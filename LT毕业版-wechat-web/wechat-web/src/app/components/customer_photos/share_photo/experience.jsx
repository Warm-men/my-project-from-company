import PropTypes from 'prop-types'
import './index.scss'

class Experience extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      content: props.content || '',
      currentSign: props.sign || ''
    }
    this.textareaMaxLength = props.textareaMaxLength || 120
    this.textInputRef = React.createRef()
    this.isPrevent = false
  }

  handleKeydown = e => {
    const position = this.getCursortPosition(this.textInputRef.current)
    const { currentSign } = this.state
    const isSelectSign = !_.isEmpty(currentSign)
    this.key = e.keyCode
    if (isSelectSign && position < currentSign.length) {
      this.isPrevent = true
    } else {
      this.isPrevent = false
    }
  }

  currentContentAndSign = e => {
    if (this.isPrevent) {
      return null
    }
    const { currentSign } = this.state
    const isSelectSign = !_.isEmpty(currentSign)
    const textValue = e.currentTarget.value
    const { onChangeValue, updateSign, shareTopics } = this.props
    const currentValue = isSelectSign
      ? _.replace(textValue, currentSign, '')
      : textValue
    // NOTE：超过字数
    if (currentValue.length > this.textareaMaxLength) {
      return null
    }
    const signLength = isSelectSign
      ? currentSign.slice(0, currentSign.length - 1).length
      : 0
    // NOTE：当用户删除文字到sign
    if (textValue.length === signLength) {
      this.setState({ content: '', currentSign: '' })
      onChangeValue('')
      updateSign({ sign: '' })
    } else {
      this.setState({ content: currentValue })
      onChangeValue(currentValue)
      updateSign({ sign: isSelectSign ? shareTopics.title : '' })
    }
  }
  addSign = () => {
    const { currentSign, content } = this.state
    if (currentSign) {
      this.props.updateSign({ sign: '' })
      this.setState({
        currentSign: '',
        content: _.replace(content, currentSign, '')
      })
      return null
    }
    const {
      shareTopics: { title }
    } = this.props
    this.props.updateSign({ sign: title })
    this.setState({
      currentSign: title
    })
  }

  getCursortPosition(textDom) {
    let cursorPos = 0
    if (document.selection) {
      // IE Support
      textDom.focus()
      let selectRange = document.selection.createRange()
      selectRange.moveStart('character', -textDom.value.length)
      cursorPos = selectRange.text.length
    } else if (textDom.selectionStart || textDom.selectionStart === '0') {
      // Firefox support
      cursorPos = textDom.selectionStart
    }
    return cursorPos
  }

  render() {
    const { currentSign, content } = this.state
    const { share_incentive, shareTopics } = this.props
    const lest = content.length
    const placeholder =
      share_incentive && share_incentive.time_cash_amount > 0
        ? '写下你的搭配技巧与心得，被评为精选并推荐到首页后，你会获得5元奖励金'
        : '写下你的搭配技巧与心得'
    return (
      <div className="experience-container">
        <div className="text-box">
          <textarea
            ref={this.textInputRef}
            className="text-view"
            onChange={this.currentContentAndSign}
            value={currentSign + content}
            placeholder={placeholder}
            onKeyDown={this.handleKeydown}
          />
          <div className="textLength">{`${lest}/${this.textareaMaxLength}`}</div>
        </div>
        {!_.isEmpty(shareTopics.title) && (
          <div className="sign-box">
            <span className="sign-giude">
              {currentSign ? '已参与本期晒单活动' : '点击标签参与本期晒单活动'}
            </span>
            <span
              className={`sign-button ${
                currentSign ? 'sign-button-on' : 'sign-button-off'
              }`}
              onClick={this.addSign}
            >
              {shareTopics.title}
            </span>
          </div>
        )}
      </div>
    )
  }
}

Experience.propTypes = {
  onChangeValue: PropTypes.func.isRequired,
  shareTopics: PropTypes.object.isRequired,
  updateSign: PropTypes.func.isRequired
}
Experience.defaultProps = {
  onChangeValue: () => {},
  updateSign: () => {},
  shareTopics: {
    id: 1,
    title: '',
    url: 'https://',
    banner_img: 'https://'
  }
}

export default Experience
