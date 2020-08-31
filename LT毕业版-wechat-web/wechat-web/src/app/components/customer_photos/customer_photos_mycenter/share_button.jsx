import { browserHistory } from 'react-router'
import * as storage from 'src/app/lib/storage.js'

const ShareButton = React.memo(() => {
  const handleShareClick = () => {
    const url = '/share_list'
    storage.set(url, 0)
    browserHistory.push(url)
  }

  return (
    <div className="go-share-btn">
      <div className="btn-content" onClick={handleShareClick}>
        <span className="btn-text">去晒单</span>
      </div>
    </div>
  )
})

export default ShareButton
