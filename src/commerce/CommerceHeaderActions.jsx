import { Link } from 'react-router-dom'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { useCommerce } from './CommerceContext'
import { useAuthSession } from '../auth/useAuthSession'

const CommerceHeaderActions = () => {
  const { cartCount, wishlist } = useCommerce()
  const user = useAuthSession()
  return (
    <div className="commerce-header-actions">
      <Link to="/wishlist" className="commerce-header-icon" aria-label={`Wishlist, ${wishlist.length} saved products`}>
        <FavoriteBorderRoundedIcon />
        {wishlist.length > 0 && <span>{wishlist.length}</span>}
      </Link>
      <Link to="/cart" className="commerce-header-icon" aria-label={`Shopping bag, ${cartCount} items`}>
        <ShoppingCartOutlinedIcon />
        {cartCount > 0 && <span>{cartCount}</span>}
      </Link>
      <Link to="/orders" className="commerce-header-icon commerce-orders-header-icon" aria-label="My orders">
        <ReceiptLongOutlinedIcon />
      </Link>
      <Link to={user ? '/account' : '/login'} className="login-btn">
        {user ? 'My account' : 'Login / Register'}
      </Link>
    </div>
  )
}

export default CommerceHeaderActions
