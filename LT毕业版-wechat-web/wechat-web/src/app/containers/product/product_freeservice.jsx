import 'src/assets/stylesheets/components/desktop/product/product_freeservice.scss'
import { browserHistory } from 'react-router'
export default function FreeService(props) {
  const {
    customer: { free_service },
    isClothing,
    isWechat
  } = props
  const openFreeService = () => {
    browserHistory.push({
      pathname: '/open_free_service'
    })
  }
  const showBanner =
    free_service &&
    free_service.display_guide_in_product_page &&
    isClothing &&
    isWechat
  return (
    <div
      className={`product-freeservice-container ${showBanner ? 'line' : ''}`}
    >
      {showBanner ? (
        <div className="product-freeservice">
          <span className="product-freeservice-desc">
            担心尺码选不准？多加2件
          </span>
          <div className="product-freeservice-button" onClick={openFreeService}>
            <span className="button-text">免费开通 ></span>
          </div>
        </div>
      ) : null}
    </div>
  )
}
