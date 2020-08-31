import { connect } from 'react-redux'
import { useState } from 'react'
import ActionButton from 'src/app/components/shared/action_button/index'
import PageHelmet from 'src/app/lib/pagehelmet'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions.js'
import './index.scss'
import Closet from './closet'
import arrow from 'src/assets/images/arrow-size.png'

function mapStateToProps(state, props) {
  const { totes } = state
  const { toteId } = props.location.query
  let currentTote = _.find(totes.current_totes, v => v.id === Number(toteId))
  return { currentTote }
}
export default connect(mapStateToProps)(PerfectClosets)

function PerfectClosets(props) {
  const [perfectClosetIds, setPerfectClosetIds] = useState([])
  let isLoading = false

  const handleSubmit = () => {
    if (isLoading) return null
    isLoading = true
    const { dispatch, location } = props
    const { toteId } = location.query
    const variables = {
      input: {
        tote_product_ids: [...perfectClosetIds],
        tote_id: parseInt(toteId)
      }
    }
    dispatch(
      Actions.addPerfectClosets.mutatePerfectClosets(
        variables,
        handleSubmitSuccess,
        () => (isLoading = false)
      )
    )
  }

  const handleSubmitSuccess = () => {
    isLoading = false
    const { toteId } = props.location.query
    browserHistory.replace({
      pathname: '/schedule_return',
      query: { toteId }
    })
  }

  const updatePerfectClosetsIds = id => {
    let newPerfectClosetIds = [...perfectClosetIds]
    if (_.includes(perfectClosetIds, id)) {
      newPerfectClosetIds = _.filter(newPerfectClosetIds, item => item !== id)
    } else {
      newPerfectClosetIds.push(id)
    }
    setPerfectClosetIds(newPerfectClosetIds)
  }

  const handleNext = () => {
    if (_.isEmpty(perfectClosetIds)) {
      const tips = { isShow: true, content: '请先选择单品' }
      props.dispatch(Actions.tips.changeTips(tips))
    } else {
      handleSubmit()
    }
  }

  const { tote_products } = props.currentTote
  return (
    <div className="perfect-closet-view">
      <PageHelmet title="满分单品" link="/perfect_closets" />
      <div className="title-view">本次有特别喜欢且合身的服饰吗？</div>
      <div className="sub-title">收集后可在「愿望衣橱」查看 </div>
      <div className="closets-view">
        {_.map(tote_products, closet => {
          const isSelected = _.includes(perfectClosetIds, closet.id)
          return (
            <Closet
              key={closet.id}
              closet={closet}
              updatePerfectClosetsIds={updatePerfectClosetsIds}
              isSelected={isSelected}
              perfectClosetIds={perfectClosetIds}
            />
          )
        })}
      </div>
      <div className="tip-view bottom-button">
        {_.isEmpty(perfectClosetIds) ? (
          <div className="skip-view" onClick={handleSubmit}>
            没有，点击跳过
            <img src={arrow} alt="" className="arrow-right" />
          </div>
        ) : (
          <div className="tip-text">{`已找到${perfectClosetIds.length}款满分单品`}</div>
        )}
        <ActionButton size="stretch" onClick={handleNext}>
          确认
        </ActionButton>
      </div>
    </div>
  )
}
