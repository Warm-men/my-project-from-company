import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions'
import Swiper from 'react-id-swiper'
import { miniProgramNavigate } from 'src/app/lib/miniProgram_navigate.js'
import { APPStatisticManager } from '../../../lib/statistics/app'

class HomepagePlay extends React.Component {
  constructor(props) {
    super(props)
    this.options = {
      slidesPerView: 'auto',
      spaceBetween: 8,
      on: {
        touchEnd: _.debounce(this.setTouchPosition, 100, {
          leading: true
        }),
        transitionEnd: _.debounce(this.setTouchPosition, 100, {
          leading: true
        })
      }
    }
    this.swiperDom = null
    this.cacheId = 'homepage_play'
  }

  componentDidMount() {
    const { dispatch } = this.props
    const variables = { name: 'intro_wechat_banner' }
    dispatch(
      Actions.homepage.fetchHomepageGroup('API:HOMEPAGEINTRODUCE', variables)
    )
  }

  setTouchPosition = () => {
    if (!this.swiperDom) {
      return
    }
    const initPosition = this.swiperDom.childNodes[0].style.transform
    sessionStorage.setItem(this.cacheId, initPosition)
  }

  handleClick = e => {
    const element = e.currentTarget
    APPStatisticManager.onClickElement(element)
    const link = element.getAttribute('data-link')
    if (!_.isEmpty(link)) {
      if (this.props.isMiniApp) {
        miniProgramNavigate(link)
        return null
      }
      window.location.href = link
    }
  }

  getSwiper = swiper => {
    if (swiper) {
      this.swiperDom = swiper.$el[0]
      const cacheStyle = sessionStorage.getItem(this.cacheId)
      if (cacheStyle && this.swiperDom) {
        this.swiperDom.childNodes[0].style.transform = cacheStyle
      }
    }
  }

  render() {
    const { introduceList } = this.props
    if (introduceList.length <= 0) {
      return null
    }
    return (
      <div className="homepage-products-list">
        <div className="title-box">
          <div className="title">
            <span className="title-border" />
            <span className="title-text">玩转托特衣箱</span>
            <span className="title-border" />
          </div>
          <div className="title-img">MASTER LETOTE</div>
        </div>
        <div className="homepage-play-box">
          {
            <Swiper getSwiper={this.getSwiper} {...this.options}>
              {introduceList.map((v, k) => (
                <img
                  onClick={this.handleClick}
                  data-link={v.link}
                  className="play-img"
                  alt=""
                  src={v.logo}
                  key={k}
                />
              ))}
            </Swiper>
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { homepage } = state
  return { introduceList: homepage.introduceList }
}

export default connect(mapStateToProps)(HomepagePlay)
