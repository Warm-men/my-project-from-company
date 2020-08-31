import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import ActionButton from 'src/app/components/shared/action_button/index'
import { browserHistory } from 'react-router'
import './index.scss'

class ActionButtons extends React.PureComponent {
  handlePreviousStep = () => {
    const { previousStep } = this.props
    if (previousStep) {
      previousStep()
    } else {
      browserHistory.goBack()
    }
  }

  render() {
    const {
      leftText,
      leftDisabled,
      rightText,
      rightDisabled,
      nextStep,
      isSubmiting,
      submintText
    } = this.props
    return (
      <StickyButtonContainer isSingle={true}>
        <ActionButton
          disabled={leftDisabled}
          className="left-btn"
          onClick={this.handlePreviousStep}
          size="stretch"
        >
          {leftText}
        </ActionButton>
        <ActionButton
          disabled={rightDisabled}
          className={isSubmiting ? 'right-btn submiting' : 'right-btn'}
          onClick={isSubmiting ? () => {} : nextStep}
          size="stretch"
        >
          {isSubmiting ? submintText : rightText}
        </ActionButton>
      </StickyButtonContainer>
    )
  }
}

ActionButtons.defaultProps = {
  leftText: '上一步',
  leftDisabled: false,
  rightText: '下一步',
  rightDisabled: false,
  submintText: '处理中',
  nextStep: () => {}
}

export default ActionButtons
