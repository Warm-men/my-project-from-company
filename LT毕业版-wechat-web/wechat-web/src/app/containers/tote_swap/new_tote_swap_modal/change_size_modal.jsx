import './index.scss'

import Actions from 'src/app/actions/actions.js'
import ToteCartUtil from './utils/tote_cart_util'
import DescriptionAndSizing from 'src/app/containers/product/description_and_sizing'
import { getButtonProps } from 'src/app/containers/product/detail_buttons/utils/product_detail_bottom_btn_util.js'

class ChangeSizeSwapModal extends React.Component {
  handleClickConfirm = () => {
    const { product, toteCart, selectSize, onConfirmSize } = this.props

    const validatorType = ToteCartUtil.ToteCartValidatorType
    ToteCartUtil.productAddToToteCartValidator(
      selectSize,
      product,
      toteCart
    ).excuteStream([
      {
        id: validatorType.isSizeEmpty,
        onTrue: () => {
          this.props.dispatch(
            Actions.tips.changeTips({
              isShow: true,
              content: '请先选择尺码'
            })
          )
          return false
        },
        onFalse: () => {
          onConfirmSize()
          return true
        }
      }
    ])
  }

  render() {
    const {
      product,
      handleCancel,
      toteCart,
      customer,
      realtimeProductRecommended
    } = this.props
    const selectSize = _(product.product_sizes).find(
      ps => ps.size.id === this.props.selectSize
    )
    const { text, disabled } = getButtonProps(product, selectSize, toteCart)
    const isClothing = product.type === 'Clothing'
    const slotTitle = isClothing ? '衣位' : '配饰位'
    const slotText =
      product.tote_slot > 1 ? ` | 占${product.tote_slot}个${slotTitle}` : ''
    return (
      <div className="new-tote-swap-modal">
        <div className="shape" onClick={handleCancel} />
        <div className="tote-swap-modal-box size-swap">
          <div className="size-swap-modal-product">
            <div className="product-view">
              <img
                className="product-img"
                src={product.catalogue_photos[0].giant_url}
                alt=""
              />
              <div className="size-swap-title">
                <span className="brand">
                  {product.brand && product.brand.name}
                </span>
                <span className="title">
                  {product.title}
                  {slotText}
                </span>
              </div>
            </div>
            <div className="close" onClick={handleCancel} />
          </div>
          <div className="size-chart-view">
            <div className="title">确认尺码</div>
          </div>
          <DescriptionAndSizing
            {...this.props}
            product={product}
            isSwapModal={true}
            customer={customer}
            isClothing={isClothing}
            style={this.props.style}
            recommended_size={product.recommended_size}
            selectedSizeName={this.props.selectSizeName}
            setSelectedSize={this.props.setSelectedSize}
            realtimeProductRecommended={realtimeProductRecommended}
          />
          <div className="tote-swap-modal-btns">
            <div
              className={`modal-btn active ${disabled ? 'disabled' : ''}`}
              onClick={disabled ? () => {} : this.handleClickConfirm}
            >
              {text}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ChangeSizeSwapModal
