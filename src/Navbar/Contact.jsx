import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import img from '../assets/react-ecom-logo.png'
import contactBannerImage from '../assets/contact-pagw-Banner.png'
import contactFormImage from '../assets/contact-page-form-img.png'
import './Navbar.css'
import './Contact.css'
import CommerceHeaderActions from '../commerce/CommerceHeaderActions'
import MobileNav from './MobileNav'
import { sendContactEmails } from '../services/emailNotifications'

const initialContactForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

const contactFaqs = [
  {
    question: 'How long does shipping take?',
    answer: 'Orders are usually processed within 1–2 business days and delivered within 3–7 business days, depending on your location.',
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'We currently ship within India. For international delivery enquiries, please contact our support team.',
  },
  {
    question: 'Can I return or exchange a product?',
    answer: 'Yes. Unworn items in their original condition can be returned or exchanged within 7 days of delivery. Contact us with your order details to get started.',
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order ships, we’ll email you a tracking link. You can also contact us with your order number for an update.',
  },
  {
    question: 'How can I contact customer support?',
    answer: 'Send us a message using the form above or email support@soverianfits.com. We aim to reply within 24 hours.',
  },
  {
    question: 'Can I cancel or change my order?',
    answer: 'If your order has not shipped yet, contact us as soon as possible and we’ll do our best to help.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'Available payment methods are shown securely at checkout and may vary depending on your location.',
  },
  {
    question: 'How do I choose the right size?',
    answer: 'Please refer to the size guide on the product page. If you’re between sizes, message us and we’ll be happy to help.',
  },
]

const validateContactForm = (form) => {
  const errors = {}
  const phone = form.phone.trim()
  const normalizedPhone = form.phone.replace(/\D/g, '')

  if (form.name.trim().length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).'
  } else if (form.name.trim().length > 80) {
    errors.name = 'Name must be 80 characters or fewer.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!/^\+?[\d\s()-]+$/.test(phone) || normalizedPhone.length < 8 || normalizedPhone.length > 15) {
    errors.phone = 'Enter a valid phone number with 8 to 15 digits.'
  }

  if (!form.subject) {
    errors.subject = 'Please select a subject.'
  }

  if (form.message.trim().length < 10) {
    errors.message = 'Please enter a message with at least 10 characters.'
  } else if (form.message.trim().length > 2000) {
    errors.message = 'Message must be 2,000 characters or fewer.'
  }

  return errors
}

