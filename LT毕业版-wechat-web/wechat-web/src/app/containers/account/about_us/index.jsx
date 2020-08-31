import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import './index.scss'

import NEXT from 'src/assets/images/account/next.png'

function mapStateToProps(state) {
  const { app } = state
  return {
    isWechat: app.isWechat,
    isMiniApp: app.platform === 'mini_app'
  }
}
@connect(mapStateToProps)
export default class AccountContainer extends PureComponent {
  testAlertGitCommitId = () => {
    if (!this.clickCounts) this.clickCounts = 0
    this.clickCounts++
    if (this.clickCounts < 5) return null
    alert(process.env.GIT_COMMIT_ID)
  }

  render() {
    const { isWechat, isMiniApp } = this.props
    return (
      <div className="about-us">
        <PageHelmet title="关于我们" link="/about_us" />
        <img
          src={require('../images/letote_logo.png')}
          alt="logo"
          className="logo"
        />
        <Link to="/about_us/about_letote" className="link">
          关于托特衣箱 <img src={NEXT} alt="" />
        </Link>
        <Link to="/about_us/agreement" className="link">
          用户协议
          <img src={NEXT} alt="" />
        </Link>
        <div className="service-phone" onClick={this.testAlertGitCommitId}>
          {isWechat && (
            <p className="text-list">
              {isMiniApp
                ? '如有任何问题请联系我们，托特衣箱竭诚为你服务'
                : '微信公众号内回复任意消息与客服进行沟通'}
            </p>
          )}
          <p className="text-list">
            客服电话：
            <a href="tel:4008070088" className="phone">
              400-807-0088
            </a>
          </p>
        </div>
      </div>
    )
  }
}
