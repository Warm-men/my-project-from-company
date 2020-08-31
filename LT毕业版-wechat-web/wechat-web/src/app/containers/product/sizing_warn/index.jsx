import PropTypes from 'prop-types'
import { handleSizeName } from 'src/app/containers/product/detail_buttons/utils/product_detail_bottom_btn_util.js'
import isCompeleteSize from 'src/app/lib/isCompleteSize.js'
import './index.scss'

function getFitMessage(recommendedSize, realtimeProductSizes, selectedSize) {
  const objcet = { fitMessage: '' }
  if (realtimeProductSizes && realtimeProductSizes.recommended_message) {
    objcet.fitMessage = realtimeProductSizes.recommended_message
    return objcet
  }

  if (!selectedSize && !recommendedSize) return objcet
  const fitMessages = realtimeProductSizes && realtimeProductSizes.product_sizes
  if (!fitMessages) {
    objcet.fitMessage = ''
    return objcet
  }
  // 如果有推荐尺码，默认会选择推荐尺码，所以如果没有selectedSize 说明没有合适尺码
  // 如果没有合适尺码，但商品有推荐尺码，但是推荐尺码无库存，仍显示推荐尺码的

  const currentSize = selectedSize
    ? selectedSize.size.abbreviation
    : recommendedSize
  let selectedItem = null
  selectedItem = fitMessages.find(item => {
    return currentSize === item.size.abbreviation
  })
  if (!selectedItem) {
    objcet.fitMessage = ''
    return objcet
  }

  if (recommendedSize && currentSize === recommendedSize) {
    const sizeName = handleSizeName(currentSize)

    objcet.size = sizeName
    if (selectedItem.realtime_fit_message) {
      objcet.fitMessage = '（' + selectedItem.realtime_fit_message + '）'
    } else {
      objcet.fitMessage = ''
    }
  } else {
    objcet.fitMessage = selectedItem.realtime_fit_message
  }
  return objcet
}

export const SizeHelp = ({ linkToSelectSize, first_delivered_tote }) => (
  <div className="size-help">
    <div className={`size-help-left ${!first_delivered_tote ? 'top' : ''}`}>
      <img
        src={require('src/app/containers/product/images/size_help.png')}
        className="help-icon"
        alt=""
      />
      {first_delivered_tote ? (
        <span className="help-tips-box" onClick={linkToSelectSize}>
          合身穿搭须从量体开始，
          <span className="help-tips-text">立即使用卷尺测量吧</span>
          <span className="help-text-icon"> &rsaquo;</span>
        </span>
      ) : (
        <span className="help-text">
          会员首个衣箱会赠送卷尺，请及时测量个人身材数据，智能尺码推荐才会更精准。
        </span>
      )}
    </div>
  </div>
)

export default function SizingWarn(props) {
  const {
    selectedSize,
    recommended_size,
    hasSizeInfo,
    linkToSelectSize,
    isClothing,
    realtimeProductRecommended,
    customer,
    isSwapModal
  } = props

  if (!hasSizeInfo ? false : !isClothing) return null

  const { fitMessage, size } = getFitMessage(
    recommended_size,
    realtimeProductRecommended,
    selectedSize
  )

  return (
    <>
      {fitMessage && (
        <div className="recommend-description">
          {size ? (
            <>
              推荐：
              <span className="recommend-size">{size}</span>
            </>
          ) : null}
          {fitMessage}
        </div>
      )}
      {!isCompeleteSize(customer.style) && isClothing && !isSwapModal && (
        <SizeHelp
          first_delivered_tote={customer.first_delivered_tote}
          linkToSelectSize={linkToSelectSize}
        />
      )}
    </>
  )
}

SizingWarn.propTypes = {
  hasRecommededSize: PropTypes.bool,
  isRecommandSizeSwappable: PropTypes.bool,
  selectedSize: PropTypes.object,
  recommended_size: PropTypes.string,
  hasSizeInfo: PropTypes.bool,
  linkToSelectSize: PropTypes.func
}