const Contact = () => {
  const [form, setForm] = useState(initialContactForm)
  const [errors, setErrors] = useState({})
  const [submissionStatus, setSubmissionStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAllFaqs, setShowAllFaqs] = useState(false)

  const updateContactField = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
    setSubmissionStatus('')
  }

  const handleContactSubmit = async (event) => {
    event.preventDefault()
    setSubmissionStatus('')

    const validationErrors = validateContactForm(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)
    try {
      const result = await sendContactEmails({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject,
        message: form.message.trim(),
      })
      if (result.notificationSent && result.confirmationSent) {
        setForm(initialContactForm)
        setErrors({})
        setSubmissionStatus('Thanks for reaching out. Your message has been sent successfully.')
      } else if (result.notificationSent) {
        setSubmissionStatus('Your message reached our team, but we could not send your email confirmation. Please check your inbox later.')
      } else if (result.confirmationSent) {
        setSubmissionStatus('We sent a receipt to your email, but could not deliver your message to our team. Please contact us directly.')
      } else {
        setSubmissionStatus('We couldn’t deliver your message or confirmation. Please try again or email us directly.')
      }
    } catch (error) {
      console.error('Unable to send contact form:', error)
      setSubmissionStatus(error.message || 'We couldn’t send your message right now. Please try again or email us directly.')
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <>
    {/* ///////////////////// navbar ///////////////////////////// */}
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
    <main className="contact-page">
      {/* /////////////////////////// contact interface section //////////////////////// */}
      <section className="contact-hero" aria-labelledby="contact-hero-title">
        <img className="contact-hero-image" src={contactBannerImage} alt="" />
        <div className="contact-hero-overlay" />
        <div className="contact-hero-content">
          <p className="contact-hero-eyebrow">GET IN TOUCH</p>
          <h1 id="contact-hero-title">Contact <span>Us</span></h1>
          <p className="contact-hero-description">
            Questions about an order, a product, or your experience? Our team is here to help.
            Get in touch and we&apos;ll make sure you receive the thoughtful support you deserve.
          </p>
          <a className="contact-hero-button" href="mailto:harshmarothiya3535@gmail.com">
            LET&apos;S TALK <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      {/* //////////////////// company about ///////////////////////////// */}

      <section className="contact-details" aria-label="Contact information">
        <article className="contact-detail">
          <PhoneRoundedIcon aria-hidden="true" />
          <div>
            <h2>Phone Number</h2>
            <a href="tel:+918591405001">+91 8591405001</a>
            <p>Mon - Sat, 9:00 AM - 9:00 PM</p>
          </div>
        </article>
        <article className="contact-detail">
          <EmailRoundedIcon aria-hidden="true" />
          <div>
            <h2>Email Address</h2>
            <a href="mailto:support@soverianfits.com">support@soverianfits.com</a>
            <p>We&apos;ll respond within 24 hours</p>
          </div>
        </article>
        <article className="contact-detail">
          <LocationOnRoundedIcon aria-hidden="true" />
          <div>
            <h2>Our Location</h2>
            <p>Mumbai Thane, Maharashtra</p>
            <p>400708, India</p>
          </div>
        </article>
        <article className="contact-detail">
          <AccessTimeRoundedIcon aria-hidden="true" />
          <div>
            <h2>Business Hours</h2>
            <p>Mon - Sat: 9:00 AM - 9:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </article>
      </section>

      {/* ////////////////////////////// form contact //////////////////////////////// */}
      
      <section className="contact-message-section" aria-labelledby="contact-form-title">
        <div className="contact-message-visual">
          <img src={contactFormImage} alt="Soverian Fit's flagship store" loading="lazy" />
          <div className="contact-message-image-shade" />
          <p>Style. Confidence. You.</p>
        </div>
        <div className="contact-message-panel">
          <div className="contact-message-heading">
            <p className="contact-message-eyebrow">DROP US A MESSAGE</p>
            <h2 id="contact-form-title">We’d Love to Hear <span>From You</span></h2>
            <p>Fill out the form below and we&apos;ll get back to you as soon as possible.</p>
          </div>
          <form className="contact-form" onSubmit={handleContactSubmit} noValidate>
            <div className="contact-form-group">
              <label className={`contact-form-field${errors.name ? ' has-error' : ''}`} htmlFor="contact-name">
                <PersonOutlineRoundedIcon aria-hidden="true" />
                <input id="contact-name" name="name" type="text" placeholder="Your Name *" autoComplete="name" maxLength={80} value={form.name} onChange={updateContactField} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'contact-name-error' : undefined} />
              </label>
              {errors.name && <span className="contact-form-error" id="contact-name-error">{errors.name}</span>}
            </div>
            <div className="contact-form-group">
              <label className={`contact-form-field${errors.email ? ' has-error' : ''}`} htmlFor="contact-email">
                <EmailRoundedIcon aria-hidden="true" />
                <input id="contact-email" name="email" type="email" placeholder="Your Email *" autoComplete="email" value={form.email} onChange={updateContactField} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'contact-email-error' : undefined} />
              </label>
              {errors.email && <span className="contact-form-error" id="contact-email-error">{errors.email}</span>}
            </div>
            <div className="contact-form-group contact-form-field--full">
              <label className={`contact-form-field${errors.phone ? ' has-error' : ''}`} htmlFor="contact-phone">
                <PhoneRoundedIcon aria-hidden="true" />
                <input id="contact-phone" name="phone" type="tel" placeholder="Your Phone Number *" autoComplete="tel" maxLength={20} value={form.phone} onChange={updateContactField} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'contact-phone-error' : undefined} />
              </label>
              {errors.phone && <span className="contact-form-error" id="contact-phone-error">{errors.phone}</span>}
            </div>
            <div className="contact-form-group contact-form-field--full">
              <label className={`contact-form-field${errors.subject ? ' has-error' : ''}`} htmlFor="contact-subject">
                <LocalOfferOutlinedIcon aria-hidden="true" />
                <select id="contact-subject" name="subject" value={form.subject} onChange={updateContactField} aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? 'contact-subject-error' : undefined}>
                  <option value="" disabled>Select Subject *</option>
                  <option value="Order enquiry">Order enquiry</option>
                  <option value="Product information">Product information</option>
                  <option value="Returns and exchanges">Returns and exchanges</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              {errors.subject && <span className="contact-form-error" id="contact-subject-error">{errors.subject}</span>}
            </div>
            <div className="contact-form-group contact-form-field--full">
              <label className={`contact-form-field contact-form-field--message${errors.message ? ' has-error' : ''}`} htmlFor="contact-message">
                <ChatBubbleOutlineRoundedIcon aria-hidden="true" />
                <textarea id="contact-message" name="message" placeholder="Your Message *" maxLength={2000} value={form.message} onChange={updateContactField} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'contact-message-error' : undefined} />
              </label>
              {errors.message && <span className="contact-form-error" id="contact-message-error">{errors.message}</span>}
            </div>
            {submissionStatus && (
              <p className={`contact-form-status${submissionStatus.startsWith('Thanks') ? ' is-success' : ' is-error'}`} role={submissionStatus.startsWith('Thanks') ? 'status' : 'alert'}>
                {submissionStatus}
              </p>
            )}
            <button className="contact-form-submit" type="submit" disabled={isSubmitting}>
              <SendRoundedIcon aria-hidden="true" />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

