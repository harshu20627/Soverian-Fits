import { useMemo, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { getCurrentUser, logoutUser } from '../auth/auth'
import { useAuthSession } from '../auth/useAuthSession'
import logoImage from '../assets/react-ecom-logo.png'
import CommerceHeaderActions from './CommerceHeaderActions'
import MobileNav from '../Navbar/MobileNav'
import {
  calculateOrderTotals,
  commerceProduct,
  productDetailsPath,
  useCommerce,
} from './CommerceContext'
import { startOnlineCheckout } from './paymentGateway'
import { sendOrderEmails, sendReviewNotification } from '../services/emailNotifications'
import './Commerce.css'
import '../aboutPages/AboutUs.css'

const money = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`
const displayOption = (option) => option || 'One size'
const sampleReviewTopics = [
  'overall design', 'first impressions', 'everyday versatility', 'outfit pairing', 'comfort',
  'fit and sizing', 'material and feel', 'colour and finish', 'ease of styling', 'wearing occasion',
  'layering options', 'silhouette', 'practical details', 'texture', 'wardrobe versatility',
  'look and presentation', 'styling possibilities', 'construction details', 'seasonal wear',
  'day-to-day use', 'care and upkeep', 'finishing touches', 'balance of style and comfort',
  'how it complements other pieces', 'the details that stand out',
]
const sampleReviewerNames = [
  'Aarav Sharma', 'Emily Carter', 'Priya Patel', 'Daniel Wilson', 'Ananya Mehta',
  'Olivia Brown', 'Rohan Verma', 'Sofia Martinez', 'Ishaan Kapoor', 'Liam Anderson',
  'Meera Nair', 'Amelia Johnson', 'Kabir Malhotra', 'Noah Taylor', 'Aisha Khan',
  'Lucas Martin', 'Vivaan Desai', 'Chloe Davis', 'Zoya Siddiqui', 'Ethan Clark',
  'Arjun Reddy', 'Isabella Rossi', 'Neha Iyer', 'Mason Lee', 'Sara Ahmed',
]
const sampleReviewStarRatings = [5, 4, 5, 4, 5]

const getSampleReviews = (product) => sampleReviewTopics.map((topic, index) => ({
  id: `sample-${product.commerceId}-${index + 1}`,
  name: sampleReviewerNames[index],
  rating: sampleReviewStarRatings[index % sampleReviewStarRatings.length],
  comment: `Example only: a shopper might share their thoughts on the ${topic} of ${product.name}.`,
}))

const CommerceNavbar = () => (
  <header className="navbar commerce-navbar">
    <MobileNav />
    <Link className="nav-brand" to="/" aria-label="Soverian Fit’s home">
      <img className="nav-logo" src={logoImage} alt="Soverian Fit’s" />
    </Link>
    <nav className="nav" aria-label="Main navigation">
      <ul className="nav-links">
        <li className="nav-link"><NavLink to="/" end>Home</NavLink></li>
        <li className="nav-link"><NavLink to="/shop">Shop</NavLink></li>
        <li className="nav-link"><NavLink to="/collection">Collection</NavLink></li>
        <li className="nav-link"><NavLink to="/men">Men</NavLink></li>
        <li className="nav-link"><NavLink to="/women">Women</NavLink></li>
        <li className="nav-link"><NavLink to="/new-arrivals">New Arrivals</NavLink></li>
        <li className="nav-link"><NavLink to="/sales">Sale</NavLink></li>
      </ul>
    </nav>
    <CommerceHeaderActions />
  </header>
)

const CommerceFooter = () => (
  <footer className="about-footer">
    <div className="about-footer-main">
      <Link to="/" className="about-footer-brand" aria-label="Soverian Fit’s home">
        <img src={logoImage} alt="Soverian Fit’s" />
      </Link>
      <nav className="about-footer-nav" aria-label="Footer navigation">
        <Link to="/">Home</Link><Link to="/shop">Shop</Link><Link to="/collection">Collection</Link>
        <Link to="/men">Men</Link><Link to="/women">Women</Link><Link to="/wishlist">Wishlist</Link>
        <Link to="/orders">My Orders</Link>
      </nav>
      <div className="about-footer-social" aria-label="Social media">
        <span aria-label="Instagram"><InstagramIcon /></span>
        <span aria-label="Facebook"><FacebookIcon /></span>
        <span className="about-footer-x" aria-label="X">𝕏</span>
        <span aria-label="YouTube"><YouTubeIcon /></span>
      </div>
    </div>
    <div className="about-footer-copyright">© 2025 Soverian Fit’s. All rights reserved.</div>
  </footer>
)

const PageShell = ({ eyebrow, title, description, children, standalone = false, showFooter = true }) => (
  <>
    {!standalone && <CommerceNavbar />}
    <main className="commerce-page">
      <div className="commerce-shell">
        {standalone && (
          <Link className="commerce-back-link commerce-dashboard-back" to="/">
            <ArrowBackRoundedIcon /> Back
          </Link>
        )}
        <header className="commerce-page-heading">
          <p>{eyebrow}</p>
          <h1>{title}</h1>
          {description && <span>{description}</span>}
        </header>
        {children}
      </div>
    </main>
    {!standalone && showFooter && <CommerceFooter />}
  </>
)

const ContinueShoppingLink = () => (
  <Link className="commerce-button commerce-button--secondary" to="/shop">
    <ArrowBackRoundedIcon /> Continue shopping
  </Link>
)

const EmptyState = ({ icon, title, detail, action = <ContinueShoppingLink /> }) => (
  <section className="commerce-empty">
    <span className="commerce-empty-icon">{icon}</span>
    <h2>{title}</h2>
    <p>{detail}</p>
    {action}
  </section>
)

const OrderTotals = ({ items }) => {
  const totals = calculateOrderTotals(items)
  return (
    <div className="commerce-summary">
      <h2>Order summary</h2>
      <div><span>Subtotal</span><strong>{money(totals.subtotal)}</strong></div>
      <div><span>Discount</span><strong className="commerce-discount">−{money(totals.discount)}</strong></div>
      <div><span>Shipping</span><strong>{totals.shipping ? money(totals.shipping) : 'Complimentary'}</strong></div>
      <div><span>Tax</span><strong>Not calculated</strong></div>
      <div className="commerce-summary-total"><span>Total</span><strong>{money(totals.total)}</strong></div>
      <small>Shipping is complimentary on orders above ₹999. Taxes require backend configuration.</small>
    </div>
  )
}

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart, moveToWishlist } = useCommerce()
  const safeName = item.name || 'Soverian Fit’s piece'
  return (
    <article className="commerce-line-item">
      <Link to={productDetailsPath(item)} className="commerce-line-image">
        <img src={item.image} alt={safeName} />
      </Link>
      <div className="commerce-line-copy">
        <p className="commerce-line-category">{item.category || 'SOVERIAN FIT’S'}</p>
        <Link className="commerce-line-name" to={productDetailsPath(item)}>{safeName}</Link>
        <p className="commerce-line-variant">Size: {displayOption(item.size)} <span>·</span> Colour: {displayOption(item.color)}</p>
        <div className="commerce-line-actions">
          <div className="commerce-quantity" aria-label={`Quantity for ${safeName}`}>
            <button type="button" aria-label="Decrease quantity" disabled={item.quantity <= 1} onClick={() => updateQuantity(item.lineId, item.quantity - 1)}>−</button>
            <span>{item.quantity}</span>
            <button type="button" aria-label="Increase quantity" onClick={() => updateQuantity(item.lineId, item.quantity + 1)}>+</button>
          </div>
          <button type="button" onClick={() => moveToWishlist(item.lineId)}>Move to wishlist</button>
          <button
            type="button"
            className="commerce-cart-remove"
            aria-label={`Remove ${safeName} from your bag`}
            onClick={() => removeFromCart(item.lineId)}
          >
            <DeleteOutlineRoundedIcon /> Remove
          </button>
        </div>
      </div>
      <div className="commerce-line-price">
        <strong>{money(item.price * item.quantity)}</strong>
        {item.oldPrice > item.price && <del>{money(item.oldPrice * item.quantity)}</del>}
      </div>
    </article>
  )
}

export const CartPage = () => {
  const { cart } = useCommerce()
  return (
    <PageShell showFooter={false} eyebrow="YOUR SELECTION" title="Shopping bag" description={`${cart.reduce((sum, item) => sum + item.quantity, 0)} carefully chosen piece(s)`}>
      {cart.length === 0 ? (
        <EmptyState
          icon={<RemoveShoppingCartOutlinedIcon />}
          title="Your bag is waiting"
          detail="Explore the collection and find something made for you."
        />
      ) : (
        <div className="commerce-layout">
          <section className="commerce-lines" aria-label="Cart items">
            {cart.map((item) => <CartItem key={item.lineId} item={item} />)}
          </section>
          <aside className="commerce-sidebar">
            <OrderTotals items={cart} />
            <Link className="commerce-button commerce-button--primary commerce-full-button" to="/checkout">
              Proceed to checkout <ArrowForwardRoundedIcon />
            </Link>
            <ContinueShoppingLink />
          </aside>
        </div>
      )}
    </PageShell>
  )
}

export const WishlistPage = () => {
  const { wishlist, reviews, toggleWishlist, removeFromWishlist, addToCart } = useCommerce()
  const navigate = useNavigate()
  return (
    <PageShell showFooter={false} eyebrow="SAVED FOR LATER" title="Your wishlist" description="The pieces you have your eye on.">
      {!wishlist.length ? (
        <EmptyState
          icon={<FavoriteBorderRoundedIcon />}
          title="No saved pieces yet"
          detail="Tap the heart on a product to keep it close."
        />
      ) : (
        <div className="commerce-wishlist-grid">
          {wishlist.map((product) => (
            <article className="commerce-wishlist-card" key={product.commerceId}>
              <Link to={productDetailsPath(product)} className="commerce-wishlist-image">
                <img src={product.image} alt={product.name} />
              </Link>
              <button
                type="button"
                className="commerce-wishlist-remove"
                aria-label={`Remove ${product.name} from wishlist`}
                onClick={() => removeFromWishlist(product.commerceId)}
              >
                <FavoriteRoundedIcon />
              </button>
              <div className="commerce-wishlist-copy">
                <p>{product.category || 'SOVERIAN FIT’S'}</p>
                <Link to={productDetailsPath(product)}>{product.name}</Link>
                <strong>{money(product.price)}</strong>
                <span>{reviews[product.commerceId]?.length ? `${reviews[product.commerceId].length} customer review(s)` : 'No customer reviews yet'}{product.sizes?.length ? ` · Sizes ${product.sizes.join(', ')}` : ' · One size'}</span>
                <div className="commerce-wishlist-buttons">
                  <button
                    type="button"
                    className="commerce-button commerce-button--primary"
                    onClick={() => {
                      const result = addToCart(product)
                      if (result.ok) {
                        toggleWishlist(product)
                        navigate('/cart')
                      }
                    }}
                  >
                    Add to bag
                  </button>
                  <Link className="commerce-button commerce-button--secondary" to={productDetailsPath(product)}>Details</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  )
}

const ReviewSection = ({ product }) => {
  const { reviews, addReview } = useCommerce()
  const productReviews = reviews[product.commerceId] ?? []
  const sampleReviews = getSampleReviews(product)
  const [rating, setRating] = useState(5)
  const [name, setName] = useState(getCurrentUser()?.name ?? '')
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [reviewNotice, setReviewNotice] = useState('')
  const [reviewNoticeType, setReviewNoticeType] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submittedAverage = productReviews.length
    ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
    : 0
  const catalogRating = Number(product.rating) || 0
  const catalogRatingCount = Number(product.reviews) || 0
  const average = catalogRatingCount ? catalogRating : submittedAverage

  const submitReview = async (event) => {
    event.preventDefault()
    if (name.trim().length < 2 || comment.trim().length < 8) {
      setError('Please enter your name and a review of at least 8 characters.')
      return
    }
    setIsSubmitting(true)
    setError('')
    setReviewNotice('')
    setReviewNoticeType('')
    const review = {
      id: crypto.randomUUID(),
      name: name.trim(),
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    }
    addReview(product.commerceId, review)
    try {
      await sendReviewNotification({
        name: review.name,
        email: getCurrentUser()?.email ?? '',
        productName: product.name,
        rating: review.rating,
        comment: review.comment,
      })
      setComment('')
      setReviewNoticeType('success')
      setReviewNotice('Your review was sent to our team by email. It is also saved for this session.')
    } catch (reviewError) {
      console.error('Unable to email product review:', reviewError)
      setReviewNoticeType('error')
      setReviewNotice('Your review is saved for this session, but its email notification could not be delivered.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="commerce-reviews" id="reviews">
      <div className="commerce-section-heading">
        <p>THE COMMUNITY</p>
        <h2>Reviews <span>({productReviews.length} customer-submitted)</span></h2>
      </div>
      <div className="commerce-review-summary">
        <strong>{average ? average.toFixed(1) : '—'}</strong>
        <span aria-label={average ? `Average rating ${average.toFixed(1)} out of 5` : 'No ratings yet'}>
          {Array.from({ length: 5 }, (_, index) => (
            <StarRoundedIcon key={index} className={index < Math.round(average) ? 'is-filled' : ''} />
          ))}
        </span>
        <small>
          {catalogRatingCount
            ? `Product catalog rating · ${catalogRatingCount} ratings`
            : productReviews.length
              ? `${productReviews.length} review(s) submitted this session`
              : 'No ratings or written reviews yet'}
        </small>
      </div>
      {productReviews.length > 0 && (
        <div className="commerce-rating-breakdown">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = productReviews.filter((review) => review.rating === stars).length
            const percentage = (count / productReviews.length) * 100
            return (
              <div key={stars}>
                <span>{stars} star</span>
                <span className="commerce-rating-track"><span style={{ width: `${percentage}%` }} /></span>
                <small>{count}</small>
              </div>
            )
          })}
        </div>
      )}
      <div className="commerce-sample-reviews">
        <div className="commerce-sample-reviews-heading">
          <h3>Review examples <span>({sampleReviews.length})</span></h3>
          <p>Illustrative placeholders only — these are not customer-submitted reviews.</p>
        </div>
        <div className="commerce-review-list">
          {sampleReviews.map((review) => (
            <article className="commerce-review commerce-review--sample" key={review.id}>
              <div className="commerce-review-top">
                <strong>{review.name}</strong>
                <span>{Array.from({ length: 5 }, (_, index) => <StarRoundedIcon key={index} className={index < review.rating ? 'is-filled' : ''} />)}</span>
                <small className="commerce-review-sample-label">EXAMPLE</small>
              </div>
              <p>{review.comment}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="commerce-review-list">
        {productReviews.map((review) => (
          <article className="commerce-review" key={review.id}>
            <div className="commerce-review-top">
              <strong>{review.name}</strong>
              <span>{Array.from({ length: 5 }, (_, index) => <StarRoundedIcon key={index} className={index < review.rating ? 'is-filled' : ''} />)}</span>
              <time dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString('en-IN')}</time>
            </div>
            <p>{review.comment}</p>
          </article>
        ))}
      </div>
      {productReviews.length === 0 && (
        <div className="commerce-no-written-reviews">
          <span aria-hidden="true">✦</span>
          <div>
            <strong>No customer reviews yet</strong>
            <p>Have this piece? Share your own experience and help someone choose.</p>
          </div>
          <a href="#commerce-review-form">Write the first review</a>
        </div>
      )}
      <form className="commerce-review-form" id="commerce-review-form" onSubmit={submitReview}>
        <h3>Share your experience</h3>
        <label>Your name<input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} autoComplete="name" /></label>
        <label>Your rating
          <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
            {[5, 4, 3, 2, 1].map((value) => <option value={value} key={value}>{value} stars</option>)}
          </select>
        </label>
        <label>Your review<textarea value={comment} onChange={(event) => setComment(event.target.value)} required minLength={8} rows={4} /></label>
        {error && <p className="commerce-form-error" role="alert">{error}</p>}
        {reviewNotice && <p className={`commerce-review-notice is-${reviewNoticeType}`} role={reviewNoticeType === 'error' ? 'alert' : 'status'}>{reviewNotice}</p>}
        <button className="commerce-button commerce-button--primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Submit review'}</button>
        <small>Reviews stay in this session only. A server is required for shared, verified reviews.</small>
      </form>
    </section>
  )
}

const ProductDetailsContent = ({ productId, product }) => {
  const { addToCart, wishlist, toggleWishlist, reviews } = useCommerce()
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] ?? 'One size')
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] ?? product?.color ?? 'Default')
  const [quantity, setQuantity] = useState(1)
  const [notice, setNotice] = useState('')
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  const gallery = useMemo(() => {
    if (!product) return []
    const images = Array.isArray(product.images)
      ? product.images
      : Array.isArray(product.gallery) ? product.gallery : []
    return [...new Set([product.image, ...images].filter(Boolean))]
  }, [product])
  const isWishlisted = wishlist.some((item) => item.commerceId === productId)

  if (!product) {
    return (
      <PageShell eyebrow="SOVERIAN FIT’S" title="Piece not found">
        <EmptyState icon={<ShoppingBagOutlinedIcon />} title="We couldn't find that piece" detail="Browse the current collection to discover more." />
      </PageShell>
    )
  }

  const normalizedProduct = commerceProduct(product, product.source)
  const sizes = normalizedProduct.sizes.length ? normalizedProduct.sizes : ['One size']
  const colors = normalizedProduct.colors.length ? normalizedProduct.colors : ['Default']
  const productReviews = reviews[productId] ?? []
  const reviewCount = productReviews.length
  const reviewAverage = reviewCount
    ? productReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
    : 0
  const optionSummary = [
    normalizedProduct.sizes.length ? `Available in ${normalizedProduct.sizes.join(', ')}.` : '',
    normalizedProduct.colors.length ? `Available colours: ${normalizedProduct.colors.join(', ')}.` : '',
  ].filter(Boolean).join(' ')
  const description = product.description
    || `${product.name} is a versatile ${String(product.category || 'wardrobe').toLowerCase()} piece from Soverian Fit’s, selected for comfortable wear and effortless styling. ${optionSummary}`

  const addSelectedProduct = (buyNow = false) => {
    if (product.stock === false) {
      setNotice('This piece is currently unavailable.')
      return
    }
    if (!selectedSize || !selectedColor) {
      setNotice('Please select a size and colour before continuing.')
      return
    }
    const result = addToCart(normalizedProduct, {
      size: selectedSize === 'One size' ? '' : selectedSize,
      color: selectedColor === 'Default' ? '' : selectedColor,
      quantity,
    })
    setNotice(result.message)
    if (buyNow && result.ok) {
      const lineId = `${normalizedProduct.commerceId}|${selectedSize === 'One size' ? '' : selectedSize}|${selectedColor === 'Default' ? '' : selectedColor}`
      navigate(`/checkout?buyNow=${encodeURIComponent(lineId)}`)
    }
  }

  return (
    <>
      <CommerceNavbar />
      <main className="commerce-page">
        <div className="commerce-shell">
          <Link className="commerce-back-link" to="/shop"><ArrowBackRoundedIcon /> Back to the collection</Link>
          <div className="commerce-product-detail">
            <section className="commerce-gallery" aria-label="Product images">
              <div className="commerce-main-image">
                <img src={selectedImage || gallery[0]} alt={product.name} />
              </div>
              {gallery.length > 1 && (
                <div className="commerce-thumbnails">
                  {gallery.map((image, index) => (
                    <button className={image === (selectedImage || gallery[0]) ? 'is-active' : ''} type="button" key={`${image}-${index}`} onClick={() => setSelectedImage(image)}>
                      <img src={image} alt={`${product.name} view ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </section>
            <section className="commerce-product-info">
              <p className="commerce-product-eyebrow">{product.category || 'SOVERIAN FIT’S COLLECTION'}</p>
              <h1>{product.name}</h1>
              <a className="commerce-product-rating" href="#reviews">
                <span>{product.rating ? '★'.repeat(Math.round(product.rating)) : reviewCount ? '★'.repeat(Math.round(reviewAverage)) : '☆☆☆☆☆'}</span>
                {product.rating && product.reviews
                  ? `${product.rating} · ${product.reviews} product ratings`
                  : reviewCount
                    ? `${reviewCount} written review(s)`
                    : 'Be the first to review'}
              </a>
              <div className="commerce-detail-price">
                <strong>{money(normalizedProduct.price)}</strong>
                {normalizedProduct.oldPrice > normalizedProduct.price && <del>{money(normalizedProduct.oldPrice)}</del>}
                {normalizedProduct.oldPrice > normalizedProduct.price && <span>{Math.round((1 - normalizedProduct.price / normalizedProduct.oldPrice) * 100)}% off</span>}
              </div>
              <p className="commerce-detail-description">{description}</p>
              <p className={product.stock === false ? 'commerce-stock is-out' : 'commerce-stock'}>
                <span /> {product.stock === false ? 'Currently unavailable' : 'Available to order'}
              </p>
              <fieldset className="commerce-choice-group">
                <legend>Size <button type="button" className="commerce-text-button" onClick={() => setSizeGuideOpen(true)}>Size guide</button></legend>
                <div className="commerce-choice-row">
                  {sizes.map((size) => (
                    <button type="button" className={selectedSize === size ? 'is-selected' : ''} key={size} onClick={() => setSelectedSize(size)}>{size}</button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="commerce-choice-group">
                <legend>Colour</legend>
                <div className="commerce-choice-row commerce-color-row">
                  {colors.map((color) => (
                    <button type="button" className={selectedColor === color ? 'is-selected' : ''} key={color} onClick={() => setSelectedColor(color)}>{color}</button>
                  ))}
                </div>
              </fieldset>
              <div className="commerce-buy-row">
                <label className="commerce-detail-quantity">Qty
                  <input aria-label="Quantity" type="number" min="1" max="10" value={quantity} onChange={(event) => setQuantity(Math.min(10, Math.max(1, Number(event.target.value) || 1)))} />
                </label>
                <button className="commerce-button commerce-button--primary" type="button" disabled={product.stock === false} onClick={() => addSelectedProduct(false)}>Add to bag</button>
                <button className="commerce-button commerce-button--secondary" type="button" disabled={product.stock === false} onClick={() => addSelectedProduct(true)}>Buy now</button>
                <button className={`commerce-detail-heart${isWishlisted ? ' is-active' : ''}`} type="button" aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={isWishlisted} onClick={() => toggleWishlist(normalizedProduct)}>
                  {isWishlisted ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
                </button>
              </div>
              {notice && <p className="commerce-notice" role="status">{notice}</p>}
              <dl className="commerce-product-facts">
                <div><dt>Product</dt><dd>{product.name}</dd></div>
                <div><dt>Category</dt><dd>{product.category || 'Soverian Fit’s'}</dd></div>
                <div><dt>Material</dt><dd>Refer to the garment label for verified composition.</dd></div>
                <div><dt>Care</dt><dd>Follow the care instructions supplied with the garment.</dd></div>
                <div><dt>Delivery</dt><dd>Free shipping above ₹999; otherwise ₹99. Taxes are not calculated.</dd></div>
                <div><dt>Returns</dt><dd>Return eligibility and terms are confirmed at checkout.</dd></div>
              </dl>
            </section>
          </div>
          <ReviewSection product={normalizedProduct} />
        </div>
      </main>
      <CommerceFooter />
      {sizeGuideOpen && (
        <div className="commerce-dialog-backdrop" role="presentation" onClick={() => setSizeGuideOpen(false)}>
          <section className="commerce-size-dialog" role="dialog" aria-modal="true" aria-labelledby="commerce-size-title" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="commerce-dialog-close" aria-label="Close size guide" onClick={() => setSizeGuideOpen(false)}>×</button>
            <p>SIZE & FIT</p><h2 id="commerce-size-title">Choose your usual fit</h2>
            <p>Available sizes for this piece: {sizes.join(' · ')}. For a precise fit, refer to the product label or contact our team.</p>
          </section>
        </div>
      )}
    </>
  )
}

export const ProductDetailsPage = () => {
  const { productId } = useParams()
  const { catalog } = useCommerce()
  return <ProductDetailsContent key={productId} productId={productId} product={catalog[productId]} />
}

const getCheckoutInitialState = () => ({
  fullName: getCurrentUser()?.name ?? '',
  email: getCurrentUser()?.email ?? '',
  phone: '',
  house: '',
  street: '',
  city: '',
  state: '',
  pincode: '',
})

export const CheckoutPage = () => {
  const { cart, createOrder } = useCommerce()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const buyNowLine = searchParams.get('buyNow')
  const items = buyNowLine ? cart.filter((item) => item.lineId === buyNowLine) : cart
  const [form, setForm] = useState(getCheckoutInitialState)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const totals = calculateOrderTotals(items)

  const updateForm = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const submitOrder = async (event) => {
    event.preventDefault()
    setError('')
    if (!items.length) {
      setError('Your bag is empty. Add a piece before checking out.')
      return
    }
    if (form.fullName.trim().length < 2) {
      setError('Enter your full name.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      setError('Enter a valid 10-digit Indian mobile number.')
      return
    }
    if (!/^\d{6}$/.test(form.pincode.trim())) {
      setError('Enter a valid 6-digit PIN code.')
      return
    }
    if (![form.house, form.street, form.city, form.state].every((value) => value.trim())) {
      setError('Complete every delivery address field.')
      return
    }
    setLoading(true)
    const customer = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: [form.house.trim(), form.street.trim(), form.city.trim(), form.state.trim(), form.pincode.trim()].join(', '),
    }
    try {
      if (paymentMethod !== 'cod') {
        await startOnlineCheckout({
          customer,
          paymentMethod,
          items: items.map(({ commerceId, name, price, quantity, size, color }) => ({ commerceId, name, price, quantity, size, color })),
          totals,
          returnUrl: `${window.location.origin}/payment/return`,
        })
        return
      }
      const order = createOrder(customer, paymentMethod, items)
      if (!order) {
        setError('Please sign in before placing your order.')
        return
      }
      let emailNotice = ''
      try {
        const delivery = await sendOrderEmails(order)
        if (delivery.notificationSent && delivery.confirmationSent) {
          emailNotice = 'Order details and customer confirmation emails were sent.'
        } else if (delivery.notificationSent) {
          emailNotice = 'The order notification reached the store, but the customer confirmation email could not be sent.'
        } else if (delivery.confirmationSent) {
          emailNotice = 'The customer confirmation email was sent, but the store notification could not be delivered.'
        } else {
          emailNotice = 'The order was saved on this browser, but neither email could be delivered. Contact Support before relying on this demo order.'
        }
      } catch (emailError) {
        console.error('Unable to send order emails:', emailError)
        emailNotice = `${emailError.message || 'Order emails could not be sent.'} The order is saved on this browser only.`
      }
      navigate(`/order-confirmation/${order.id}`, { state: { emailNotice } })
    } catch (submitError) {
      setError(submitError.message || 'Unable to continue to checkout.')
    } finally {
      setLoading(false)
    }
  }

  if (!items.length) {
    return (
      <PageShell eyebrow="SECURE CHECKOUT" title="Checkout">
        <EmptyState icon={<ShoppingBagOutlinedIcon />} title="Your bag is empty" detail="Add a piece to your bag to continue to checkout." />
      </PageShell>
    )
  }

  return (
    <PageShell eyebrow="ALMOST YOURS" title="Checkout" description="Demo mode: orders are saved to this browser account; no order backend is configured.">
      <div className="commerce-layout commerce-checkout-layout">
        <form className="commerce-checkout-form" onSubmit={submitOrder}>
          <section className="commerce-form-section">
            <p>01 · YOUR DETAILS</p><h2>Contact information</h2>
            <div className="commerce-form-grid">
              <label>Full name<input name="fullName" autoComplete="name" value={form.fullName} onChange={updateForm} required minLength={2} /></label>
              <label>Email address<input name="email" type="email" autoComplete="email" value={form.email} onChange={updateForm} required /></label>
              <label>Mobile number<input name="phone" type="tel" inputMode="numeric" autoComplete="tel" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value.replace(/\D/g, '').slice(0, 10) }))} required /></label>
            </div>
          </section>
          <section className="commerce-form-section">
            <p>02 · DELIVERY</p><h2>Delivery address</h2>
            <div className="commerce-form-grid">
              <label>House / flat number<input name="house" value={form.house} onChange={updateForm} autoComplete="address-line1" required /></label>
              <label>Street / area<input name="street" value={form.street} onChange={updateForm} autoComplete="address-line2" required /></label>
              <label>City<input name="city" value={form.city} onChange={updateForm} autoComplete="address-level2" required /></label>
              <label>State<input name="state" value={form.state} onChange={updateForm} autoComplete="address-level1" required /></label>
              <label>PIN code<input name="pincode" inputMode="numeric" value={form.pincode} onChange={(event) => setForm((current) => ({ ...current, pincode: event.target.value.replace(/\D/g, '').slice(0, 6) }))} autoComplete="postal-code" required /></label>
            </div>
          </section>
          <fieldset className="commerce-form-section commerce-payment-options">
            <legend>03 · PAYMENT</legend>
            {[
              ['upi', 'UPI'],
              ['card', 'Credit / Debit Card'],
              ['netbanking', 'Net Banking'],
              ['cod', 'Cash on Delivery'],
            ].map(([value, label]) => (
              <label key={value} className={paymentMethod === value ? 'is-selected' : ''}>
                <input type="radio" name="payment" value={value} checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} />
                <span>{label}</span>
                {value !== 'cod' && <small>Secure provider setup required</small>}
              </label>
            ))}
            <p>Card, UPI and banking details are never collected or stored by this frontend.</p>
          </fieldset>
          {error && <p className="commerce-form-error" role="alert">{error}</p>}
          <button className="commerce-button commerce-button--primary commerce-full-button" type="submit" disabled={loading}>
            {loading ? 'Please wait…' : paymentMethod === 'cod' ? 'Place COD order' : 'Continue to secure payment'}
            {!loading && <ArrowForwardRoundedIcon />}
          </button>
          <Link className="commerce-back-link" to="/cart"><ArrowBackRoundedIcon /> Return to bag</Link>
        </form>
        <aside className="commerce-sidebar">
          <div className="commerce-checkout-items">
            <h2>Your pieces <span>{items.length}</span></h2>
            {items.map((item) => (
              <div key={item.lineId}>
                <img src={item.image} alt="" />
                <span>{item.name}<small>{displayOption(item.size)} · {displayOption(item.color)} · Qty {item.quantity}</small></span>
                <strong>{money(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <OrderTotals items={items} />
        </aside>
      </div>
    </PageShell>
  )
}

export const OrderConfirmationPage = () => {
  const { orderId } = useParams()
  const location = useLocation()
  const { orders } = useCommerce()
  const order = orders.find((item) => item.id === orderId)
  if (!order) {
    return (
      <PageShell eyebrow="ORDER STATUS" title="Order not available">
        <EmptyState icon={<ShoppingBagOutlinedIcon />} title="We couldn't find this order on this device" detail="Orders are stored locally in this demo. Sign in on the device where you placed it." action={<Link className="commerce-button commerce-button--primary" to="/orders">View my orders</Link>} />
      </PageShell>
    )
  }
  return (
    <PageShell eyebrow="SOVERIAN FIT’S · DEMO ORDER" title="Thank you" description="Your COD order draft is saved locally and has not been sent to a store.">
      <section className="commerce-confirmation">
        <div className="commerce-confirmation-mark">✓</div>
        <p>ORDER ID <strong>{order.id}</strong></p>
        <p>Placed {new Date(order.createdAt).toLocaleString('en-IN')}</p>
        {location.state?.emailNotice && <p className="commerce-form-error" role="status">{location.state.emailNotice}</p>}
        <div className="commerce-confirmation-grid">
          <div><span>Customer</span><strong>{order.customer.fullName}</strong></div>
          <div><span>Payment</span><strong>{order.paymentStatus}</strong></div>
          <div><span>Delivery address</span><strong>{order.customer.address}</strong></div>
          <div><span>Order total</span><strong>{money(order.total)}</strong></div>
        </div>
        <div className="commerce-confirmation-products">
          {order.items.map((item) => (
            <div key={item.lineId}><img src={item.image} alt="" /><span>{item.name}<small>Qty {item.quantity} · {displayOption(item.size)} · {displayOption(item.color)}</small></span><strong>{money(item.price * item.quantity)}</strong></div>
          ))}
        </div>
        <div className="commerce-wishlist-buttons">
          <Link className="commerce-button commerce-button--primary" to="/shop">Continue shopping</Link>
          <Link className="commerce-button commerce-button--secondary" to="/orders">My orders</Link>
        </div>
        <small>This confirmation is stored in this browser only. Connect an order backend to accept and persist real orders.</small>
      </section>
    </PageShell>
  )
}

export const MyOrdersPage = () => {
  const { orders, cancelOrder, deleteOrder } = useCommerce()

  const handleCancelOrder = (order) => {
    if (!window.confirm(`Cancel order ${order.id}?`)) return
    cancelOrder(order.id)
  }

  const handleDeleteOrder = (order) => {
    if (!window.confirm(`Permanently remove order ${order.id} from this browser?`)) return
    deleteOrder(order.id)
  }

  return (
    <PageShell showFooter={false} eyebrow="YOUR ACCOUNT" title="My orders" description="Order history saved to your account on this browser.">
      {!orders.length ? (
        <EmptyState icon={<ShoppingBagOutlinedIcon />} title="No orders yet" detail="Your order history will appear here after you place an order." />
      ) : (
        <div className="commerce-orders">
          {orders.map((order) => (
            <article className="commerce-order-card" key={order.id}>
              <header>
                <span><strong>{order.id}</strong><small>{new Date(order.createdAt).toLocaleDateString('en-IN')}</small></span>
                <span className={`commerce-order-status${order.status === 'Cancelled' ? ' is-cancelled' : ''}`}>{order.status}</span>
              </header>
              <div className="commerce-order-products">
                {order.items.map((item) => <div key={item.lineId}><img src={item.image} alt="" /><span>{item.name}<small>Qty {item.quantity} · {displayOption(item.size)} · {displayOption(item.color)}</small></span><strong>{money(item.price * item.quantity)}</strong></div>)}
              </div>
              <footer><span>{order.paymentStatus}</span><strong>Total {money(order.total)}</strong></footer>
              <div className="commerce-order-actions">
                {['Pending', 'Confirmed'].includes(order.status) && (
                  <button type="button" className="commerce-order-cancel" onClick={() => handleCancelOrder(order)}>
                    <CancelOutlinedIcon /> Cancel order
                  </button>
                )}
                <button type="button" className="commerce-order-delete" onClick={() => handleDeleteOrder(order)}>
                  <DeleteOutlineRoundedIcon /> Remove order
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  )
}

export const AccountDashboardPage = () => {
  const user = useAuthSession()
  const { cart, wishlist, orders } = useCommerce()
  const navigate = useNavigate()
  const recentOrders = orders.slice(0, 3)
  const recentItems = cart.slice(0, 3)
  const savedItems = wishlist.slice(0, 4)
  const totalSpent = orders.reduce((total, order) => total + order.total, 0)

  const signOut = () => {
    logoutUser()
    navigate('/', { replace: true })
  }

  return (
    <PageShell
      standalone
      eyebrow="SOVERIAN FIT’S · MEMBER SPACE"
      title="Your dashboard"
      description="Your account, saved pieces and order activity in one place."
    >
      <div className="commerce-dashboard">
        <section className="commerce-dashboard-welcome">
          <div className="commerce-dashboard-avatar"><PersonOutlineRoundedIcon /></div>
          <div>
            <p>WELCOME BACK</p>
            <h2>{user?.name || 'Soverian member'}</h2>
            <span>{user?.email}</span>
          </div>
          <button type="button" className="commerce-dashboard-signout" onClick={signOut}>
            <LogoutRoundedIcon /> Sign out
          </button>
        </section>

        <div className="commerce-dashboard-stats">
          <Link to="/orders">
            <span>ORDERS PLACED</span><strong>{orders.length}</strong><small>View your order history →</small>
          </Link>
          <Link to="/cart">
            <span>IN YOUR BAG</span><strong>{cart.reduce((sum, item) => sum + item.quantity, 0)}</strong><small>Items ready for checkout →</small>
          </Link>
          <Link to="/wishlist">
            <span>SAVED PIECES</span><strong>{wishlist.length}</strong><small>Revisit your favourites →</small>
          </Link>
          <article>
            <span>ORDER TOTAL</span><strong>{money(totalSpent)}</strong><small>Across orders on this device</small>
          </article>
        </div>

        <div className="commerce-dashboard-grid">
          <section className="commerce-dashboard-panel">
            <header><div><p>YOUR ACTIVITY</p><h2>Recent orders</h2></div><Link to="/orders">All orders <ArrowForwardRoundedIcon /></Link></header>
            {recentOrders.length ? (
              <div className="commerce-dashboard-list">
                {recentOrders.map((order) => (
                  <Link to={`/order-confirmation/${order.id}`} className="commerce-dashboard-order" key={order.id}>
                    <span><strong>{order.id}</strong><small>{new Date(order.createdAt).toLocaleDateString('en-IN')} · {order.items.length} piece(s)</small></span>
                    <span className="commerce-dashboard-order-total">{money(order.total)}<small>{order.status}</small></span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="commerce-dashboard-empty">
                <ShoppingBagOutlinedIcon />
                <p>Your orders will appear here after checkout.</p>
                <Link to="/shop">Explore the collection <ArrowForwardRoundedIcon /></Link>
              </div>
            )}
          </section>

          <section className="commerce-dashboard-panel">
            <header><div><p>ACCOUNT DETAILS</p><h2>Member profile</h2></div></header>
            <div className="commerce-dashboard-profile">
              <span>Full name<strong>{user?.name || '—'}</strong></span>
              <span>Email address<strong>{user?.email || '—'}</strong></span>
              <small>Account activity is saved in this browser.</small>
            </div>
          </section>

          <section className="commerce-dashboard-panel">
            <header><div><p>READY WHEN YOU ARE</p><h2>Your bag</h2></div><Link to="/cart">Open bag <ArrowForwardRoundedIcon /></Link></header>
            {recentItems.length ? (
              <div className="commerce-dashboard-products">
                {recentItems.map((item) => (
                  <Link to={productDetailsPath(item)} key={item.lineId}>
                    <img src={item.image} alt="" />
                    <span>{item.name}<small>Qty {item.quantity} · {displayOption(item.size)}</small></span>
                    <strong>{money(item.price * item.quantity)}</strong>
                  </Link>
                ))}
              </div>
            ) : <p className="commerce-dashboard-muted">Your bag is empty. Find a piece to make it yours.</p>}
          </section>

          <section className="commerce-dashboard-panel">
            <header><div><p>KEPT CLOSE</p><h2>Saved pieces</h2></div><Link to="/wishlist">Wishlist <ArrowForwardRoundedIcon /></Link></header>
            {savedItems.length ? (
              <div className="commerce-dashboard-products">
                {savedItems.map((item) => (
                  <Link to={productDetailsPath(item)} key={item.commerceId}>
                    <img src={item.image} alt="" />
                    <span>{item.name}<small>Saved to your wishlist</small></span>
                    <strong>{money(item.price)}</strong>
                  </Link>
                ))}
              </div>
            ) : <p className="commerce-dashboard-muted">Your favourite pieces will show up here.</p>}
          </section>
        </div>
        <p className="commerce-dashboard-note">This demo keeps account activity in this browser. A secure backend is needed for cross-device accounts and production orders.</p>
      </div>
    </PageShell>
  )
}

export const PaymentReturnPage = () => (
  <PageShell eyebrow="PAYMENT UPDATE" title="Payment verification required" description="A payment is not marked successful until the configured server verifies it with the payment provider.">
    <EmptyState
      icon={<ShoppingBagOutlinedIcon />}
      title="We haven’t confirmed a payment"
      detail="This project has no payment backend configured yet. If you have completed a provider checkout, check its order status with the store before trying again."
      action={<Link className="commerce-button commerce-button--primary" to="/orders">View my orders</Link>}
    />
  </PageShell>
)
