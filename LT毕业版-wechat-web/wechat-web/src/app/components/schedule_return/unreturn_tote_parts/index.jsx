import './index.scss'

export default function UnreturnToteParts(props) {
  const { current, history } = props.message
  return (
    <div className="unreturn-tote-parts-content">
      {!_.isEmpty(current.product_parts) && (
        <UnreturnTotePartItem
          content={current}
          title={'归还衣箱时，请不要遗漏以下商品的配件，以免影响新衣箱发出'}
        />
      )}
      {!_.isEmpty(history.product_parts) && (
        <UnreturnTotePartItem
          content={history}
          title={'之前衣箱遗留商品配件'}
          hasBorder={true}
        />
      )}
    </div>
  )
}

function UnreturnTotePartItem(props) {
  const { content, title, hasBorder } = props
  if (_.isEmpty(content)) return null
  return (
    <div className={`${hasBorder ? 'item-view' : ''}`}>
      <span className="top-content">{title}</span>
      <ul className="title-list">
        {_.map(content.product_parts, (parts, key) => {
          return (
            <li key={key} className={'list-row'}>
              <span className={'icon-title'}>
                &bull;{` ${parts.product_title}`}
              </span>
              <span className={'icon-list'}>
                {_.map(parts.part_titles, (value, key) => {
                  return (
                    <span key={key} className={'parts-icon'}>
                      {value}
                    </span>
                  )
                })}
              </span>
            </li>
          )
        })}
        {!!content.bag_tips && (
          <li className={'list-row'}>
            <span className={'icon-title fix-ellipsis'}>
              {'* '}
              {` ${content.bag_tips}`}
            </span>
          </li>
        )}
      </ul>
    </div>
  )
}
