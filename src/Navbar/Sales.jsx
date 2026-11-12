import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import YouTubeIcon from '@mui/icons-material/YouTube'
import img from '../assets/react-ecom-logo.png'
import heroImage from '../assets/shop-hero.png'
import shopProductData from '../Shop_product.json'
import './Navbar.css'
import './Sales.css'
import '../aboutPages/AboutUs.css'
import CommerceHeaderActions from '../commerce/CommerceHeaderActions'
import MobileNav from './MobileNav'
import { commerceProduct, productDetailsPath, useCommerce, useRegisterProducts } from '../commerce/CommerceContext'

const collectionImages = Object.entries(import.meta.glob('../assets/collection-pro*.jpg', {
  eager: true,
  import: 'default',
}))
  .filter(([path]) => !path.endsWith('collection-pro24.jpg'))
  .sort(([firstPath], [secondPath]) => (
    Number(firstPath.match(/pro(\d+)\.jpg$/)?.[1])
      - Number(secondPath.match(/pro(\d+)\.jpg$/)?.[1])
  ))
  .map(([, image]) => image)

const collectionProductDetails = [
  { name: 'Brown Utility Zip Jacket', category: 'Outerwear', colors: ['Brown'] },
  { name: 'Charcoal Minimal Zip Jacket', category: 'Outerwear', colors: ['Grey', 'White'] },
  { name: 'Sherpa-Lined Heritage Jacket', category: 'Outerwear', colors: ['Brown', 'Black', 'Beige'] },
  { name: 'Olive Cargo Wide-Leg Pants', category: 'Trousers', colors: ['Olive Green'] },
  { name: 'Brown Relaxed Denim Jeans', category: 'Denim', colors: ['Brown'] },
  { name: 'White and Green Court Sneakers', category: 'Footwear', colors: ['White', 'Green'], sizes: [] },
  { name: 'Brown Suede Low-Top Sneakers', category: 'Footwear', colors: ['Brown', 'Black'], sizes: [] },
  { name: 'Grey and White Retro Sneakers', category: 'Footwear', colors: ['Grey', 'White'], sizes: [] },
  { name: 'Heritage Polo Outfit', category: 'Outfit Sets', colors: ['Brown', 'White', 'Beige'] },
  { name: 'Contrast-Collar Polo Outfit', category: 'Outfit Sets', colors: ['White', 'Brown'] },
  { name: 'Slim Metal-Frame Sunglasses', category: 'Accessories', colors: ['Gold', 'Black'], sizes: [] },
  { name: 'Classic Aviator Sunglasses', category: 'Accessories', colors: ['Gold', 'Brown'], sizes: [] },
  { name: 'Green Embroidered Baseball Cap', category: 'Accessories', colors: ['Green'], sizes: [] },
  { name: 'Green Analog Sports Watch', category: 'Accessories', colors: ['Green', 'Black'], sizes: [] },
  { name: 'Vintage Digital Watch', category: 'Accessories', colors: ['Black', 'Brown'], sizes: [] },
  { name: 'Graphic Patchwork Sweatshirt', category: 'Sweatshirts', colors: ['Grey', 'Black', 'White'] },
  { name: 'Floral Print Camp-Collar Shirt', category: 'Shirts', colors: ['Red', 'Green', 'Black'] },
  { name: 'Cream Quilted Puffer Jacket', category: 'Outerwear', colors: ['White', 'Beige'] },
  { name: 'Color-Block Retro Sneakers', category: 'Footwear', colors: ['Black', 'White', 'Brown'], sizes: [] },
  { name: 'Burgundy Utility Zip Jacket', category: 'Outerwear', colors: ['Burgundy', 'Black'] },
  { name: 'Navy Waffle-Knit Polo Sweatshirt', category: 'Sweatshirts', colors: ['Navy Blue'] },
  { name: 'Navy Corduroy Wide-Leg Trousers', category: 'Trousers', colors: ['Navy Blue'] },
  { name: 'Brown Plaid Overshirt', category: 'Shirts', colors: ['Brown', 'Beige'] },
  { name: 'Cream and Navy Striped Knit Polo', category: 'Knitwear', colors: ['Cream', 'Navy Blue'] },
  { name: 'Charcoal Color-Block Hoodie', category: 'Hoodies', colors: ['Grey', 'White'] },
  { name: 'Taupe Color-Block Hoodie', category: 'Hoodies', colors: ['Beige', 'Brown'] },
  { name: 'Forest Green Graphic Sweatshirt', category: 'Sweatshirts', colors: ['Green', 'Cream'] },
  { name: 'Vintage Patterned Hooded Sweatshirt', category: 'Hoodies', colors: ['Grey', 'Brown', 'Beige'] },
  { name: 'Patterned Fleece Zip Jacket', category: 'Outerwear', colors: ['Navy Blue', 'Brown', 'Orange'] },
  { name: 'Multicolor Patchwork Button-Up Shirt', category: 'Shirts', colors: ['Multicolor'] },
  { name: 'Geometric Sherpa Jacket Outfit', category: 'Outfit Sets', colors: ['Beige', 'Brown', 'Black'] },
  { name: 'Heritage Brown Layered Outfit', category: 'Outfit Sets', colors: ['Brown', 'Beige', 'White'] },
  { name: 'Distressed Burgundy Baseball Cap', category: 'Accessories', colors: ['Burgundy'], sizes: [] },
  { name: 'Red Embroidered Festive Kurta', category: 'Ethnicwear', colors: ['Red', 'Gold'] },
  { name: 'Green Court Sneakers', category: 'Footwear', colors: ['Green', 'White'], sizes: [] },
  { name: 'Sage and Cream On-Ear Headphones', category: 'Accessories', colors: ['Green', 'Cream', 'Orange'], sizes: [] },
  { name: 'Sage Flip-Top Lighter', category: 'Accessories', colors: ['Green', 'Cream'], sizes: [] },
  { name: 'Wood-Cup Over-Ear Headphones', category: 'Accessories', colors: ['Brown', 'Black'], sizes: [] },
]

