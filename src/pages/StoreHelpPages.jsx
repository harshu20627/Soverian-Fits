import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import About from '../Navbar/About'
import SiteFooter from '../SiteFooter'
import accessoryHeroImage from '../assets/shop-category-accessories.png'
import { additionalShopProducts } from '../data/ShopCatalog'
import { sizeGuideMeasurements, storePolicies } from '../data/StorePolicies'
import { commerceProduct, productDetailsPath, useCommerce, useRegisterProducts } from '../commerce/CommerceContext'
import { sendSupportEmails, sendTrackingConfirmation } from '../services/emailNotifications'
import { trackOrder } from '../services/storefrontApi'
import './StoreHelpPages.css'

const money = (value) => `₹${Number(value).toLocaleString('en-IN')}`

const accessoryCategories = ['Watches', 'Sunglasses', 'Wallets', 'Belts', 'Caps', 'Bags']
const getAccessoryCategory = (product) => {
  const name = product.name.toLowerCase()
  if (name.includes('watch')) return 'Watches'
  if (name.includes('sunglasses')) return 'Sunglasses'
  if (name.includes('cap')) return 'Caps'
  if (name.includes('bag')) return 'Bags'
  if (name.includes('wallet')) return 'Wallets'
  if (name.includes('belt')) return 'Belts'
  return null
}

const accessoryProducts = additionalShopProducts
  .filter((product) => ['Accessories', 'Watches'].includes(product.category) && product.image && getAccessoryCategory(product))
  .map((product) => ({
    ...product,
    id: `${product.source}-${product.id}`,
    source: 'accessories',
    category: getAccessoryCategory(product),
    rating: Number(product.rating) || null,
    oldPrice: Number(product.oldPrice) || Number(product.price),
  }))

const PageIntro = ({ eyebrow, title, description, image, children }) => (
  <section className={`help-hero${image ? ' help-hero--image' : ''}`} style={image ? { '--help-hero-image': `url("${image}")` } : undefined}>
    <div className="help-hero-inner">
      <p className="help-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="help-hero-description">{description}</p>
      {children}
    </div>
  </section>
)

