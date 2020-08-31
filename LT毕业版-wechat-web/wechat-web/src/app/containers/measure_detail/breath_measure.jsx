import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import SuoFang from './images/suofang.png'
import ZhanKai from './images/zhankai.png'
import './index.scss'

class BreathMeasure extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showInfo: !props.canToggle || false
    }
  }

  handleClick = () => {
    this.setState({
      showInfo: !this.state.showInfo
    })
  }

  render() {
    const { showInfo } = this.state
    return (
      <div
        className={
          !showInfo ? 'measure-detail-row row-border' : 'measure-detail-row'
        }
      >
        <div className="breath-measure-container">
          <h4 className="breath-measure-title">
            <span>如何测量胸围？</span>
            {this.props.canToggle && (
              <span onClick={this.handleClick}>
                <img alt="" src={showInfo ? SuoFang : ZhanKai} />
              </span>
            )}
          </h4>
          {showInfo && (
            <div>
              <div className="breath-measure-breath2" />
              <p className="breath-measure-text">
                <span className="breath-measure-title-text">下胸围：</span>
                用软尺水平测量胸底部一周
              </p>
              <p className="breath-measure-text middle-margin">
                胸罩尺寸=下胸围尺寸
              </p>
              <div className="breath-measure-introduce1" />
              <div className="breath-measure-breath1" />
              <p className="breath-measure-text">
                <span className="breath-measure-title-text clear-margin">
                  上胸围：
                </span>
                用软尺紧贴着身体通过乳头的水平位置围上一圈
              </p>
              <p className="breath-measure-text middle-margin">
                <span className="breath-measure-title-text">罩杯尺寸=</span>
                上胸围尺寸-下胸围尺寸
              </p>
              <div className="breath-measure-introduce" />
              <p className="breath-measure-special-introduce">
                例如：你的上胸围为85cm，下胸围为75cm，那么你的胸围尺码为75B
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default connect()(withRouter(BreathMeasure))
