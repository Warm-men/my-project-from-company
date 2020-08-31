import { observable, action } from 'mobx'
import { filterSameProducts } from '../expand/tool/product_l10n'
import Statistics from '../expand/tool/statistics'

class ProductsAccessoryStore {
  @observable products = []
  @observable filters = new Filters()
  @observable filter_selections = []
  @observable secondFilterTerms = []
  @observable isMore = true

  @action
  addProducts = products => {
    const newProducts = filterSameProducts(this.products, products)
    this.products = [...this.products, ...newProducts]
    if (products.length < this.filters.per_page) {
      this.isMore = false
    }
  }

  @action
  refreshProducts = () => {
    this.filters.page = 1
    this.isMore = true
  }

  @action
  cleanProducts = () => {
    this.products = []
  }

  @action
  updateFilters = (type, item) => {
    let filter
    let key
    switch (type) {
      case 'FILTER_TERMS':
        filter = this.filters.filter_terms
        //改变terms 时候重置二级筛选
        this.secondFilterTerms = []
        key = '品类'
        break
      case 'COLOR_FAMILIES':
        filter = this.filters.color_families
        key = '颜色'
        break
      case 'OCCASION':
        filter = this.filter_selections
        key = '场合'
        break
      default:
        filter = this.secondFilterTerms
        key = type
        break
    }
    if (!filter) {
      return
    }
    const isSelected = filter.indexOf(item) === -1
    if (isSelected) {
      if (type === 'FILTER_TERMS' && filter[0] === 'accessory') {
        filter[0] = item
      } else {
        filter.push(item)
      }
    } else {
      filter.remove(item)
      if (type === 'FILTER_TERMS' && filter.length === 0) {
        filter.push('accessory')
      }
    }
    Statistics.onEvent({
      id: 'filter',
      label: 'filter',
      attributes: {
        filter: item,
        type: key,
        op_type: isSelected ? '筛选' : '反选'
      }
    })
  }

  @action
  cleanFilters = () => {
    const currentPage = this.filters.page
    this.filters = new Filters()
    this.filters.page = currentPage
  }

  @action
  resetProducts = () => {
    this.filters = new Filters()
    this.products = []
    this.filter_selections = []
    this.secondFilterTerms = []
    this.isMore = true
  }
}

class Filters {
  @observable color_families = []
  @observable filter_terms = ['accessory']
  @observable page = 1
  @observable per_page = 20
  @observable sort = 'area_based_popularity_recommended'
}

export default new ProductsAccessoryStore()
