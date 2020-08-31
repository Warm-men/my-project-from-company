import { SHAPE_UTILS, SHAPE_SHOW } from 'src/app/containers/onboarding/size.js'
import Previous from './images/previous.png'
import Actions from 'src/app/actions/actions.js'

class ShapeSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isRating: false
    }
  }

  handleLeft = () => {
    const { changeShape } = this.props
    let { shape } = this.props
    this.index = _.findIndex(SHAPE_SHOW, value => value === shape)
    shape =
      this.index === 0
        ? SHAPE_SHOW[SHAPE_SHOW.length - 1]
        : SHAPE_SHOW[this.index - 1]
    changeShape && changeShape(shape)
  }

  handleRight = () => {
    const { changeShape } = this.props
    let { shape } = this.props
    this.index = _.findIndex(SHAPE_SHOW, value => value === shape)
    shape =
      this.index === SHAPE_SHOW.length - 1
        ? SHAPE_SHOW[0]
        : SHAPE_SHOW[this.index + 1]
    changeShape && changeShape(shape)
  }

  handleClick = () => {
    if (this.state.isRating) {
      const { dispatch, shape } = this.props
      dispatch(
        Actions.customerStyleInfo.updateUserDataAction({
          data: {
            style: {
              shape
            }
          }
        })
      )
    }
    this.setState({
      isRating: !this.state.isRating
    })
  }

  render() {
    const { isRating } = this.state
    const { shape } = this.props
    return (
      <div className="shape-select-box">
        <div className="shape-select">
          {isRating && (
            <img
              onClick={this.handleLeft}
              src={Previous}
              className="select-icon"
              alt=""
            />
          )}
          <span className="select-text">{SHAPE_UTILS[shape]}</span>
          {isRating && (
            <img
              onClick={this.handleRight}
              src={Previous}
              className="select-icon next"
              alt=""
            />
          )}
        </div>
        <span
          className={isRating ? 'select-btn active' : 'select-btn'}
          onClick={this.handleClick}
        >
          {isRating ? '保存' : '修改'}
        </span>
      </div>
    )
  }
}

export default ShapeSelect
