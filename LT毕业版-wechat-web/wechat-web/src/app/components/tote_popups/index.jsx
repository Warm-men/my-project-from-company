import PreventScroll from 'src/app/components/HOC/PreventScroll'
import { browserHistory } from 'react-router'
import './index.scss'

export default class TotePopups extends React.Component {
  handleClick = () => {
    this.props.closePopups && this.props.closePopups()
    this.goToNextPage()
  }

  goToNextPage = () => {
    const { floatHover } = this.props.app
    if (floatHover.url.match('https:')) {
      window.location.href = floatHover.url
      return null
    }
    browserHistory.push(floatHover.url)
  }

  render() {
    const { floatHover, isPreventFloatHover } = this.props.app
    if (_.isEmpty(floatHover) || isPreventFloatHover) {
      return null
    }
    return (
      <div className="tote-popups">
        {floatHover.display_type === 'pop' ? (
          <AlertPopups
            goToNextPage={this.handleClick}
            closePopups={this.props.closePopups}
            image={floatHover.pop_image}
          />
        ) : (
          <FloatPopups
            goToNextPage={this.goToNextPage}
            floatHover={floatHover}
          />
        )}
      </div>
    )
  }
}

const AlertPopups = PreventScroll(({ closePopups, image, goToNextPage }) => {
  return (
    <div className="tote-popups-alert">
      <div className="tote-image-popups">
        <i className="tote-close-popups" onClick={closePopups} />
        <img src={image} className="tote-image" alt="popups" />
        <div className="tote-btn-popups" onClick={goToNextPage} />
      </div>
    </div>
  )
})

const FloatPopups = ({ goToNextPage, floatHover }) => {
  return (
    <div className="tote-popups-float" onClick={goToNextPage}>
      <img src={floatHover.float_image} className="float-image" alt="popups" />
    </div>
  )
}
