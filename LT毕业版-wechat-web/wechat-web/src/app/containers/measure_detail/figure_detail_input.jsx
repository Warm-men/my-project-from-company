import { browserHistory } from 'react-router'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import calculateSize from 'src/app/lib/calculate_size'
import Actions from 'src/app/actions/actions.js'
// import ArrowGray from 'src/assets/images/arrow_gray.png'
import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import ActionButton from 'src/app/components/shared/action_button/index'
import PageHelmet from 'src/app/lib/pagehelmet'
import SelectSize from 'src/app/containers/product/sizechart/select_size'
import MeasurementPicker from 'src/app/components/MeasurementPicker'
import { SIZE_LIMIT } from 'src/app/containers/product/sizechart/utils'
import { FULL_DRESS_SIZE } from 'src/app/containers/onboarding/size.js'
import './index.scss'
import 'src/assets/stylesheets/mobile/style_profile.scss'

class FigureDetailInput extends React.Component {
  constructor(props) {
    super(props)
    this.newStyle = props.style
    const { state } = props.router.location,
      inputStyle = state.inputStyle
    _.mapValues(inputStyle, (v, k) => {
      if (!v) {
        delete inputStyle[k]
      }
    })
    this.state = {
      style: { ...this.newStyle, ...inputStyle },
      isShow: false
    }
    this.inputList = [
      {
        title: '身高',
        unit: 'cm',
        type: 'height_inches',
        required: true
      },
      {
        title: '体重',
        unit: 'kg',
        type: 'weight',
        required: true
      },
      {
        title: '胸围',
        unit: '',
        type: 'bra_cup',
        required: true
      },
      {
        title: '肩宽',
        unit: 'cm',
        type: 'shoulder_size'
      },
      {
        title: '腰围',
        unit: 'cm',
        type: 'waist_size'
      },
      {
        title: '臀围',
        unit: 'cm',
        type: 'hip_size_inches'
      },
      {
        title: '内腿长',
        unit: 'cm',
        type: 'inseam'
      }
    ]
  }

  handleValidSubmit = () => {
    const { style } = this.state
    if (
      !style.height_inches ||
      !style.weight ||
      !style.bra_size ||
      !style.cup_size
    ) {
      this.props.dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: `填写必填项才能推荐尺码哦`
        })
      )
    } else {
      this.handleRecommend()
    }
  }

  handleRecommend = () => {
    const { style } = this.state
    let newStyle = {
      height_inches: style.height_inches,
      weight: style.weight,
      bra_size: style.bra_size,
      cup_size: style.cup_size,
      inseam: style.inseam,
      waist_size: style.waist_size,
      shoulder_size: style.shoulder_size,
      hip_size_inches: style.hip_size_inches
    }
    _.mapValues(newStyle, (v, k) => {
      if (!v) {
        delete newStyle[k]
      }
    })
    // NOTE:用户的KG体重转为斤
    const userWeight = newStyle.weight * 2
    const trackData = {
      height_inches: newStyle.height_inches,
      weight: newStyle.weight,
      bra_size: newStyle.bra_size,
      cup_size: newStyle.cup_size
    }
    const userCalSize = calculateSize(
      newStyle.height_inches,
      userWeight,
      trackData
    )
    const dress_size = FULL_DRESS_SIZE[userCalSize]
    const top_size = userCalSize
    this.props.dispatch(
      Actions.customerStyleInfo.updateUserDataAction({
        data: {
          style: { ...newStyle, dress_size, top_size }
        },
        success: this.handleActiveProductSuccess
      })
    )
  }

  handleActiveProductSuccess = () => {
    const { state } = this.props.router.location
    state &&
      browserHistory.replace({
        pathname: state.redirectUrl,
        state
      })
  }

  gotoMeasureDetail = () => browserHistory.push('/measure_detail')

  handleSelectChange = e => {
    let { style } = this.state,
      newValue = parseInt(e.target.value, 10)
    style[e.target.getAttribute('data-index')] = newValue
    this.setState({
      style
    })
  }

  handleConfirmMeasurement = (brasize, cupsize) => {
    let { style } = this.state
    style.bra_size = parseInt(brasize, 10)
    style.cup_size = cupsize
    this.setState(
      {
        style
      },
      this.hideMeasureModal
    )
  }

  showMeasureModal = () =>
    this.setState({
      isShow: true
    })

  hideMeasureModal = () =>
    this.setState({
      isShow: false
    })

  render() {
    const { style } = this.state
    return (
      <div className="quiz-wrapper">
        <PageHelmet title={'填写尺码'} link={`/figure_detail_input`} />
        <h5 className="figure-detail-tips">
          <span className="tips-icon">*</span>Tips：身高、体重、胸围为必填项
        </h5>
        <div className="figure-detail-container">
          <div className="figure-detail-img" />
          <div className="figure-detail-ipuut">
            {this.inputList.map((v, k) => {
              return (
                <div key={k} className="input-row">
                  <span className="title">
                    {v.title}
                    {v.required && <span className="tips-icon">*</span>}
                  </span>
                  {v.type === 'bra_cup' ? (
                    <span className="input-box" onClick={this.showMeasureModal}>
                      <span className="input-box-barcup">
                        {style['bra_size']
                          ? `${style['bra_size']} ${style['cup_size']}`
                          : '请选择'}
                      </span>
                      <MeasurementPicker
                        defaultValue={[75, 'B']}
                        onConfirm={this.handleConfirmMeasurement}
                        onCancel={this.hideMeasureModal}
                        visible={this.state.isShow}
                      />
                    </span>
                  ) : (
                    <span className="input-box">
                      <SelectSize
                        key={k}
                        dataIndex={v.type}
                        value={style[v.type] || ''}
                        className="detail-input"
                        handleChange={this.handleSelectChange}
                        minLimit={SIZE_LIMIT[v.type].min}
                        maxLimit={SIZE_LIMIT[v.type].max}
                        unit={v.unit}
                      />
                    </span>
                  )}
                </div>
              )
            })}
            {/* <p
              className="measure-detail-tips-text textLeft"
              onClick={this.gotoMeasureDetail}
            >
              详细测量教程<img src={ArrowGray} alt="" />
            </p> */}
          </div>
        </div>
        <StickyButtonContainer>
          <ActionButton size="stretch" onClick={this.handleValidSubmit}>
            立即推荐
          </ActionButton>
        </StickyButtonContainer>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { customer } = state
  return {
    customer_id: customer.id,
    style: customer.style
  }
}

export default connect(mapStateToProps)(withRouter(FigureDetailInput))
