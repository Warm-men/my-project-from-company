import RectangleLoader from 'src/app/containers/tote_swap/rectangle_loader'
import './index.scss'

export default React.memo(({ line_items, hadMakeAnAppointmentToReturn }) => {
  const length = hadMakeAnAppointmentToReturn.length + line_items.length
  return (
    <div className="payment-details-box">
      <div className="payment-details" style={{ width: (84 + 5) * length }}>
        {_.map(
          line_items,
          ({
            product: { id, catalogue_photos, full_price, parts },
            amount
          }) => (
            <div className="product-list-box" key={id}>
              <div className="product-list">
                <RectangleLoader
                  className="product-image"
                  src={catalogue_photos[0].full_url}
                  alt=""
                />
                <div className="price">
                  <span className="dynamic-price">&yen;{amount}</span>
                  <div className="origin-price">&yen;{full_price}</div>
                </div>
              </div>
              <div className="parts-box">
                {_.map(parts, (v, k) => {
                  return (
                    <span className="parts" key={k}>
                      含{v.title}
                    </span>
                  )
                })}
              </div>
            </div>
          )
        )}
        {_.map(
          hadMakeAnAppointmentToReturn,
          ({ product: { id, catalogue_photos }, product_item: { state } }) => (
            <div className="product-list-box" key={id}>
              <div className="product-list">
                <RectangleLoader
                  className="product-image product-image-return"
                  src={catalogue_photos[0].thumb_url}
                  alt=""
                />
                <div
                  className={`had-make-an-appointment ${
                    state === 'purchased' ? 'purchased-state' : ''
                  }`}
                />
              </div>
            </div>
          )
        )}
      </div>
      <div className="clear" />
    </div>
  )
})
