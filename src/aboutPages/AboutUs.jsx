import { Link } from 'react-router-dom'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import YouTubeIcon from '@mui/icons-material/YouTube'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import GppGoodIcon from '@mui/icons-material/GppGood'
import DiamondIcon from '@mui/icons-material/Diamond'
import './AboutUs.css'
import aboutUsImage from '../assets/about-us.png'
import ourstoryimg from '../assets/about-us-2img.png'
import craftsmanshipImage from '../assets/philosophy-craftwork.jpg'
import brandLogo from '../assets/react-ecom-logo.png'

const AboutUs = () => {
  return (
    <>
    <div className='about-us'>
        <div className='about-us-img'>
            <img src={aboutUsImage} alt="Soverian Fit's style" />
            <button className="our-story-btn">OUR STORY   →</button>
        </div>
        <div className="style-build">
            <h3>STYLE<br/>BUILDS<br/>CONFIDENCE</h3>
        </div>
    </div>
    
    {/* ////////////////////////////////// OUR STORY ////////////////////////////////// */}
      <div className='our-story'>
        <div className="story-img">
          <img src={ourstoryimg} alt="Soverian Fit's style" />
        </div>
        <div className="story-right">
          <p className='story-heading'>OUR STORY</p>
          <h1 className='story-title'>BUILD ON VISION,<br/>DRIVEN BY YOU</h1>
          <p className='story-journy'>Soverian Fit's started with a simple idea -- to create<br/>Primium fashion that blends modern design with<br/>timeless style. What began as a passion for fashion <br/>has grown into a brand that stands for quality.<br/>confidence and individuality<br/><br/>We design for those who don't just follow trends,<br/> but set them.</p>
          <button className="our-story-btn">OUR JOURNEY   →</button>
        </div>
      </div>

    {/* ///////////////////////// OUR PHILOSOPHY ////////////////////////// */}
    <section className="philosophy">
      <div className="philosophy-values">
        <div className="philosophy-intro">
          <p className="philosophy-eyebrow">OUR PHILOSOPHY</p>
          <h2 className="philosophy-motto">
            <span>STYLE</span><span className="motto-divider" />
            <span>CONFIDENCE</span><span className="motto-divider" />
            <span>TIMELESS</span>
          </h2>
          <p className="philosophy-description">
            We don’t follow trends, we create essentials.<br />
            Our philosophy is built on three simple values<br />
            that define everything we do.
          </p>
        </div>

        <div className="philosophy-pillars">
          <article className="philosophy-pillar">
            <svg className="pillar-icon" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M13 8h22l10 11-21 25L3 19 13 8Z" />
              <path d="m3 19 42 0M13 8l11 36L35 8M13 8l11 11L35 8" />
            </svg>
            <h3>QUALITY</h3>
            <p>Premium fabrics,<br />crafted for long-lasting<br />comfort and durability.</p>
          </article>
          <article className="philosophy-pillar">
            <svg className="pillar-icon" viewBox="0 0 48 48" aria-hidden="true">
              <path d="m5 17 10 5 9-14 9 14 10-5-4 22H9L5 17Z" />
              <path d="M9 32h30M24 8V3M14 22l1 10m18-10-1 10" />
            </svg>
            <h3>CONFIDENCE</h3>
            <p>Because what you wear<br />shapes how you feel.</p>
          </article>
          <article className="philosophy-pillar">
            <svg className="pillar-icon infinity-icon" viewBox="0 0 60 40" aria-hidden="true">
              <path d="M30 20C21 31 16 36 10 34 3 32 2 24 7 17c7-10 15-6 23 3l1 1c8 9 16 13 23 3 5-7 4-15-3-18-6-2-11 3-21 14Z" />
            </svg>
            <h3>TIMELESS STYLE</h3>
            <p>Classic designs that<br />never go out of fashion.</p>
          </article>
        </div>
      </div>
{/* /////////////////////////////  CraftsMan session ///////////////////////// */}
      <div className="craftsmanship">
        <div className="craftsmanship-image">
          <img src={craftsmanshipImage} alt="A tailor carefully cutting fabric" />
        </div>
        <div className="craftsmanship-copy">
          <p className="philosophy-eyebrow">OUR CRAFTSMANSHIP</p>
          <h2>BUILT ON DETAIL.<br />MADE TO LAST.</h2>
          <p className="craftsmanship-description">
            From selecting the finest fabrics to perfecting every stitch,<br className="desktop-break" />
            our craftsmanship is rooted in precision and passion.<br className="desktop-break" />
            Every piece is carefully designed and made to deliver<br className="desktop-break" />
            unmatched quality and a perfect fit.
          </p>
          <button className="craftsmanship-button" type="button">
            EXPLORE CRAFTSMANSHIP <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <section className="why-choose" aria-labelledby="why-choose-title">
        <h2 className="why-choose-title" id="why-choose-title">WHY CHOOSE SOVERIAN FIT'S</h2>
        <div className="why-choose-grid">
          <article className="why-choose-item">
            <LocalShippingIcon className="why-choose-icon" aria-hidden="true" />
            <h3>FREE SHIPPING</h3>
            <p>On orders over ₹999</p>
          </article>
          <article className="why-choose-item">
            <AutorenewIcon className="why-choose-icon" aria-hidden="true" />
            <h3>EASY RETURNS</h3>
            <p>Hassle-free returns</p>
          </article>
          <article className="why-choose-item">
            <GppGoodIcon className="why-choose-icon" aria-hidden="true" />
            <h3>SECURE PAYMENT</h3>
            <p>100% safe checkout</p>
          </article>
          <article className="why-choose-item">
            <DiamondIcon className="why-choose-icon" aria-hidden="true" />
            <h3>PREMIUM QUALITY</h3>
            <p>Crafted for you</p>
          </article>
        </div>
      </section>

      <section className="about-impact" aria-labelledby="about-impact-title">
        <div className="impact-intro">
          <p className="philosophy-eyebrow">OUR IMPACT</p>
          <h2 id="about-impact-title">NUMBERS THAT<br />TELL OUR STORY</h2>
          <p>Every number represents a person who chose Soverian Fit's. And that inspires us to do better, every single day.</p>
        </div>
        <div className="impact-stats">
          <article className="impact-stat">
            <strong>10K+</strong>
            <span>Happy Customers</span>
          </article>
          <article className="impact-stat">
            <strong>500+</strong>
            <span>Premium Products</span>
          </article>
          <article className="impact-stat">
            <strong>20+</strong>
            <span>Collections</span>
          </article>
          <article className="impact-stat">
            <strong>4.8/5</strong>
            <span>Customer Rating</span>
            <span className="impact-stars" aria-label="5 out of 5 stars">★★★★★</span>
          </article>
        </div>
      </section>

      <section className="about-cta">
        <div className="about-cta-copy">
          <p className="philosophy-eyebrow">SOVERIAN FIT'S</p>
          <h2>READY TO UPGRADE YOUR WARDROBE?</h2>
          <p>Discover premium styles, crafted for your lifestyle.</p>
        </div>
        <Link to="/shop" className="craftsmanship-button about-cta-button">
          DISCOVER YOUR STYLE <span aria-hidden="true">→</span>
        </Link>
      </section>

      <footer className="about-footer">
        <div className="about-footer-main">
          <Link to="/" className="about-footer-brand" aria-label="Soverian Fit's home">
            <img src={brandLogo} alt="Soverian Fit's" />
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
    </section>
    </>
  )
}

export default AboutUs
