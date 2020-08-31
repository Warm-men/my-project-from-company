import './index.scss'
import 'react-id-swiper/lib/styles/css/swiper.css'
import 'src/app/components/custom_components/swiper.scss'

import { find } from 'lodash'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import authentication from 'src/app/lib/authentication'
import WithHandleTouch from 'src/app/components/HOC/with_handletouch'
import NewToteSwapModal from 'src/app/containers/tote_swap/new_tote_swap_modal/index.jsx'
import ChangeSizeModal from 'src/app/containers/tote_swap/new_tote_swap_modal/change_size_modal.jsx'
import { handleToteCart } from 'src/app/containers/tote_swap/new_tote_swap_modal/utils/format_onboarding_tote.js'

function mapStateToProps(state) {
  return {
    customer: state.customer,
    tote_cart: state.tote_cart,
    totes: state.totes,
    authentication: authentication(state.customer),
    app: state.app
  }
}

export const NEW_TOTE_MODAL_TYPE = {
  all: 'swap',
  size: 'size',
  same: 'same',
  different: 'different'
}

@connect(mapStateToProps)
@WithHandleTouch
@withRouter
export default class NewToteSwapModalContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedSize: props.selectedSize
    }
    this.selectedSizeName = this.getSelectedSizeName(
      props.selectedSize,
      props.product
    )
  }

  getSelectedSizeName = (sizeId, product) => {
    if (sizeId && product.product_sizes) {
      const _finded = find(
        product.product_sizes || [],
        ps => ps.size.id === sizeId
      )
      if (_finded) {
        return _finded.size.name
      }
    }
    return null
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.selectedSize !== this.state.selectedSize) {
      // 更新关联对象
      this.selectedSizeName = this.getSelectedSizeName(
        nextState.selectedSize,
        nextProps.product
      )
    }
    return true
  }

  render() {
    const {
      totes,
      product,
      customer,
      tote_cart,
      modalType,
      handleHideModal,
      isOnboardingSwap,
      handleAddToCart,
      realtimeProductRecommended,
      onReplaceForToteCart
    } = this.props
    const { selectedSize } = this.state
    const toteCart = handleToteCart(
      totes.latest_rental_tote,
      tote_cart,
      isOnboardingSwap
    )
    if (_.isEmpty(product)) {
      return null
    }

    if (modalType === NEW_TOTE_MODAL_TYPE.size) {
      return (
        <ChangeSizeModal
          product={product}
          customer={customer}
          toteCart={toteCart}
          style={customer.style}
          selectSize={selectedSize}
          dispatch={this.props.dispatch}
          handleCancel={handleHideModal}
          selectSizeName={this.selectedSizeName}
          realtimeProductRecommended={realtimeProductRecommended}
          onConfirmSize={() => handleAddToCart(selectedSize, product, toteCart)}
          setSelectedSize={sizeId => this.setState({ selectedSize: sizeId })}
        />
      )
    } else {
      return (
        <NewToteSwapModal
          toteCart={toteCart}
          currentProduct={product}
          dispatch={this.props.dispatch}
          handleCancel={handleHideModal}
          isOnboarding={isOnboardingSwap}
          handleReplaceForToteCart={(...args) =>
            onReplaceForToteCart(...args, selectedSize)
          }
        />
      )
    }
  }
}
