import React from 'react'
import './index.scss'
import ZHIMA_CREDIT from '../../images/zhimaxinyong.png'
import FLOW from '../../images/flow.png'

class ApplySuccess extends React.PureComponent {
  handleGoTotes = () => {
    this.props.handleGoTotes()
  }

  render() {
    return (
      <div className="apply-success">
        <img src={ZHIMA_CREDIT} alt="..." className="zhima-credit-bg" />
        <span>我的芝麻信用</span>
        <p>{this.props.score}</p>
        <div>芝麻信用已认证成功</div>
        <img src={FLOW} alt="..." className="apply-flow" />
        <h6>
          为了给你提供品质更优质、更符合你心意的服饰，请再花费1分钟的时间填写我们的问卷，完成后即可成为试用会员。你的意见将是我们最宝贵的财富，谢谢你的合作。
        </h6>
        <button onClick={this.handleGoTotes}>继续</button>
      </div>
    )
  }
}

export default ApplySuccess
