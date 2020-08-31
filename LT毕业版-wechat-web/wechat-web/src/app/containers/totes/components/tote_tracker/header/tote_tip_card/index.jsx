import './index.scss'

const ToteTipCard = ({ type, message }) => {
  if (!message || !type) return null

  return (
    <div className="tote-tips-card">
      {type === 'PULL_TOTE' ? (
        <div className="pull-message">
          <span className="icon">i</span>
          {message}
        </div>
      ) : null}
      {type === 'REITTED_FREE_SERVICE_RENT' ? (
        <div className="message">
          <span className="free-service-icon">{'自在选'}</span>
          {message}
        </div>
      ) : null}
    </div>
  )
}

export default React.memo(ToteTipCard)
