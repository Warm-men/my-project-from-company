import { withRouter } from 'react-router'
import { miniProgramNavigate } from 'src/app/lib/miniProgram_navigate.js'
import { APPStatisticManager } from '../../../lib/statistics/app'

@withRouter
export default class OtherHomepageActivity extends React.PureComponent {
  handleClick = e => {
    APPStatisticManager.onClickElement({ element: e.target })
    const link = e.target.getAttribute('data-link')
    const { customer, trackType } = this.props
    !_.isEmpty(trackType) && window.adhoc('track', trackType, 1)
    if (_.includes(link, 'https://')) {
      let url = link
      if (!_.isEmpty(customer)) {
        url = `${link}${link.indexOf('?') > -1 ? '&' : '?'}customer_id=${
          customer.id
        }`
      }
      if (this.props.isMiniApp) {
        miniProgramNavigate(url)
      } else {
        window.location.href = url
      }
    } else {
      this.props.router.push(link)
    }
  }

  render() {
    const { title, activity } = this.props
    return (
      <div className="other-homepage-activity">
        <div className="title-box">
          <div className="title">
            <span className="title-border" />
            <span className="title-text">{title}</span>
            <span className="title-border" />
          </div>
        </div>
        <div className="activity-container">
          {_.map(activity, (v, k) => {
            return (
              <img
                className="activity-img"
                onClick={this.handleClick}
                data-link={v.link}
                alt=""
                src={v.logo}
                key={k}
              />
            )
          })}
        </div>
      </div>
    )
  }
}
