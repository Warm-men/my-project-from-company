import { withRouter, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import Hold from './hold.jsx'
import Actions from 'src/app/actions/actions.js'
import { useState } from 'react'
import 'src/assets/stylesheets/components/profile.scss'

function mapStateToProps(state) {
  return {
    customer: state.customer,
    isSubmitting: state.app.subscription.isSubmitting
  }
}

function HoldContainer(props) {
  const [selectedComment, setSelectedComment] = useState(undefined)
  const [selectedDays, setSelectedDays] = useState(undefined)
  const [visible, setVisible] = useState(false)
  const [select_date, setSelectDate] = useState(null)

  const holdComments = {
    save_money: '暂时不需要用',
    move: '我搬家了',
    pregnancy: '我怀孕了',
    no_need: '我的衣服已经够多了',
    vacation: '我要去度假',
    job_change: '我换了工作',
    selection: '我不喜欢现在的衣服'
  }

  const changeHoldComment = event => {
    setSelectedComment(event.target.getAttribute('data-comment'))
  }

  const validTime = time => {
    const timerReg = new RegExp(/[\u4e00-\u9fa5]/g)
    let selectDate = time.replace(timerReg, '-')
    selectDate = selectDate.substring(0, selectDate.length - 1)
    return new Date(selectDate)
  }

  const holdSuccess = () => {
    props.dispatch(Actions.currentCustomer.fetchMe(handleHoldSuccess))
  }

  const goOnHold = () => {
    if (props.isSubmitting || !isValidData()) return
    const toDate = validTime(select_date)
    const data = {
      subscription_id: parseInt(props.customer.subscription.id, 10),
      comment: selectedComment,
      to_date: toDate
    }
    props.dispatch(Actions.subscription.hold(data, holdSuccess))
  }

  const handleHoldSuccess = (dispatch, res) => {
    const { me } = res.data
    if (me.subscription.status === 'pending_hold') {
      browserHistory.replace('/hold_success')
    } else {
      browserHistory.replace(`/membershiponhold`)
    }
  }

  const isValidData = () => selectedComment && selectedDays

  const handleSelectDate = () => setVisible(true)

  const onCancel = () => setVisible(false)

  const onConfirm = (date, index) => {
    setVisible(false)
    setSelectDate(date[0])
    setSelectedDays(index + 1)
  }

  const selectHoldDays = (date, index) => {
    setSelectDate(date[0])
    setSelectedDays(index + 1)
  }

  return (
    <Hold
      isSubmitting={props.isSubmitting}
      selectHoldDays={selectHoldDays}
      handleSelectDate={handleSelectDate}
      visible={visible}
      onConfirm={onConfirm}
      onCancel={onCancel}
      goOnHold={goOnHold}
      changeHoldComment={changeHoldComment}
      comments={holdComments}
      selectedComment={selectedComment}
      selectedDays={selectedDays}
      isEnabled={isValidData()}
      select_date={select_date}
    />
  )
}

export default connect(mapStateToProps)(withRouter(HoldContainer))
