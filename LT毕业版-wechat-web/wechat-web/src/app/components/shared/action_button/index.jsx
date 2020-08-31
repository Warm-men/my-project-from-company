import { Link } from 'react-router'
import PropTypes from 'prop-types'
import 'src/assets/stylesheets/components/action_button.scss'

const ActionButton = ({
  actionType,
  children,
  className,
  disabled,
  href,
  processing,
  shape,
  size,
  stepsCompleted,
  stepsCompletedText,
  stepsTotal,
  style,
  to,
  ...rest
}) => {
  let Element

  if (to) {
    Element = Link
  } else if (href) {
    Element = 'a'
  } else {
    Element = 'button'
  }

  let classNames = `action-button-component ${actionType} ${size} ${shape} ${className}`
  if (processing) classNames = `${classNames} processing`

  const body =
    stepsCompletedText && stepsCompleted >= stepsTotal
      ? stepsCompletedText
      : children
  const inlineStyle = { ...style }
  const incomplete = stepsCompleted < stepsTotal
  if (stepsTotal) {
    classNames = `${classNames} steps`

    if (incomplete) {
      const percentPerStep = 100 / stepsTotal
      const percentComplete = percentPerStep * stepsCompleted
      const percentRemaining = 100 - percentComplete
      inlineStyle.backgroundPositionX = `${percentRemaining}%`
    }
  }

  return (
    <Element
      className={classNames}
      disabled={disabled || processing || incomplete}
      href={href}
      style={inlineStyle}
      to={to}
      {...rest}
    >
      {body}
    </Element>
  )
}

ActionButton.propTypes = {
  actionType: PropTypes.oneOf(['primary', 'secondary', 'gold']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  decoration: PropTypes.oneOf(['lock', 'heart-filled', 'heart-empty', null]),
  disabled: PropTypes.bool,
  href: PropTypes.string,
  processing: PropTypes.bool,
  shape: PropTypes.oneOf(['rectangle', 'rounded']),
  size: PropTypes.oneOf(['stretch', 'large', 'small', 'smallest']),
  stepsCompleted: PropTypes.number,
  stepsCompletedText: PropTypes.string,
  stepsTotal: PropTypes.number,
  style: PropTypes.object,
  to: PropTypes.string
}

ActionButton.defaultProps = {
  actionType: 'primary',
  className: '',
  disabled: false,
  decoration: null,
  href: null,
  processing: false,
  shape: 'rectangle',
  size: 'large',
  stepsCompleted: 0,
  stepsCompletedText: null,
  stepsTotal: 0,
  style: {},
  to: null
}

export default ActionButton
