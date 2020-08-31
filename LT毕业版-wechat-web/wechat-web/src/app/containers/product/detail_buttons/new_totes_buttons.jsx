import { withRouter } from 'react-router'
import './index.scss'

export default withRouter(NewTotesButtons)
function NewTotesButtons(props) {
  const gotoNewTotesCart = () => props.router.push('/new_totes')

  const handleClick = () => {
    const { handleAddToCart, disabled } = props
    !disabled && handleAddToCart && handleAddToCart()
  }

  const { addToCollect, disabled, buttonText, displayCartEntry } = props
  return (
    <div className="new-totes-buttons">
      <div className="buttons-box" onClick={addToCollect}>
        <img
          className="buttons-icon"
          alt=""
          src={
            props.inCloset
              ? require(`./images/collected.svg`)
              : require(`./images/collect.svg`)
          }
        />
        <span className="buttons-text">收藏</span>
      </div>
      {displayCartEntry && (
        <>
          <div className="buttons-border" />
          <div className="buttons-box" onClick={gotoNewTotesCart}>
            <img
              className="buttons-icon"
              alt=""
              src={require('./images/new-cart.svg')}
            />
            <span className="buttons-text">下单</span>
          </div>
        </>
      )}
      <span
        className={`add-to-cart ${!displayCartEntry ? 'full-btn' : ''} ${
          disabled ? 'disabled' : ''
        }`}
        onClick={handleClick}
      >
        {buttonText}
      </span>
    </div>
  )
}
