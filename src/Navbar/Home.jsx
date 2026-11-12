import { NavLink } from 'react-router-dom'
import './Navbar.css'
import img from '../assets/react-ecom-logo.png'
import CommerceHeaderActions from '../commerce/CommerceHeaderActions'
import MobileNav from './MobileNav'
const Home = () => {
  return (
  // /////////////////////  navbar  /////////////////////////////
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
  )
}

export default Home
