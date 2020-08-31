import NewToteSwapModalContainer, {
  NEW_TOTE_MODAL_TYPE
} from '../../tote_swap/new_tote_swap_modal/new_tote_swap_modal_container'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Actions from '../../../actions/actions'
import authentication from '../../../lib/authentication'
import { find, findIndex } from 'lodash'
import ToteCartUtil from '../../tote_swap/new_tote_swap_modal/utils/tote_cart_util'

/** 商品加入购物车高阶函数 为服务对象提供:
 *
 *  衍生状态转发
 *  handleAddToCart 业务处理入口
 *  NewToteSwapModalContainer 弹窗UI
 *
 * NOTICE
 *  | NewToteSwapModalContainer 中独立维护了 selectedSize 并不回传给父对象更新
 *    | 所以 HOC 的处理函数注意是否需要使用 Container 中的 selectedSize
 * @export
 * @param {*} WrapperComponent
 * @returns
 */
export default function AddToToteCartHandlerHOC(WrapperComponent) {
  const EnhancedComponent = class extends React.Component {
    constructor(props) {
      super(props)
      this.isLoading = false
      this.loadingToteCart = false
      this.state = {
        modalType: '',
        showSwapModal: false,
        totesCacheIds: '',
        prevPropsTotes: props.totes, // for Update
        prevPropsProduct: props.product, // for Update
        prevPropsToteCart: props.tote_cart, // for Update
        selectedSize: this.setSelectSizeObject(
          undefined,
          props.product,
          props.tote_cart
        )
      }
    }

    get isOnboardingSwap() {
      const { customer, authentication } = this.props
      return ToteCartUtil.isOnboardingSwap({
        customer,
        authentication,
        location: window.location
      })
    }

    get toteCart() {
      return ToteCartUtil.getToteCart(
        {
          totes: this.props.totes,
          tote_cart: this.props.tote_cart
        },
        this.isOnboardingSwap
      )
    }

    fetchLatestRentalTote = () => {
      if (this.isOnboardingSwap) {
        // isOnboardingSwap 拉取新的toteCart
        const onEnd = () => {
          this.loadingToteCart = false
        }
        this.loadingToteCart = true
        this.props.dispatch(Actions.totes.fetchLatestRentalTote(onEnd, onEnd))
      }
    }

    componentDidMount() {
      this.fetchLatestRentalTote()
      this.props.router.setRouteLeaveHook(this.props.route, () => {
        if (this.state.showSwapModal) {
          this.handleHideModal()
          if (this.props.location.pathname !== '/closet') {
            browserHistory.go(1)
          }
          return false
        }
        return true
      })
    }

    setSelectSizeObject(sizeId, product, tote_cart) {
      this.selectSizeObject = ToteCartUtil.getProductSizeObj(
        sizeId,
        product,
        tote_cart
      )
      return this.selectSizeObject ? this.selectSizeObject.size.id : null
    }

    /**
     * { product, totes, tote_cart } = props 更新时刷新selectedSize
     *
     * @static
     * @param {*} props
     * @param {*} state
     * @returns
     */
    static getDerivedStateFromProps(props, state) {
      let nextState = {}
      const isOnboardingSwap = ToteCartUtil.isOnboardingSwap({
        customer: props.customer,
        authentication: props.authentication,
        location: window.location
      })
      const selectedSizeInToteCart = () => {
        const { totes, product, tote_cart } = props
        return ToteCartUtil.getProductSelectedSizeInToteCart(
          product,
          tote_cart,
          totes,
          isOnboardingSwap
        )
      }
      // #当产品/购物车更新时更新 selectedSize
      if (isOnboardingSwap) {
        // isOnboardingSwap 购物车更新时更新 selectedSize
        const productsIds = (totes => {
          if (totes && totes.latest_rental_tote) {
            const tote_products = totes.latest_rental_tote.tote_products
            if (tote_products) {
              // 产品列表size_id串
              const totesCacheIds = tote_products.reduce(
                (a, b) => a + b.product_size.id,
                ''
              )
              return totesCacheIds
            }
          }
          return ''
        })(props.totes)
        if (productsIds !== state.totesCacheIds) {
          nextState = {
            ...nextState,
            totesCacheIds: productsIds,
            selectedSize: selectedSizeInToteCart()
          }
        }
      }

      if (props.product !== state.prevPropsProduct) {
        // product 更新时更新 selectedSize
        nextState = {
          ...nextState,
          prevPropsProduct: props.product,
          selectedSize: selectedSizeInToteCart()
        }
      }

      if (props.tote_cart !== state.prevPropsToteCart) {
        // toteCart 更新时更新 selectedSize
        nextState = {
          ...nextState,
          prevPropsTotes: props.totes,
          prevPropsToteCart: props.tote_cart,
          selectedSize: selectedSizeInToteCart()
        }
      }
      return nextState
    }
    /**
     * selectedSize 更新 -> setSelectSizeObject
     *
     * @param {*} nextProps
     * @param {*} nextState
     * @returns
     */
    shouldComponentUpdate(nextProps, nextState) {
      if (
        nextState.selectedSize !== this.state.selectedSize ||
        nextProps.product !== this.props.product
      ) {
        // 更新关联对象
        this.setSelectSizeObject(
          nextState.selectedSize,
          nextProps.product,
          this.toteCart
        )
      }
      return true
    }

    handleChangeSize = sizeId => {
      this.setState({
        selectedSize: this.setSelectSizeObject(
          sizeId,
          this.props.product,
          this.toteCart
        )
      })
    }

    handleHideModal = () => {
      this.isLoading = false
      this.setState({ modalType: '', showSwapModal: false })
    }

    handleShowModal = modalType => {
      this.setState({ modalType, showSwapModal: true })
    }

    /**
     * 处理一次product加入购物车的事件
     *
     * @param {*} sizeId
     * @param {*} product
     * @param {*} toteCart
     * @returns
     */
    handleAddToCart = (sizeId, product, toteCart) => {
      // NOTE：Onboarding直接弹窗然后进行更换，不走购物车逻辑

      if (this.isLoading) return

      const validatorType = ToteCartUtil.ToteCartValidatorType
      ToteCartUtil.productAddToToteCartValidator(
        sizeId,
        product,
        toteCart,
        this.isOnboardingSwap
      ).excuteStream([
        {
          id: validatorType.isSizeEmpty,
          onTrue: () => {
            this.handleShowModal(NEW_TOTE_MODAL_TYPE.size)
            return false
          },
          onFalse: () => {
            return true
          }
        },
        {
          id: validatorType.isInToteCart,
          onTrue: () => {
            // 在购物车内
            this.onAddProductInToteCart(sizeId, product, toteCart)
            return false
          },
          onFalse: () => {
            // 不在购物车内 进入下一步
            if (this.isOnboardingSwap) {
              this.handleShowModal(NEW_TOTE_MODAL_TYPE.all)
              return false
            }
            return true
          }
        },
        // 是否符合同品类数量限制
        {
          id: validatorType.isSameCategoryValid,
          onTrue: () => {
            // 符合 进入下一步
            return true
          },
          onFalse: () => {
            // 不符合 显示同品类选择弹窗
            this.handleShowModal(NEW_TOTE_MODAL_TYPE.all)
            return false
          }
        },
        // 是否超出衣位限制
        {
          id: validatorType.isSlotCapacityValid,
          onTrue: () => {
            // 符合 提交
            this.onSubmit(sizeId)
            return true
          },
          onFalse: () => {
            // 不符合 显示全部替换选择弹窗
            this.handleShowModal(NEW_TOTE_MODAL_TYPE.all)
            return false
          }
        }
      ])
    }
    /**
     * 处理已在购物车中的商品
     *
     */
    onAddProductInToteCart = (newSelectedSize, newProduct, newToteCart) => {
      const { reportData, dispatch } = this.props
      const toteCartItems = ToteCartUtil.getToteCartItems(
        newProduct,
        newToteCart
      )
      const index = findIndex(
        toteCartItems,
        v => v.product.id === newProduct.id
      )
      if (this.isOnboardingSwap) {
        const toteProduct = toteCartItems[index]
        const selectSize = find(
          newProduct.product_sizes,
          ps => ps.size.id === newSelectedSize
        )
        dispatch(
          Actions.toteSwap.swapProduct(
            toteProduct.id,
            newProduct.id,
            selectSize.name,
            newProduct.recommended_size,
            null,
            () => {
              this.swapProductSuccess(selectSize)
            }
          )
        )
      } else {
        this.isLoading = true
        const sizeObj = ToteCartUtil.getProductSizeObj(
          newSelectedSize,
          newProduct,
          newToteCart
        )
        if (sizeObj) {
          const newId = [sizeObj.id]
          const oldId = [toteCartItems[index].product_size.id]
          dispatch(
            Actions.toteCart.replaceForToteCart(
              oldId,
              newId,
              ToteCartUtil.resolveReportData(reportData),
              () => {
                this.isLoading = false
                const tips = { isShow: true, content: '换码成功' }
                dispatch(Actions.tips.changeTips(tips))
              },
              () => {
                this.isLoading = false
              }
            )
          )
        }
      }
    }

    onSubmit = sizeId => {
      const { dispatch, product, reportData } = this.props
      const sizeObj = ToteCartUtil.getProductSizeObj(
        sizeId,
        product,
        this.toteCart
      )

      if (sizeObj) {
        this.isLoading = true
        dispatch(
          Actions.toteCart.addToToteCart(
            sizeObj.id,
            ToteCartUtil.resolveReportData(reportData),
            () => {
              this.handleHideModal()
              this.fetchLatestRentalTote()
              const tips = { isShow: true, content: '加入成功' }
              dispatch(Actions.tips.changeTips(tips))
            },
            () => {
              this.isLoading = false
            }
          )
        )
      }
    }

    handleReplaceForToteCart = (
      product,
      productIds,
      selectProducts,
      sizeId
    ) => {
      const size = ToteCartUtil.getProductSizeObj(
        sizeId,
        product,
        this.toteCart
      )
      if (_.isEmpty(productIds) || !selectProducts.length) {
        return null
      }

      if (this.isOnboardingSwap) {
        const { id, recommended_size } = product
        const selectProduct = selectProducts[0]
        this.props.dispatch(
          Actions.toteSwap.swapProduct(
            selectProduct.id,
            id,
            size.name,
            recommended_size,
            null,
            () => {
              this.swapProductSuccess(size)
            }
          )
        )
      } else {
        const { reportData } = this.props
        this.props.dispatch(
          Actions.toteCart.replaceForToteCart(
            productIds,
            [size.id],
            ToteCartUtil.resolveReportData(reportData),
            () => this.replaceToteCartSuccess('换装成功')
          )
        )
      }
    }

    swapProductSuccess = selectData => {
      this.setState({ selectedSize: selectData.size.id })
      this.fetchLatestRentalTote()
      this.props.dispatch(Actions.totes.fetchLatest())
      this.props.dispatch(
        Actions.tips.changeTips({ isShow: true, content: `换装成功` })
      )
      this.handleHideModal()
    }

    replaceToteCartSuccess = content => {
      this.props.dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: content
        })
      )
      this.handleHideModal()
    }

    render() {
      const { product, realtimeProductRecommended } = this.props
      const { showSwapModal, modalType, selectedSize } = this.state

      const selectedSizeName = this.selectSizeObject
        ? this.selectSizeObject.size.name
        : null

      return (
        <>
          <WrapperComponent
            {...this.props}
            toteCart={this.toteCart}
            handleAddToCart={this.handleAddToCart}
            loadingToteCart={this.loadingToteCart}
            setSelectedSize={this.handleChangeSize}
            isOnboardingSwap={this.isOnboardingSwap}
            selectSizeObject={this.selectSizeObject}
          />
          {showSwapModal && product && (
            <NewToteSwapModalContainer
              product={product}
              modalType={modalType}
              selectedSize={selectedSize}
              selectedSizeName={selectedSizeName}
              onChangeSize={this.handleChangeSize}
              handleAddToCart={this.handleAddToCart}
              handleHideModal={this.handleHideModal}
              isOnboardingSwap={this.isOnboardingSwap}
              onReplaceForToteCart={this.handleReplaceForToteCart}
              realtimeProductRecommended={realtimeProductRecommended}
              updateModalType={type => this.setState({ modalType: type })}
            />
          )}
        </>
      )
    }
  }
  return connect(state => {
    const { customer } = state
    return {
      customer,
      authentication: authentication(customer)
    }
  })(EnhancedComponent)
}
