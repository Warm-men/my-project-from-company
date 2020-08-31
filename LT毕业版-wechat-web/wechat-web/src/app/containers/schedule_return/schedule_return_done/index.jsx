import '../index.scss'
import Actions from 'src/app/actions/actions.js'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import { connect } from 'react-redux'
import done_img from 'src/app/containers/schedule_return/images/done.png'
import done_banner from 'src/app/containers/schedule_return/images/done_banner.png'

function ScheduleReturnDone(props) {
  const { dispatch, location } = props
  const { tote_id } = location.query
  const gotoRating = async () => {
    await dispatch(Actions.ratings.setRatingToteId(tote_id))
    sessionStorage.setItem('RatingsToteId', tote_id)
    browserHistory.replace({ pathname: '/rating_products' })
  }

  const backTote = () => {
    browserHistory.replace('/totes')
  }
  return (
    <div className="schedule-return-done-modal">
      <PageHelmet title="预约完成" link="/schedule_return_done" />
      <div className="top-view">
        <img className="done-img" src={done_img} alt="" />
        <div className="done-text">预约归还成功</div>
      </div>
      <div className="banner-view" onClick={gotoRating}>
        <img src={done_banner} className="done-banner" alt="" />
      </div>
      <div className="back-view" onClick={backTote}>
        返回衣箱
      </div>
    </div>
  )
}
export default connect()(ScheduleReturnDone)
