/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { requestAuthentication } from '../auth/auth'
import { useAuthSession } from '../auth/useAuthSession'

const CommerceContext = createContext(null)
const EMPTY_ARRAY = []
const EMPTY_OBJECT = {}
const STORAGE_KEYS = {
  cart: 'soverian_fit_cart_v1',
  wishlist: 'soverian_fit_wishlist_v1',
  catalog: 'soverian_fit_catalog_v1',
  orders: 'soverian_fit_orders_v1',
}

const readStoredValue = (key, fallback) => {
  try {
    const storedValue = localStorage.getItem(key)
    if (!storedValue) return fallback
    const parsedValue = JSON.parse(storedValue)
    if (Array.isArray(fallback)) return Array.isArray(parsedValue) ? parsedValue : fallback
    if (fallback && typeof fallback === 'object') {
      return parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue)
        ? parsedValue
        : fallback
    }
    return parsedValue
  } catch (error) {
    console.error(`Unable to read ${key} from local storage.`, error)
    return fallback
  }
}

const usePersistedState = (key, fallback) => {
  const [storedState, setStoredState] = useState(() => ({
    key,
    value: readStoredValue(key, fallback),
  }))

  useEffect(() => {
    if (storedState.key !== key) return
    try {
      localStorage.setItem(key, JSON.stringify(storedState.value))
    } catch (error) {
      console.error(`Unable to save ${key} to local storage.`, error)
    }
  }, [key, storedState])

  const value = useMemo(() => (
    storedState.key === key ? storedState.value : readStoredValue(key, fallback)
  ), [fallback, key, storedState])
  const setValue = useCallback((update) => {
    setStoredState((currentState) => {
      const currentValue = currentState.key === key
        ? currentState.value
        : readStoredValue(key, fallback)
      return {
        key,
        value: typeof update === 'function' ? update(currentValue) : update,
      }
    })
  }, [key, fallback])

  return [value, setValue]
}

export const commerceProduct = (product, source = 'shop') => {
  const resolvedSource = product.source ?? source
  const commerceId = product.commerceId ?? `${resolvedSource}-${product.id}`
  return {
    ...product,
    source: resolvedSource,
    commerceId: String(commerceId),
    price: Number(product.price) || 0,
    oldPrice: Number(product.oldPrice) || null,
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    colors: Array.isArray(product.colors)
      ? product.colors
      : product.color ? [product.color] : [],
    image: product.image ?? '',
  }
}

export const productDetailsPath = (product, source = 'shop') => (
  `/product/${encodeURIComponent(commerceProduct(product, source).commerceId)}`
)

export const useCommerce = () => {
  const context = useContext(CommerceContext)
  if (!context) throw new Error('useCommerce must be used within CommerceProvider.')
  return context
}

export const useRegisterProducts = (products, source) => {
  const { registerProducts } = useCommerce()
  useEffect(() => {
    registerProducts(products, source)
  }, [products, registerProducts, source])
}

