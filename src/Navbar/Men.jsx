import { useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined'
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined'
import CheckroomOutlinedIcon from '@mui/icons-material/CheckroomOutlined'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import YouTubeIcon from '@mui/icons-material/YouTube'
import collectionHeroImage from '../assets/collection-page-hero-img.png'
import manHeroImage from '../assets/main-man.png'
import manCampaignImage from '../assets/more-fashion.png'
import logoImage from '../assets/react-ecom-logo.png'
import shopProductData from '../Shop_product.json'
import './Navbar.css'
import './Men.css'
import CommerceHeaderActions from '../commerce/CommerceHeaderActions'
import { commerceProduct, productDetailsPath, useCommerce, useRegisterProducts } from '../commerce/CommerceContext'
import MobileNav from './MobileNav'
import { useNewsletterSignup } from '../services/useNewsletterSignup'

const productImages = Object.entries(import.meta.glob('../assets/collection-pro*.jpg', {
  eager: true,
  import: 'default',
}))
  .filter(([path]) => !path.endsWith('collection-pro24.jpg'))
  .sort(([firstPath], [secondPath]) => (
    Number(firstPath.match(/pro(\d+)\.jpg$/)?.[1])
      - Number(secondPath.match(/pro(\d+)\.jpg$/)?.[1])
  ))
  .map(([, image]) => image)

const menProductDetails = [
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

const products = menProductDetails.map((details, index) => ({
  ...shopProductData.products[index % shopProductData.products.length],
  ...details,
  id: index + 1,
  sizes: details.sizes ?? ['S', 'M', 'L', 'XL'],
  image: productImages[index],
}))
const featuredProductCount = 6
const categories = [...new Set(products.map((product) => product.category))]

const slides = [
  {
    image: collectionHeroImage,
    eyebrow: 'THE MEN’S EDIT',
    title: <>Discover Our<br /><span>Premium Collection</span></>,
    description: 'Explore the latest styles, crafted for comfort, style and confidence.',
  },
  {
    image: manHeroImage,
    eyebrow: 'DRESSED FOR EVERY DAY',
    title: <>Made to Move.<br /><span>Built to Last.</span></>,
    description: 'Thoughtful essentials and statement layers for wherever life takes you.',
  },
  {
    image: manCampaignImage,
    eyebrow: 'NEW SEASON · 2025',
    title: <>Your Style.<br /><span>Your Story.</span></>,
    description: 'Meet the newest pieces from Soverian Fit’s men’s collection.',
  },
]

const sizes = ['S', 'M', 'L', 'XL']
const colors = [
  { name: 'Black', value: '#111111' },
  { name: 'White', value: '#f5f2eb' },
  { name: 'Grey', value: '#777a80' },
  { name: 'Brown', value: '#68412e' },
  { name: 'Olive Green', value: '#596044' },
  { name: 'Green', value: '#246b53' },
  { name: 'Beige', value: '#d9c8a9' },
  { name: 'Cream', value: '#e9e1d0' },
  { name: 'Red', value: '#a44642' },
  { name: 'Burgundy', value: '#722c3b' },
  { name: 'Navy Blue', value: '#243a63' },
  { name: 'Orange', value: '#d17b43' },
  { name: 'Gold', value: '#c5a35b' },
  { name: 'Multicolor', value: 'linear-gradient(135deg, #a44642, #596044, #68412e)' },
]
const priceRanges = [
  { label: 'Under ₹1,000', min: 0, max: 999 },
  { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 – ₹4,000', min: 2001, max: 4000 },
  { label: 'Above ₹4,000', min: 4001, max: Infinity },
]
const benefits = [
  { icon: <WorkspacePremiumOutlinedIcon />, title: 'Premium Quality', detail: 'Built to last' },
  { icon: <LocalShippingOutlinedIcon />, title: 'Free Shipping', detail: 'On orders above ₹999' },
  { icon: <SecurityOutlinedIcon />, title: 'Secure Payments', detail: '100% safe checkout' },
  { icon: <SupportAgentOutlinedIcon />, title: '24/7 Support', detail: 'Always here to help' },
]

const testimonials = [
  { initials: 'RS', name: 'Rohit Sharma', quote: 'Amazing quality and perfect fit! Highly recommended.' },
  { initials: 'PV', name: 'Priya Verma', quote: 'Stylish, comfortable and premium. Love it!' },
  { initials: 'AP', name: 'Arjun Patel', quote: 'Best fashion brand ever. Will shop again!' },
]

const Men = () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const [category, setCategory] = useState('')
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedPrices, setSelectedPrices] = useState([])
  const [appliedFilters, setAppliedFilters] = useState({
    category: '',
    sizes: [],
    colors: [],
    prices: [],
  })
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [sortOrder, setSortOrder] = useState('featured')
  const [showAllProducts, setShowAllProducts] = useState(false)
  const [cartMessage, setCartMessage] = useState('')
  const { email, setEmail, isSubmitting, isSubscribed, notice, submitNewsletter } = useNewsletterSignup()
  const { wishlist, toggleWishlist, addToCart } = useCommerce()
  useRegisterProducts(products, 'collection')

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory = !appliedFilters.category || product.category === appliedFilters.category
      const matchesSize = !appliedFilters.sizes.length
        || appliedFilters.sizes.some((size) => product.sizes.includes(size))
      const matchesColor = !appliedFilters.colors.length
        || appliedFilters.colors.some((color) => product.colors.includes(color))
      const matchesPrice = !appliedFilters.prices.length
        || appliedFilters.prices.some(({ min, max }) => product.price >= min && product.price <= max)

      return matchesCategory && matchesSize && matchesColor && matchesPrice
    })

    if (sortOrder === 'price-low') return filtered.sort((first, second) => first.price - second.price)
    if (sortOrder === 'price-high') return filtered.sort((first, second) => second.price - first.price)
    if (sortOrder === 'name') return filtered.sort((first, second) => first.name.localeCompare(second.name))
    return filtered
  }, [appliedFilters, sortOrder])
  const visibleProducts = showAllProducts
    ? filteredProducts
    : filteredProducts.slice(0, featuredProductCount)

  const toggleSelection = (value, setter) => {
    setter((current) => (
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    ))
  }

  const applyFilters = () => {
    setAppliedFilters({
      category,
      sizes: selectedSizes,
      colors: selectedColors,
      prices: selectedPrices,
    })
    setShowAllProducts(true)
  }

  const resetFilters = () => {
    setCategory('')
    setSelectedSizes([])
    setSelectedColors([])
    setSelectedPrices([])
    setAppliedFilters({ category: '', sizes: [], colors: [], prices: [] })
    setShowAllProducts(true)
  }

  const changeSlide = (direction) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length)
  }

  const slide = slides[activeSlide]

  return (
    <>
      <header className="navbar">
        <MobileNav />
        <div className="nav-brand">
          <img className="nav-logo" src={logoImage} alt="Soverian Fit’s" />
        </div>
        <div className="nav">
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
        </div>
        <CommerceHeaderActions />
      </header>

      <div className="men-page">
      <main>
        <section className="men-hero" aria-label="Men’s collection">
          <img className="men-hero-image" src={slide.image} alt="" />
          <div className="men-hero-shade" />
          <div className="men-hero-copy">
            <p className="men-eyebrow">{slide.eyebrow}</p>
            <h1>{slide.title}</h1>
            <p className="men-hero-description">{slide.description}</p>
            <a className="men-primary-button" href="#men-products">
              SHOP NOW <ArrowForwardRoundedIcon aria-hidden="true" />
            </a>
          </div>
          <button className="men-slide-arrow is-previous" type="button" aria-label="Previous slide" onClick={() => changeSlide(-1)}>
            <ChevronLeftRoundedIcon />
          </button>
          <button className="men-slide-arrow is-next" type="button" aria-label="Next slide" onClick={() => changeSlide(1)}>
            <ChevronRightRoundedIcon />
          </button>
          <div className="men-slide-dots" aria-label="Choose a collection slide">
            {slides.map((item, index) => (
              <button
                type="button"
                key={item.eyebrow}
                className={index === activeSlide ? 'is-active' : ''}
                aria-label={`Show slide ${index + 1}`}
                aria-current={index === activeSlide ? 'true' : undefined}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </section>

        <section className="men-benefits" aria-label="Shopping benefits">
          {benefits.map((benefit) => (
            <div className="men-benefit" key={benefit.title}>
              <span className="men-benefit-icon">{benefit.icon}</span>
              <span><strong>{benefit.title}</strong><small>{benefit.detail}</small></span>
            </div>
          ))}
        </section>

        <section className="men-catalog" id="men-products" aria-labelledby="men-products-title">
          <aside className={`men-filters${filtersOpen ? '' : ' is-collapsed'}`} aria-label="Product filters">
            <button
              className="men-filter-heading"
              type="button"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((open) => !open)}
            >
              <TuneRoundedIcon aria-hidden="true" />
              <span>Filter Products</span>
              <span className="men-filter-toggle">{filtersOpen ? '−' : '+'}</span>
            </button>
            {filtersOpen && (
              <div className="men-filter-content">
                <fieldset className="men-filter-group">
                  <legend>Category</legend>
                  <label><input type="radio" name="men-category" checked={!category} onChange={() => setCategory('')} /> All Men’s Wear</label>
                  {categories.map((item) => (
                    <label key={item}>
                      <input type="radio" name="men-category" checked={category === item} onChange={() => setCategory(item)} />
                      {item}
                    </label>
                  ))}
                </fieldset>

                <fieldset className="men-filter-group">
                  <legend>Size</legend>
                  <div className="men-size-options">
                    {sizes.map((size) => (
                      <label className={selectedSizes.includes(size) ? 'is-selected' : ''} key={size}>
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size)}
                          onChange={() => toggleSelection(size, setSelectedSizes)}
                        />
                        {size}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="men-filter-group">
                  <legend>Color</legend>
                  <div className="men-color-options">
                    {colors.map((color) => (
                      <label className={selectedColors.includes(color.name) ? 'is-selected' : ''} title={color.name} key={color.name}>
                        <input
                          type="checkbox"
                          aria-label={color.name}
                          checked={selectedColors.includes(color.name)}
                          onChange={() => toggleSelection(color.name, setSelectedColors)}
                        />
                        <span style={{ '--men-swatch-color': color.value }} />
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="men-filter-group">
                  <legend>Price Range</legend>
                  {priceRanges.map((range) => (
                    <label key={range.label}>
                      <input
                        type="checkbox"
                        checked={selectedPrices.includes(range)}
                        onChange={() => toggleSelection(range, setSelectedPrices)}
                      />
                      {range.label}
                    </label>
                  ))}
                </fieldset>
                <div className="men-filter-actions">
                  <button className="men-apply-button" type="button" onClick={applyFilters}>
                    Apply Filter <ArrowForwardRoundedIcon aria-hidden="true" />
                  </button>
                  <button className="men-reset-button" type="button" onClick={resetFilters}>Reset</button>
                </div>
              </div>
            )}
          </aside>

          <div className="men-products-area">
            <div className="men-section-heading">
              <div>
                <p className="men-eyebrow">MADE FOR YOUR EVERYDAY</p>
                <h2 id="men-products-title">
                  {showAllProducts ? 'All Men’s' : 'Featured'} <span>Products</span>
                </h2>
              </div>
              <button
                className="men-view-all"
                type="button"
                onClick={() => setShowAllProducts((showAll) => !showAll)}
                aria-expanded={showAllProducts}
              >
                {showAllProducts ? 'Show Featured Products' : 'View All Products'}
                <ArrowForwardRoundedIcon aria-hidden="true" />
              </button>
            </div>
            <div className="men-product-toolbar">
              <p>
                Showing {visibleProducts.length}
                {!showAllProducts && filteredProducts.length > visibleProducts.length ? ` of ${filteredProducts.length}` : ''}
                {' '}products
              </p>
              <label className="men-sort">
                <span className="men-sr-only">Sort products</span>
                <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                  <option value="featured">Sort By: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </label>
            </div>

            {visibleProducts.length ? (
              <div className="men-product-grid">
                {visibleProducts.map((product) => {
                  const commerceItem = commerceProduct(product, 'collection')
                  const isWishlisted = wishlist.some((item) => item.commerceId === commerceItem.commerceId)
                  return (
                    <article className="men-product-card" key={product.id}>
                      <div className="men-product-image">
                        <Link to={productDetailsPath(product, 'collection')} aria-label={`View ${product.name}`}>
                          <img src={product.image} alt={product.name} loading="lazy" />
                        </Link>
                        {product.tag && <span className={`men-product-badge is-${product.tag.toLowerCase()}`}>{product.tag}</span>}
                        <button
                          className={`men-wishlist-button${isWishlisted ? ' is-active' : ''}`}
                          type="button"
                          aria-label={`${isWishlisted ? 'Remove' : 'Add'} ${product.name} ${isWishlisted ? 'from' : 'to'} wishlist`}
                          aria-pressed={isWishlisted}
                          onClick={() => toggleWishlist(commerceItem)}
                        >
                          {isWishlisted
                            ? <FavoriteRoundedIcon aria-hidden="true" />
                            : <FavoriteBorderRoundedIcon aria-hidden="true" />}
                        </button>
                      </div>
                      <div className="men-product-info">
                        <h3><Link to={productDetailsPath(product, 'collection')}>{product.name}</Link></h3>
                        <p className="men-product-price">
                          ₹{product.price.toLocaleString('en-IN')}
                          {product.oldPrice && <del>₹{product.oldPrice.toLocaleString('en-IN')}</del>}
                        </p>
                        <button
                          className="men-add-button"
                          type="button"
                          onClick={() => setCartMessage(addToCart(commerceItem).message)}
                        >
                          <ShoppingCartIcon aria-hidden="true" /> Add to Cart
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="men-empty-state">
                <CheckroomOutlinedIcon aria-hidden="true" />
                <p>No products match those filters.</p>
                <button type="button" onClick={resetFilters}>Clear filters</button>
              </div>
            )}
            <p className="men-sr-only" aria-live="polite">{cartMessage}</p>
          </div>
        </section>

        <section className="men-sale-banner" aria-label="New season offer">
          <div className="men-sale-copy">
            <p className="men-eyebrow">NEW SEASON</p>
            <h2>20% <span>OFF</span></h2>
          </div>
          <div className="men-sale-description">
            <p>Upgrade Your Style</p>
            <strong>With SOVERIAN FIT’S</strong>
          </div>
          <a className="men-sale-button" href="#men-products">SHOP NOW <ArrowForwardRoundedIcon aria-hidden="true" /></a>
          <img src={manCampaignImage} alt="" />
        </section>

        <section className="men-service-strip" aria-label="Our promises">
          <div><CheckroomOutlinedIcon /><span><strong>Trendy Styles</strong><small>Always in Fashion</small></span></div>
          <div><WorkspacePremiumOutlinedIcon /><span><strong>Best Quality</strong><small>Guaranteed</small></span></div>
          <div><CardGiftcardOutlinedIcon /><span><strong>Easy Returns</strong><small>Hassle Free</small></span></div>
          <div><FavoriteBorderRoundedIcon /><span><strong>Loved by Customers</strong><small>4.8/5 Ratings</small></span></div>
        </section>

        <section className="men-testimonials" aria-labelledby="men-reviews-title">
          <div className="men-reviews-heading">
            <h2 id="men-reviews-title">What Our Customers Say</h2>
            <a href="#men-reviews-title">View All Reviews <ArrowForwardRoundedIcon aria-hidden="true" /></a>
          </div>
          <div className="men-review-grid">
            {testimonials.map((review) => (
              <article className="men-review-card" key={review.name}>
                <span className="men-review-avatar" aria-hidden="true">{review.initials}</span>
                <div>
                  <p>“{review.quote}”</p>
                  <strong>{review.name}</strong>
                  <span className="men-review-stars" aria-label="5 out of 5 stars">★★★★★</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="men-newsletter" aria-label="Newsletter subscription">
          <div className="men-newsletter-intro">
            <span className="men-newsletter-icon"><CardGiftcardOutlinedIcon /></span>
            <div><h2>Subscribe to Our Newsletter</h2><p>Get updates on new collections and exclusive offers.</p></div>
          </div>
          {isSubscribed ? (
            <p className="men-newsletter-success" role="status">{notice?.text}</p>
          ) : (
            <form className="men-newsletter-form" onSubmit={submitNewsletter}>
              <label className="men-sr-only" htmlFor="men-newsletter-email">Your email address</label>
              <input
                id="men-newsletter-email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Subscribe'} <ArrowForwardRoundedIcon aria-hidden="true" /></button>
            </form>
          )}
          {notice?.type === 'error' && <p className="men-newsletter-success is-error" role="alert">{notice.text}</p>}
          <span className="men-newsletter-mark" aria-hidden="true">S</span>
        </section>
      </main>
      <footer className="men-footer">
        <div className="men-footer-main">
          <div className="men-footer-brand">
            <Link to="/" aria-label="Soverian Fit’s home">
              <img src={logoImage} alt="Soverian Fit’s" />
            </Link>
          </div>
          <nav className="men-footer-nav" aria-label="Footer navigation">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/collection">Collection</Link>
            <Link to="/men">Men</Link>
            <Link to="/women">Women</Link>
            <Link to="/new-arrivals">New Arrivals</Link>
            <Link to="/sales">Sales</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          <div className="men-footer-social" aria-label="Social media">
            <a href="https://www.instagram.com/" aria-label="Instagram"><InstagramIcon /></a>
            <a href="https://www.facebook.com/" aria-label="Facebook"><FacebookIcon /></a>
            <a href="https://x.com/" aria-label="X" className="men-footer-x">𝕏</a>
            <a href="https://www.youtube.com/" aria-label="YouTube"><YouTubeIcon /></a>
          </div>
        </div>
        <div className="men-footer-copyright">© 2025 Soverian Fit’s. All rights reserved.</div>
      </footer>
      </div>
    </>
  )
}

export default Men
