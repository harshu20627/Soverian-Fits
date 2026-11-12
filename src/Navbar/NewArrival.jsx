import { useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined'
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import YouTubeIcon from '@mui/icons-material/YouTube'
import img from '../assets/react-ecom-logo.png'
import heroImage from '../assets/new-arrival-model.png'
import productOne from '../assets/collection-pro1.jpg'
import productTwo from '../assets/collection-pro2.jpg'
import productThree from '../assets/collection-pro3.jpg'
import productFour from '../assets/collection-pro4.jpg'
import productFive from '../assets/collection-pro5.jpg'
import productSix from '../assets/collection-pro6.jpg'
import productSeven from '../assets/collection-pro7.jpg'
import productEight from '../assets/collection-pro8.jpg'
import './Navbar.css'
import './NewArrival.css'
import '../aboutPages/AboutUs.css'
import CommerceHeaderActions from '../commerce/CommerceHeaderActions'
import MobileNav from './MobileNav'
import { commerceProduct, productDetailsPath, useCommerce, useRegisterProducts } from '../commerce/CommerceContext'

const products = [
  { id: 1, name: 'Brown Utility Zip Jacket', category: 'Outerwear', price: 4299, image: productOne, tag: 'Just dropped' },
  { id: 2, name: 'Charcoal Minimal Zip Jacket', category: 'Outerwear', price: 3899, image: productTwo, tag: 'New' },
  { id: 3, name: 'Sherpa-Lined Heritage Jacket', category: 'Outerwear', price: 5499, image: productThree, tag: 'Bestseller' },
  { id: 4, name: 'Olive Cargo Wide-Leg Pants', category: 'Trousers', price: 2799, image: productFour, tag: 'Just dropped' },
  { id: 5, name: 'Brown Relaxed Denim Jeans', category: 'Denim', price: 3299, image: productFive, tag: 'New' },
  { id: 6, name: 'Court Low-Top Sneakers', category: 'Footwear', price: 3999, image: productSix, tag: 'Just dropped' },
  { id: 7, name: 'Suede Everyday Sneakers', category: 'Footwear', price: 4499, image: productSeven, tag: 'New' },
  { id: 8, name: 'Retro Court Sneakers', category: 'Footwear', price: 3699, image: productEight, tag: 'Bestseller' },
]

const categories = ['All pieces', 'Outerwear', 'Trousers', 'Denim', 'Footwear']

const NewArrival = () => {
  const [activeCategory, setActiveCategory] = useState('All pieces')
  const [sortOrder, setSortOrder] = useState('featured')
  const { wishlist, toggleWishlist, addToCart } = useCommerce()
  useRegisterProducts(products, 'new-arrival')

  const visibleProducts = useMemo(() => {
    const filteredProducts = products.filter((product) => (
      activeCategory === 'All pieces' || product.category === activeCategory
    ))

    if (sortOrder === 'price-low') return [...filteredProducts].sort((a, b) => a.price - b.price)
    if (sortOrder === 'price-high') return [...filteredProducts].sort((a, b) => b.price - a.price)
    return filteredProducts
  }, [activeCategory, sortOrder])

  return (
    <div className="new-arrival-page">
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
        <section className="arrival-hero" style={{ '--arrival-hero-image': `url(${heroImage})` }}>
          <div className="arrival-hero-copy">
            <p className="arrival-eyebrow"><span /> The latest drop · Edition 01</p>
            <h1>New season.<br /><em>New perspective.</em></h1>
            <p className="arrival-hero-description">
              Thoughtful layers, standout essentials and fresh silhouettes.
              Meet the pieces made for wherever the day takes you.
            </p>
            <a className="arrival-hero-cta" href="#new-arrival-products">
              Explore the drop <ArrowForwardRoundedIcon />
            </a>
          </div>
          <div className="arrival-hero-stamp" aria-hidden="true">
            <span>NEW</span>
            <span>SEASON</span>
            <span className="arrival-stamp-star">✳</span>
          </div>
          <div className="arrival-hero-note">
            <span>THE SO / VERIAN EDIT</span>
            <p>A fresh take<br />on everyday</p>
            <span className="arrival-hero-index">VOL. 01 — 2026</span>
          </div>
        </section>

        <section className="arrival-perks" aria-label="Shopping benefits">
          <div className="arrival-perk">
            <LocalShippingOutlinedIcon aria-hidden="true" />
            <p>Complimentary delivery<span>On orders over ₹999</span></p>
          </div>
          <div className="arrival-perk">
            <AutorenewOutlinedIcon aria-hidden="true" />
            <p>Easy 30-day returns<span>A little more peace of mind</span></p>
          </div>
          <div className="arrival-perk">
            <VerifiedUserOutlinedIcon aria-hidden="true" />
            <p>Secure checkout<span>Your details stay protected</span></p>
          </div>
        </section>

        <section className="arrival-catalog" id="new-arrival-products">
          <div className="arrival-catalog-inner">
            <div className="arrival-section-heading">
              <div>
                <p className="arrival-eyebrow">The latest drop</p>
                <h2>New pieces, <em>new favourites.</em></h2>
              </div>
              <p className="arrival-section-note">Considered essentials, made to find their way into your everyday.</p>
            </div>

            <div className="arrival-toolbar">
              <div className="arrival-categories" aria-label="Filter by category">
                {categories.map((category) => (
                  <button
                    className={`arrival-category${activeCategory === category ? ' is-active' : ''}`}
                    key={category}
                    type="button"
                    aria-pressed={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <label className="arrival-sort">
                <span>Sort by</span>
                <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
              </label>
            </div>

            <div className="arrival-results-row">
              <p className="arrival-result-count">{visibleProducts.length} pieces to discover</p>
              <span>Designed for repeat wear</span>
            </div>
            <div className="arrival-product-grid">
              {visibleProducts.map((product) => {
                const commerceItem = commerceProduct(product, 'new-arrival')
                const isFavorite = wishlist.some((item) => item.commerceId === commerceItem.commerceId)

                return (
                  <article className="arrival-product-card" key={product.id}>
                    <Link className="arrival-product-image-link" to={productDetailsPath(product, 'new-arrival')} aria-label={`View ${product.name}`}>
                      <img className="arrival-product-image" src={product.image} alt={product.name} />
                      <span className={`arrival-product-tag${product.tag === 'Bestseller' ? ' is-bestseller' : ''}`}>
                        {product.tag}
                      </span>
                    </Link>
                    <button
                      className={`arrival-favorite${isFavorite ? ' is-favorite' : ''}`}
                      type="button"
                      aria-label={`${isFavorite ? 'Remove' : 'Add'} ${product.name} ${isFavorite ? 'from' : 'to'} wishlist`}
                      aria-pressed={isFavorite}
                      onClick={() => toggleWishlist(commerceItem)}
                    >
                      {isFavorite ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
                    </button>
                    <div className="arrival-product-details">
                      <p className="arrival-product-category">{product.category}</p>
                      <Link className="arrival-product-name" to={productDetailsPath(product, 'new-arrival')}>{product.name}</Link>
                      <p className="arrival-product-price">₹{product.price.toLocaleString('en-IN')}</p>
                      <button className="arrival-add-to-cart" type="button" onClick={() => addToCart(commerceItem)}>
                        Add to bag <ArrowForwardRoundedIcon />
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="arrival-signoff">
          <span>SOVERIAN</span>
          <p>
            <span>Made for your everyday,</span>
            <em>and everything beyond it.</em>
          </p>
          <Link to="/collection">Discover the collection <ArrowForwardRoundedIcon /></Link>
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

export default NewArrival