const collectionProducts = collectionProductDetails.map((details, index) => {
  const product = {
    ...shopProductData.products[index % shopProductData.products.length],
    ...details,
    id: index + 1,
    sizes: details.sizes ?? ['S', 'M', 'L', 'XL'],
    image: collectionImages[index],
  }
  const originalPrice = product.price
  const salePrice = Math.round((originalPrice * 0.9) / 10) * 10

  return {
    ...product,
    oldPrice: originalPrice,
    price: salePrice,
    discount: Math.round(((originalPrice - salePrice) / originalPrice) * 100),
    savings: originalPrice - salePrice,
  }
})

const saleProducts = collectionProducts

const categories = ['All sale', ...new Set(saleProducts.map((product) => product.category))]
const maxDiscount = Math.max(...saleProducts.map((product) => product.discount))
const sizes = ['S', 'M', 'L', 'XL']
  .filter((size) => saleProducts.some((product) => product.sizes.includes(size)))
const colorValues = {
  Black: '#17191b',
  'Navy Blue': '#243a63',
  White: '#f4f0e9',
  'Olive Green': '#596044',
  Grey: '#85878b',
  Green: '#4b7555',
  Brown: '#75543e',
  Beige: '#d9c8a9',
  Gold: '#c5a35b',
  Cream: '#e9e1d0',
  Red: '#a44642',
  Burgundy: '#722c3b',
  Orange: '#d17b43',
  Multicolor: 'linear-gradient(135deg, #a44642 0 25%, #596044 25% 50%, #68412e 50% 75%, #777a80 75%)',
}
const colors = [...new Set(saleProducts.flatMap((product) => product.colors ?? []))]
  .map((name) => ({ name, value: colorValues[name] }))