{/* ////////////////////////////////// Frequently Asked Questions /////////////////////// */}
      <section className="contact-faq-section" aria-labelledby="contact-faq-title">
        <div className="contact-faq-heading">
          <div>
            <p className="contact-faq-eyebrow">FREQUENTLY ASKED QUESTIONS</p>
            <h2 id="contact-faq-title">Got Questions?</h2>
            <p>Find answers to common questions about orders, shipping, returns and more.</p>
          </div>
          <button
            className="contact-faq-toggle"
            type="button"
            aria-expanded={showAllFaqs}
            aria-controls="contact-faq-list"
            onClick={() => setShowAllFaqs((isExpanded) => !isExpanded)}
          >
            {showAllFaqs ? 'Show Less' : 'View All FAQs'}
            <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="contact-faq-list" id="contact-faq-list">
          {contactFaqs.slice(0, showAllFaqs ? contactFaqs.length : 4).map((faq) => (
            <details className="contact-faq-item" key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* /////////////////////// contact page footer /////////////////////// */}
    </main>
    <footer className="contact-footer">
      <div className="contact-footer-main">
        <Link to="/" className="contact-footer-brand" aria-label="Soverian Fit's home">
          <img src={img} alt="Soverian Fit's" />
        </Link>
        <nav className="contact-footer-nav" aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/collection">Collection</Link>
          <Link to="/men">Men</Link>
          <Link to="/women">Women</Link>
          <Link to="/new-arrivals">New Arrivals</Link>
          <Link to="/sales">Sales</Link>
        </nav>
        <div className="contact-footer-social" aria-label="Social media">
          <span aria-label="Instagram"><InstagramIcon /></span>
          <span aria-label="Facebook"><FacebookIcon /></span>
          <span className="contact-footer-x" aria-label="X">𝕏</span>
          <span aria-label="YouTube"><YouTubeIcon /></span>
        </div>
      </div>
      <div className="contact-footer-copyright">© 2025 Soverian Fit&apos;s. All rights reserved.</div>
    </footer>
    </>
  )
}

export default Contact
