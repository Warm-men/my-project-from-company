import { observable, action } from 'mobx'
import { filterSameProducts } from '../expand/tool/product_l10n'
import Statistics from '../expand/tool/statistics'

class ProductsClothingStore {
  @observable products = []
  @observable productHybird = []
  @observable filters = new Filters()
  @observable filter_selections = []
  @observable secondFilterTerms = []
  @observable isMore = true

  @action
  addPreProducts = products => {
    const newProducts = filterSameProducts(this.productHybird, products)
    this.productHybird = [...this.productHybird, ...newProducts]
    if (products.length < this.filters.per_page) {
      this.isMore = false
    }
  }
  @action
  addProducts = data => {
    const { products } = data
    if (!products || products.length === 0) {
      this.isMore = false
      return
    }
    const newProducts = filterSameProducts(this.products, products)
    this.products = [...this.products, ...newProducts]
    const array = [...this.productHybird, ...newProducts]
    this.insertExternalItems(array, data)
  }

  @action
  insertExternalItems = (array, data) => {
    const { indexes, browse_collections, looks, customer_photos } = data
    const {
      browse_collection_indexes,
      customer_photo_indexes,
      look_indexes
    } = indexes
    if (customer_photos && customer_photos.length) {
      if (customer_photo_indexes[0] < array.length) {
        array.splice(customer_photo_indexes[0], 0, customer_photos[0])
      }
    }
    if (looks && looks.length) {
      if (look_indexes[0] < array.length) {
        array.splice(look_indexes[0], 0, looks[0])
      }
    }
    if (browse_collections && browse_collections.length) {
      if (browse_collection_indexes[0] < array.length) {
        array.splice(browse_collection_indexes[0], 0, browse_collections[0])
      }
    }
    this.productHybird = [...array]
  }

  @action
  refreshProducts = () => {
    this.filters.page = 1
    this.isMore = true
  }

  @action
  cleanProducts = () => {
    this.products = []
    this.productHybird = []
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
    if (!filter) {
      return
    }
    const isSelected = filter.indexOf(item) === -1
    if (isSelected) {
      if (type === 'FILTER_TERMS' && filter[0] === 'clothing') {
        filter[0] = item
      } else {
        filter.push(item)
      }
    } else {
      filter.remove(item)
      if (type === 'FILTER_TERMS' && filter.length === 0) {
        filter.push('clothing')
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
    this.productHybird = []
    this.filter_selections = []
    this.secondFilterTerms = []
    this.isMore = true
  }
}

class Filters {
  @observable color_families = []
  /*
  red
  pink
  orange
  yellow
  green
  blue
  purple
  black
  gray
  white
  cream
  brown
  gold
  rose_gold
  silver
  */
  @observable filter_terms = ['clothing']
  /*
  clothing
  accessory
  tops
  sweaters
  jackets
  dresses
  athleisure
  pants
  skirts
  bracelets
  earrings
  necklaces
  rings
  belts
  scarves
  handbags
  */
  @observable page = 1
  @observable per_page = 20
  @observable sort = 'area_based_popularity_recommended'
  /*
  newest
  Sort by activated_at

  newest
  Sort by like_percentage

  recommended
  Sort by recommended for current customer

  closet
  Sort by most recent closet for current customer

  display_order
  Sort by the display order of the browse collection

  sale_price_asc
  Sort by ascending order of sale price
  */
  @observable temperature = []
  /*  cold、mild、warm  */
}

export default new ProductsClothingStore()
