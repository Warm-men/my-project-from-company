import Actions from 'src/app/actions/actions'
import memorize from 'memoize-one'
import TopView from './components/swap_top_view'
import Products from './components/swap_product_list'
import BottomView from './components/swap_action_buttons'

import './index.scss'

class NewToteSwapModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = { selectedProducts: [] }

    this._getCartItemsAndVoidCount()

    this.categoryProducts = []
    this.otherProducts = this.toteProducts

    this._getCategoryInfo()
  }

  _getCartItemsAndVoidCount = () => {
    const { currentProduct, toteCart } = this.props
    const {
      clothingSlot,
      accessorySlot,
      clothing_items,
      accessory_items,
      max_accessory_count,
      max_clothing_count
    } = toteCart

    let toteProducts = []
    let voidCount = 0

    if (currentProduct.category.accessory) {
      toteProducts = [...accessory_items, ...clothing_items]
      voidCount = max_accessory_count - accessorySlot
    } else {
      toteProducts = [...clothing_items, ...accessory_items]
      voidCount = max_clothing_count - clothingSlot
    }

    this.toteProducts = toteProducts
    this.voidCount = voidCount
  }

  _getCategoryInfo = () => {
    const { currentProduct } = this.props
    if (currentProduct.category_rule) {
      const { slug, swap_ban_threshold } = currentProduct.category_rule

      this.slug = slug
      this.maxLength = swap_ban_threshold

      this.categoryProducts = this.toteProducts.filter(({ product }) => {
        return product.category_rule && product.category_rule.slug === slug
      })

      this.otherProducts = this.toteProducts.filter(({ product }) => {
        return !product.category_rule || product.category_rule.slug !== slug
      })

      this.isThreshold = this.categoryProducts.length >= this.maxLength
    }
  }

  _getProductsWithCategory = () => {
    const products = [...this.categoryProducts, ...this.otherProducts]
    let array = this._getCurrentProductsStatus(products, true)

    if (!this.isThreshold) return array

    //onboarding Tote 限制
    if (this.props.isOnboarding) {
      if (this.categoryProducts.length >= this.maxLength) {
        array = this._getCurrentProductsStatus(products)
      }
      return array
    }

    // 新衣箱的品类限制
    let selectedSlots = 0
    const selected = this.state.selectedProducts.filter(item => {
      const { product, slot } = item
      if (product.category_rule && product.category_rule.slug === this.slug) {
        if (slot) selectedSlots = selectedSlots + slot
        return true
      }
      return false
    })
    array = this._getCurrentProductsStatus(products)
    //不超过品类限制
    if (this.categoryProducts.length - selected.length < this.maxLength) {
      const { currentProduct } = this.props
      if (
        selectedSlots + this.voidCount < currentProduct.tote_slot ||
        selected.length > 1
      ) {
        //当前选中的限制品类商品的衣位，和衣箱剩余的衣位，不满足替换，剩下的全部都可以选择
        //已经选择一件限制商品后，剩下的全部都可以选择
        array = this._getCurrentProductsStatus(products, true)
      }
    }
    return array
  }

  _getCurrentProductsStatus = memorize((products, unlock) => {
    const { currentProduct } = this.props
    const array = products.map(data => {
      const { product } = data
      const bool = unlock
        ? product.category.accessory === currentProduct.category.accessory
        : product.category_rule && product.category_rule.slug === this.slug
      return { data, disabled: !bool }
    })
    return array
  })

  handleReplaceProduct = () => {
    const { currentProduct, handleReplaceForToteCart } = this.props
    const { selectedProducts } = this.state
    const ok = this.canSwapWithProductInToteCart(
      [currentProduct],
      selectedProducts
    )
    if (ok) {
      const ids = selectedProducts.map(i => i.product_size.id)
      handleReplaceForToteCart(currentProduct, ids, selectedProducts)
    }
  }

  /*
    当前选中的衣服是否可以进行换装
    products： 要换入的商品 []
    selectedCartItems： 选择要被替换的商品  [cart_item, ...]
    voidCount： 初始占用的衣位数，用来默认占用一定衣位数
  */
  canSwapWithProductInToteCart = (products, selectedCartItems) => {
    const { isOnboarding, dispatch } = this.props
    let newCount = 0,
      selectedCount = 0
    products.forEach(product => {
      newCount = newCount + product.tote_slot
    })
    selectedCartItems.forEach(item => {
      selectedCount = selectedCount + item.product.tote_slot
    })
    const count = newCount - (selectedCount + this.voidCount)
    const ok = count <= 0

    const isAccessory = products && products[0].type === 'Accessory'
    const typeTitle = isAccessory ? '配饰位' : '衣位'

    if (!ok && !isOnboarding) {
      const content = '请再选择' + count + '个' + typeTitle + '进行替换'
      dispatch(Actions.tips.changeTips({ isShow: true, content }))
    }
    return ok || isOnboarding
  }

  handleCancel = e => {
    e.preventDefault()
    this.props.handleCancel()
  }

  _updateSelectedProducts = selectedProducts => {
    if (!this.isThreshold) {
      this.setState({ selectedProducts })
      return
    }
    const selected = selectedProducts.filter(({ product }) => {
      return product.category_rule && product.category_rule.slug === this.slug
    })

    if (this.categoryProducts.length - selected.length < this.maxLength) {
      this.setState({ selectedProducts })
    } else {
      this.setState({ selectedProducts: selected })
    }
  }

  render() {
    if (_.isEmpty(this.props.toteCart)) return null

    const { handleCancel, currentProduct, isOnboarding } = this.props

    const array = this._getProductsWithCategory()

    return (
      <div className="new-tote-swap-modal">
        <div className="shape" onClick={handleCancel} />
        <div className="tote-swap-modal-box">
          <TopView
            cancel={handleCancel}
            isOnboarding={isOnboarding}
            currentProduct={currentProduct}
            isThreshold={this.isThreshold}
          />
          {!!array && (
            <Products
              products={array}
              isOnboarding={isOnboarding}
              voidCount={this.voidCount}
              selectedProducts={this.state.selectedProducts}
              currentProduct={currentProduct}
              updateSelectedProducts={this._updateSelectedProducts}
            />
          )}
          <BottomView
            voidCount={this.voidCount}
            currentProduct={currentProduct}
            selectedProducts={this.state.selectedProducts}
            isOnboarding={isOnboarding}
            onClick={this.handleReplaceProduct}
          />
        </div>
      </div>
    )
  }
}

export default NewToteSwapModal
