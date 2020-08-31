import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import Actions from 'src/app/actions/actions'
import ActionButtons from 'src/app/containers/onboarding/utils_component/action_buttons'
import InputTextarea from 'src/app/containers/ratings/rating_products/comment_textarea.jsx'
import Alert from 'src/app/components/alert'
import * as storage from 'src/app/lib/storage.js'
import './index.scss'

class UnSatisfied extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectList: []
    }
    this.unSatisfied = [
      ['商品款式不喜欢', '商品风格不喜欢'],
      ['商品质量不满意', '商品品牌不喜欢'],
      ['商品经常缺货', '符合我尺码的商品少'],
      ['挑选商品不便利', '寄还衣箱麻烦'],
      ['包月价格太贵', '售后服务差'],
      ['无频繁换装需求', '担忧洗衣问题'],
      ['不接受共享服装', '个人原因']
    ]
  }

  componentWillReceiveProps(nextProps) {
    const { showSelect } = this.props
    if (nextProps.showSelect !== showSelect) {
      this.setState({
        selectList: []
      })
    }
  }

  handleSelect = value => () => {
    const selectList = [...this.state.selectList]
    const index = selectList.findIndex(v => v === value)
    if (index >= 0) {
      selectList.splice(index, 1)
    } else {
      selectList.push(value)
    }
    this.setState({
      selectList
    })
    this.props.changeSubmitData(selectList)
  }

  render() {
    const { showSelect, handleSelectList } = this.props
    const { selectList } = this.state
    return (
      <div className="cancel-description">
        <span
          className={`desc-btn ${showSelect === 'Satisfied' ? 'active' : ''}`}
          onClick={handleSelectList('Satisfied')}
        >
          不打算续费使用了
        </span>
        <div className={showSelect === 'Satisfied' ? 'desc-box' : 'hidden'}>
          {this.unSatisfied.map((list, key) => (
            <div className="desc-content" key={key}>
              {list.map((value, index) => {
                return (
                  <span
                    className={
                      _.includes(selectList, value) ? 'text active' : 'text'
                    }
                    key={index}
                    onClick={this.handleSelect(value)}
                  >
                    {value}
                  </span>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

class OnHold extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectList: null
    }
    this.onHold = [
      '要出门（出差、旅行等）',
      '最近衣服多，没需求',
      '最近没喜欢的衣服'
    ]
  }

  componentWillReceiveProps(nextProps) {
    const { showSelect } = this.props
    if (nextProps.showSelect !== showSelect) {
      this.setState({
        selectList: null
      })
    }
  }

  handleSelect = value => () => {
    this.setState({
      selectList: value
    })
    this.props.changeSubmitData([value])
  }

  render() {
    const { showSelect, handleSelectList } = this.props
    const { selectList } = this.state
    return (
      <div className="cancel-description">
        <span
          className={`desc-btn ${showSelect === 'onHold' ? 'active' : ''}`}
          onClick={handleSelectList('onHold')}
        >
          想要暂停使用一段时间
        </span>
        <div className={showSelect === 'onHold' ? 'desc-box' : 'hidden'}>
          <span className="text-title">
            你可以选择暂停会员期，不浪费会员期哦～
          </span>
          {this.onHold.map((value, key) => {
            return (
              <div className="desc-content" key={key}>
                <span
                  className={selectList === value ? 'text active' : 'text'}
                  onClick={this.handleSelect(value)}
                >
                  {value}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    customer: state.customer
  }
}
@connect(mapStateToProps)
export default class CancelFreePassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSubmit: false,
      showSelect: null,
      errorsAlert: false,
      submitData: []
    }
  }

  handleSelectList = type => () => {
    if (type === 'close') {
      this.setState({
        showSelect: type === this.state.showSelect ? null : type,
        submitData: ['仍会续费，只想关闭功能']
      })
    } else {
      this.setState({
        showSelect: type === this.state.showSelect ? null : type,
        submitData: []
      })
    }
  }

  getUserComment = value => {
    this.setState({
      submitData: [value]
    })
  }

  changeSubmitData = data => {
    this.setState({
      submitData: data
    })
  }

  hanldeDisable = () => {
    const { enable_payment_contract } = this.props.customer
    const { id } = enable_payment_contract[0]
    const { submitData } = this.state
    let remark = ''
    submitData.map((v, k) => {
      if (k === 0) {
        remark = v
      } else {
        remark += `,${v}`
      }
      return null
    })
    this.props.dispatch(
      Actions.freePassword.disableUserContract(
        {
          payment_contract_id: id,
          contract_termination_remark: remark
        },
        this.handelDisableSuccess
      )
    )
  }

  handelDisableSuccess = (dispatch, data) => {
    const { errors } = data.data.DisableCustomerContract
    if (errors && errors.length > 0) {
      this.setState({
        errorsAlert: true,
        errorsContent: errors[0]
      })
    } else {
      storage.set('DisableContract', true, localStorage)
      setTimeout(() => {
        browserHistory.goBack()
      }, 100)
    }
  }

  hideErrorsAlert = () => {
    this.setState({
      errorsAlert: false,
      errorsContent: null
    })
  }

  onSubmit = () => {
    this.setState(
      {
        isSubmit: true
      },
      this.hanldeDisable
    )
  }

  render() {
    const { showSelect, errorsAlert } = this.state
    return (
      <div className="cancel-free-password container-box">
        <PageHelmet title="取消免密支付" link="/membership" />
        <img src={require('./images/cancel_banner.png')} alt="" />
        <h4 className="title">造成你想要取消“免密支付”的原因是？</h4>
        <UnSatisfied
          showSelect={showSelect}
          handleSelectList={this.handleSelectList}
          changeSubmitData={this.changeSubmitData}
        />
        <div className="cancel-description">
          <span
            className={`desc-btn ${showSelect === 'close' ? 'active' : ''}`}
            onClick={this.handleSelectList('close')}
          >
            仍会续费，只想关闭功能
          </span>
        </div>
        <OnHold
          showSelect={showSelect}
          handleSelectList={this.handleSelectList}
          changeSubmitData={this.changeSubmitData}
        />
        <div className="cancel-description">
          <span
            className={`desc-btn ${showSelect === 'comment' ? 'active' : ''}`}
            onClick={this.handleSelectList('comment')}
          >
            其他原因
          </span>
          <div
            className={
              showSelect === 'comment' ? 'desc-box comment-box' : 'hidden'
            }
          >
            {showSelect === 'comment' && (
              <InputTextarea
                handleComment={this.getUserComment}
                placeholder="告诉我们取消免密支付的原因，我们会做得更好"
              />
            )}
          </div>
        </div>
        {errorsAlert && (
          <Alert
            content={this.state.errorsContent}
            btnText="好的"
            handleClick={this.hideErrorsAlert}
          />
        )}
        <ActionButtons
          leftText="取消"
          rightText="确认提交"
          isSubmiting={this.state.isSubmit}
          rightDisabled={_.isEmpty(this.state.submitData)}
          nextStep={this.onSubmit}
        />
      </div>
    )
  }
}