export const CommerceProvider = ({ children }) => {
  const user = useAuthSession()
  const accountScope = user?.id ?? 'guest'
  const [cart, setCart] = usePersistedState(`${STORAGE_KEYS.cart}:${accountScope}`, EMPTY_ARRAY)
  const [wishlist, setWishlist] = usePersistedState(`${STORAGE_KEYS.wishlist}:${accountScope}`, EMPTY_ARRAY)
  const [catalog, setCatalog] = usePersistedState(STORAGE_KEYS.catalog, EMPTY_OBJECT)
  const [orders, setOrders] = usePersistedState(`${STORAGE_KEYS.orders}:${accountScope}`, EMPTY_ARRAY)
  const [reviews, setReviews] = useState({})

  const registerProducts = useCallback((products, source) => {
    setCatalog((currentCatalog) => {
      const nextCatalog = { ...currentCatalog }
      products.forEach((product) => {
        const normalizedProduct = commerceProduct(product, source)
        nextCatalog[normalizedProduct.commerceId] = normalizedProduct
      })
      return nextCatalog
    })
  }, [setCatalog])

  const addToCart = useCallback((product, options = {}) => {
    if (!user) {
      requestAuthentication()
      return { ok: false, message: 'Please sign in to add items to your bag.' }
    }
    const normalizedProduct = commerceProduct(product, product.source ?? 'shop')
    if (normalizedProduct.stock === false) {
      return { ok: false, message: 'This piece is currently unavailable.' }
    }
    const size = options.size ?? normalizedProduct.sizes[0] ?? ''
    const color = options.color ?? normalizedProduct.colors[0] ?? ''
    const quantity = Math.max(1, Number(options.quantity) || 1)
    const lineId = `${normalizedProduct.commerceId}|${size}|${color}`

    setCart((currentCart) => {
      const existingLine = currentCart.find((item) => item.lineId === lineId)
      if (existingLine) {
        return currentCart.map((item) => (
          item.lineId === lineId
            ? {
              ...item,
              price: Math.min(item.price, normalizedProduct.price),
              oldPrice: Math.max(item.oldPrice ?? item.price, normalizedProduct.oldPrice ?? normalizedProduct.price),
              quantity: item.quantity + quantity,
            }
            : item
        ))
      }
      return [...currentCart, { ...normalizedProduct, lineId, size, color, quantity }]
    })
    return { ok: true, message: `${normalizedProduct.name} added to your bag.` }
  }, [setCart, user])

  const updateQuantity = useCallback((lineId, quantity) => {
    const nextQuantity = Number(quantity)
    if (!Number.isInteger(nextQuantity) || nextQuantity < 1) return
    setCart((currentCart) => currentCart.map((item) => (
      item.lineId === lineId ? { ...item, quantity: nextQuantity } : item
    )))
  }, [setCart])

  const removeFromCart = useCallback((lineId) => {
    setCart((currentCart) => currentCart.filter((item) => item.lineId !== lineId))
  }, [setCart])

  const toggleWishlist = useCallback((product) => {
    if (!user) {
      requestAuthentication()
      return
    }
    const normalizedProduct = commerceProduct(product, product.source ?? 'shop')
    setWishlist((currentWishlist) => (
      currentWishlist.some((item) => item.commerceId === normalizedProduct.commerceId)
        ? currentWishlist.filter((item) => item.commerceId !== normalizedProduct.commerceId)
        : [...currentWishlist, normalizedProduct]
    ))
  }, [setWishlist, user])

  const removeFromWishlist = useCallback((commerceId) => {
    setWishlist((currentWishlist) => currentWishlist.filter((item) => item.commerceId !== commerceId))
  }, [setWishlist])

  const moveToWishlist = useCallback((lineId) => {
    if (!user) {
      requestAuthentication()
      return
    }
    const item = cart.find((cartItem) => cartItem.lineId === lineId)
    if (!item) return
    setWishlist((currentWishlist) => (
      currentWishlist.some((wishItem) => wishItem.commerceId === item.commerceId)
        ? currentWishlist
        : [...currentWishlist, commerceProduct(item, item.source)]
    ))
    removeFromCart(lineId)
  }, [cart, removeFromCart, setWishlist, user])

  const createOrder = useCallback((customer, paymentMethod, selectedItems = cart) => {
    if (!user) {
      requestAuthentication()
      return null
    }
    const items = selectedItems.map((item) => ({ ...item }))
    const totals = calculateOrderTotals(items)
    const order = {
      id: `SF-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      customer,
      items,
      ...totals,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'Pay on delivery' : 'Awaiting provider confirmation',
      status: 'Pending',
    }
    setOrders((currentOrders) => [order, ...currentOrders])
    const orderedLineIds = new Set(items.map((item) => item.lineId))
    setCart((currentCart) => currentCart.filter((item) => !orderedLineIds.has(item.lineId)))
    return order
  }, [cart, setCart, setOrders, user])

  const cancelOrder = useCallback((orderId) => {
    setOrders((currentOrders) => currentOrders.map((order) => {
      if (order.id !== orderId || !['Pending', 'Confirmed'].includes(order.status)) return order
      return { ...order, status: 'Cancelled', paymentStatus: 'Cancelled' }
    }))
  }, [setOrders])

  const deleteOrder = useCallback((orderId) => {
    setOrders((currentOrders) => currentOrders.filter((order) => order.id !== orderId))
  }, [setOrders])

  const addReview = useCallback((commerceId, review) => {
    setReviews((currentReviews) => ({
      ...currentReviews,
      [commerceId]: [...(currentReviews[commerceId] ?? []), review],
    }))
  }, [setReviews])

  const value = useMemo(() => ({
    cart,
    wishlist,
    catalog,
    orders,
    reviews,
    cartCount: cart.reduce((total, item) => total + item.quantity, 0),
    registerProducts,
    addToCart,
    updateQuantity,
    removeFromCart,
    toggleWishlist,
    removeFromWishlist,
    moveToWishlist,
    createOrder,
    cancelOrder,
    deleteOrder,
    addReview,
  }), [
    cart, wishlist, catalog, orders, reviews, registerProducts, addToCart,
    updateQuantity, removeFromCart, toggleWishlist, removeFromWishlist,
    moveToWishlist, createOrder, cancelOrder, deleteOrder, addReview,
  ])

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>
}

export const calculateOrderTotals = (items) => {
  const subtotal = items.reduce((total, item) => total + (item.oldPrice ?? item.price) * item.quantity, 0)
  const discount = items.reduce(
    (total, item) => total + Math.max(0, (item.oldPrice ?? item.price) - item.price) * item.quantity,
    0,
  )
  const payableBeforeShipping = subtotal - discount
  const shipping = payableBeforeShipping === 0 || payableBeforeShipping > 999 ? 0 : 99
  return {
    subtotal,
    discount,
    shipping,
    tax: 0,
    total: payableBeforeShipping + shipping,
  }
}
