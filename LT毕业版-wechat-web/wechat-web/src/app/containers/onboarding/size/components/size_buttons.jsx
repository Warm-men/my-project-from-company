import PropTypes from 'prop-types'
import 'src/assets/stylesheets/components/shared/size/button.scss'
import '../index.scss'

const SizeButton = ({ active, children, onClick, value }) => (
  <span
    data-value={value}
    className={`btn btn-selectable ${active ? 'active' : ''}`}
    onClick={onClick}
  >
    {children}
  </span>
)

SizeButton.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func
}

SizeButton.defaultProps = {
  active: false,
  onClick: () => null
}

class SizeButtons extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { inputValue: props.defaultValue }
  }

  changeInput = e => {
    const { onChange, activeKey } = this.props
    let value = e.currentTarget.getAttribute('data-value')
    if (activeKey !== 'top_size') {
      value = parseInt(value, 10)
    }
    this.setState({ inputValue: value })
    onChange(value, activeKey)
  }

  render() {
    const { inputValue } = this.state
    const { options, title } = this.props
    const newOptinos = [options]
    return (
      <div className="size-select">
        {!_.isEmpty(title) && <p className="size-select-title">{title}</p>}
        {_.map(newOptinos, (options, index) => {
          return (
            <div key={index} className="size-select-box">
              {_.map(options, (v, k) => {
                const active = v.type === inputValue
                return (
                  <SizeButton
                    key={k}
                    value={v.type}
                    active={active}
                    onClick={this.changeInput}
                  >
                    {v.name}
                  </SizeButton>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }
}

SizeButtons.defaultProps = {
  defaultValue: '',
  placeholder: '请输入',
  title: ''
}

export default SizeButtons
