import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions.js'
import Gallery from './tote_swap_gallery'

class ToteSwapGalleryContainer extends React.Component {
  constructor() {
    super()
    this.initFitler = null
  }

  componentDidMount() {
    const { primaryGallery } = this.props
    // NOTE：防止详情页请求列表
    if (_.isEmpty(primaryGallery)) {
      this.fetchInitProducts()
    } else {
      this.props.initScrollTop(100)
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldUrl = this.props.location.pathname
    const newUrl = nextProps.location.pathname
    if (oldUrl !== newUrl) {
      nextProps.filterModalOpen && this.toggleFilterModal()
      this.changeUrl(newUrl)
    }
  }

  componentWillUnmount() {
    this.props.filterModalOpen && this.toggleFilterModal()
  }

  changeUrl = async url => {
    const filter_term = this.getInitialFilterTerm(this.props.router)
    this.props.dispatch(Actions.toteSwap.clearFilters())
    await this.props.dispatch(Actions.toteSwap.clearProducts(url))
    const isVacation = filter_term === 'vacation'
    const filters = !isVacation
      ? {
          filter_terms: [filter_term],
          changedFilters: false
        }
      : this.props.vacationFilters
    await this.props.dispatch(Actions.toteSwap.setFilters(filters))
    const slug = isVacation ? 'beach_vacation' : null
    await this.props.dispatch(Actions.toteSwap.fetchProducts(true, slug))
    window.scrollTo(0, 0)
  }

  getInitialFilterTerm = router => {
    if (router.isActive('customize/accessories')) {
      return 'accessory'
    } else if (router.isActive('customize/closet')) {
      return 'closet'
    } else if (router.isActive('customize/vacation')) {
      return 'vacation'
    } else {
      return 'clothing'
    }
  }

  arrDedupe = (originArr = [], newValue) => {
    return _.includes(originArr, newValue)
      ? originArr.filter(item => item !== newValue)
      : [...originArr, newValue]
  }

  getOccasion = () => {
    if (!this.props.productsFilters) return null
    let occasionData = null
    _.map(this.props.productsFilters, v => {
      if (v.name === '场合') {
        occasionData = v
      }
    })
    const result = _.find(occasionData.product_search_slots, v =>
      _.includes(v.name, '度假')
    )
    return result
  }

  fetchInitProducts = async () => {
    const result = this.getOccasion()
    const { filters, filters_occasion, dispatch } = this.props
    const filter_term = this.getInitialFilterTerm(this.props.router)
    const newFilters =
      filter_term !== 'vacation'
        ? {
            filter_terms: [filter_term],
            changedFilters: false
          }
        : _.isEmpty(result)
        ? filters
        : {
            ...filters,
            filters_occasion: this.arrDedupe(filters_occasion, result.id),
            filter_flag: 'occasion_filter'
          }
    await dispatch(Actions.toteSwap.setFilters(newFilters))
    dispatch(Actions.toteSwap.fetchProducts(true))
  }

  setFilters = filters => {
    this.props.dispatch(Actions.toteSwap.setFilters(filters))
  }

  applyFilters = () => {
    this.toggleFilterModal()
    if (!this.props.filters.changedFilters) return
    this.props.dispatch(Actions.toteSwap.clearGalleryProducts())
    this.fetchProducts()
  }

  fetchMoreProducts = async () => {
    const { filters } = this.props
    await this.props.dispatch(
      Actions.toteSwap.setFilters({
        primaryPage: filters.primaryPage + 1
      })
    )
    this.fetchProducts()
  }

  fetchProducts = () => {
    this.props.dispatch(Actions.toteSwap.fetchProducts(null))
  }

  toggleFilterModal = () => {
    this.props.dispatch(Actions.toteSwap.toggleFilterModal())
  }

  toggleCloset = (id, reportData) => {
    const inCloset = _.includes(this.props.closetProductIds, id)
    if (inCloset) {
      this.props.dispatch(Actions.closet.remove([id]))
    } else {
      this.props.dispatch(Actions.closet.add([id], reportData))
    }
  }

  resetFilters = () => {
    const {
      location: { pathname },
      dispatch
    } = this.props
    if (this.activeReset()) {
      const isCloset = _.includes(pathname, 'closet')
      const isAccessories = _.includes(pathname, 'accessories')
      const param = isCloset ? 'closet' : isAccessories ? 'accessory' : ''
      dispatch(Actions.toteSwap.resetFilters(param))
    }
  }

  activeReset = () => {
    const { filters, filters_occasion } = this.props
    const isActiveReset = !(
      _.isEmpty(filters.filter_terms) &&
      _.isEmpty(filters.color_families) &&
      _.isEmpty(filters.temperature) &&
      _.isEmpty(filters_occasion)
    )
    return isActiveReset
  }

  clearProducts = () => {
    const { location, dispatch } = this.props
    dispatch(Actions.toteSwap.clearProducts(location.pathname))
  }

  showFilterModal = () => {
    this.initFitler = this.props.filters
    this.toggleFilterModal()
  }

  hideFilterModal = () => {
    this.setFilters(this.initFitler)
    this.toggleFilterModal()
  }

  render() {
    const module = this.getInitialFilterTerm(this.props.router)
    return (
      <Gallery
        {...this.props}
        toggleFilterModal={this.toggleFilterModal}
        setFilters={this.setFilters}
        applyFilters={this.applyFilters}
        isInCloset={module === 'closet'}
        isClothing={module === 'clothing'}
        isVacation={module === 'vacation'}
        gallery={module === 'accessory' ? 'accessories' : module}
        toggleCloset={this.toggleCloset}
        closetProductIds={this.props.closetProductIds}
        resetFilters={this.resetFilters}
        isActiveReset={this.activeReset()}
        fetchProducts={this.fetchMoreProducts}
        clearProducts={this.clearProducts}
        hideFilterModal={this.hideFilterModal}
        showFilterModal={this.showFilterModal}
      />
    )
  }
}

function mapStateToProps(state, props) {
  const { pathname } = props.location
  const { toteSwap } = state
  return {
    primaryGallery: toteSwap.primaryGallery[pathname] || [],
    loading: !!toteSwap.loading,
    more: toteSwap.more,
    filterModalOpen: toteSwap.filterModalOpen,
    filters: toteSwap.filters,
    closetProductIds: state.closet.productIds,
    tote: toteSwap.tote,
    productsFilters: state.app.productsFilters,
    customer: state.customer,
    filters_occasion: toteSwap.filters_occasion,
    the_second_level: toteSwap.the_second_level
  }
}

export default connect(mapStateToProps)(withRouter(ToteSwapGalleryContainer))
