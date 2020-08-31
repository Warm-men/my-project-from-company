import './index.scss'

class OnboardingTitle extends React.PureComponent {
  render() {
    const { title, text } = this.props
    return (
      <div className="onboarding-title-box">
        <p className="onboarding-title">{title}</p>
        <div className="onboarding-border" />
        <p className="onboarding-text">{text}</p>
      </div>
    )
  }
}

export default OnboardingTitle
