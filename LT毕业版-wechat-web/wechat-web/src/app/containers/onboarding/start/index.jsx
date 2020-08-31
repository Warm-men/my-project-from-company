import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import './index.scss'

class OnboardingStart extends React.PureComponent {
  handleClick = () => browserHistory.push('/get-started/basic_data')

  render() {
    return (
      <div className="onboarding-start">
        <PageHelmet title={'衣箱'} link="/get-started/start" />
        <img
          className="logo"
          src={require('./images/letote.png')}
          alt={'letote'}
        />
        <div className="line" />
        <span className="title">创建你的第一个衣箱</span>
        <span className="sub-title">
          根据你的身材和偏好为你智能推荐衣箱服饰
        </span>
        <img
          className="image"
          src={require('./images/onboarding_start.png')}
          alt={'icon'}
        />
        <span className="start-btn" onClick={this.handleClick}>
          立即开始
        </span>
      </div>
    )
  }
}

export default OnboardingStart
