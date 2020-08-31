import Actions from 'src/app/actions/actions.js'
import { connect } from 'react-redux'
import ProductContainer from './products_container'
import Authentication from 'src/app/lib/authentication'

@connect(mapStateToProps)
export default class ProductsByFilterTermsContainer extends ProductContainer {
  initialProducts = async () => {
    const { params } = this.props
    const action = Actions.allproducts.setFilters({
      filter_terms: [Number(params.filterTerm)]
    })
    await this.clearProductsAndFilterTerms()
    await this.props.dispatch(action)
    this.fetchProducts()
  }

  fetchProducts(page) {
    const {
      filters,
      the_second_level,
      params: { type },
      authentication: { isSubscriber },
      customer: { products_size_filter },
      filters_occasion
    } = this.props
    // NOTE: 智能选码 从第一页开始重新拿
    if (page) {
      filters['page'] = 1
    }

    filters['in_stock_in_my_size'] =
      type === 'clothing' && isSubscriber && products_size_filter ? true : false
    const actions = Actions.allproducts.fetchAllProducts({
      filters,
      the_second_level,
      filters_occasion
    })
    this.props.dispatch(actions)
  }
}

function getName(id, collections) {
  const arr = _.find(collections, v => v.name === '品类')
  if (_.isEmpty(arr)) return null
  const collection = _.find(
    arr.product_search_slots,
    v => v && v.id === Number(id)
  )
  return collection.name
}

function getProductsTitle(props, collections = {}) {
  const { filters } = props
  let title = '服饰分类'
  if (filters) {
    const { filter_terms } = filters

    // ①如果是全部分类，标题为全部
    // ②如果是某一个分类，标题为分类名
    // ③如果是某两个分类，标题为分类名1和分类名2
    // ④如果是两个以上分类，标题为分类名1和分类名2等
    if (filter_terms) {
      switch (filter_terms.length) {
        case 0:
          title = '全部分类'
          break
        case 1:
          title = getName(filter_terms[0], collections) || ''
          break
        case 2:
          title =
            getName(filter_terms[0], collections) +
            '和' +
            getName(filter_terms[1], collections)
          break
        default:
          title =
            getName(filter_terms[0], collections) +
            '和' +
            getName(filter_terms[1], collections) +
            '等'
          break
      }
    }
  }
  return title
}

function mapStateToProps(state, props) {
  const { allproducts, customer, closet, app } = state
  return {
    ...allproducts,
    productsTitle: getProductsTitle(
      allproducts,
      app.productsFilters,
      props.params
    ),
    fetchMoreProducts: true,
    showSortBotton: true,
    closetProductIds: closet.productIds,
    customer,
    customerSignedIn: !!customer.id,
    cart: state.cart,
    isShowStock: true,
    scrollName: 'filterProducts',
    authentication: Authentication(customer)
  }
}
