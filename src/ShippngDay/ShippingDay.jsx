import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Forward30Icon from '@mui/icons-material/Forward30';

const ShippingDay = () => {
    
  return (
    <div className='shipping-day'>
        <div className="shipping">
             <p className='ship'><LocalShippingIcon className='ship-icon'/> Free Shipping on orders over ₹999</p>
        </div>
        <div className="brackk"></div>
        <div className="day">
            <p className='dayy'>30-day hassle-free returns <Forward30Icon className='day-icon'/></p>
        </div>
    </div>
  )
}

export default ShippingDay
