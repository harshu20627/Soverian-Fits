import { useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined'
import CheckroomOutlinedIcon from '@mui/icons-material/CheckroomOutlined'
import DryCleaningOutlinedIcon from '@mui/icons-material/DryCleaningOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import WomanOutlinedIcon from '@mui/icons-material/WomanOutlined'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import YouTubeIcon from '@mui/icons-material/YouTube'
import heroImage from '../assets/women-interface-img.png'
import secondaryHeroImage from '../assets/main-women.png'
import thirdHeroImage from '../assets/shop-category-women.png'
import ethnicSetImage from '../assets/women-pro2.png'
import logoImage from '../assets/react-ecom-logo.png'
import './Navbar.css'
import './Women.css'
import CommerceHeaderActions from '../commerce/CommerceHeaderActions'
import MobileNav from './MobileNav'
import { commerceProduct, productDetailsPath, useCommerce, useRegisterProducts } from '../commerce/CommerceContext'
import { useNewsletterSignup } from '../services/useNewsletterSignup'

const womenProductImages = Object.fromEntries(
  Object.entries(import.meta.glob('../assets/women-pro*.png', {
    eager: true,
    import: 'default',
  }))
    .filter(([path]) => !path.endsWith('women-pro1.png'))
    .map(([path, image]) => [path.split('/').pop(), image]),
)

const womenProducts = [
  { name: 'Striped Tee & Denim Edit', category: 'Western Wear', price: 2299, oldPrice: 2899, tag: 'NEW', image: 'women-pro4.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Blue' },
  { name: 'Everyday Navy Shirt', category: 'Tops & Tees', price: 1899, oldPrice: 2499, tag: 'NEW', image: 'women-pro5.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Blue' },
  { name: 'Embroidered Blouse & Skirt Set', category: 'Ethnic Wear', price: 3299, oldPrice: 3999, tag: 'NEW', image: 'women-pro7.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Ivory' },
  { name: 'Olive Tailored Blazer', category: 'Outerwear', price: 3599, oldPrice: 4499, tag: 'NEW', image: 'women-pro8.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Emerald' },
  { name: 'Burgundy Ribbed Knit Top', category: 'Tops & Tees', price: 1699, oldPrice: 2199, tag: 'NEW', image: 'women-pro9.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Wine' },
  { name: 'Relaxed Wide-Leg Trousers', category: 'Western Wear', price: 1799, oldPrice: 2299, tag: '', image: 'women-pro10.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Brown' },
  { name: 'Tiered Everyday Maxi Skirt', category: 'Western Wear', price: 1999, oldPrice: 2599, tag: '', image: 'women-pro11.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Brown' },
  { name: 'Wine Bow Heels', category: 'Footwear', price: 2499, oldPrice: 3199, tag: 'NEW', image: 'women-pro12.png', sizes: [], color: 'Wine' },
  { name: 'Polished Ankle Boots', category: 'Footwear', price: 3299, oldPrice: 3999, tag: 'NEW', image: 'women-pro13.png', sizes: [], color: 'Wine' },
  { name: 'Cherry Mini Shoulder Bag', category: 'Accessories', price: 2199, oldPrice: 2799, tag: 'NEW', image: 'women-pro14.png', sizes: [], color: 'Wine' },
  { name: 'Classic Court Sneakers', category: 'Footwear', price: 2799, oldPrice: 3499, tag: '', image: 'women-pro15.png', sizes: [], color: 'Ivory' },
  { name: 'Burgundy Dial Bracelet Watch', category: 'Accessories', price: 2899, oldPrice: 3599, tag: 'NEW', image: 'women-pro16.png', sizes: [], color: 'Wine' },
  { name: 'Rose Dial Link Watch', category: 'Accessories', price: 3199, oldPrice: 3899, tag: '', image: 'women-pro17.png', sizes: [], color: 'Pink' },
  { name: 'Floral Ombre Knit Sweater', category: 'Tops & Tees', price: 2599, oldPrice: 3299, tag: 'NEW', image: 'women-pro18.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Wine' },
  { name: 'Color-Block Cozy Sweater', category: 'Tops & Tees', price: 2399, oldPrice: 2999, tag: '', image: 'women-pro19.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Brown' },
  { name: 'Blue Floral Knit Pullover', category: 'Tops & Tees', price: 2699, oldPrice: 3399, tag: 'NEW', image: 'women-pro20.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Blue' },
  { name: 'Embroidered Blouse & Skirt Co-ord', category: 'Ethnic Wear', price: 3499, oldPrice: 4299, tag: '', image: 'women-pro21.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Ivory' },
  { name: 'Longline Belted Coat', category: 'Outerwear', price: 4299, oldPrice: 5299, tag: 'NEW', image: 'women-pro22.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Brown' },
  { name: 'Burgundy Shirt & Denim Outfit', category: 'Western Wear', price: 2899, oldPrice: 3599, tag: '', image: 'women-pro67.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Wine' },
  { name: 'Embroidered Festive Set', category: 'Ethnic Wear', price: 2999, oldPrice: 3699, tag: '', image: 'women-pro2.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Gold' },
  { name: 'Floral Print Everyday Top', category: 'Tops & Tees', price: 1399, oldPrice: 1899, tag: '', image: 'women-pro3.png', sizes: ['S', 'M', 'L'], color: 'Pink' },
].map((product, index) => ({ ...product, id: index + 1, image: womenProductImages[product.image] }))

const categories = ['Dresses', 'Tops & Tees', 'Sarees', 'Western Wear', 'Ethnic Wear', 'Outerwear', 'Footwear', 'Accessories']
const sizes = ['S', 'M', 'L', 'XL', 'XXL']
const colors = [
  { name: 'Pink', value: '#ec4d79' },
  { name: 'Red', value: '#ed343b' },
  { name: 'Wine', value: '#9e164c' },
  { name: 'Emerald', value: '#08794e' },
  { name: 'Ivory', value: '#f4eee0' },
  { name: 'Black', value: '#111111' },
  { name: 'Blue', value: '#2879e9' },
  { name: 'Gold', value: '#daa520' },
]
const priceRanges = [
  { label: 'Under ₹1,000', min: 0, max: 999 },
  { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 – ₹3,000', min: 2001, max: 3000 },
  { label: 'Above ₹3,000', min: 3001, max: Infinity },
]
const heroSlides = [
  {
    image: heroImage,
    title: <>Discover Our<br /><span>Women’s Collection</span></>,
    description: 'Explore the latest styles, crafted for elegance, style and confidence.',
  },
  {
    image: secondaryHeroImage,
    title: <>Find Your<br /><span>Everyday Elegance</span></>,
    description: 'Beautifully considered pieces for every day, every mood, every you.',
  },
  {
    image: thirdHeroImage,
    title: <>A Little More<br /><span>Beautifully You</span></>,
    description: 'Discover the details that make every outfit feel like your own.',
  },
]
const benefits = [
  { icon: <DiamondOutlinedIcon />, title: 'Premium Quality', detail: 'Best in class' },
  { icon: <LocalShippingOutlinedIcon />, title: 'Free Shipping', detail: 'On orders above ₹999' },
  { icon: <VerifiedUserOutlinedIcon />, title: 'Secure Payments', detail: '100% safe' },
  { icon: <HeadsetMicOutlinedIcon />, title: '24/7 Support', detail: 'Always here' },
]
const categoryLinks = [
  { name: 'Dresses', category: 'Dresses', icon: <CheckroomOutlinedIcon /> },
  { name: 'Tops & Tees', category: 'Tops & Tees', icon: <DryCleaningOutlinedIcon /> },
  { name: 'Sarees', category: 'Sarees', icon: <WomanOutlinedIcon /> },
  { name: 'Western Wear', category: 'Western Wear', icon: <CheckroomOutlinedIcon /> },
  { name: 'Ethnic Wear', category: 'Ethnic Wear', icon: <AutoAwesomeOutlinedIcon /> },
  { name: 'Accessories', category: 'Accessories', icon: <ShoppingBagOutlinedIcon /> },
]
const testimonials = [
  { name: 'Sneha Sharma', quote: 'Amazing quality and perfect fit! Highly recommended.', image: heroImage },
  { name: 'Priya Mehta', quote: 'Stylish, comfortable and premium. Love it!', image: ethnicSetImage },
  { name: 'Anjali Verma', quote: 'Best fashion brand ever. Will shop again!', image: thirdHeroImage },
]
const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`

const Women = () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const [category, setCategory] = useState('')
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedPrices, setSelectedPrices] = useState([])
  const [appliedFilters, setAppliedFilters] = useState({ category: '', sizes: [], colors: [], prices: [] })
  const [showAllProducts, setShowAllProducts] = useState(false)
  const { email, setEmail, isSubmitting, isSubscribed, notice, submitNewsletter } = useNewsletterSignup()
  const { wishlist, toggleWishlist, addToCart } = useCommerce()
  useRegisterProducts(womenProducts, 'women')

  const filteredProducts = useMemo(() => womenProducts.filter((product) => {
    const matchesCategory = !appliedFilters.category || product.category === appliedFilters.category
    const matchesSizes = !appliedFilters.sizes.length
      || appliedFilters.sizes.some((size) => product.sizes.includes(size))
    const matchesColors = !appliedFilters.colors.length
      || appliedFilters.colors.includes(product.color)
    const matchesPrices = !appliedFilters.prices.length
      || appliedFilters.prices.some(({ min, max }) => product.price >= min && product.price <= max)
    return matchesCategory && matchesSizes && matchesColors && matchesPrices
  }), [appliedFilters])
  const displayedProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 6)
  const slide = heroSlides[activeSlide]

  const toggleSelection = (value, setter) => {
    setter((current) => current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value])
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
    setShowAllProducts(false)
  }

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

      <main className="women-page">
        <section className="women-hero" aria-label="Women’s collection">
          <img className="women-hero-image" src={slide.image} alt="" />
          <div className="women-hero-shade" />
          <div className="women-hero-copy">
            <p className="women-eyebrow">OUR COLLECTION</p>
            <h1>{slide.title}</h1>
            <p>{slide.description}</p>
            <a className="women-shop-button" href="#women-products">SHOP NOW <ArrowForwardRoundedIcon /></a>
          </div>
          <button className="women-hero-arrow women-hero-previous" type="button" aria-label="Previous slide" onClick={() => setActiveSlide((activeSlide + heroSlides.length - 1) % heroSlides.length)}>
            <ChevronLeftRoundedIcon />
          </button>
          <button className="women-hero-arrow women-hero-next" type="button" aria-label="Next slide" onClick={() => setActiveSlide((activeSlide + 1) % heroSlides.length)}>
            <ChevronRightRoundedIcon />
          </button>
          <div className="women-hero-dots" aria-label="Choose collection slide">
            {heroSlides.map((item, index) => (
              <button
                key={item.description}
                className={index === activeSlide ? 'is-active' : ''}
                type="button"
                aria-label={`Show collection slide ${index + 1}`}
                aria-pressed={index === activeSlide}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </section>

        <section className="women-benefits" aria-label="Shopping benefits">
          {benefits.map((benefit) => (
            <div className="women-benefit" key={benefit.title}>
              {benefit.icon}
              <div><strong>{benefit.title}</strong><span>{benefit.detail}</span></div>
            </div>
          ))}
        </section>

        <section className="women-shopping" id="women-products">
          <aside className="women-filter-panel" aria-label="Filter products">
            <h2><span>▽</span> Filter Products</h2>
            <fieldset>
              <legend>Category</legend>
              <label className="women-radio-option">
                <input type="radio" name="women-category" value="" checked={!category} onChange={() => setCategory('')} />
                <span>All Women’s Wear</span>
              </label>
              {categories.map((item) => (
                <label className="women-radio-option" key={item}>
                  <input type="radio" name="women-category" value={item} checked={category === item} onChange={() => setCategory(item)} />
                  <span>{item}</span>
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>Size</legend>
              <div className="women-size-options">
                {sizes.map((size) => (
                  <label className={selectedSizes.includes(size) ? 'is-selected' : ''} key={size}>
                    <input type="checkbox" checked={selectedSizes.includes(size)} onChange={() => toggleSelection(size, setSelectedSizes)} />
                    <span>{size}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Color</legend>
              <div className="women-color-options">
                {colors.map((color) => (
                  <label className={selectedColors.includes(color.name) ? 'is-selected' : ''} key={color.name} title={color.name}>
                    <input type="checkbox" checked={selectedColors.includes(color.name)} onChange={() => toggleSelection(color.name, setSelectedColors)} />
                    <span style={{ '--swatch-color': color.value }} />
                    <span className="women-sr-only">{color.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Price Range</legend>
              {priceRanges.map((range) => (
                <label className="women-price-option" key={range.label}>
                  <input type="checkbox" checked={selectedPrices.some((item) => item.label === range.label)} onChange={() => toggleSelection(range, setSelectedPrices)} />
                  <span>{range.label}</span>
                </label>
              ))}
            </fieldset>
            <button className="women-filter-button" type="button" onClick={applyFilters}>Apply Filter <ArrowForwardRoundedIcon /></button>
            {Boolean(appliedFilters.category || appliedFilters.sizes.length || appliedFilters.colors.length || appliedFilters.prices.length) && (
              <button className="women-reset-button" type="button" onClick={resetFilters}>Clear filters</button>
            )}
          </aside>

          <div className="women-trending">
            <div className="women-trending-heading">
              <h2>Trending <span>Collection</span></h2>
              <button type="button" onClick={() => setShowAllProducts((value) => !value)}>
                {showAllProducts ? 'Show Less' : 'View All Products'} <ArrowForwardRoundedIcon />
              </button>
            </div>
            <div className="women-product-grid">
              {displayedProducts.map((product) => {
                const commerceItem = commerceProduct(product, 'women')
                const isWishlisted = wishlist.some((item) => item.commerceId === commerceItem.commerceId)
                return (
                  <article className="women-product-card" key={product.id}>
                    <div className="women-product-image-wrap">
                      <Link to={productDetailsPath(product, 'women')} aria-label={`View ${product.name}`}>
                        <img src={product.image} alt={product.name} loading="lazy" />
                      </Link>
                      {product.tag && <span className="women-product-tag">{product.tag}</span>}
                      <button
                        className={`women-wishlist-button${isWishlisted ? ' is-active' : ''}`}
                        type="button"
                        aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                        aria-pressed={isWishlisted}
                        onClick={() => toggleWishlist(commerceItem)}
                      >
                        {isWishlisted ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
                      </button>
                    </div>
                    <div className="women-product-info">
                      <h3><Link to={productDetailsPath(product, 'women')}>{product.name}</Link></h3>
                      <p><strong>{formatPrice(product.price)}</strong>{product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}</p>
                      <button className="women-add-to-cart" type="button" onClick={() => addToCart(commerceItem)}>
                        <ShoppingCartIcon /> Add to Cart
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
            {displayedProducts.length === 0 && <p className="women-empty-state">No products match those filters. Try changing your selection.</p>}
          </div>
        </section>

        <section className="women-offer-banner">
          <div className="women-offer-copy">
            <span>NEW SEASON</span>
            <strong><b>20%</b> OFF</strong>
          </div>
          <span className="women-offer-divider" />
          <p>Upgrade Your Style<br />With <strong>SOVERIAN FIT’S</strong></p>
          <a href="#women-products">SHOP NOW <ArrowForwardRoundedIcon /></a>
        </section>

        <nav className="women-category-strip" aria-label="Shop women’s categories">
          {categoryLinks.map((item) => (
            <button
              type="button"
              key={item.name}
              onClick={() => {
                setCategory(item.category === 'All' ? '' : item.category)
                setAppliedFilters({ category: item.category === 'All' ? '' : item.category, sizes: [], colors: [], prices: [] })
                setSelectedSizes([])
                setSelectedColors([])
                setSelectedPrices([])
                setShowAllProducts(true)
                document.getElementById('women-products')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span className="women-category-icon">{item.icon}</span>
              <span><strong>{item.name}</strong><small>Shop Now <ArrowForwardRoundedIcon /></small></span>
            </button>
          ))}
        </nav>

        <section className="women-reviews">
          <div className="women-reviews-heading">
            <h2>What Our Customers Say</h2>
            <a href="#women-reviews">View All Reviews <ArrowForwardRoundedIcon /></a>
          </div>
          <div className="women-review-grid" id="women-reviews">
            {testimonials.map((testimonial) => (
              <article className="women-review-card" key={testimonial.name}>
                <img src={testimonial.image} alt="" loading="lazy" />
                <div>
                  <div className="women-review-stars" aria-label="5 out of 5 stars">★★★★★</div>
                  <p>“{testimonial.quote}”</p>
                  <strong>{testimonial.name}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="women-newsletter">
          <span className="women-newsletter-icon"><MailOutlineRoundedIcon /></span>
          <div className="women-newsletter-copy">
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get updates on new collections and exclusive offers.</p>
          </div>
          {isSubscribed ? (
            <p className="women-subscribe-success" role="status">{notice?.text}</p>
          ) : (
            <form className="women-newsletter-form" onSubmit={submitNewsletter}>
              <label className="women-sr-only" htmlFor="women-newsletter-email">Enter your email address</label>
              <input
                id="women-newsletter-email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Subscribe'} <ArrowForwardRoundedIcon /></button>
            </form>
          )}
          {notice?.type === 'error' && <p className="women-subscribe-success is-error" role="alert">{notice.text}</p>}
        </section>
      </main>

      <footer className="women-footer">
        <div className="women-footer-main">
          <div className="women-footer-brand">
            <Link to="/"><img src={logoImage} alt="Soverian Fit’s" /></Link>
          </div>
          <nav className="women-footer-nav" aria-label="Footer navigation">
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
          <div className="women-footer-social" aria-label="Social media">
            <a href="https://www.instagram.com/" aria-label="Instagram"><InstagramIcon /></a>
            <a href="https://www.facebook.com/" aria-label="Facebook"><FacebookIcon /></a>
            <a href="https://x.com/" aria-label="X" className="women-footer-x">𝕏</a>
            <a href="https://www.youtube.com/" aria-label="YouTube"><YouTubeIcon /></a>
          </div>
        </div>
        <div className="women-footer-copyright">© 2025 Soverian Fit’s. All rights reserved.</div>
      </footer>
    </>
  )
}

export default Women
