import { observable, action } from 'mobx'
import _ from 'lodash'
import Statistics from '../expand/tool/statistics'
class ClosetStore {
  @observable closetIds = []
  @observable filter_selections = []
  @observable secondFilterTerms = []
  @observable products = []
  @observable filters = new Filters()
  @observable isMore = true

  @action
  addProducts = products => {
    const array = [...this.products, ...products]
    this.products = _.uniqBy(array, 'id')
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
  resetCloset = () => {
    this.products = []
    this.closetIds = []
    this.filter_selections = []
    this.secondFilterTerms = []
    this.filters = new Filters()
  }

  @action
  resetFilter = () => {
    this.filter_selections = []
    this.secondFilterTerms = []
    this.filters = new Filters()
  }

  @action
  refreshProducts = () => {
    this.filters.page = 1
    this.isMore = true
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
      case 'TEMPERATURE':
        filter = this.filters.temperature
        key = '天气'
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
    if (!filter) return

    const isSelected = filter.indexOf(item) === -1
    if (isSelected) {
      filter.push(item)
    } else {
      filter.remove(item)
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
  updateClosetIds = products => {
    let idArr = []
    products.map(product => {
      idArr.push(product.id)
    })
    this.closetIds = idArr
    // TODO: 上报收藏数量
  }

  @action
  addToCloset = products => {
    let addArr = products
    if (!Array.isArray(addArr)) {
      addArr = [addArr]
    }

    let idArr = [],
      productArr = []
    addArr.map(item => {
      const idIndex = this.closetIds.indexOf(item.id)
      if (idIndex === -1) {
        idArr.push(item.id)
      }
      const productIndex = this.products.findIndex(function(product) {
        return product.id === item.id
      })
      if (productIndex === -1) {
        productArr.push(item)
      }
    })

    this.closetIds = this.closetIds.concat([...idArr])
    this.products = [...productArr, ...this.products]
  }

  @action
  removeFromCloset = ids => {
    let removeArr = ids
    if (!Array.isArray(removeArr)) {
      removeArr = [removeArr]
    }
    removeArr.map(id => {
      const idIndex = this.closetIds.indexOf(id)
      if (idIndex > -1) {
        this.closetIds.splice(idIndex, 1)
      }
      // const productIndex = this.products.findIndex(function(product) {
      //   return product.id === id
      // })
      // if (productIndex > -1) {
      //   this.products.splice(productIndex, 1)
      // }
    })
  }
}

class Filters {
  @observable color_families = []
  @observable filter_terms = []
  @observable page = 1
  @observable per_page = 20
  @observable temperature = []
}

export default new ClosetStore()
