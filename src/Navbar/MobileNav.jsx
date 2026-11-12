import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import logoImage from '../assets/react-ecom-logo.png'
import { useAuthSession } from '../auth/useAuthSession'
import './Navbar.css'

const navigationLinks = [
  ['Home', '/', true],
  ['Shop', '/shop'],
  ["Men's Collection", '/men'],
  ["Women's Collection", '/women'],
  ['About', '/about'],
  ['Collection', '/collection'],
  ['New Arrivals', '/new-arrivals'],
  ['Sale', '/sales'],
  ['Contact', '/contact'],
]

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const user = useAuthSession()

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const currentPaddingRight = Number.parseFloat(getComputedStyle(document.body).paddingRight) || 0
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth) document.body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <button
        type="button"
        className="mobile-menu-toggle"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-drawer"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
      </button>
      {isOpen && (
        <div className="mobile-navigation-layer">
          <button className="mobile-navigation-overlay" type="button" aria-label="Close navigation menu" onClick={closeMenu} />
          <aside
            id="mobile-navigation-drawer"
            className="mobile-navigation-drawer"
            aria-label="Mobile navigation"
          >
            <header className="mobile-navigation-header">
              <Link to="/" onClick={closeMenu} aria-label="Soverian Fit’s home">
                <img src={logoImage} alt="Soverian Fit’s" />
              </Link>
              <button type="button" aria-label="Close navigation menu" onClick={closeMenu}>
                <CloseRoundedIcon />
              </button>
            </header>
            <nav className="mobile-navigation-links">
              {navigationLinks.map(([label, path, exact]) => (
                <NavLink key={path} to={path} end={exact} onClick={closeMenu}>
                  {label}<span aria-hidden="true">→</span>
                </NavLink>
              ))}
            </nav>
            <div className="mobile-navigation-account">
              <Link to={user ? '/account' : '/login'} onClick={closeMenu}>
                {user ? 'My account' : 'Login / Register'}<span aria-hidden="true">→</span>
              </Link>
              <Link to="/wishlist" onClick={closeMenu}>Wishlist<span aria-hidden="true">→</span></Link>
              <Link to="/cart" onClick={closeMenu}>Shopping bag<span aria-hidden="true">→</span></Link>
              <Link to="/orders" onClick={closeMenu}>My orders<span aria-hidden="true">→</span></Link>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}

export default MobileNav
