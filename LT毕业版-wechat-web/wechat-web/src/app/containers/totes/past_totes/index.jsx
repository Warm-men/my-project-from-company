import PastTote from './individual_past_tote'
import { browserHistory } from 'react-router'

import './index.scss'

const onClick = () => browserHistory.push('/past_totes_list')
const numColumns = 1

export default React.memo(({ totes, dispatch }) => {
  if (_.isEmpty(totes) || _.isEmpty(totes.past_totes)) return null

  const data = totes.past_totes[0]
  const hasMore = totes.past_totes.length > numColumns

  return (
    <div className="past-tote-container">
      <div className="my-totes-section-header">历史衣箱</div>
      <PastTote tote={data} dispatch={dispatch} />
      {hasMore ? (
        <div className="show-more-past-tote-button" onClick={onClick}>
          查看全部历史衣箱
          <span className="arrow" />
        </div>
      ) : null}
    </div>
  )
})
