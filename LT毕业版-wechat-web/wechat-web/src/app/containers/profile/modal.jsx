import classnames from 'classnames'
class Modal extends React.PureComponent {
  componentDidMount() {
    document.addEventListener('keyup', this.closeOnEscape)
    document.documentElement.className = 'modal-open'
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.closeOnEscape)
    document.documentElement.className = ''
  }

  closeOnEscape = e => e.keyCode === 27 && this.props.close()

  handleClick = () => {
    typeof this.props.back === 'function'
      ? this.props.back()
      : this.props.close()
  }

  render() {
    const { title, showBackArrow, children, className, doubleWide } = this.props

    const classname = classnames(
      'profile-modal',
      {
        'profile-modal-double-wide': doubleWide
      },
      className
    )
    return (
      <div className="profile-modal-container" onClick={this.props.close}>
        <div className={classname} onClick={e => e.stopPropagation()}>
          <div className="profile-modal-header">
            <div
              onClick={this.handleClick}
              className={`${
                showBackArrow
                  ? 'profile-modal-back-arrow'
                  : 'profile-modal-close'
              }`}
            />
            <h3>{title}</h3>
          </div>
          <div className="profile-modal-body">{children}</div>
        </div>
      </div>
    )
  }
}

export default Modal
