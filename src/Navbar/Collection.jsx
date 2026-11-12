import { useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import YouTubeIcon from '@mui/icons-material/YouTube'
import collectionHeroImage from '../assets/collection-page-hero-img.png'
import collectionFilmOne from '../assets/209e705a0d763b5e711da469bf55f079_720w.mp4'
import collectionFilmTwo from '../assets/e5d045f8e2f860c4fcbf1db1067a0055.mp4'
import MobileNav from './MobileNav'
import collectionFilmThree from '../assets/cb0a5f400e148d1da02d9ad23a24c9ec_720w.mp4'
import collectionFilmFour from '../assets/e0a611638d312102f5f00c0dbf0e231a_720w.mp4'
import img from '../assets/react-ecom-logo.png'
import shopProductData from '../Shop_product.json'
import './Navbar.css'
import './Collection.css'
import CommerceHeaderActions from '../commerce/CommerceHeaderActions'
import { commerceProduct, productDetailsPath, useCommerce, useRegisterProducts } from '../commerce/CommerceContext'

const sizes = ['S', 'M', 'L', 'XL']
const productImages = Object.entries(import.meta.glob([
  '../assets/collection-pro*.jpg',
], {
  eager: true,
  import: 'default',
}))
  .filter(([path]) => !path.endsWith('collection-pro24.jpg') && !path.endsWith('women-pro1.png'))
  .sort(([firstPath], [secondPath]) => {
    const firstGroup = firstPath.includes('women-pro') ? 1 : 0
    const secondGroup = secondPath.includes('women-pro') ? 1 : 0
    if (firstGroup !== secondGroup) return firstGroup - secondGroup

    return Number(firstPath.match(/pro(\d+)\.(?:jpg|png)$/)?.[1])
      - Number(secondPath.match(/pro(\d+)\.(?:jpg|png)$/)?.[1])
  })
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

const products = collectionProductDetails.map((details, index) => ({
  ...shopProductData.products[index % shopProductData.products.length],
  ...details,
  id: index + 1,
  sizes: details.sizes ?? sizes,
  image: productImages[index],
}))

const productCategories = [...new Set(products.map((product) => product.category))]
const collectionFilms = [
  { src: collectionFilmOne, title: 'The Everyday Edit', number: '01' },
  { src: collectionFilmTwo, title: 'Made to Move', number: '02' },
  { src: collectionFilmThree, title: 'Details in Motion', number: '03' },
  { src: collectionFilmFour, title: 'A New Perspective', number: '04' },
]
const colors = [
  { name: 'Black', value: '#090b0d' },
  { name: 'White', value: '#f4f0e9' },
  { name: 'Grey', value: '#777a80' },
  { name: 'Brown', value: '#68412e' },
  { name: 'Navy Blue', value: '#243a63' },
  { name: 'Olive Green', value: '#596044' },
  { name: 'Green', value: '#246b53' },
  { name: 'Beige', value: '#d9c8a9' },
  { name: 'Cream', value: '#e9e1d0' },
  { name: 'Red', value: '#a44642' },
  { name: 'Burgundy', value: '#722c3b' },
  { name: 'Pink', value: '#e9aabc' },
  { name: 'Orange', value: '#d17b43' },
  { name: 'Multicolor', value: 'linear-gradient(135deg, #a44642 0 25%, #596044 25% 50%, #68412e 50% 75%, #777a80 75%)' },
  { name: 'Gold', value: '#c5a35b' },
]
const priceRanges = [
  { label: 'Under ₹1,000', min: 0, max: 999 },
  { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 – ₹4,000', min: 2001, max: 4000 },
  { label: 'Above ₹4,000', min: 4001, max: Infinity },
]

const Collection = () => {
  const { toggleWishlist, wishlist, addToCart } = useCommerce()
  useRegisterProducts(products, 'collection')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([])
  const [appliedFilters, setAppliedFilters] = useState({
    category: '',
    sizes: [],
    colors: [],
    priceRanges: [],
  })
  const [sortOrder, setSortOrder] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(true)
  const pageSize = 9

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory = !appliedFilters.category || product.category === appliedFilters.category
      const matchesSize = appliedFilters.sizes.length === 0
        || appliedFilters.sizes.some((size) => product.sizes?.includes(size))
      const matchesColor = appliedFilters.colors.length === 0
        || appliedFilters.colors.some((color) => product.colors?.includes(color))
      const matchesPrice = appliedFilters.priceRanges.length === 0
        || appliedFilters.priceRanges.some(({ min, max }) => product.price >= min && product.price <= max)

      return matchesCategory && matchesSize && matchesColor && matchesPrice
    })

    return filtered.sort((first, second) => {
      if (sortOrder === 'price-low') return first.price - second.price
      if (sortOrder === 'price-high') return second.price - first.price
      if (sortOrder === 'name') return first.name.localeCompare(second.name)
      return Number(second.id) - Number(first.id)
    })
  }, [appliedFilters, sortOrder])

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const visibleProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const toggleSelection = (value, setSelectedValues) => {
    setSelectedValues((current) => (
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    ))
  }

  const applyFilters = () => {
    setAppliedFilters({
      category: selectedCategory,
      sizes: selectedSizes,
      colors: selectedColors,
      priceRanges: selectedPriceRanges,
    })
    setCurrentPage(1)
  }

  return (
    <>
      <header className="navbar">
        <MobileNav />
        <div className="nav-brand">
          <img className="nav-logo" src={img} alt="Soverian Fit's" />
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

      <main className="collection-page">
        <section className="collection-hero" aria-labelledby="collection-title">
          <img className="collection-hero-image" src={collectionHeroImage} alt="" />
          <div className="collection-hero-shade" />
          <div className="collection-hero-copy">
            <p className="collection-eyebrow">OUR COLLECTION</p>
            <h1 id="collection-title">Discover Our<br /><span>Premium Collection</span></h1>
            <p>Explore the latest styles, crafted for comfort,<br className="collection-desktop-break" /> style and confidence.</p>
            <a className="collection-hero-button" href="#collection-products">
              SHOP NOW <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <section className="collection-films" aria-labelledby="collection-films-title">
          <div className="collection-films-heading">
            <div>
              <p className="collection-eyebrow">THE SOVERIAN EDIT</p>
              <h2 id="collection-films-title">Style, in motion<span>.</span></h2>
            </div>
            <p>Get a closer look at the pieces made for wherever the day takes you.</p>
          </div>
          <div className="collection-film-grid">
            {collectionFilms.map((film) => (
              <figure className="collection-film" key={film.number}>
                <video autoPlay muted loop playsInline preload="metadata" aria-label={film.title}>
                  <source src={film.src} type="video/mp4" />
                </video>
                <figcaption>
                  <span>{film.number}</span>
                  <h3>{film.title}</h3>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="collection-catalog" id="collection-products" aria-label="Collection products">
          <aside className={`collection-filters${filtersOpen ? '' : ' is-collapsed'}`} aria-label="Product filters">
            <button
              className="collection-filter-heading"
              type="button"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((isOpen) => !isOpen)}
            >
              <TuneRoundedIcon aria-hidden="true" />
              <span>Filter Products</span>
              <span className="collection-filter-chevron" aria-hidden="true">{filtersOpen ? '−' : '+'}</span>
            </button>
            {filtersOpen && (
              <div className="collection-filter-content">
                <fieldset className="collection-filter-group">
                  <legend>Category</legend>
                  <label><input type="radio" name="collection-category" checked={!selectedCategory} onChange={() => setSelectedCategory('')} /> All Products</label>
                  {productCategories.map((category) => (
                    <label key={category}>
                      <input type="radio" name="collection-category" value={category} checked={selectedCategory === category} onChange={() => setSelectedCategory(category)} />
                      {category}
                    </label>
                  ))}
                </fieldset>

                <fieldset className="collection-filter-group">
                  <legend>Size</legend>
                  <div className="collection-size-options">
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

                <fieldset className="collection-filter-group">
                  <legend>Color</legend>
                  <div className="collection-color-options">
                    {colors.map((color) => (
                      <label key={color.name} title={color.name} className={selectedColors.includes(color.name) ? 'is-selected' : ''}>
                        <input
                          type="checkbox"
                          aria-label={color.name}
                          checked={selectedColors.includes(color.name)}
                          onChange={() => toggleSelection(color.name, setSelectedColors)}
                        />
                        <span style={{ '--swatch-color': color.value }} />
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="collection-filter-group">
                  <legend>Price Range</legend>
                  {priceRanges.map((range) => (
                    <label key={range.label}>
                      <input
                        type="checkbox"
                        checked={selectedPriceRanges.includes(range)}
                        onChange={() => toggleSelection(range, setSelectedPriceRanges)}
                      />
                      {range.label}
                    </label>
                  ))}
                </fieldset>

                <button className="collection-apply-button" type="button" onClick={applyFilters}>Apply Filter <span aria-hidden="true">→</span></button>
              </div>
            )}
          </aside>

          <div className="collection-results">
            <div className="collection-results-toolbar">
              <p>Showing {filteredProducts.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length} Products</p>
              <label className="collection-sort">
                <span className="collection-sr-only">Sort products</span>
                <select value={sortOrder} onChange={(event) => { setSortOrder(event.target.value); setCurrentPage(1) }}>
                  <option value="newest">Sort By: Latest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </label>
            </div>

            {visibleProducts.length > 0 ? (
              <div className="collection-product-grid">
                {visibleProducts.map((product) => {
                  const commerceItem = commerceProduct(product, 'collection')
                  const isWishlisted = wishlist.some((item) => item.commerceId === commerceItem.commerceId)
                  return (
                  <article className="collection-product-card" key={product.id}>
                    <div className="collection-product-image">
                      <Link to={productDetailsPath(product, 'collection')} aria-label={`View ${product.name}`}>
                        <img src={product.image} alt={product.name} loading="lazy" />
                      </Link>
                      {product.tag && <span className={`collection-product-badge is-${String(product.tag).toLowerCase()}`}>{product.tag}</span>}
                      <button className={`collection-wishlist${isWishlisted ? ' is-active' : ''}`} type="button" aria-label={`${isWishlisted ? 'Remove' : 'Add'} ${product.name} ${isWishlisted ? 'from' : 'to'} wishlist`} aria-pressed={isWishlisted} onClick={() => toggleWishlist(commerceItem)}>
                        {isWishlisted ? <FavoriteRoundedIcon aria-hidden="true" /> : <FavoriteBorderRoundedIcon aria-hidden="true" />}
                      </button>
                    </div>
                    <div className="collection-product-info">
                      <h2><Link to={productDetailsPath(product, 'collection')}>{product.name}</Link></h2>
                      <p className="collection-product-price">
                        ₹{Number(product.price).toLocaleString('en-IN')}
                        {product.oldPrice != null && <del>₹{Number(product.oldPrice).toLocaleString('en-IN')}</del>}
                      </p>
                      <button className="collection-add-button" type="button" onClick={() => addToCart(commerceItem)}>
                        <ShoppingCartIcon aria-hidden="true" /> Add to Cart
                      </button>
                    </div>
                  </article>
                  )
                })}
              </div>
            ) : (
              <p className="collection-empty">No products match these filters. Try adjusting your selection.</p>
            )}

            {pageCount > 1 && (
              <nav className="collection-pagination" aria-label="Collection pages">
                <button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)}>‹</button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                  <button
                    className={currentPage === page ? 'is-current' : ''}
                    type="button"
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                    key={page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button type="button" aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setCurrentPage((page) => page + 1)}>›</button>
              </nav>
            )}
          </div>
        </section>
      </main>

      <footer className="collection-footer">
        <div className="collection-footer-main">
          <Link to="/" className="collection-footer-brand" aria-label="Soverian Fit's home">
            <img src={img} alt="Soverian Fit's" />
          </Link>
          <nav className="collection-footer-nav" aria-label="Footer navigation">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/collection">Collection</Link>
            <Link to="/men">Men</Link>
            <Link to="/women">Women</Link>
            <Link to="/new-arrivals">New Arrivals</Link>
            <Link to="/sales">Sales</Link>
          </nav>
          <div className="collection-footer-social" aria-label="Social media">
            <span aria-label="Instagram"><InstagramIcon /></span>
            <span aria-label="Facebook"><FacebookIcon /></span>
            <span className="collection-footer-x" aria-label="X">𝕏</span>
            <span aria-label="YouTube"><YouTubeIcon /></span>
          </div>
        </div>
        <div className="collection-footer-copyright">© 2025 Soverian Fit's. All rights reserved.</div>
      </footer>
    </>
  )
}

export default Collection
