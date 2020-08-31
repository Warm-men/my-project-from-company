import withHandleTouch from 'src/app/components/HOC/with_handletouch/index_hooks.jsx'
import * as storage from 'src/app/lib/storage.js'
import { useState } from 'react'
import './index.scss'

export default withHandleTouch(PurchaseProductGuide)
function PurchaseProductGuide(props) {
  const [isShowGuide, setIsShowGuide] = useState(
    !storage.get('PurchaseProductsGuide', localStorage)
  )

  if (!isShowGuide) return null
  const handleClick = () => {
    storage.set('PurchaseProductsGuide', true, localStorage)
    setIsShowGuide(false)
  }

  return (
    <div className="purchase-products-guide" onClick={handleClick}>
      <img
        className={`guide-img ${props.isHadHint ? 'had-hint' : ''}`}
        src={require('src/app/containers/totes/purchase_tote_products/purchase_guide/imgaes/guide.png')}
        alt=""
      />
    </div>
  )
}