const priceRanges = [
  { label: 'Under ₹1,500', min: 0, max: 1500 },
  { label: '₹1,500 – ₹2,500', min: 1500, max: 2500 },
  { label: '₹2,500 – ₹4,000', min: 2500, max: 4000 },
  { label: 'Above ₹4,000', min: 4000, max: Infinity },
]
const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`

const Sales = () => {
  const [activeCategory, setActiveCategory] = useState('All sale')
  const [sortOrder, setSortOrder] = useState('featured')
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedPriceRange, setSelectedPriceRange] = useState('')
  const [showAllProducts, setShowAllProducts] = useState(false)
  const [initialProductLimit, setInitialProductLimit] = useState(9)
  const { wishlist, toggleWishlist, addToCart } = useCommerce()
  useRegisterProducts(saleProducts, 'collection')

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 760px)')
    const updateProductLimit = () => setInitialProductLimit(mobileQuery.matches ? 6 : 9)

    updateProductLimit()
    mobileQuery.addEventListener('change', updateProductLimit)
    return () => mobileQuery.removeEventListener('change', updateProductLimit)
  }, [])

  const visibleProducts = useMemo(() => {
    const filteredProducts = saleProducts.filter((product) => (
      (activeCategory === 'All sale' || product.category === activeCategory)
      && (selectedSizes.length === 0 || selectedSizes.some((size) => product.sizes?.includes(size)))
      && (selectedColors.length === 0 || selectedColors.some((color) => product.colors?.includes(color)))
      && (!selectedPriceRange || (
        product.price >= priceRanges.find((range) => range.label === selectedPriceRange).min
        && product.price < priceRanges.find((range) => range.label === selectedPriceRange).max
      ))
    ))
    const sortedProducts = [...filteredProducts]

    if (sortOrder === 'price-low') sortedProducts.sort((a, b) => a.price - b.price)
    if (sortOrder === 'price-high') sortedProducts.sort((a, b) => b.price - a.price)
    if (sortOrder === 'savings') sortedProducts.sort((a, b) => b.savings - a.savings)
    if (sortOrder === 'discount') sortedProducts.sort((a, b) => b.discount - a.discount)

    return sortedProducts
  }, [activeCategory, selectedColors, selectedPriceRange, selectedSizes, sortOrder])

  const toggleSelection = (value, selectedValues, setSelectedValues) => {
    setShowAllProducts(false)
    setSelectedValues((currentValues) => (
      currentValues.includes(value)
        ? currentValues.filter((currentValue) => currentValue !== value)
        : [...currentValues, value]
    ))
  }

  const clearFilters = () => {
    setShowAllProducts(false)
    setActiveCategory('All sale')
    setSelectedSizes([])
    setSelectedColors([])
    setSelectedPriceRange('')
  }

  const productsToDisplay = showAllProducts
    ? visibleProducts
    : visibleProducts.slice(0, initialProductLimit)

  return (
    <div className="sales-page">
      <header className="navbar">
        <MobileNav />
        <Link className="nav-brand" to="/" aria-label="Soverian Fits home">
          <img className="nav-logo" src={img} alt="Soverian Fits" />
        </Link>
        <nav className="nav" aria-label="Main navigation">
          <ul className="nav-links">
            <li className="nav-link"><NavLink to="/" end>Home</NavLink></li>
            <li className="nav-link"><NavLink to="/about">About</NavLink></li>
            <li className="nav-link"><NavLink to="/shop">Shop</NavLink></li>
            <li className="nav-link"><NavLink to="/contact">Contact</NavLink></li>
            <li className="nav-link"><NavLink to="/collection">Collection</NavLink></li>
            <li className="nav-link"><NavLink to="/men">Men</NavLink></li>
            <li className="nav-link"><NavLink to="/women">Women</NavLink></li>
            <li className="nav-link"><NavLink to="/new-arrivals">New Arrivals</NavLink></li>
            <li className="nav-link"><NavLink to="/sales">Sales</NavLink></li>
          </ul>
        </nav>
        <CommerceHeaderActions />
      </header>

      <main>
        <section className="sales-campaign">
          <div className="sales-campaign-copy">
            <p className="sales-eyebrow"><span /> The Soverian sale event</p>
            <h1>Big<br /><em>Sale.</em></h1>
            <p className="sales-campaign-description">
              Your favourite Soverian pieces, now at considered prices.
              Find a little something worth keeping.
            </p>
            <a className="sales-hero-cta" href="#sale-collection">
              Shop sale now <ArrowForwardRoundedIcon />
            </a>
          </div>
          <div className="sales-campaign-visual">
            <img src={heroImage} alt="Soverian Fits campaign look" />
            <div className="sales-discount-stamp" aria-label={`Up to ${maxDiscount} percent off`}>
              <span>UP TO</span>
              <strong>{maxDiscount}<small>%</small></strong>
              <span>OFF SELECT STYLES</span>
            </div>
            <p className="sales-visual-caption">A LITTLE LESS, A LOT TO LOVE <span>— SO / VERIAN</span></p>
          </div>
        </section>

        <section className="sales-catalog" id="sale-collection">
          <div className="sales-catalog-inner">
            <div className="sales-catalog-heading">
              <div className="sales-heading">
                <p className="sales-eyebrow">A little something off</p>
                <h2>The sale <em>selection</em></h2>
              </div>
              <label className="sales-sort">
                <span>Sort by</span>
                <select
                  value={sortOrder}
                  onChange={(event) => {
                    setShowAllProducts(false)
                    setSortOrder(event.target.value)
                  }}
                >
                  <option value="featured">Featured</option>
                  <option value="discount">Biggest discount</option>
                  <option value="savings">Highest savings</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
              </label>
            </div>

            <div className="sales-shop-layout">
              <aside className="sales-sidebar" aria-label="Sale filters">
                <div className="sales-sidebar-heading">
                  <span><TuneRoundedIcon aria-hidden="true" /> FILTER PRODUCTS</span>
                  <button type="button" onClick={clearFilters}>Clear</button>
                </div>
                <div className="sales-filter-group">
                  <p className="sales-sidebar-title">Category</p>
                  <div className="sales-categories" aria-label="Filter sale products by category">
                  {categories.map((category) => {
                    const categoryCount = category === 'All sale'
                      ? saleProducts.length
                      : saleProducts.filter((product) => product.category === category).length

                    return (
                      <button
                        className={`sales-category${activeCategory === category ? ' is-active' : ''}`}
                        key={category}
                        type="button"
                        aria-pressed={activeCategory === category}
                        onClick={() => {
                          setShowAllProducts(false)
                          setActiveCategory(category)
                        }}
                      >
                        <span className="sales-category-check" aria-hidden="true">
                          {activeCategory === category ? '✓' : ''}
                        </span>
                        <span>{category}</span>
                        <span className="sales-category-count">{categoryCount}</span>
                      </button>
                    )
                  })}
                  </div>
                </div>

                <div className="sales-filter-group">
                  <p className="sales-sidebar-title">Size</p>
                  <div className="sales-size-options">
                    {sizes.map((size) => (
                      <label className="sales-size-option" key={size}>
                        <input
                          type="checkbox"
                          aria-label={`Size ${size}`}
                          checked={selectedSizes.includes(size)}
                          onChange={() => toggleSelection(size, selectedSizes, setSelectedSizes)}
                        />
                        <span>{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="sales-filter-group">
                  <p className="sales-sidebar-title">Color</p>
                  <div className="sales-color-options">
                    {colors.map((color) => (
                      <label className="sales-color-option" key={color.name} title={color.name}>
                        <input
                          type="checkbox"
                          aria-label={color.name}
                          checked={selectedColors.includes(color.name)}
                          onChange={() => toggleSelection(color.name, selectedColors, setSelectedColors)}
                        />
                        <span
                          className="sales-color-swatch"
                          style={{ '--swatch-color': color.value }}
                          aria-label={color.name}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="sales-filter-group">
                  <p className="sales-sidebar-title">Price range</p>
                  <div className="sales-price-options">
                    {priceRanges.map((range) => (
                      <label className="sales-price-option" key={range.label}>
                        <input
                          type="radio"
                          name="sales-price-range"
                          checked={selectedPriceRange === range.label}
                          onChange={() => {
                            setShowAllProducts(false)
                            setSelectedPriceRange(range.label)
                          }}
                        />
                        <span>{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </aside>

              <div className="sales-product-area">
                <div className="sales-results-row">
                  <p>{visibleProducts.length} {visibleProducts.length === 1 ? 'piece' : 'pieces'}</p>
                  <span>Selected styles, special prices</span>
                </div>

                {visibleProducts.length > 0 ? (
                  <div className="sales-product-grid">
                    {productsToDisplay.map((product) => {
                      const commerceItem = commerceProduct(product, 'collection')
                      const isFavorite = wishlist.some((item) => item.commerceId === commerceItem.commerceId)

                      return (
                        <article className="sales-product-card" key={product.id}>
                          <Link
                            className="sales-product-image-link"
                            to={productDetailsPath(product, 'collection')}
                            aria-label={`Shop ${product.name}`}
                          >
                            <img className="sales-product-image" src={product.image} alt={product.name} loading="lazy" />
                            <span className="sales-discount-badge">−{product.discount}%</span>
                          </Link>
                          <button
                            className={`sales-favorite${isFavorite ? ' is-favorite' : ''}`}
                            type="button"
                            aria-label={`${isFavorite ? 'Remove' : 'Add'} ${product.name} ${isFavorite ? 'from' : 'to'} wishlist`}
                            aria-pressed={isFavorite}
                            onClick={() => toggleWishlist(commerceItem)}
                          >
                            {isFavorite ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
                          </button>
                          <div className="sales-product-details">
                            <p className="sales-product-category">{product.category}</p>
                            <Link className="sales-product-name" to={productDetailsPath(product, 'collection')}>{product.name}</Link>
                            <div className="sales-product-prices">
                              <span>{formatPrice(product.price)}</span>
                              <del>{formatPrice(product.oldPrice)}</del>
                              <small>You save {formatPrice(product.savings)}</small>
                            </div>
                            <Link className="sales-view-product" to={productDetailsPath(product, 'collection')}>
                              View this piece <ArrowForwardRoundedIcon />
                            </Link>
                            <button className="sales-add-to-cart" type="button" onClick={() => addToCart(commerceItem)}>
                              <ShoppingCartIcon aria-hidden="true" /> Add to bag
                            </button>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                ) : (
                  <div className="sales-empty-state">
                    <p>No sale pieces in this category just yet.</p>
                    <button type="button" onClick={clearFilters}>Clear filters and view all sale pieces</button>
                  </div>
                )}
                {visibleProducts.length > initialProductLimit && (
                  <button
                    className="sales-view-all"
                    type="button"
                    aria-expanded={showAllProducts}
                    onClick={() => setShowAllProducts((isExpanded) => !isExpanded)}
                  >
                    {showAllProducts ? 'Show less' : 'View all products'}
                    <ArrowForwardRoundedIcon className={showAllProducts ? 'is-expanded' : ''} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="sales-offer-strip">
          <div className="sales-offer-mark"><LocalOfferOutlinedIcon /></div>
          <div className="sales-offer-copy">
            <span>LIMITED TIME OFFER</span>
            <p>Up to <strong>{maxDiscount}% off</strong></p>
          </div>
          <a href="#sale-collection">Shop the sale <ArrowForwardRoundedIcon /></a>
        </section>

      </main>

      <footer className="about-footer">
        <div className="about-footer-main">
          <Link to="/" className="about-footer-brand" aria-label="Soverian Fit's home">
            <img src={img} alt="Soverian Fit's" />
          </Link>
          <nav className="about-footer-nav" aria-label="Footer navigation">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/collection">Collection</Link>
            <Link to="/men">Men</Link>
            <Link to="/women">Women</Link>
            <Link to="/new-arrivals">New Arrivals</Link>
            <Link to="/sales">Sales</Link>
          </nav>
          <div className="about-footer-social" aria-label="Social media">
            <span aria-label="Instagram"><InstagramIcon /></span>
            <span aria-label="Facebook"><FacebookIcon /></span>
            <span className="about-footer-x" aria-label="X">𝕏</span>
            <span aria-label="YouTube"><YouTubeIcon /></span>
          </div>
        </div>
        <div className="about-footer-copyright">© 2025 Soverian Fit's. All rights reserved.</div>
      </footer>
    </div>
  )
}

export default Sales
