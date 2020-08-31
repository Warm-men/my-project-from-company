import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Actions from 'src/app/actions/actions.js'
import ErrorModal from './tote_swap_error_modal'
import Header from './tote_swap_header'
import HOCSwap from 'src/app/components/HOC/HOCSwap'
import authentication from 'src/app/lib/authentication'
import initScrollTop from 'src/app/lib/init_scroll_to_top.js'
import 'src/assets/stylesheets/components/desktop/tote_swap/tote_modal.scss'

class ToteSwapContainer extends React.Component {
  constructor() {
    super()
    this.state = {
      animate: false,
      scrolled: false
    }
    this.vacationFilters = {
      in_stock: true,
      colors: [],
      filter_terms: [],
      weather: [],
      without_weather: [],
      sort: 'newest',
      primaryPage: 1,
      primaryPagesRemaining: true,
      changedFilters: false,
      filter_flag: 'occasion_filter',
      slug: 'beach_vacation'
    }
    this.analyzeSwapSlug = null
  }

  componentDidMount() {
    this.setState(state => ({ animate: !state.animate }))
  }

  componentDidUpdate() {
    this.props.isMissingTote && this.props.router.push('/totes')
  }

  changeAnalyzeSlug = slug => (this.analyzeSwapSlug = slug)

  fetchProduct = () => {
    const { params, dispatch } = this.props
    if (params.id) {
      dispatch(
        Actions.toteSwap.fetchProduct(params.id, this.setFullScreenPhoto)
      )
    }
  }

  setFullScreenPhoto = () => {
    const { app, dispatch, product } = this.props
    if (!app.isWechat) {
      dispatch(
        Actions.fullscreencarousel.setFullScreenPhoto(product.catalogue_photos)
      )
    }
  }

  closeError = () => {
    this.fetchProduct()
    this.props.dispatch(Actions.toteSwap.closeErrorModal())
  }

  render() {
    const {
      selectedProduct: { type },
      authentication,
      location: { pathname },
      params,
      errorModalOpen
    } = this.props
    const isList =
      _.isEmpty(params.product_id) &&
      !_.includes(pathname, 'collection_products')
    return (
      <div className="tote-swap-experience" id="tote-swap-experience">
        {isList && (
          <Header
            header={this.props.header}
            pathname={pathname}
            isVacation={authentication.isVacation}
            scrolled={this.state.scrolled}
          />
        )}
        {React.cloneElement(this.props.children, {
          vacationFilters: this.vacationFilters,
          initScrollTop: initScrollTop,
          changeAnalyzeSlug: this.changeAnalyzeSlug,
          analyzeSwapSlug: this.analyzeSwapSlug,
          isFromSwap: true
        })}
        {errorModalOpen && (
          <ErrorModal closeModal={this.closeError} selectedProductType={type} />
        )}
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { customer, toteSwap, app } = state
  return {
    app,
    customer,
    authentication: authentication(customer),
    tote: toteSwap.tote,
    header: toteSwap.header,
    isMissingTote: toteSwap.isMissingTote,
    selectedProduct: toteSwap.selectedProduct,
    errorModalOpen: toteSwap.errorModalOpen
  }
}

export default connect(mapStateToProps)(HOCSwap(withRouter(ToteSwapContainer)))
