import { format } from 'date-fns'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions.js'
import Swiper from 'react-id-swiper'
import 'src/assets/stylesheets/components/desktop/totes/individual_past_tote.scss'
import 'src/app/components/custom_components/swiper.scss'
import ProductItem from './past_tote_product_item'

const ratingStar = 5

export default function PastTote({ tote, dispatch }) {
  if (_.isEmpty(tote)) return null

  const { id, locked_at, tote_rating, tote_products, rating_incentive } = tote

  const options = {
    slidesPerView: 'auto',
    freeMode: true,
    freeModeMinimumVelocity: 0.1,
    preloadImages: false,
    lazy: true
  }

  const handlRating = async () => {
    await dispatch(Actions.ratings.setRatingToteId(id))
    sessionStorage.setItem('RatingsToteId', id)
    browserHistory.push({ pathname: '/rating_products' })
  }

  const gotoPurchaseDetail = async (e, tote_product_id) => {
    e.stopPropagation()
    await dispatch(Actions.purchaseCheckout.reSetPurchaseIds())
    browserHistory.push({
      pathname: `/purchased_detail`,
      query: { toteId: id, tote_product_id, isHistory: true }
    })
  }

  const gotoProductDetail = (e, id) => {
    e.stopPropagation()
    browserHistory.push(`/products/${id}`)
  }

  return (
    <div className="tote-widget-wrapper">
      <div className="header">
        <span className="locked-time">
          下单时间：{format(locked_at, 'YYYY-MM-DD')}
        </span>
        {tote_rating ? (
          <div className="rating">
            {_.map(_.range(ratingStar), i => {
              const divClass = i < tote_rating.rating ? 'star filled' : 'star'
              return <span key={i} className={divClass} />
            })}
          </div>
        ) : null}
      </div>
      <div className="past-tote-products">
        <Swiper
          slideClass="custom-swiper-slide"
          wrapperClass="custom-swiper-wrapper"
          {...options}
        >
          {_.map(tote_products, item => (
            <div key={item.id}>
              <ProductItem
                gotoPurchaseDetail={gotoPurchaseDetail}
                gotoProductDetail={gotoProductDetail}
                toteProduct={item}
              />
            </div>
          ))}
        </Swiper>
      </div>
      <div className="button" onClick={handlRating}>
        <span>
          {rating_incentive && !rating_incentive.has_incentived
            ? '评价领奖励'
            : '查看评价'}
        </span>
      </div>
    </div>
  )
}
