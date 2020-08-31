import './index.scss'

const NewProductsSortBtn = ({ btns, handleClick, selectDate }) => {
  const width = btns.length * (80 + 30)
  return (
    <div className="new-products-sort-btn-container">
      <div className="new-products-sort-btn-box">
        <div
          className="new-products-sort-btn-scroll"
          style={{
            width: `${width}px`
          }}
        >
          {_.map(btns, (v, k) => {
            const isActive = !!_.find(
              selectDate,
              select => select.since === v.value
            )
            return (
              <span
                onClick={handleClick(v)}
                key={k}
                className={`new-products-sort-btn ${isActive ? 'active' : ''}`}
              >
                {`${v.text} ${isActive ? 'x' : ''}`}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

NewProductsSortBtn.defaultProps = {
  handleClick: () => {},
  btns: []
}

export default NewProductsSortBtn
