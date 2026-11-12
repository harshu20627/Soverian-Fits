import { Link } from 'react-router-dom'
import EmailIcon from '@mui/icons-material/Email'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
import LocationPinIcon from '@mui/icons-material/LocationPin'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import logoImage from './assets/react-ecom-logo.png'
import './FeaturedProducts/FeaturePro.css'

const SiteFooter = () => (
  <>
    <footer className="footer">
      <div className="fot-logo">
        <img src={logoImage} alt="Soverian Fit’s" />
        <pre className="footer-tagline">STYLE       /       QUALITY       /       CONFIDENCE</pre>
        <InstagramIcon className="footer-icon" aria-label="Instagram" />
        <FacebookIcon className="footer-icon" aria-label="Facebook" />
        <WhatsAppIcon className="footer-icon" aria-label="WhatsApp" />
        <LinkedInIcon className="footer-icon" aria-label="LinkedIn" />
      </div>
      <div className="quick-links">
        <h5 className="footer-heading">QUICK LINKS</h5>
        <ul className="footer-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/collection">Collection</Link></li>
          <li><Link to="/men">Men</Link></li>
          <li><Link to="/women">Women</Link></li>
          <li><Link to="/new-arrivals">New Arrivals</Link></li>
          <li><Link to="/sales">Sales</Link></li>
        </ul>
      </div>
      <div className="shop-category">
        <h5 className="footer-heading">SHOP CATEGORY</h5>
        <ul className="footer-links">
          <li><Link to="/men">Men</Link></li>
          <li><Link to="/women">Women</Link></li>
          <li><Link to="/accessories">Accessories</Link></li>
        </ul>
      </div>
      <div className="customer-service">
        <h5 className="footer-heading">CUSTOMER SERVICE</h5>
        <ul className="footer-links">
          <li><Link to="/faq">FAQ</Link></li>
          <li><Link to="/shipping">Shipping &amp; Returns</Link></li>
          <li><Link to="/size-guide">Size Guide</Link></li>
          <li><Link to="/track-order">Track Order</Link></li>
          <li><Link to="/support">Support</Link></li>
        </ul>
      </div>
      <div className="contact-us">
        <h5 className="footer-heading">CONTACT US</h5>
        <ul className="footer-links">
          <li><Link to="mailto:harshmarothiya3535@gmail.com"><EmailIcon className="contact-icon" /> support@gmail.com</Link></li>
          <li><Link to="https://www.google.com/maps/place/Mumbai,+India"><LocationPinIcon className="contact-icon" /> Mumbai, India</Link></li>
          <li><Link to="tel:+11234567890"><LocalPhoneIcon className="contact-icon" /> +1 (123) 456-7890</Link></li>
        </ul>
      </div>
    </footer>
    <div className="down-footer">
      <div className="down-footer-text">© 2026 Soverian Fit. All rights reserved.</div>
      <div className="privacy">
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
      </div>
    </div>
  </>
)

export default SiteFooter
