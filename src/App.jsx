import './App.css'
import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Home from './Navbar/Home'
import About from './Navbar/About'
import Contact from './Navbar/Contact'
import Shop from './Navbar/Shop'
import Collection from './Navbar/Collection'
import Men from './Navbar/Men'
import Women from './Navbar/Women'
import NewArrival from './Navbar/NewArrival'
import Sales from './Navbar/Sales'
import ShippingDay from './ShippngDay/ShippingDay'
import MainInterface from './MainInter/MainInterface'
import FeaturePro from './FeaturedProducts/FeaturePro'
import AboutUs from './aboutPages/AboutUs'
import Login from './LogReg/Login'
import { AccountDashboardPage, CartPage, CheckoutPage, MyOrdersPage, OrderConfirmationPage, PaymentReturnPage, ProductDetailsPage, WishlistPage } from './commerce/CommercePages'
import { AUTH_REQUIRED_EVENT } from './auth/auth'
import { useAuthSession } from './auth/useAuthSession'
import { AccessoriesPage, FAQPage, ShippingPage, SizeGuidePage, SupportPage, TrackOrderPage } from './pages/StoreHelpPages'

const RequireAccount = ({ children }) => {
  const user = useAuthSession()
  const location = useLocation()
  if (!user) {
    const next = `${location.pathname}${location.search}`
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />
  }
  return children
}

const AuthenticationRedirect = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const redirectToLogin = () => {
      const next = `${location.pathname}${location.search}`
      navigate(`/login?next=${encodeURIComponent(next)}`)
    }
    window.addEventListener(AUTH_REQUIRED_EVENT, redirectToLogin)
    return () => window.removeEventListener(AUTH_REQUIRED_EVENT, redirectToLogin)
  }, [location.pathname, location.search, navigate])

  return null
}

function App() {
  return (
    <>

    <ShippingDay />
      <AuthenticationRedirect />
      <Routes>
        <Route path='/' element={<> <Home /> <MainInterface/> <FeaturePro/> </>} />
        <Route path='/about' element={<><About /> <AboutUs/> </>} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/men' element={<Men />} />
        <Route path='/women' element={<Women />} />
        <Route path='/new-arrivals' element={<NewArrival />} />
        <Route path='/sales' element={<Sales />} />
        <Route path='/accessories' element={<AccessoriesPage />} />
        <Route path='/faq' element={<FAQPage />} />
        <Route path='/shipping' element={<ShippingPage />} />
        <Route path='/size-guide' element={<SizeGuidePage />} />
        <Route path='/track-order' element={<TrackOrderPage />} />
        <Route path='/support' element={<SupportPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Login />} />
        <Route path='/account' element={<RequireAccount><AccountDashboardPage /></RequireAccount>} />
        <Route path='/cart' element={<RequireAccount><CartPage /></RequireAccount>} />
        <Route path='/wishlist' element={<RequireAccount><WishlistPage /></RequireAccount>} />
        <Route path='/product/:productId' element={<ProductDetailsPage />} />
        <Route path='/checkout' element={<RequireAccount><CheckoutPage /></RequireAccount>} />
        <Route path='/order-confirmation/:orderId' element={<RequireAccount><OrderConfirmationPage /></RequireAccount>} />
        <Route path='/orders' element={<RequireAccount><MyOrdersPage /></RequireAccount>} />
        <Route path='/payment/return' element={<RequireAccount><PaymentReturnPage /></RequireAccount>} />
      </Routes>
    </>
  )
}

export default App
