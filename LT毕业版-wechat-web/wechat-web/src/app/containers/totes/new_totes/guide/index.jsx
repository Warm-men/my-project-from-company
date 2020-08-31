import withHandleTouch from 'src/app/components/HOC/with_handletouch/index_hooks.jsx'
import ActionButton from 'src/app/components/shared/action_button/index'
import { useState } from 'react'
import './index.scss'

export default withHandleTouch(CartProductsGuide)
function CartProductsGuide(props) {
  const { type } = props
  const maxIndex = type === 'oldUser' ? 1 : 4
  const [index, setIndex] = useState(type === 'onboarding' ? 2 : 1)

  const nextGuide = e => {
    if (index < maxIndex) {
      setIndex(index => index + 1)
    } else {
      e.preventDefault()
      props.handleFinish()
    }
  }

  const getGuideComponents = index => {
    let component, style
    switch (index) {
      case 1:
        if (type === 'oldUser') {
          component = <span className="swap_product-icon" />
          style = { marginBottom: 150 }
        }
        break
      case 2:
        component = <span className="swap_product-icon" />
        style = { marginBottom: 150 }
        break
      case 4:
        component = (
          <ActionButton className={'lock-button'} size="stretch">
            下单衣箱
          </ActionButton>
        )
        style = { marginBottom: 60 }
        break
      default:
    }
    return { component, style }
  }

  const { component, style } = getGuideComponents(index)
  let image
  if (type === 'oldUser') {
    image = require(`src/app/containers/totes/new_totes/guide/images/guide_tote_cart_old.png`)
  } else {
    image = require(`src/app/containers/totes/new_totes/guide/images/guide_${index}.png`)
  }

  return (
    <div className="cart-products-guide" onClick={nextGuide}>
      {index === 1 && <img style={style} src={image} alt="" />}
      {index === 2 && <img style={style} src={image} alt="" />}
      {index === 3 && <img style={style} src={image} alt="" />}
      {index === 4 && <img style={style} src={image} alt="" />}
      {component}
    </div>
  )
}

CartProductsGuide.defaultProps = {
  handleFinish: () => {}
}
