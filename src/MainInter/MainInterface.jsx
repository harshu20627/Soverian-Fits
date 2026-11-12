import './MainInter.css'
import './MainInter.css'
import {Link} from 'react-router-dom'

const MainInterface = () => {
  return (
    <div className='main-interface'>
      <div className="new-season">
        <p className="season-text">NEW SEASON , NEW STYLE</p>
        <h1 className="season-heading">Elevate Your</h1>
        <span className="season-head">Everyday</span>
      </div>
      <div className="discription">
         <p className="main-description">
          Premium fashion for the modern you.<br />Where comfort meets confidence.
        </p>
        <button className="shop-btn">SHOP NOW<span>→</span></button>
      </div>
      <div className="section">
        <div className="men">
          <h2 className='wear'>MEN'S WEAR</h2>
          <Link to="/men" className="section-link section-men"><span className='arrow'>SHOP NOW →</span></Link>
        </div>
        <div className="women">
          <h2 className='wear'>WOMEN'S WEAR</h2>
          <Link to="/women" className="section-link section-men"><span className='arrow'>SHOP NOW →</span></Link>
        </div>
        <div className="collection">
          <h2 className='wear'>NEW ARRIVAL'S</h2>
          <Link to="/new-arrivals" className="section-link section-men"><span className='arrow'>SHOP NOW →</span></Link>
        </div>
      </div>
    </div>
  )
}

export default MainInterface
