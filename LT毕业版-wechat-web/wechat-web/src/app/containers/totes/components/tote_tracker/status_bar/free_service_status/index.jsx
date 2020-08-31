import FreeServiceReturn from './free_service_return'

import './index.scss'

const FreeServiceStatus = ({ tote }) => {
  const data = tote.tote_free_service
  if (!data || !data.hint || !data.hint.tote_page_return_remind) return null

  const { type, message } = data.hint.tote_page_return_remind
  switch (type) {
    case 'undelivered':
    case 'scheduled_with_prev_tote':
      // case 'remitted_free_service_rent':
      return <FreeServiceTip message={message} />
    case 'ugently_return_free_service':
      return <FreeServiceOvertime />
    case 'return_free_service':
      return <FreeServiceReturn message={message} tote={tote} />
    default:
      return null
  }
}

const FreeServiceOvertime = () => {
  return (
    <div className="free-service-overtime">
      <p className="message">
        <span className="free-service-icon">{'自在选'}</span>
        {'签收已超48小时，将会产生自在选租赁金，如需帮助请'}
        <a href="tel:4008070088" className="button">
          {'联系客服'}
        </a>
      </p>
    </div>
  )
}

const FreeServiceTip = ({ message }) => {
  return (
    <div className="free-service-tip">
      <p className="message">
        <span className="free-service-icon">{'自在选'}</span>
        {message}
      </p>
    </div>
  )
}

export default React.memo(FreeServiceStatus)
