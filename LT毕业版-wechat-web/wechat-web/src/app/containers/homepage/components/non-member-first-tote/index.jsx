import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import ActionButton from 'src/app/components/shared/action_button/index'
import CountDown from 'src/app/components/count_down'
import Swiper from 'react-id-swiper'
class NonMemberFirstTote extends Component {
  handleCustom = () => {
    window.adhoc('track', 'onboarding_0', 1)
    browserHistory.push('/onboarding_v2/my_fashion_wish')
  }

  goToteSwap = () => browserHistory.push('/totes_v2')

  goPlans = () => browserHistory.push('/plans')

  handleLinkToProductDetail = id => () => browserHistory.push(`/products/${id}`)

  returnTime = () => {
    const { latest_rental_tote } = this.props
    let minutes = 0,
      seconds = 0
    if (!latest_rental_tote || !latest_rental_tote.stock_locked_at) {
      return { minutes, seconds }
    }
    let diffTime =
      new Date(latest_rental_tote.stock_locked_at).getTime() -
      new Date().getTime() +
      1800000

    if (diffTime < 0) {
      return { minutes, seconds }
    } else {
      minutes = parseInt((diffTime % (1000 * 60 * 60)) / (1000 * 60), 10)
      seconds = parseInt((diffTime % (1000 * 60)) / 1000, 10)
      if (minutes < 10) {
        minutes = `0${minutes}`
      }
      if (seconds < 10) {
        seconds = `0${seconds}`
      }
      return { minutes, seconds }
    }
  }

  render() {
    const { tote_count, latest_rental_tote, firstToteAbtestVar } = this.props
    return _.isEmpty(latest_rental_tote) ? (
      <NonTote
        tote_count={tote_count}
        handleCustom={this.handleCustom}
        firstToteAbtestVar={firstToteAbtestVar}
      />
    ) : (
      <FirstTote
        tote_count={tote_count}
        goToteSwap={this.goToteSwap}
        goPlans={this.goPlans}
        tote_products={latest_rental_tote.tote_products}
        returnTime={this.returnTime()}
        handleLinkToProductDetail={this.handleLinkToProductDetail}
      />
    )
  }
}

const NonTote = ({ tote_count, handleCustom, firstToteAbtestVar }) => (
  <div className="nonmember-first-tote">
    <div className="non-title">
      托特衣箱已在全球发出
      <span className="money">{parseInt(tote_count, 10).toLocaleString()}</span>
      个衣箱
    </div>
    <i className="first-tote-banner" />
    <ActionButton className="custom" onClick={handleCustom}>
      {firstToteAbtestVar === 1 ? '立即体验' : '开始定制'}
    </ActionButton>
  </div>
)

const options = {
  slidesPerView: 'auto',
  paginationClickable: true,
  freeMode: true,
  freeModeMinimumVelocity: 0.1,
  preloadImages: false,
  lazy: true
}

const FirstTote = ({
  tote_count,
  goToteSwap,
  goPlans,
  tote_products,
  returnTime,
  handleLinkToProductDetail
}) => (
  <div className="nonmember-first-tote first-tote">
    <div className="non-title">
      托特衣箱已在全球发出
      <span className="money">{parseInt(tote_count, 10).toLocaleString()}</span>
      个衣箱
    </div>
    <div className="tote-preview">
      <div className="tote-lists">
        <Swiper {...options}>
          {tote_products.map(item => (
            <img
              key={item.id}
              src={item.product.catalogue_photos[0].medium_url}
              alt="tote"
              onClick={handleLinkToProductDetail(item.product.id)}
              className="image-item"
            />
          ))}
        </Swiper>
      </div>
    </div>
    <ActionButton
      size="small"
      actionType="secondary"
      className="exchange-clothing"
      onClick={goToteSwap}
    >
      查看衣箱
    </ActionButton>
    <ActionButton size="small" className="payment-tote" onClick={goPlans}>
      立即下单
      <CountDown minutes={returnTime.minutes} seconds={returnTime.seconds} />
    </ActionButton>
  </div>
)

export default NonMemberFirstTote
