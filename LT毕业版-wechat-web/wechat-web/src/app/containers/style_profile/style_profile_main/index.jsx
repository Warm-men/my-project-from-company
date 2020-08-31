import PageHelmet from 'src/app/lib/pagehelmet'
import { browserHistory } from 'react-router'
import rightArrowURL from 'src/assets/images/account/next.png'
import 'src/assets/stylesheets/mobile/style_profile.scss'
import GeneralWxShareHOC from 'src/app/components/HOC/GeneralWxShare'

@GeneralWxShareHOC
export default class StyleProfileMain extends React.Component {
  clickQuiz = name => () => browserHistory.push(`/style_profile/${name}`)

  render() {
    return (
      <div className="style-profile-wrapper">
        <PageHelmet title={`风格档案`} link={`/style_profile`} />
        <div className="grap-border" />
        <div
          className="option-wrapper border-top"
          onClick={this.clickQuiz('figure_input')}
        >
          <div className="option-heading">
            <span className="option-heading-text">尺码</span>
            <img src={rightArrowURL} className="right-caret" alt="...img" />
          </div>
        </div>
        <div className="option-wrapper" onClick={this.clickQuiz('workplace')}>
          <div className="option-heading">
            <span className="option-heading-text">场合</span>
            <img src={rightArrowURL} className="right-caret" alt="...img" />
          </div>
        </div>
        <div className="option-wrapper" onClick={this.clickQuiz('style')}>
          <div className="option-heading">
            <span className="option-heading-text">喜欢</span>
            <img src={rightArrowURL} className="right-caret" alt="...img" />
          </div>
        </div>
        <div className="option-wrapper" onClick={this.clickQuiz('Filters')}>
          <div className="option-heading">
            <span className="option-heading-text">不喜欢</span>
            <img src={rightArrowURL} className="right-caret" alt="...img" />
          </div>
        </div>
      </div>
    )
  }
}
