import { Link } from 'react-router-dom'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import './FeaturePro.css'
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import GppGoodIcon from '@mui/icons-material/GppGood';
import DiamondIcon from '@mui/icons-material/Diamond';
import shopProductData from '../Shop_product.json'
import { commerceProduct, productDetailsPath, useCommerce, useRegisterProducts } from '../commerce/CommerceContext'
import SiteFooter from '../SiteFooter'
import { useNewsletterSignup } from '../services/useNewsletterSignup'

// ///////////////// Products-img
import hoodieImg from '../assets/feature-pro1.jpg'
import poloshirt from '../assets/feature-pro2.jpg'
import oversized from '../assets/feature-pro3.jpg'
import jacket from '../assets/feature-pro4.jpg'
import beggie from '../assets/feature-pro5.jpg'
import track from '../assets/feature-pro8.jpg'

// /////////////// explore-img
import exploretshirt from '../assets/explore1.jpg'
import exploreshirt from '../assets/explore2.jpg'
import explorejacket from '../assets/explore3.jpg'
import explorepents from '../assets/explore4.jpg'

const products = [
  { ...shopProductData.products[0], image: hoodieImg },
  { ...shopProductData.products[1], image: poloshirt },
  { ...shopProductData.products[4], image: oversized },
  { ...shopProductData.products[2], image: jacket },
  { ...shopProductData.products[3], image: beggie },
  { ...shopProductData.products[7], image: track },
]

const FeaturePro = () => {
  const { wishlist, toggleWishlist, addToCart } = useCommerce()
  const { email, setEmail, isSubmitting, isSubscribed, notice, submitNewsletter } = useNewsletterSignup()
  useRegisterProducts(products, 'shop')
 const categories = [
    {
      id: 1,
      names: "T-Shirts",
      images: exploretshirt,
      to: '/shop?category=T-Shirts',
    },
    {
      id: 2,
      names: "Shirts",
      images: exploreshirt,
      to: '/shop?category=Shirts',
    },
    {
      id: 3,
      names: "Jacket",
      images: explorejacket,
      to: '/shop?category=Jackets',
    },
    {
      id: 4,
      names: "Pents",
      images: explorepents,
      to: '/shop?category=Trousers',
    },
  ]
  return (
    <>
    <div className="featured-products">

      <div className="featured-heading">
        <h2>FEATURED PRODUCTS</h2>
        <span>View All →</span>
      </div>
      <div className="product-grid">
        {products.map((product) => {
          const commerceItem = commerceProduct(product, 'shop')
          const isWishlisted = wishlist.some((item) => item.commerceId === commerceItem.commerceId)
          return (
          <div className="product-card" key={product.id}>
            <div className="product-image"><span className="product-tag">{product.tag}</span>
              <button className={`wishlist${isWishlisted ? ' is-active' : ''}`} type="button" aria-label={`${isWishlisted ? 'Remove' : 'Add'} ${product.name} ${isWishlisted ? 'from' : 'to'} wishlist`} aria-pressed={isWishlisted} onClick={() => toggleWishlist(commerceItem)}>
                {isWishlisted ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
              </button>
              <Link to={productDetailsPath(product, 'shop')} aria-label={`View ${product.name}`}>
                <img src={product.image} alt={product.name}/>
              </Link>
            </div>

            <div className="product-info">
              <h3><Link to={productDetailsPath(product, 'shop')}>{product.name}</Link></h3>
              <div className="price">
                <span className="current-price">₹{Number(product.price).toLocaleString('en-IN')}</span>
                <span className="old-price">₹{Number(product.oldPrice).toLocaleString('en-IN')}</span>
              </div>
              <button className="featured-add-to-cart" type="button" onClick={() => addToCart(commerceItem)}>
                <ShoppingCartOutlinedIcon /> Add to bag
              </button>
            </div>
          </div>
          )
        })}
      </div>
    </div >

    {/* // ///////////////////////////////////// New Arrival ////////////////////////// */}

    <div className="new-arrival">
      <h3 className='offer'>LIMITED TIME OFFER</h3>
      <h1 className='new'>NEW COLLECTION</h1>
      <h1 className='off'>UP TO 50% OFF</h1>
      <button className="shop-btn">SHOP NOW<span>→</span></button>
    </div>

    <div className="arri-style">
      <p className='style'>STYLE</p>
      <p className='quality'>QUALITY</p>
      <p className='confi'>CONFIDENCE</p>
    </div>

{/* //////////////////////////// Explore session /////////////////////// */}
    
    <div className="category">
        <h2>SHOP BY <span>CATEGORY</span></h2>
      </div>
        
      <div className="category-grid">
        {categories.map((category) => (
          <div className="category-card" key={category.id}>
            <img src={category.images} alt={category.names}/>
            <div className="category-content">
              <h3>{category.names}</h3>
              <Link className="category-explore-link" to={category.to}>Explore Now →</Link>
            </div>
          </div>
        ))}
      </div>

  {/* /////////////////////////////// More then Function ///////////////////////////// */}
        <div className="more-then-session">
          <div className="more-left"></div>
          <div className="more-right">
            <p className='more-story'>OUR STORY</p>
            <h1 className='more-then'>MORE THEN</h1>
            <h1 className='more-just'>JUST FASHION</h1>
            <p className='more-about'>Soverian Fit’s is built for those who value <br/>
            quality, confidence and timeless style.<br/>
            We create modern essentials that fit your<br/>
            lifestyle — from everyday wear to standout moments.</p>
            <Link className='shop-btn ' to="/about">Learn More →</Link>
          </div>
        </div>

    {/* ////////////////////////////////  facilities  ///////////////////////////////////// */}
    <div className="facilities">
      <div className="faci-icon shopping"><LocalShippingIcon/><br/><span className="faci-heading">Free Shipping</span><br/>On orders over ₹999</div>
      <div className="faci-icon return"><AutorenewIcon/><br/><span className="faci-heading">30-Day return</span><br/>Hassle-free & easy</div>
      <div className="faci-icon payment"><GppGoodIcon/><br/><span className="faci-heading">Secure Payment</span><br/>100% protected</div>
      <div className="faci-icon quality"><DiamondIcon/><br/><span className="faci-heading">Premium Quality</span><br/>Crafted to last</div>
    </div>


  {/* /////////////////////////////// Subscription ///////////////////////////////////// */}
  <form className="subscription" onSubmit={submitNewsletter}>
        <h3 className="subscription-heading">STAY IN THE LOOP</h3>
        <h1 className="subscription-title">JOIN OUR NEWSLETTER</h1>
        <p className="subscription-description">Be the first to know about new arrivals, exclusive offers and more.</p>
        {isSubscribed ? (
          <p className="subscription-status" role="status">{notice?.text}</p>
        ) : (
          <>
            <input type="email" className="subscription-input" placeholder="Enter your email address" value={email} onChange={(event) => setEmail(event.target.value)} required aria-label="Email address" />
            <button className="subscription-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Subscribe Now'}</button>
          </>
        )}
        {notice?.type === 'error' && <p className="subscription-status is-error" role="alert">{notice.text}</p>}
  </form>

  <SiteFooter />
    </>
  )
}


export default FeaturePro