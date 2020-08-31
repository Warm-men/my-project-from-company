import Actions from 'src/app/actions/actions.js'
import { connect } from 'react-redux'
import ProductContainer from './products_container'
import GeneralWxShareHOC from 'src/app/components/HOC/GeneralWxShare'
import { FETCH_PRODUCT_SORT_CONFIG_MAP } from '../../constants/fetchproductconfig'

@connect(mapStateToProps)
@GeneralWxShareHOC
export default class ProductsByAllContainer extends ProductContainer {
  fetchProducts = () => {
    const { filters, the_second_level, filters_occasion } = this.props
    const actions = Actions.allproducts.fetchAllProducts({
      filters,
      the_second_level,
      filters_occasion
    })
    this.props.dispatch(actions)
  }
}

function mapStateToProps(state) {
  const { allproducts, customer, closet } = state
  return {
    ...allproducts,
    filters: {
      ...allproducts.filters,
      sort: FETCH_PRODUCT_SORT_CONFIG_MAP.allProducts
    },
    productsTitle: '所有产品',
    fetchMoreProducts: true,
    showSortBotton: true,
    closetProductIds: closet.productIds,
    customer,
    customerSignedIn: !!customer.id,
    cart: state.cart,
    scrollName: 'allProducts'
  }
}
