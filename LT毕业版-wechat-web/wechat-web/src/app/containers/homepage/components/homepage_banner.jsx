import React from 'react'
import { miniProgramNavigate } from 'src/app/lib/miniProgram_navigate.js'
import Swiper from 'react-id-swiper'
import 'src/assets/stylesheets/mobile/homepage.scss'
import {
  APPStatisticManager,
  BaiduStatisService
} from '../../../lib/statistics/app'

export default class HomepageBanenr extends React.Component {
  constructor(props) {
    super(props)
    this.params = {
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      }
    }
  }

  handleBannerClick = e => {
    const element = e.currentTarget
    APPStatisticManager.onClickElement(element)
    if (element.getAttribute('data-link')) {
      APPStatisticManager.service(BaiduStatisService.id).push([
        '_trackEvent',
        'ClickBanner',
        'BannerId',
        element.getAttribute('data-id')
      ])
      if (this.props.isMiniApp) {
        miniProgramNavigate(element.getAttribute('data-link'))
        return null
      }
      window.location.href = element.getAttribute('data-link')
    }
  }

  render() {
    const { bannerList, isSubscriber } = this.props

    if (_.isEmpty(bannerList)) {
      return (
        <img
          src={require('../../../../assets/images/placeholder/placeholder_420_232.png')}
          alt="banenr"
        />
      )
    }

    return (
      <div className="homepage-banner-box">
        <Swiper
          autoplay={true}
          loop={false}
          speed={200}
          pagination={bannerList.length === 0 ? {} : this.params.pagination}
        >
          {_.map(bannerList, (v, k) => {
            const isReferral =
              _.includes(v.link, 'referal') || _.includes(v.link, 'referral')
            if (!this.props.isWechat && isReferral) {
              return <React.Fragment key={k} />
            }
            if (v.visibility === 0) {
              return (
                <div
                  key={k}
                  data-id={v.id}
                  data-link={v.link}
                  onClick={this.handleBannerClick}
                >
                  <img
                    className="homepage-top-banner"
                    src={v.logo}
                    alt={v.id}
                  />
                </div>
              )
            } else if (v.visibility === 1 && isSubscriber) {
              return (
                <div
                  key={k}
                  data-id={v.id}
                  data-link={v.link}
                  onClick={this.handleBannerClick}
                >
                  <img
                    className="homepage-top-banner"
                    src={v.logo}
                    alt={v.id}
                  />
                </div>
              )
            } else if (v.visibility === 2 && !isSubscriber) {
              return (
                <div
                  key={k}
                  data-id={v.id}
                  data-link={v.link}
                  onClick={this.handleBannerClick}
                >
                  <img
                    className="homepage-top-banner"
                    src={v.logo}
                    alt={v.id}
                  />
                </div>
              )
            }
            return <React.Fragment key={k} />
          })}
        </Swiper>
      </div>
    )
  }
}
