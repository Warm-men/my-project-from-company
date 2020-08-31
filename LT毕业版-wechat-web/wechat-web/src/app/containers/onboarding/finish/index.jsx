import Actions from 'src/app/actions/actions'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { loadAnimation } from 'lottie-web/build/player/lottie_light'
import PageHelmet from 'src/app/lib/pagehelmet'
import 'src/assets/stylesheets/mobile/style_profile.scss'
import './index.scss'

class FinishOnboarding extends React.PureComponent {
  constructor() {
    super()
    this.initialTimeout = 5000
    this.checkInterval = this.initialTimeout
    this.iterCount = 0
    this.animateRefs = null
    this.bodyMovin = null
    this.state = {
      isComplete: false
    }
  }
  componentDidMount() {
    this.stylingCheckInterval()
    this.animateRefs && this.ceartBodyMovin()
  }

  ceartBodyMovin = () => {
    this.bodyMovin = loadAnimation({
      path: 'https://static.letote.cn/pages/animation_finish/data.json', //json文件路径
      loop: false,
      autoplay: true,
      renderer: 'svg', //渲染方式，有"html"、"canvas"和"svg"三种
      container: this.animateRefs
    })
    this.bodyMovin.addEventListener('complete', () => {
      this.setState({
        isComplete: true
      })
    })
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  openTotes = () => {
    this.props.dispatch(Actions.currentCustomer.fetchMe())
    browserHistory.push('/new_totes')
  }

  isGetTotes = () => {
    const { state } = this.props.toteCart
    return !_.isEmpty(state) && state !== 'populating'
  }

  fetchLatestRental = () => {
    // this.props.dispatch(Actions.totes.fetchLatestRentalAndPurchaseTote())
    this.props.dispatch(Actions.toteCart.queryToteCart())
  }

  stylingCheckInterval = () => {
    this.timer && clearTimeout(this.timer)
    if (this.isGetTotes()) {
      return null
    }
    this.timer = setTimeout(() => {
      this.fetchLatestRental()
      this.iterCount++
      if (this.iterCount > 2) {
        this.checkInterval += this.initialTimeout
      }
      this.stylingCheckInterval()
    }, this.checkInterval)
  }
  render() {
    const { isComplete } = this.state
    const isGetTotes = this.isGetTotes()
    const tipsText = isGetTotes ? '衣箱已为你准备好' : '正在为你准备衣箱'
    return (
      <div className="finish-onboarding">
        <PageHelmet title="衣箱" link={this.props.location.pathname} />
        <div
          className="finish-animate"
          ref={refs => (this.animateRefs = refs)}
        />
        <div className={isComplete ? 'finish-tips animate' : 'finish-tips'}>
          <p className="tips-text">{tipsText}</p>
          {isGetTotes ? (
            <span className="open-btn" onClick={this.openTotes}>
              开启衣箱
            </span>
          ) : (
            <img
              className="loading-img"
              alt=""
              src={require('src/app/containers/onboarding/images/finish-loading.svg')}
            />
          )}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    // totes: state.totes,
    toteCart: state.tote_cart
  }
}

export default connect(mapStateToProps)(FinishOnboarding)
