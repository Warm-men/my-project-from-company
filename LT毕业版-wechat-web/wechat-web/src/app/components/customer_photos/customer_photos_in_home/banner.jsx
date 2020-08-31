import PropTypes from 'prop-types'
import './index.scss'
import { differenceInDays } from 'date-fns'

class CustomerPhotosInHomeBanner extends React.PureComponent {
  closingDate = () => {
    const { shareTopics } = this.props
    const { ended_at } = !!shareTopics.length && shareTopics[0]
    const closingDate = differenceInDays(ended_at, new Date())
    let text = ''
    if (closingDate >= 0) {
      if (closingDate === 0) {
        text = '活动今天截止'
      } else {
        text = `剩余${closingDate}天`
      }
    } else {
      text = '活动已结束'
    }
    return text
  }

  bannerOnClick = () => (window.location.href = this.props.shareTopics[0].url)

  render() {
    const { shareTopics, isJdEnv } = this.props
    const { title, banner_img } = !!shareTopics.length && shareTopics[0]
    const closingDate = this.closingDate()
    return (
      <div className="banner-container">
        <div className="title-box">
          <div className="title">
            <span className="title-border" />
            <span className="title-text">精选晒单</span>
            <span className="title-border" />
          </div>
          <div className="title-img">OUTFIT INSPIRATION</div>
        </div>
        {!!banner_img && !isJdEnv && (
          <div className="wrapper-view" onClick={this.bannerOnClick}>
            <img src={banner_img} alt="" className="banner-img" />
            <div className="content-view">
              <p className="content-view-title">{title}</p>
              <span className="content-view-closing-date">{closingDate}</span>
            </div>
          </div>
        )}
      </div>
    )
  }
}

CustomerPhotosInHomeBanner.propTypes = {
  shareTopics: PropTypes.array.isRequired,
  onClickBanner: PropTypes.func.isRequired
}

CustomerPhotosInHomeBanner.defaultProps = {
  shareTopics: [
    {
      title: '',
      ended_at: new Date(),
      banner_img: 'https://',
      url: 'https://'
    }
  ],
  onClickBanner: () => {}
}

export default CustomerPhotosInHomeBanner
