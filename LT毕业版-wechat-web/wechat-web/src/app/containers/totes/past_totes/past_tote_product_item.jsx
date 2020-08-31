import { getDisplaySizeName } from 'src/app/lib/product_l10n'

import ToteSlotIcon from 'src/app/containers/totes/tote_slot_icon'
import 'src/assets/stylesheets/components/desktop/totes/individual_past_tote.scss'

export default React.memo(props => {
  const { toteProduct, gotoPurchaseDetail, gotoProductDetail } = props
  const {
    id,
    product,
    product_size,
    transition_info,
    transition_state
  } = toteProduct
  const {
    type,
    tote_slot,
    full_price,
    member_price,
    disabled,
    id: product_id
  } = product
  const catalogue_photos = product.catalogue_photos[0] || {}

  //已经被购买的商品
  const isPurchased = transition_state === 'purchased'
  const returned = transition_state === 'returned'
  const price = returned ? member_price : transition_info.modified_price
  return (
    <div className="past-tote-item">
      <div className="image">
        <img
          src={catalogue_photos.thumb_url}
          alt=""
          onClick={e => gotoProductDetail(e, product_id)}
        />
        <div className="message-box">
          <span className="message">
            {isPurchased
              ? '已购买'
              : getDisplaySizeName(product_size.size_abbreviation)}
          </span>
        </div>
      </div>
      {tote_slot > 1 && (
        <div className="products-both-slot">
          <ToteSlotIcon slot={tote_slot} type={type} />
        </div>
      )}
      {isPurchased ? (
        <div
          className="pruchased-button"
          onClick={e => gotoPurchaseDetail(e, id)}
        >
          查看详情
        </div>
      ) : (
        <>
          {disabled && (
            <div className="product-disabled-box">
              <div className="product-disabled-text">已下架</div>
            </div>
          )}
          <div className={'member-price'}>{'¥' + price}</div>
          <div className="full-price">{'¥' + full_price}</div>
        </>
      )}
    </div>
  )
})
