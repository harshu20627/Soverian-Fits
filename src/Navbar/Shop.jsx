import { Link, NavLink, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import './Navbar.css'
import './Shop.css'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import img from '../assets/react-ecom-logo.png'
import MobileNav from './MobileNav'
import shopHeroImage from '../assets/more-fashion.png'
import mensCategoryImage from '../assets/shop-category-men.png'
import womensCategoryImage from '../assets/shop-category-women.png'
import collectionCategoryImage from '../assets/shop-category-collection.png'
import footwearCategoryImage from '../assets/shop-category-footwear.png'
import accessoriesCategoryImage from '../assets/shop-category-accessories.png'
import hoodieProductImage from '../assets/product-hoodie-photo.jpg'
import poloProductImage from '../assets/product-polo-photo.jpg'
import jacketProductImage from '../assets/product-jacket-photo.jpg'
import jeansProductImage from '../assets/feature-pro5.jpg'
import oversizedTshirtImage from '../assets/feature-pro3.jpg'
import casualShirtImage from '../assets/explore2.jpg'
import cargoPantsImage from '../assets/feature-pro5.jpg'
import trackPantsImage from '../assets/feature-pro8.jpg'
import crewTshirtImage from '../assets/explore1.jpg'
import bomberJacketImage from '../assets/feature-pro4.jpg'
import chinoTrousersImage from '../assets/explore4.jpg'
import sweatshirtImage from '../assets/feature-pro1.jpg'
import utilityVestImage from '../assets/feature-pro7.jpg'
import denimJacketImage from '../assets/product-jacket-photo.jpg'
import knitPoloImage from '../assets/feature-pro2.jpg'
import shopProductData from '../Shop_product.json'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import newsletterImage from '../assets/new-arrival-model.png'
import '../aboutPages/AboutUs.css'
import CommerceHeaderActions from '../commerce/CommerceHeaderActions'
import { commerceProduct, productDetailsPath, useCommerce, useRegisterProducts } from '../commerce/CommerceContext'
import { mergeShopProducts } from '../data/ShopCatalog'
import { useNewsletterSignup } from '../services/useNewsletterSignup'

const shopCategories = [
  { name: "Men's Wear", image: mensCategoryImage, to: '/men' },
  { name: 'Women', image: womensCategoryImage, to: '/women' },
  { name: 'Collection', image: collectionCategoryImage, to: '/collection' },
  { name: 'Footwear', image: footwearCategoryImage, to: '/collection' },
  { name: 'Accessories', image: accessoriesCategoryImage, to: '/collection' },
]

const productImages = new Map([
  ['1', hoodieProductImage],
  ['2', poloProductImage],
  ['3', jacketProductImage],
  ['4', jeansProductImage],
  ['5', oversizedTshirtImage],
  ['6', casualShirtImage],
  ['7', cargoPantsImage],
  ['8', trackPantsImage],
  ['9', crewTshirtImage],
  ['10', bomberJacketImage],
  ['11', chinoTrousersImage],
  ['12', sweatshirtImage],
  ['13', oversizedTshirtImage],
  ['14', utilityVestImage],
  ['15', casualShirtImage],
  ['16', trackPantsImage],
  ['17', denimJacketImage],
  ['18', chinoTrousersImage],
  ['19', knitPoloImage],
  ['20', hoodieProductImage],
  ['21', bomberJacketImage],
  ['22', sweatshirtImage],
  ['23', jeansProductImage],
  ['24', casualShirtImage],
])

const withProductImages = (items) => items.map((product) => ({
  ...product,
  image: productImages.get(String(product.id)) ?? product.image,
}))

const localProducts = withProductImages(shopProductData.products)
const productSummaries = {
  1: 'A signature Soverian Fit’s layer with a relaxed feel and a clean, versatile finish. Made for everyday comfort without compromising on presence.',
  2: 'A refined polo that brings effortless polish to everyday dressing. Its easy-to-style silhouette moves comfortably from laid-back plans to sharper looks.',
  3: 'A confident outer layer with a bold graphic finish and a modern oversized shape. Designed to make a statement while staying easy to wear.',
  4: 'A timeless denim essential with a comfortable fit and a versatile wash. Pair it with everyday staples for a look that never feels overdone.',
  5: 'An expressive graphic tee with an easy oversized cut. A comfortable go-to for adding a confident, street-ready touch to your daily rotation.',
  6: 'A lightweight-feel shirt with a relaxed, considered look. Easy to dress up or down for warm days, weekends and everything in between.',
  7: 'Relaxed cargo styling meets practical everyday wear. A confident utility-inspired essential with room to move and easy outfit versatility.',
  8: 'Built for comfort on active days and off-duty moments. These easy track pants bring a relaxed fit to a clean everyday silhouette.',
  9: 'A classic crew-neck staple with a comfortable fit and effortless versatility. The kind of essential that earns its place in every rotation.',
  10: 'A modern bomber silhouette with a confident edge. Layer it over everyday basics for an instantly elevated, street-inspired finish.',
  11: 'A clean, versatile trouser designed to bring a sharper feel to everyday outfits. Easy to pair, comfortable to wear and ready for any plan.',
  12: 'A soft pullover layer for cooler days and relaxed evenings. Its timeless shape makes comfort feel considered, season after season.',
  13: 'A minimal graphic gives this everyday tee a distinct Soverian Fit’s point of view. Comfortable, versatile and easy to make your own.',
  14: 'A utility-inspired layer with practical details and a modern profile. Made for easy layering and confident everyday styling.',
  15: 'A polished button-down with a timeless feel and easy styling range. Wear it open, layered or buttoned up for a more refined look.',
  16: 'An easy tapered fit made for movement and everyday comfort. A versatile essential for relaxed looks with a more considered finish.',
  17: 'A timeless denim jacket with a confident, versatile character. Layer it over tees and knits to bring an effortless edge to your look.',
  18: 'A relaxed take on a refined wardrobe essential. These trousers balance everyday comfort with a clean silhouette that styles with ease.',
  19: 'A textured knit brings a subtle premium feel to this versatile polo. A considered choice for adding depth to both casual and smart-casual looks.',
  20: 'An easy zip-up layer designed for comfort, warmth and everyday versatility. A dependable essential for relaxed days and cooler evenings.',
  21: 'A varsity-inspired bomber with a bold, confident profile. Bring a standout layer to everyday outfits with this modern wardrobe piece.',
  22: 'A timeless crew-neck sweater with a soft, easy-to-layer feel. Designed to make everyday comfort look polished and effortless.',
  23: 'A dependable denim essential with a straight fit and timeless appeal. Easy to style across seasons, from casual days to weekend plans.',
  24: 'A lightweight overshirt that makes layering simple. Its relaxed versatility adds a clean finishing touch to everyday looks.',
}

const getProductSummary = (product) => (
  (product.source === 'shop' && productSummaries[product.id])
  ?? `A considered ${String(product.category ?? 'everyday').toLowerCase()} essential from Soverian Fit’s. Designed for comfort, easy styling and a confident finish.`
)

const Shop = () => {
  const [products, setProducts] = useState(() => mergeShopProducts([], localProducts));
  const [searchParams] = useSearchParams()
  const { toggleWishlist, wishlist, addToCart } = useCommerce()
  const { email: newsletterEmail, setEmail: setNewsletterEmail, isSubmitting: isNewsletterSubmitting, isSubscribed, notice: newsletterNotice, submitNewsletter } = useNewsletterSignup()
  useRegisterProducts(products, 'shop')
  const shopFilterCategories = useMemo(
    () => [...new Set(products.map((product) => product.category).filter(Boolean))].sort(),
    [products],
  )
  const shopFilterColors = useMemo(
    () => [...new Set(products.flatMap((product) => product.colors ?? []))].sort(),
    [products],
  )
  const [categoryFilter, setCategoryFilter] = useState(() => searchParams.get('category') ?? '')
  const [sizeFilter, setSizeFilter] = useState('')
  const [colorFilter, setColorFilter] = useState('')
  const [priceFilter, setPriceFilter] = useState('')
  const [sortFilter, setSortFilter] = useState('featured')
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Products request failed: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setProducts(mergeShopProducts(withProductImages(data), localProducts)))
      .catch((error) => {
        console.error("Error loading shop products:", error);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory = !categoryFilter || product.category?.toLowerCase() === categoryFilter.toLowerCase()
      const matchesSize = !sizeFilter || product.sizes?.includes(sizeFilter)
      const matchesColor = !colorFilter || product.colors?.some((color) => color.toLowerCase() === colorFilter.toLowerCase())
      const price = Number(product.price)
      const matchesPrice = !priceFilter
        || (priceFilter === 'under-1000' && price < 1000)
        || (priceFilter === '1000-2000' && price >= 1000 && price <= 2000)
        || (priceFilter === '2000-4000' && price > 2000 && price <= 4000)
        || (priceFilter === 'over-4000' && price > 4000)

      return matchesCategory && matchesSize && matchesColor && matchesPrice
    })

    return filtered.sort((first, second) => {
      if (sortFilter === 'newest') return Number(second.id) - Number(first.id)
      if (sortFilter === 'price-low-high') return Number(first.price) - Number(second.price)
      if (sortFilter === 'price-high-low') return Number(second.price) - Number(first.price)
      if (sortFilter === 'popularity' || sortFilter === 'best-selling') return Number(second.reviews) - Number(first.reviews)
      if (sortFilter === 'rating') return Number(second.rating) - Number(first.rating)
      return Number(first.id) - Number(second.id)
    })
  }, [products, categoryFilter, sizeFilter, colorFilter, priceFilter, sortFilter])

  const updateFilter = (setter) => (event) => setter(event.target.value)

  return (
   // /////////////////////  navbar  /////////////////////////////
    <>
    <div className='navbar'>
      <MobileNav />
  {/* ////////  navbar logo //////// */}
      <div className='nav-brand'>
        <img className='nav-logo' src={img} alt="Logo" />
      </div>
    {/* ////////  navbar links //////// */}
      <div className='nav'>
      <ul className='nav-links'>
        <li className='nav-link'><NavLink to='/' end>Home</NavLink></li>
        <li className='nav-link'><NavLink to='/about'>About</NavLink></li>
        <li className='nav-link'><NavLink to='/shop'>Shop</NavLink></li>
        <li className='nav-link'><NavLink to='/contact'>Contact</NavLink></li>
        <li className='nav-link'><NavLink to='/collection'>Collection</NavLink></li>
        <li className='nav-link'><NavLink to='/men'>Men</NavLink></li>
        <li className='nav-link'><NavLink to='/women'>Women</NavLink></li>
        <li className='nav-link'><NavLink to='/new-arrivals'>New Arrivals</NavLink></li>
        <li className='nav-link'><NavLink to='/sales'>Sales</NavLink></li>
      </ul>
      </div>
    {/* ////////  navbar cart //////// */}
      <CommerceHeaderActions />
    </div>

    {/* /////////////////////// shop interface //////////////////////// */}
    <main className="shop-hero">
      <img className="shop-hero-image" src={shopHeroImage} alt="Soverian Fit's premium fashion collection" />
      <div className="shop-hero-overlay" />
      <div className="shop-hero-content">
        <p className="shop-hero-eyebrow">SHOP COLLECTION</p>
        <h1>Premium Fashion<br /><span>For Every You</span></h1>
        <p className="shop-hero-description">
          Discover timeless styles, modern essentials<br className="shop-desktop-break" />
          and premium quality — all in one place.
        </p>
        <Link to="/collection" className="shop-hero-button">
          SHOP NOW <span aria-hidden="true">→</span>
        </Link>
      </div>
      <p className="shop-hero-tagline">Better<br />Style<br />Bigger<br />Confidence</p>
    </main>

    {/* /////////////////////////  Shop Category  ////////////////////////// */}
    <section className="shop-categories" aria-labelledby="shop-categories-title">
      <div className="shop-categories-inner">
        <div className="shop-categories-header">
          <h2 id="shop-categories-title">SHOP BY CATEGORY</h2>
          <Link to="/collection" className="shop-categories-all">
            View All Categories <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="shop-categories-grid">
          {shopCategories.map((category) => (
            <Link className="shop-category-card" key={category.name} to={category.to} style={{ '--category-image': `url("${category.image}")` }} >
              <span className="shop-category-content">
                <span className="shop-category-name">{category.name}</span>
                <span className="shop-category-link">
                  Shop Now <span aria-hidden="true">→</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* /////////////////////////////// Filter session ///////////////////////////// */}
    <section className="shop-filter-section" aria-label="Product filters">
      <div className="shop-filter-toolbar">
        <div className="shop-filter-controls">
          <button
            className="shop-filter-trigger"
            type="button"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((isOpen) => !isOpen)}
          >
            <TuneRoundedIcon aria-hidden="true" />
            <span>Filter {filtersOpen ? '−' : '+'}</span>
          </button>

          {filtersOpen && (
            <>
              <label className="shop-filter-select">
                <span className="shop-sr-only">Category</span>
                <select value={categoryFilter} onChange={updateFilter(setCategoryFilter)}>
                  <option value="">All Categories</option>
                  {shopFilterCategories.map((category) => <option value={category} key={category}>{category}</option>)}
                </select>
                <KeyboardArrowDownRoundedIcon aria-hidden="true" />
              </label>

              <label className="shop-filter-select">
                <span className="shop-sr-only">Size</span>
                <select value={sizeFilter} onChange={updateFilter(setSizeFilter)}>
                  <option value="">All Sizes</option>
                  {['S', 'M', 'L', 'XL', 'XXL'].map((size) => <option value={size} key={size}>{size}</option>)}
                </select>
                <KeyboardArrowDownRoundedIcon aria-hidden="true" />
              </label>

              <label className="shop-filter-select">
                <span className="shop-sr-only">Color</span>
                <select value={colorFilter} onChange={updateFilter(setColorFilter)}>
                  <option value="">All Colors</option>
                  {shopFilterColors.map((color) => <option value={color} key={color}>{color}</option>)}
                </select>
                <KeyboardArrowDownRoundedIcon aria-hidden="true" />
              </label>

              <label className="shop-filter-select">
                <span className="shop-sr-only">Price</span>
                <select value={priceFilter} onChange={updateFilter(setPriceFilter)}>
                  <option value="">All Prices</option>
                  <option value="under-1000">Under ₹1,000</option>
                  <option value="1000-2000">₹1,000 – ₹2,000</option>
                  <option value="2000-4000">₹2,001 – ₹4,000</option>
                  <option value="over-4000">Above ₹4,000</option>
                </select>
                <KeyboardArrowDownRoundedIcon aria-hidden="true" />
              </label>
              <label className="shop-filter-select">
                <span className="shop-sr-only">Sort by</span>
                <select value={sortFilter} onChange={updateFilter(setSortFilter)}>
                  <option value="featured">Featured</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="popularity">Popularity</option>
                  <option value="rating">Customer Rating</option>
                  <option value="best-selling">Best Selling</option>
                </select>
                <KeyboardArrowDownRoundedIcon aria-hidden="true" />
              </label>
            </>
          )}
        </div>

        <div className="shop-filter-summary">
          <div className="shop-view-switch" aria-label="Product view">
            <button className={`shop-view-button${viewMode === 'grid' ? ' is-active' : ''}`} type="button" aria-label="Grid view" aria-pressed={viewMode === 'grid'} onClick={() => setViewMode('grid')}>
              <GridViewRoundedIcon aria-hidden="true" />
            </button>
            <button className={`shop-view-button${viewMode === 'list' ? ' is-active' : ''}`} type="button" aria-label="List view" aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')}>
              <ViewListRoundedIcon aria-hidden="true" />
            </button>
          </div>
          <p className="shop-product-count">{filteredProducts.length} Products</p>
        </div>
      </div>
    </section>

    {/* ////////////////////////// Product Session /////////////////////////////// */}
    <div className={`shop-products${viewMode === 'list' ? ' is-list-view' : ''}`}>
      {filteredProducts.map((product) => {
        const commerceItem = commerceProduct(product, product.source ?? 'shop')
        const isWishlisted = wishlist.some((item) => item.commerceId === commerceItem.commerceId)
        const detailsPath = productDetailsPath(commerceItem)
        const productImageClass = product.source === 'shop'
          ? `shop-product-image--${product.id}`
          : 'shop-product-image--catalog'
        return (
        <article className="shop-product-card" key={commerceItem.commerceId}>
          <div className={`shop-product-image ${productImageClass}`}>
            <Link to={detailsPath} aria-label={`View ${product.name}`}>
              <img src={product.image} alt={product.name} loading="lazy" />
            </Link>
            {product.tag && (
              <span className={`shop-product-badge shop-product-badge--${String(product.tag).toLowerCase()}`}>
                {product.tag}
              </span>
            )}
            <button
              className="shop-product-wishlist"
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
          <div className="shop-product-info">
            <h3><Link to={detailsPath}>{product.name}</Link></h3>
            <div className="shop-product-prices">
              <span className="shop-product-price">₹{Number(product.price).toLocaleString('en-IN')}</span>
              {product.oldPrice != null && (
                <del className="shop-product-old-price">₹{Number(product.oldPrice).toLocaleString('en-IN')}</del>
              )}
            </div>
            {product.rating != null && (
              <p className="shop-product-rating">
                <span aria-hidden="true">★</span> {product.rating} <span>({product.reviews ?? 0})</span>
              </p>
            )}
            {viewMode === 'list' && (
              <div className="shop-product-list-details">
                <p className="shop-product-description">{getProductSummary(product)}</p>
                <div className="shop-product-specs">
                  <span><strong>Category</strong>{product.category ?? 'Everyday essentials'}</span>
                  {product.sizes?.length > 0 && <span><strong>Sizes</strong>{product.sizes.join(' · ')}</span>}
                  {product.colors?.length > 0 && <span><strong>Colors</strong>{product.colors.join(' · ')}</span>}
                  <span><strong>Crafted for</strong>Everyday comfort & confident style</span>
                </div>
              </div>
            )}
            <button className="shop-add-to-cart" type="button" onClick={() => addToCart(commerceItem)}>
              <ShoppingCartIcon aria-hidden="true" />
              Add to Cart
            </button>
          </div>
        </article>
        )
      })}
    </div>

    {filteredProducts.length === 0 ? (
      <p className="shop-empty-state">No products match your filters. Try changing your selection.</p>
    ) : (
      <p className="shop-results-count">Showing all {filteredProducts.length} products</p>
    )}
    
{/* /////////////////////// limited time offer ////////////////////////// */}

    <section className="shop-promo-banner" aria-label="Sale offer and shopping benefits">
      <img className="shop-promo-image" src={shopHeroImage} alt="" loading="lazy" />
      <div className="shop-promo-copy">
        <p className="shop-promo-eyebrow">LIMITED TIME OFFER</p>
        <h2>UP TO <span>50% OFF</span></h2>
        <p className="shop-promo-description">On Selected Styles</p>
        <Link to="/sales" className="shop-promo-button">
          SHOP SALE <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="shop-promo-benefits">
        <div className="shop-promo-benefit">
          <LocalShippingOutlinedIcon aria-hidden="true" />
          <p>Free Shipping<span>On orders over ₹999</span></p>
        </div>
        <div className="shop-promo-benefit">
          <AutorenewOutlinedIcon aria-hidden="true" />
          <p>30-Day Returns<span>Hassle-free returns</span></p>
        </div>
        <div className="shop-promo-benefit">
          <VerifiedUserOutlinedIcon aria-hidden="true" />
          <p>Secure Payment<span>100% safe checkout</span></p>
        </div>
        <div className="shop-promo-benefit">
          <DiamondOutlinedIcon aria-hidden="true" />
          <p>Premium Quality<span>Crafted for you</span></p>
        </div>
      </div>
    </section>

{/* /////////////////////// get exclusive offers ////////////////////////// */}

    <section className="shop-newsletter" aria-labelledby="shop-newsletter-title">
      <img className="shop-newsletter-image" src={newsletterImage} alt="" loading="lazy" />
      <div className="shop-newsletter-copy">
        <p className="shop-newsletter-eyebrow">STAY IN THE LOOP</p>
        <h2 id="shop-newsletter-title">Get Exclusive Offers</h2>
        <p>Be the first to know about new arrivals, special offers and more.</p>
      </div>
      <form className="shop-newsletter-form" onSubmit={submitNewsletter}>
        {isSubscribed ? (
          <p className="shop-newsletter-status" role="status">{newsletterNotice?.text}</p>
        ) : (
          <>
            <label className="shop-sr-only" htmlFor="shop-newsletter-email">Your email address</label>
            <input id="shop-newsletter-email" type="email" placeholder="Your email address" value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} required />
            <button type="submit" disabled={isNewsletterSubmitting}>
              {isNewsletterSubmitting ? 'SENDING…' : 'SUBSCRIBE'} <ArrowForwardRoundedIcon aria-hidden="true" />
            </button>
          </>
        )}
        {newsletterNotice?.type === 'error' && <p className="shop-newsletter-status is-error" role="alert">{newsletterNotice.text}</p>}
      </form>
    </section>
{/* /////////////////////////// shop footer ////////////////////////////////  */}
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
    </>
  )
}

export default Shop
