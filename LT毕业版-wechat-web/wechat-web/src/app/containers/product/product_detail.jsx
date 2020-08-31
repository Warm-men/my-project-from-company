import memoize from 'memoize-one'
import arrow from 'src/assets/images/arrow-size.png'
import HighlightWords from '../../components/highlight_words'

export default React.memo(({ product }) => {
  const goIronTip = () => {
    window.location.href =
      'https://static.letote.cn/pages/iron_clothes_tip/index.html'
  }

  const highlightIndex = memoize((description, digests = []) => {
    let index = []
    if (!description) {
      return index
    }
    digests.forEach(d => {
      if (description.includes(d.text)) {
        // start :0，stop: 3, 真实划词就是 0、1、2，3不算到划词。
        if (d.stop - 1 >= d.start) {
          index.push({ start: d.start, end: d.stop - 1 })
        }
      }
    })
    return index
  })(product.description, product.product_digests)

  return (
    <div className="col-sm-4 description">
      <div className="product-description-text">
        <div className="description-title">商品信息</div>
        {product.description && (
          <HighlightWords text={product.description} index={highlightIndex} />
        )}
      </div>
      <div className="product-details-container">
        <div className="product-details">
          {_.map(product.attributes, (attribute, key) => {
            if (_.isEmpty(attribute.value)) return null
            return (
              <div className="description-view" key={key}>
                <span className="size-attribute-description">
                  {attribute.title}
                </span>
                <span className="description-value">
                  {_.isEmpty(attribute.options) ? (
                    <p className="value">{attribute.value}</p>
                  ) : (
                    _.map(attribute.options, (option, key) => {
                      const optionStyle =
                        attribute.value === option ? 'value' : 'option'
                      return (
                        <p key={key} className={optionStyle}>
                          {option}
                        </p>
                      )
                    })
                  )}
                </span>
                {attribute.value === '容易褶皱' && (
                  <div className="button" onClick={goIronTip}>
                    除皱小妙招
                    <img src={arrow} alt="" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
})
