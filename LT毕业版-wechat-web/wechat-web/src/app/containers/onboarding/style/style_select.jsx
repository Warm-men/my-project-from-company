import './index.scss'

export default class Item extends React.Component {
  onClick = () => {
    const { handleClick, data } = this.props
    handleClick && handleClick(data.value)
  }

  render() {
    const { data, active } = this.props
    const { src, title } = data
    const className = active ? 'style-select-box active' : 'style-select-box'
    return (
      <div className={className} onClick={this.onClick}>
        <img src={src} alt={title} />
        <span className="style-title">{title}</span>
        {active ? (
          <img
            className="active-icon"
            src={require('./images/active.png')}
            alt={'active'}
          />
        ) : null}
      </div>
    )
  }
}
