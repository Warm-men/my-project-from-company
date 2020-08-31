import { browserHistory } from 'react-router'
import * as storage from 'src/app/lib/storage'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions'

import React from 'react'

function mapStateToProps(state) {
  const { totes } = state
  return { currentTotes: totes.current_totes }
}

@connect(mapStateToProps)
export default class QuizContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.status = storage.get('isFromQuiz')
  }
  componentDidMount() {
    const { toteId, quizUrl, slug } = this.props.location.query
    if (this.status === null) {
      storage.set('isFromQuiz', true)
      window.location.href = quizUrl
      return
    }

    storage.remove('isFromQuiz')
    if (slug === 'QUIZSubscribeCancel' && toteId) {
      this.toteScheduleReturn(toteId)
    } else {
      window.location.href = window.location.origin + '/totes'
    }
  }

  toteScheduleReturn = async toteId => {
    const { dispatch, currentTotes } = this.props
    const tote = currentTotes.find(i => i.id.toString() === toteId)
    if (!tote) {
      browserHistory.goBack()
      return
    }
    const { id, tote_rating, skip_perfect_closet, perfect_closets } = tote

    if (!tote_rating) {
      await dispatch(Actions.ratings.resetRatingStore())
      await dispatch(Actions.ratings.setRatingToteId(id))
      storage.set('RatingsToteId', id)
      browserHistory.replace({ pathname: `/ratings` })
    } else {
      if (!_.isEmpty(perfect_closets) || skip_perfect_closet) {
        browserHistory.replace({
          pathname: `/schedule_return`,
          query: { toteId: id }
        })
      } else {
        browserHistory.replace({
          pathname: `/perfect_closets`,
          query: { toteId: id }
        })
      }
    }
  }

  render() {
    return <div />
  }
}
