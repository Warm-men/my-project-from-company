import { browserHistory } from 'react-router'
import { getDisplaySizeName } from 'src/app/lib/product_l10n'

import ToteSlotIcon from 'src/app/containers/totes/tote_slot_icon'

import './product.scss'

const getStatus = ({ product, product_size, transition_state, column }) => {
  if (column === 'CurrentTote') {
    if (transition_state === 'purchased') {
      return '已购买'
    }
    if (transition_state === 'needs_payment') {
      return '待付款'
    }
    if (transition_state === 'returned') {
      return '已归还'
    }
  } else if (column === 'ConfirmTote') {
    if (product.disabled) {
      return '已下架'
    }
    if (!product.swappable) {
      return '待返架'
    }
    if (!product_size.swappable) {
      return getDisplaySizeName(product_size.size_abbreviation) + '无货'
    }
  } else {
    return null
  }
}

const Product = ({ value, column, onClickPurchaseButton, showProductSize }) => {
  //占位标签
  if (_.isEmpty(value)) return <div className="empty" />

  const { transition_info, transition_state, product_size } = value
  const { tote_slot, id, type, full_price, catalogue_photos } = value.product

  //已经被购买的商品
  const isPurchased = transition_state === 'purchased'
  const isReturned = transition_state === 'returned'

  const onClick = () => {
    if (column !== 'CurrentTote') return
    const data = { pathname: `/products/${id}`, state: { column_name: column } }
    browserHistory.push(data)
  }

  const _onClickPurchaseButton = () => {
    onClickPurchaseButton && onClickPurchaseButton(value.id, isPurchased)
  }

  const text = getStatus({ ...value, column })

  const price = transition_info && transition_info.modified_price
  //显示按钮
  const isShowSale = (transition_state !== 'none' && !!price) || isPurchased

  const buttonStyle = isPurchased ? 'detail-button' : 'price-button'

  const hidePriceButton = column === 'ReturnTote'

  return (
    <div className="custom-product">
      {tote_slot > 1 && (
        <div className="slot">
          <ToteSlotIcon slot={tote_slot} type={type} />
        </div>
      )}
      <div style={{ position: 'relative' }} onClick={onClick}>
        <img className="image" src={catalogue_photos[0].medium_url} alt="" />
        {text ? (
          <div className="product-tips">
            <span className="size-tips">{text}</span>
          </div>
        ) : null}
        {showProductSize ? (
          <div className="size-box">
            <span className="size">
              {getDisplaySizeName(product_size.size_abbreviation)}
            </span>
          </div>
        ) : null}
      </div>
      {isShowSale && !hidePriceButton && (
        <div className="price-box">
          <span className="modified-price">{'¥' + price}</span>
          <span className="full-price">{'¥' + full_price}</span>
          {!isReturned && (
            <span className={buttonStyle} onClick={_onClickPurchaseButton}>
              {isPurchased ? '查看详情' : '折扣购买'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default React.memo(Product)
