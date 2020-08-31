import SuoFang from './images/suofang.png'
import ZhanKai from './images/zhankai.png'
import ProgressiveImage from 'src/app/components/ProgressiveImage'
import { placeholder_690_279 } from 'src/assets/placeholder'
import './index.scss'

class MeaSureInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showInfo: false
    }
  }

  handleClick = () => {
    this.setState({
      showInfo: !this.state.showInfo
    })
  }

  render() {
    const { title, imgSrc, text } = this.props
    const { showInfo } = this.state
    return (
      <div className="measure-detail-container">
        <div
          className={
            !showInfo ? 'measure-detail-row row-border' : 'measure-detail-row'
          }
        >
          <h4 className="row-title">
            <span>{title}</span>
            <span onClick={this.handleClick}>
              <img alt="" src={showInfo ? SuoFang : ZhanKai} />
            </span>
          </h4>
          {showInfo && (
            <div className="row-img">
              <ProgressiveImage src={imgSrc} placeholder={placeholder_690_279}>
                {image => (
                  <img
                    alt=""
                    src={image}
                    className="theme-banner"
                    onClick={this.handleClick}
                  />
                )}
              </ProgressiveImage>
              <p>{text}</p>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default MeaSureInfo
