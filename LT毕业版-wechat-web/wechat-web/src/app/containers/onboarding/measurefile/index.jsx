import DataTitle from 'src/app/containers/onboarding/utils_component/data_title'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import ActionButtons from 'src/app/containers/onboarding/utils_component/action_buttons'
import PageHelmet from 'src/app/lib/pagehelmet'
import './index.scss'
import { MEASURE_OPTIONS } from './utils'

class MeasureFile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShow: false,
      isSubmiting: false
    }
    this.index = _.findIndex(
      props.onboarding.routerList,
      path => props.location.pathname === `/get-started/${path}`
    )
  }

  onSubmit = () => {
    this.setState(
      {
        isSubmit: true
      },
      () => {
        const { routerList } = this.props.onboarding
        browserHistory.push(`/get-started/${routerList[this.index + 1]}`)
      }
    )
  }

  gotoMeasure = () => browserHistory.push(`/measure_detail`)

  getUserSizeImg = () => {
    const { shape } = this.props.customer.style
    if (shape) {
      return require(`src/app/containers/onboarding/measurefile/images/${shape}.png`)
    } else {
      return require(`src/app/containers/onboarding/measurefile/images/Hourglass.png`)
    }
  }

  handleSelect = type => () => browserHistory.push(`/select_size/${type}`)

  render() {
    const {
      onboarding: { routerList },
      customer: { style }
    } = this.props
    const { isSubmit } = this.state
    const pageNum = `${this.index + 1}/${routerList.length}`
    return (
      <div className="container-box">
        <PageHelmet
          title={`定制衣箱-${pageNum}`}
          link={this.props.location.pathname}
        />
        <DataTitle
          title="合身-测量档案"
          tips={pageNum}
          text="更准确的测量，可以让你不必再为挑选尺码而烦心"
        />
        <div className="measure-container">
          <div className="measure-left">
            <img src={this.getUserSizeImg()} alt="" />
          </div>
          <div className="measure-right">
            {MEASURE_OPTIONS.map(item => (
              <div className="select-input" key={item.type}>
                <span className="measure-title">{item.title}</span>
                <div
                  className="measure-input"
                  onClick={this.handleSelect(item.type)}
                >
                  {style[item.type] ? style[item.type] + 'cm' : '点击选择'}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* <p
          className="onboarding-tips-text small-text"
          onClick={this.gotoMeasure}
        >
          <img
            src={require('src/app/containers/onboarding/measurefile/images/attention.png')}
            className="attention"
            alt="attention"
          />
          <span>查看详细测量教程</span>
        </p> */}
        <p className="onboarding-tips-gray">
          第一个衣箱会附赠精美卷尺，如果暂时不确定，可点击下一步跳过
        </p>
        <ActionButtons isSubmiting={isSubmit} nextStep={this.onSubmit} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    onboarding: state.onboarding || {},
    customer: state.customer || {}
  }
}

export default connect(mapStateToProps)(MeasureFile)
