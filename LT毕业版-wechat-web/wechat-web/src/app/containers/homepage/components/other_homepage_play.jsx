import { withRouter } from 'react-router'
import { miniProgramNavigate } from 'src/app/lib/miniProgram_navigate.js'
import { APPStatisticManager } from '../../../lib/statistics/app'
@withRouter
export default class OtherHomepagePlay extends React.Component {
  state = {
    abtestVar: -1
  }

  componentDidMount() {
    window.adhoc('getFlags', flag => {
      this.setState({
        abtestVar: flag.get('D181214_WECHAT_PLAYING_TOTE')
      })
    })
  }

  handleClick = e => {
    APPStatisticManager.onClickElement({ element: e.currentTarget })
    const link = e.currentTarget.getAttribute('data-link')
    const clickType = e.currentTarget.getAttribute('data-type')
    clickType && window.adhoc('track', clickType, 1)
    if (this.props.isMiniApp) {
      miniProgramNavigate(link)
      return null
    }
    window.location.href = link
  }

  joinMember = e => {
    APPStatisticManager.onClickElement({ element: e.currentTarget })
    this.props.router.push('/plans')
  }

  render() {
    return (
      <div className="other-homepage-play">
        <div className="title-box">
          <div className="title">
            <span className="title-border" />
            <span className="title-text">玩转托特衣箱</span>
            <span className="title-border" />
          </div>
        </div>
        <p className="play-tips">
          每箱多至6件衣服+4件配饰 &bull; 衣箱可换 &bull; 顺丰包邮
        </p>
        <img
          className="flow-img"
          alt=""
          src={require('../other_image/flow.svg')}
        />
        {this.state.abtestVar === 1 ? (
          <IntroductionH5Tab
            handleClick={this.handleClick}
            joinMember={this.joinMember}
          />
        ) : (
          <IntroductionH5TabAbTesting
            handleClick={this.handleClick}
            joinMember={this.joinMember}
          />
        )}
      </div>
    )
  }
}

class IntroductionH5Tab extends React.PureComponent {
  render() {
    const { handleClick, joinMember } = this.props
    return (
      <div>
        <div className="play-icons-containers">
          <img
            className="icon"
            alt=""
            data-link="https://static.letote.cn/pages/homepage_introduce_190702/index.html"
            src={require('../other_image/play.svg')}
            onClick={handleClick}
            data-type="clickIntroduct"
          />
          <img
            className="icon"
            alt=""
            src={require('../other_image/profession.svg')}
            data-link="https://static.letote.cn/kol_activity/homepage_clean_0228/index.html"
            onClick={handleClick}
          />
          <img
            className="icon"
            alt=""
            src={require('../other_image/common.svg')}
            data-link="http://mp.weixin.qq.com/s?__biz=MzU0MTM1MjAyOQ==&mid=100000944&idx=1&sn=b75d6b477738a3a0aaf133b9d7d77d19&chksm=7b2a0d824c5d849460a0342a27e7fcb11c1ee0cbb6f75ef0c3af505b16d9caaa2da8f630e27a#wechat_redirect"
            onClick={handleClick}
            data-type="clickHelp"
          />
        </div>
        <span onClick={joinMember} className="join-member-btn">
          加入会员
        </span>
      </div>
    )
  }
}

class IntroductionH5TabAbTesting extends React.PureComponent {
  render() {
    const { handleClick, joinMember } = this.props
    return (
      <div>
        <img
          alt=""
          onClick={handleClick}
          className="introduction-img"
          data-link="https://static.letote.cn/pages/homepage_introduce_190702/index.html"
          src={require('../images/introduction_to_play.png')}
          data-type="clickIntroduct"
        />
        <span onClick={joinMember} className={'join-member-btn-abtest'}>
          加入会员
        </span>
        <span
          onClick={handleClick}
          data-link="http://mp.weixin.qq.com/s?__biz=MzU0MTM1MjAyOQ==&mid=100000944&idx=1&sn=b75d6b477738a3a0aaf133b9d7d77d19&chksm=7b2a0d824c5d849460a0342a27e7fcb11c1ee0cbb6f75ef0c3af505b16d9caaa2da8f630e27a#wechat_redirect"
          className="help-btn"
          data-type="clickHelp"
        >
          <img
            className="what-icon"
            alt=""
            src={require('../images/what.png')}
          />
          <span>{'常见问题'}</span>
        </span>
      </div>
    )
  }
}
