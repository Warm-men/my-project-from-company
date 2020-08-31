import { format } from 'date-fns'

const isValidTel = new RegExp(
  /((1\d{10})|(\d{7,8})|(\d{3,4}-\d{7,8})|(\d{3,4}-\d{7,8}-\d{1,4})|(\d{7,8}-\d{1,4}))/g
)

const formatText = msg => {
  let newTel = msg
  const tel = msg.match(isValidTel)
  if (tel && tel.length > 0) {
    _.map(tel, value => {
      newTel = newTel.replace(value, `<a href="tel:${value}">${value}</a>`)
      return null
    })
  }
  return <span dangerouslySetInnerHTML={{ __html: newTel }} />
}

export default React.memo(({ value, index }) =>
  _.isEmpty(value) ? null : (
    <div className="express-info">
      <div className={`default-info ${index === 0 ? 'active' : ''}`} />
      {!_.isEmpty(value.carrier_updated_at) && (
        <span className="express-info-head">
          {format(value.carrier_updated_at, 'YYYY.MM.DD HH:mm:ss')}
        </span>
      )}
      {!_.isEmpty(value.carrier_message) && (
        <p className="express-info-text">{formatText(value.carrier_message)}</p>
      )}
    </div>
  )
)