const AccessoriesProductCard = ({ product }) => {
  const { wishlist, toggleWishlist, addToCart } = useCommerce()
  const commerceItem = commerceProduct(product, 'accessories')
  const isWishlisted = wishlist.some((item) => item.commerceId === commerceItem.commerceId)
  const rating = Number(product.rating)

  return (
    <article className="accessory-product-card">
      <div className="accessory-product-image">
        <Link to={productDetailsPath(product, 'accessories')} aria-label={`View ${product.name}`}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
        {product.tag && <span className="accessory-product-tag">{product.tag}</span>}
        <button
          className={`accessory-wishlist${isWishlisted ? ' is-active' : ''}`}
          type="button"
          aria-label={`${isWishlisted ? 'Remove' : 'Add'} ${product.name} ${isWishlisted ? 'from' : 'to'} wishlist`}
          aria-pressed={isWishlisted}
          onClick={() => toggleWishlist(commerceItem)}
        >
          {isWishlisted ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
        </button>
      </div>
      <div className="accessory-product-info">
        <p className="accessory-product-category">{product.category}</p>
        <h3><Link to={productDetailsPath(product, 'accessories')}>{product.name}</Link></h3>
        <div className="accessory-product-rating" aria-label={rating ? `${rating} out of 5` : 'Not yet rated'}>
          {rating
            ? <><StarRoundedIcon /><span>{rating.toFixed(1)}</span></>
            : <><StarRoundedIcon className="is-unrated" /><span>Not yet rated</span></>}
        </div>
        <div className="accessory-product-prices">
          <strong>{money(product.price)}</strong>
          {product.oldPrice > product.price && (
            <>
              <del>{money(product.oldPrice)}</del>
              <span>{Math.round((1 - product.price / product.oldPrice) * 100)}% off</span>
            </>
          )}
        </div>
        <button className="accessory-add-button" type="button" onClick={() => addToCart(commerceItem)}>
          <ShoppingBagOutlinedIcon /> Add to bag
        </button>
      </div>
    </article>
  )
}

export const AccessoriesPage = () => {
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('featured')
  useRegisterProducts(accessoryProducts, 'accessories')

  const visibleProducts = useMemo(() => {
    const filtered = category === 'All'
      ? [...accessoryProducts]
      : accessoryProducts.filter((product) => product.category === category)
    if (sort === 'price-low') filtered.sort((first, second) => first.price - second.price)
    if (sort === 'price-high') filtered.sort((first, second) => second.price - first.price)
    return filtered
  }, [category, sort])

  return (
    <>
      <About />
      <main className="store-help-page accessories-page">
        <PageIntro
          eyebrow="THE FINISHING TOUCH"
          title={<>Elevate Your <span>Style</span></>}
          description="Discover considered details that bring a distinctive finish to every look. Explore accessories selected for everyday ease and timeless appeal."
          image={accessoryHeroImage}
        >
          <a className="help-button" href="#accessory-products">Shop Accessories <span aria-hidden="true">→</span></a>
        </PageIntro>
        <section className="accessory-featured help-section" aria-labelledby="accessory-featured-title">
          <div className="help-section-heading">
            <p className="help-eyebrow">DETAILS THAT DEFINE</p>
            <h2 id="accessory-featured-title">Featured <span>Accessories</span></h2>
            <p>Choose a category and find the piece that feels like you.</p>
          </div>
          <div className="accessory-category-list">
            {accessoryCategories.map((item) => (
              <button
                type="button"
                key={item}
                className={category === item ? 'is-selected' : ''}
                aria-pressed={category === item}
                onClick={() => {
                  setCategory(item)
                  document.getElementById('accessory-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
              >
                {item}<span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </section>
        <section className="accessory-listing help-section" id="accessory-products" aria-labelledby="accessory-products-title">
          <div className="accessory-listing-heading">
            <div className="help-section-heading">
              <p className="help-eyebrow">THE ACCESSORY EDIT</p>
              <h2 id="accessory-products-title">Shop <span>Accessories</span></h2>
              <p>{visibleProducts.length} pieces to explore</p>
            </div>
            <label className="help-select accessory-sort">
              <span>Sort by</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </label>
          </div>
          <div className="accessory-filter-chips" aria-label="Filter products by category">
            {['All', ...accessoryCategories].map((item) => (
              <button
                type="button"
                key={item}
                className={category === item ? 'is-selected' : ''}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          {visibleProducts.length ? (
            <div className="accessory-product-grid">
              {visibleProducts.map((product) => <AccessoriesProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="help-empty-state">
              <h3>{category} are not listed yet</h3>
              <p>We don’t currently have verified product listings for this category. Please check back as the collection grows.</p>
              <button type="button" className="help-button help-button--outline" onClick={() => setCategory('All')}>View available accessories</button>
            </div>
          )}
        </section>
        <section className="accessory-note">
          <p>STYLE, IN EVERY DETAIL</p>
          <h2>Make the look your own.</h2>
          <Link to="/collection" className="help-text-link">Explore the collection <span aria-hidden="true">→</span></Link>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}

const faqCategories = [
  'General Questions',
  'Orders & Payments',
  'Shipping & Delivery',
  'Returns & Refunds',
  'Products & Sizes',
  'Account & Wishlist',
]

const faqItems = [
  { category: faqCategories[0], question: 'What is Soverian Fit’s?', answer: 'Soverian Fit’s is an online fashion store for considered everyday clothing and accessories. Browse the collections and review each product page for its specific details.' },
  { category: faqCategories[0], question: 'How do I contact your team?', answer: 'Send a message through our Support page or use the contact details listed in the website footer. Include your order ID when your question is about an order.' },
  { category: faqCategories[0], question: 'Can I change or cancel an order?', answer: 'Contact Support as soon as possible with your order ID. We can check whether an order can still be changed; a change or cancellation cannot be promised after processing or dispatch has started.' },
  { category: faqCategories[1], question: 'Which payment methods can I use?', answer: 'Payment methods available for your order are shown at checkout. Availability can vary, and payment details should only be entered on the secure payment page.' },
  { category: faqCategories[1], question: 'When is my payment confirmed?', answer: 'For online payments, confirmation depends on the payment provider. Cash-on-delivery orders, where offered, are marked separately. Check your order confirmation or contact Support if the status is unclear.' },
  { category: faqCategories[1], question: 'I was charged but did not receive confirmation. What should I do?', answer: 'Please wait for the payment provider’s confirmation, then contact Support with the order reference and payment time. Do not share full card numbers, passwords or one-time passcodes.' },
  { category: faqCategories[2], question: 'How long does delivery take?', answer: storePolicies.shipping.delivery },
  { category: faqCategories[2], question: 'How are shipping charges calculated?', answer: storePolicies.shipping.charges },
  { category: faqCategories[2], question: 'Where do you deliver?', answer: storePolicies.shipping.locations },
  { category: faqCategories[2], question: 'How can I track my order?', answer: 'Use the Track Order page with your order ID and the email address or phone number used at checkout. Tracking can be displayed only when the order-tracking service is connected and has a matching record.' },
  { category: faqCategories[3], question: 'Can I return or exchange an item?', answer: `${storePolicies.returns.eligibility} ${storePolicies.returns.exchange}` },
  { category: faqCategories[3], question: 'What should I do if my item arrived damaged?', answer: storePolicies.returns.damaged },
  { category: faqCategories[3], question: 'When will my refund arrive?', answer: storePolicies.returns.refund },
  { category: faqCategories[4], question: 'How do I choose the right size?', answer: 'Open the Size Guide for indicative garment measurements. Product-specific specifications, when provided on the item page, should take priority. If you need help, send Support the product name and measurements you are comparing.' },
  { category: faqCategories[4], question: 'Are product colours and details exact?', answer: 'Product images and descriptions are provided to help you choose, but appearance can vary slightly by screen and lighting. Review the product details and contact Support if you need clarification before ordering.' },
  { category: faqCategories[4], question: 'Do accessories have clothing sizes?', answer: 'Many accessories are one-size items, while some products may have specific measurements or options. Check the individual product page for the available details.' },
  { category: faqCategories[5], question: 'Do I need an account to shop?', answer: 'An account is required for the current bag, wishlist and order-management features. You can sign in or create an account from the website header.' },
  { category: faqCategories[5], question: 'How does the wishlist work?', answer: 'Sign in, then use the heart button on a product to add or remove it from your wishlist. Wishlist items are associated with your signed-in account on this browser.' },
]

export const FAQPage = () => {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [openQuestion, setOpenQuestion] = useState(null)
  const visibleFaqs = useMemo(() => {
    const query = search.trim().toLowerCase()
    return faqItems.filter((item) => (
      (activeCategory === 'All' || item.category === activeCategory)
      && (!query || `${item.category} ${item.question} ${item.answer}`.toLowerCase().includes(query))
    ))
  }, [activeCategory, search])

  return (
    <>
      <About />
      <main className="store-help-page faq-page">
        <PageIntro
          eyebrow="CUSTOMER CARE"
          title={<>How Can We <span>Help You?</span></>}
          description="Find clear answers about orders, delivery, returns, products and your account."
        >
          <label className="faq-search">
            <span className="help-sr-only">Search frequently asked questions</span>
            <span aria-hidden="true">⌕</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search a question or topic" />
            {search && <button type="button" onClick={() => setSearch('')} aria-label="Clear search">×</button>}
          </label>
        </PageIntro>
        <section className="faq-content help-section">
          <div className="help-section-heading">
            <p className="help-eyebrow">HERE TO MAKE IT SIMPLE</p>
            <h2>Frequently Asked <span>Questions</span></h2>
          </div>
          <div className="faq-category-list" aria-label="FAQ categories">
            <button type="button" className={activeCategory === 'All' ? 'is-selected' : ''} aria-pressed={activeCategory === 'All'} onClick={() => setActiveCategory('All')}>All topics</button>
            {faqCategories.map((item) => (
              <button type="button" key={item} className={activeCategory === item ? 'is-selected' : ''} aria-pressed={activeCategory === item} onClick={() => setActiveCategory(item)}>{item}</button>
            ))}
          </div>
          <div className="faq-list">
            {visibleFaqs.map((item, index) => {
              const isOpen = openQuestion === item.question
              const answerId = `faq-answer-${faqItems.indexOf(item)}`
              return (
                <article className={`faq-item${isOpen ? ' is-open' : ''}`} key={item.question}>
                  <button type="button" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpenQuestion(isOpen ? null : item.question)}>
                    <span className="faq-number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="faq-question-copy"><small>{item.category}</small>{item.question}</span>
                    <span className="faq-toggle" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                  </button>
                  <div className="faq-answer" id={answerId} aria-hidden={!isOpen}>
                    <div><p>{item.answer}</p></div>
                  </div>
                </article>
              )
            })}
            {!visibleFaqs.length && (
              <div className="help-empty-state">
                <h3>No matching answers found</h3>
                <p>Try a different search or ask our team directly.</p>
                <button type="button" className="help-button help-button--outline" onClick={() => { setSearch(''); setActiveCategory('All') }}>Clear filters</button>
              </div>
            )}
          </div>
        </section>
        <section className="faq-support-cta">
          <p className="help-eyebrow">PERSONAL HELP</p>
          <h2>Still have a question?</h2>
          <p>Our support team can help you with an order or product enquiry.</p>
          <Link className="help-button" to="/support">Contact Support <span aria-hidden="true">→</span></Link>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}

const shippingSections = [
  ['Order processing', storePolicies.shipping.processing],
  ['Estimated delivery', storePolicies.shipping.delivery],
  ['Shipping charges', storePolicies.shipping.charges],
  ['Delivery locations', storePolicies.shipping.locations],
  ['Order dispatch', storePolicies.shipping.dispatch],
]

const trackingSteps = [
  ['01', 'Place your order', 'Keep the order ID from your order confirmation.'],
  ['02', 'Open Track Order', 'Enter the order ID and the email or phone used at checkout.'],
  ['03', 'Review live updates', 'When tracking is connected, the page displays the status returned by the order service.'],
]

const returnSteps = [
  ['01', 'Check your order policy', 'Review the return window, item condition and eligibility shown for your order.'],
  ['02', 'Contact Support', 'Share your order ID, the item and the reason for your request.'],
  ['03', 'Follow the instructions', 'Wait for the team to confirm eligibility and provide return or exchange instructions.'],
  ['04', 'Return and review', 'Send the item as instructed. Refunds, when approved, follow the return and payment-provider review.'],
]

export const ShippingPage = () => (
  <>
    <About />
    <main className="store-help-page shipping-page">
      <PageIntro eyebrow="DELIVERY, MADE CLEAR" title={<>Shipping <span>&amp; Returns</span></>} description="Everything you need to know about delivery updates, order tracking and return requests." />
      <div className="shipping-page-content">
        <section className="policy-panel help-section" aria-labelledby="shipping-information-title">
          <div className="help-section-heading">
            <p className="help-eyebrow">BEFORE YOUR ORDER ARRIVES</p>
            <h2 id="shipping-information-title">Shipping Policy <span>&amp; Information</span></h2>
          </div>
          <div className="policy-grid">
            {shippingSections.map(([title, detail], index) => (
              <article className="policy-card" key={title}>
                <span className="policy-card-index">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{detail}</p>
              </article>
            ))}
          </div>
          <p className="policy-disclaimer">Checkout and order-specific information is the source of truth for your purchase. Estimated dates are not delivery guarantees.</p>
        </section>
        <section className="shipping-tracking-panel">
          <div className="shipping-tracking-copy">
            <p className="help-eyebrow">STAY IN THE KNOW</p>
            <h2>Order <span>Tracking</span></h2>
            <p>Follow the status updates available for your order. Tracking details appear only when returned by the connected order service.</p>
            <Link to="/track-order" className="help-button">Track an Order <span aria-hidden="true">→</span></Link>
          </div>
          <div className="process-list">
            {trackingSteps.map(([number, title, detail]) => (
              <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{detail}</p></div></article>
            ))}
          </div>
        </section>
        <section className="policy-panel help-section">
          <div className="help-section-heading">
            <p className="help-eyebrow">A THOUGHTFUL NEXT STEP</p>
            <h2>Returns <span>&amp; Exchanges</span></h2>
          </div>
          <div className="policy-grid returns-policy-grid">
            {[
              ['Return policy', storePolicies.returns.eligibility],
              ['Exchange policy', storePolicies.returns.exchange],
              ['Return eligibility', 'Check the item-specific order policy before requesting a return. Keep the product and packaging in the condition described in those instructions.'],
              ['Damaged or incorrect items', storePolicies.returns.damaged],
              ['Refund processing', storePolicies.returns.refund],
            ].map(([title, detail], index) => (
              <article className="policy-card" key={title}>
                <span className="policy-card-index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3><p>{detail}</p>
              </article>
            ))}
          </div>
          <div className="return-process">
            <div className="help-section-heading">
              <p className="help-eyebrow">YOUR RETURN, STEP BY STEP</p>
              <h3>A clear path <span>forward</span></h3>
            </div>
            <div className="return-steps">
              {returnSteps.map(([number, title, detail]) => (
                <article key={number}><span>{number}</span><h4>{title}</h4><p>{detail}</p></article>
              ))}
            </div>
          </div>
          <div className="policy-contact-note">
            <p>Need help with a specific order?</p>
            <Link to="/support" className="help-text-link">Contact Support <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </div>
    </main>
    <SiteFooter />
  </>
)

const measurementInches = (centimetres) => (
  centimetres === null ? '—' : `${(centimetres / 2.54).toFixed(1)}`
)

export const SizeGuidePage = () => {
  const [department, setDepartment] = useState('men')
  const [garment, setGarment] = useState('T-Shirt')
  const [unit, setUnit] = useState('cm')
  const selectedChart = sizeGuideMeasurements[department].charts[garment]
  const formatMeasurement = (value) => {
    if (value === null) return '—'
    return unit === 'cm' ? value : measurementInches(value)
  }

  return (
    <>
      <About />
      <main className="store-help-page size-guide-page">
        <PageIntro eyebrow="FIND YOUR FIT" title={<>The Size <span>Guide</span></>} description="Use these indicative garment measurements as a starting point, then check the product page for item-specific fit details." />
        <section className="size-guide-content help-section">
          <div className="help-section-heading">
            <p className="help-eyebrow">MEASURE WITH CONFIDENCE</p>
            <h2>Choose your <span>size guide</span></h2>
            <p>All dimensions below are garment measurements and are configurable in the store’s size guide data.</p>
          </div>
          <div className="size-guide-controls">
            <div className="size-tabs" role="group" aria-label="Select size guide">
              {Object.entries(sizeGuideMeasurements).map(([key, data]) => (
                <button type="button" key={key} className={department === key ? 'is-selected' : ''} aria-pressed={department === key} onClick={() => setDepartment(key)}>{data.label}</button>
              ))}
            </div>
            <div className="size-unit-toggle" role="group" aria-label="Measurement unit">
              <button type="button" className={unit === 'cm' ? 'is-selected' : ''} aria-pressed={unit === 'cm'} onClick={() => setUnit('cm')}>CM</button>
              <button type="button" className={unit === 'inch' ? 'is-selected' : ''} aria-pressed={unit === 'inch'} onClick={() => setUnit('inch')}>INCH</button>
            </div>
          </div>
          <div className="garment-tabs" role="group" aria-label="Select garment">
            {Object.keys(sizeGuideMeasurements[department].charts).map((item) => (
              <button type="button" key={item} className={garment === item ? 'is-selected' : ''} aria-pressed={garment === item} onClick={() => setGarment(item)}>{item}</button>
            ))}
          </div>
          <div className="size-table-heading">
            <div><p className="help-eyebrow">{sizeGuideMeasurements[department].label.toUpperCase()} · {garment.toUpperCase()}</p><h3>Garment measurements <span>({unit})</span></h3></div>
            <p>Measured flat and shown as circumference where applicable.</p>
          </div>
          <div className="size-table-scroll" role="region" aria-label={`${sizeGuideMeasurements[department].label} ${garment} size chart`} tabIndex="0">
            <table className="size-table">
              <thead><tr><th scope="col">Size</th><th scope="col">Chest ({unit})</th><th scope="col">Shoulder ({unit})</th><th scope="col">Length ({unit})</th><th scope="col">Waist ({unit})</th></tr></thead>
              <tbody>
                {selectedChart.map(([size, chest, shoulder, length, waist]) => (
                  <tr key={size}><th scope="row">{size}</th><td>{formatMeasurement(chest)}</td><td>{formatMeasurement(shoulder)}</td><td>{formatMeasurement(length)}</td><td>{formatMeasurement(waist)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="size-guide-note">Measurements are indicative references, not verified specifications for every product. Garment construction and fit vary; use product-specific measurements when provided. Allow a small measurement variation when measuring by hand.</p>
        </section>
        <section className="measurement-guide help-section">
          <div className="help-section-heading">
            <p className="help-eyebrow">HOW TO MEASURE</p>
            <h2>Get the right <span>fit</span></h2>
          </div>
          <div className="measurement-instructions">
            {[
              ['01', 'Chest', 'Wrap a tape around the fullest part of the chest, keeping it level and comfortably snug.'],
              ['02', 'Shoulder', 'Measure straight across the back from the edge of one shoulder seam to the other.'],
              ['03', 'Length', 'Measure from the highest shoulder point beside the collar to the bottom hem.'],
              ['04', 'Waist', 'Measure around the garment at its narrowest point. A dash in the chart means the measurement is not applicable.'],
            ].map(([number, title, detail]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{detail}</p></article>)}
          </div>
          <p className="size-guide-note">For best comparison, measure a similar garment that fits you well, laid flat on a surface. If you are between sizes, ask Support about the specific product.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}

const trackingStages = ['Order Placed', 'Order Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered']
const trackingStageIndex = (status) => {
  const value = String(status || '').toLowerCase()
  if (value.includes('deliver')) return value.includes('out for') ? 4 : 5
  if (value.includes('ship')) return 3
  if (value.includes('process')) return 2
  if (value.includes('confirm')) return 1
  return 0
}

const formatDate = (date) => {
  if (!date) return 'Not provided'
  const parsedDate = new Date(date)
  return Number.isNaN(parsedDate.getTime()) ? String(date) : parsedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

const formatAddress = (address) => {
  if (!address) return 'Not provided by the tracking service.'
  if (typeof address === 'string') return address
  return [address.fullName, address.house, address.street, address.city, address.state, address.pincode, address.postalCode, address.country]
    .filter(Boolean)
    .join(', ') || 'Not provided by the tracking service.'
}

export const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState('')
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [trackingNotice, setTrackingNotice] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setTrackingNotice('')
    setOrder(null)
    setIsLoading(true)
    try {
      const result = await trackOrder({ orderId: orderId.trim(), emailOrPhone: emailOrPhone.trim() })
      setOrder(result)
      try {
        const emailSent = await sendTrackingConfirmation(result)
        setTrackingNotice(emailSent
          ? 'A tracking update was sent to the email address registered to this order.'
          : 'Order status loaded. The tracking service did not provide a verified email address, so no email was sent.')
      } catch (emailError) {
        console.error('Unable to email order tracking update:', emailError)
        setTrackingNotice('Order status loaded, but the tracking email could not be delivered.')
      }
    } catch (requestError) {
      console.error('Unable to retrieve order tracking:', requestError)
      setError(requestError.message || 'We could not retrieve this order. Please try again or contact Support.')
    } finally {
      setIsLoading(false)
    }
  }

  const currentStage = order ? trackingStageIndex(order.status) : -1
  const orderItems = order?.items ?? order?.products ?? []

  return (
    <>
      <About />
      <main className="store-help-page track-order-page">
        <PageIntro eyebrow="ORDER UPDATES" title={<>Track Your <span>Order</span></>} description="Enter the details used at checkout to request the latest status from our order-tracking service." />
        <section className="tracking-content help-section">
          <form className="tracking-form" onSubmit={handleSubmit}>
            <div className="help-section-heading">
              <p className="help-eyebrow">YOUR ORDER, AT A GLANCE</p>
              <h2>Find your <span>order</span></h2>
              <p>Your order details are verified by the connected tracking service and are never replaced with a sample result.</p>
            </div>
            <div className="tracking-form-fields">
              <label>Order ID<input value={orderId} onChange={(event) => setOrderId(event.target.value)} required autoComplete="off" placeholder="e.g. the ID in your confirmation" /></label>
              <label>Registered email or phone<input value={emailOrPhone} onChange={(event) => setEmailOrPhone(event.target.value)} required autoComplete="email" placeholder="Email address or phone number" /></label>
            </div>
            {error && <p className="help-form-message is-error" role="alert">{error}</p>}
            <button className="help-button" type="submit" disabled={isLoading}>{isLoading ? 'Checking order…' : 'Track Order'} <span aria-hidden="true">→</span></button>
          </form>

          {order && (
            <section className="tracking-result" aria-live="polite" aria-labelledby="tracking-result-title">
              <div className="tracking-result-heading">
                <div><p className="help-eyebrow">LIVE ORDER INFORMATION</p><h2 id="tracking-result-title">Order <span>{order.id ?? order.orderId}</span></h2></div>
                <span className="tracking-status-pill">{order.status}</span>
              </div>
              {trackingNotice && <p className="help-form-message" role="status">{trackingNotice}</p>}
              <div className="tracking-summary-grid">
                <article><span>Order date</span><strong>{formatDate(order.createdAt ?? order.orderDate)}</strong></article>
                <article><span>Payment status</span><strong>{order.paymentStatus || 'Not provided by the tracking service.'}</strong></article>
                <article><span>Estimated delivery</span><strong>{order.estimatedDelivery ? formatDate(order.estimatedDelivery) : 'Not available'}</strong></article>
                <article><span>Delivery address</span><strong>{formatAddress(order.deliveryAddress ?? order.shippingAddress ?? order.customer?.address)}</strong></article>
              </div>
              <div className="tracking-timeline">
                <h3>Order timeline</h3>
                <ol>
                  {trackingStages.map((stage, index) => {
                    const state = index < currentStage ? 'completed' : index === currentStage ? 'current' : 'pending'
                    return <li className={`tracking-stage is-${state}`} key={stage}><span className="tracking-stage-marker">{state === 'completed' ? '✓' : String(index + 1).padStart(2, '0')}</span><span>{stage}</span></li>
                  })}
                </ol>
              </div>
              <div className="tracking-products">
                <h3>Product details</h3>
                {orderItems.length ? (
                  <ul>{orderItems.map((item, index) => <li key={item.lineId ?? item.id ?? index}><span>{item.name ?? item.title ?? 'Product'}{item.quantity ? ` · Qty ${item.quantity}` : ''}</span><strong>{item.price === undefined ? '' : money(item.price)}</strong></li>)}</ul>
                ) : <p>Product details were not provided by the tracking service.</p>}
              </div>
            </section>
          )}
        </section>
        <section className="tracking-help-cta"><p>Need a hand with an order?</p><Link to="/support" className="help-text-link">Contact Support <span aria-hidden="true">→</span></Link></section>
      </main>
      <SiteFooter />
    </>
  )
}

const initialSupportForm = { name: '', email: '', orderId: '', subject: '', message: '' }
const supportSubjects = ['Order status', 'Shipping & delivery', 'Return or exchange', 'Product question', 'Payment question', 'Other']

const validateSupportForm = (form) => {
  const errors = {}
  if (form.name.trim().length < 2 || form.name.trim().length > 80) errors.name = 'Enter a name between 2 and 80 characters.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errors.email = 'Enter a valid email address.'
  if (form.orderId.trim().length > 80) errors.orderId = 'Order ID must be 80 characters or fewer.'
  if (!supportSubjects.includes(form.subject)) errors.subject = 'Choose a subject.'
  if (form.message.trim().length < 10 || form.message.trim().length > 2000) errors.message = 'Enter a message between 10 and 2,000 characters.'
  return errors
}

export const SupportPage = () => {
  const [form, setForm] = useState(initialSupportForm)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateForm = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setNotice(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateSupportForm(form)
    setErrors(nextErrors)
    setNotice(null)
    if (Object.keys(nextErrors).length) return

    setIsSubmitting(true)
    try {
      const delivery = await sendSupportEmails({
        name: form.name.trim(),
        email: form.email.trim(),
        orderId: form.orderId.trim(),
        subject: form.subject,
        message: form.message.trim(),
      })
      if (delivery.notificationSent && delivery.confirmationSent) {
        setForm(initialSupportForm)
        setErrors({})
        setNotice({ type: 'success', text: 'Thank you. Your message and email confirmation have been sent.' })
      } else if (delivery.notificationSent) {
        setForm(initialSupportForm)
        setErrors({})
        setNotice({ type: 'success', text: 'Your message reached our team, but we could not send your email confirmation.' })
      } else if (delivery.confirmationSent) {
        setNotice({ type: 'error', text: 'We sent a receipt to your email, but could not deliver your message to our team. Please contact us directly.' })
      } else {
        setNotice({ type: 'error', text: 'We could not deliver your message or confirmation. Please try again or email us directly.' })
      }
    } catch (submissionError) {
      console.error('Unable to submit support request:', submissionError)
      setNotice({ type: 'error', text: submissionError.message || 'We couldn’t send your message. Please try again later.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <About />
      <main className="store-help-page support-page">
        <PageIntro eyebrow="PERSONAL CUSTOMER CARE" title={<>We’re Here <span>to Help</span></>} description="Tell us what you need and our team will be ready to assist with your order, fit or product question." />
        <section className="support-content help-section">
          <div className="support-form-panel">
            <div className="help-section-heading">
              <p className="help-eyebrow">SEND US A MESSAGE</p>
              <h2>Contact <span>Support</span></h2>
              <p>Complete the form below. Fields marked required need to be filled in before submission.</p>
            </div>
            <form className="support-form" onSubmit={handleSubmit} noValidate>
              <div className="support-form-grid">
                <label>Full name <span>*</span><input name="name" value={form.name} onChange={updateForm} required maxLength={80} autoComplete="name" aria-invalid={Boolean(errors.name)} />{errors.name && <small>{errors.name}</small>}</label>
                <label>Email address <span>*</span><input name="email" type="email" value={form.email} onChange={updateForm} required autoComplete="email" aria-invalid={Boolean(errors.email)} />{errors.email && <small>{errors.email}</small>}</label>
                <label>Order ID <em>Optional</em><input name="orderId" value={form.orderId} onChange={updateForm} maxLength={80} autoComplete="off" aria-invalid={Boolean(errors.orderId)} />{errors.orderId && <small>{errors.orderId}</small>}</label>
                <label>Subject <span>*</span><select name="subject" value={form.subject} onChange={updateForm} required aria-invalid={Boolean(errors.subject)}><option value="">Select a topic</option>{supportSubjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}</select>{errors.subject && <small>{errors.subject}</small>}</label>
                <label className="support-message-field">Message <span>*</span><textarea name="message" value={form.message} onChange={updateForm} required minLength={10} maxLength={2000} rows={6} aria-invalid={Boolean(errors.message)} />{errors.message && <small>{errors.message}</small>}</label>
              </div>
              {notice && <p className={`help-form-message is-${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>{notice.text}</p>}
              <button className="help-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send Message'} <span aria-hidden="true">→</span></button>
              <p className="support-privacy-note">Please don’t include passwords, full card numbers or one-time passcodes in your message.</p>
            </form>
          </div>
          <aside className="support-aside">
            <article className="support-contact-card">
              <span className="support-card-number">01</span><p className="help-eyebrow">EMAIL SUPPORT</p>
              <h3>A real person, ready to help.</h3>
              <p>Send your enquiry through the form or email our support address.</p>
              <a href="mailto:harshmarothiya3535@gmail.com">harshmarothiya3535@gmail.com</a>
            </article>
            <div className="support-topic-list">
              <h3>Quick ways to get help</h3>
              <Link to="/track-order"><span>Order related help</span><span aria-hidden="true">↗</span></Link>
              <Link to="/shipping"><span>Returns &amp; refunds</span><span aria-hidden="true">↗</span></Link>
              <Link to="/size-guide"><span>Product &amp; sizing advice</span><span aria-hidden="true">↗</span></Link>
              <Link to="/faq"><span>Frequently asked questions</span><span aria-hidden="true">↗</span></Link>
            </div>
          </aside>
        </section>
        <section className="support-bottom-note"><p>GOOD SERVICE IS ALWAYS IN STYLE</p><h2>We’ll help you find the next step.</h2></section>
      </main>
      <SiteFooter />
    </>
  )
}
