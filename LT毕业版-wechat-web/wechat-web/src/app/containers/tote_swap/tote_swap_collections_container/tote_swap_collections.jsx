import ProductsLoading from 'src/app/containers/products/products_loading/index'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import Swiper from 'react-id-swiper'
import * as storage from 'src/app/lib/storage.js'
import Gallery from 'src/app/containers/tote_swap/tote_swap_gallery_container/tote_swap_gallery'
import Actions from 'src/app/actions/actions.js'
import { ANALYZE_SLUG } from 'src/app/containers/tote_swap/utils/analyze_slug.js'
import 'src/assets/stylesheets/components/desktop/tote_swap/collections.scss'
import 'react-id-swiper/lib/styles/css/swiper.css'
import './index.scss'

class CollectionsInfo extends React.PureComponent {
  handleClick = product => () => {
    browserHistory.push({
      pathname: `/customize/collection_products/${product.id}`,
      query: {
        title: product.name,
        slug: ANALYZE_SLUG[product.slug]
      }
    })
  }

  render() {
    const { data } = this.props
    const { product_search_slots } = data
    return (
      <div className="tote-swap-collections-container info">
        <div className="collection-title">{data.name}</div>
        {_.map(product_search_slots, (v, k) => {
          return (
            <div
              className={`info-img ${k === 0 ? 'first' : ''}`}
              style={{ backgroundImage: `url(${v.sign})` }}
              key={k}
              onClick={this.handleClick(v)}
            >
              <span className="info-img-span">{v.name}</span>
            </div>
          )
        })}
        <div className="clear" />
      </div>
    )
  }
}

class CollectionsNewest extends React.PureComponent {
  handleClick = product => () => {
    browserHistory.push({
      pathname: `/customize/collection_products/${product.id}`,
      query: {
        title: product.name,
        slug: 'ToteSwapCollectionNextWeek'
      }
    })
  }

  render() {
    const { data } = this.props
    const newProducts = _.chunk(data.product_search_slots, 3)
    return (
      <div className="tote-swap-collections-container newest">
        <div className="collection-title">{data.name}</div>
        {_.map(newProducts, (v, k) => {
          return (
            <div className="collection-newest" key={k}>
              {_.map(v, (v1, k1) => {
                return (
                  <div
                    onClick={this.handleClick(v1)}
                    className="collection-box"
                    key={k1}
                  >
                    <img src={v1.sign} alt="" />
                    <div className="newest-title">
                      {v1.name}
                      <img
                        alt=""
                        src={require('src/app/containers/tote_swap/tote_swap_collections_container/img/next.svg')}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }
}

class CollectionsProducts extends React.Component {
  constructor(props) {
    super()
    this.options = {
      slidesPerView: 'auto',
      paginationClickable: true,
      freeMode: true,
      freeModeMinimumVelocity: 0.1,
      preloadImages: false,
      lazy: true,
      spaceBetween: 12,
      on: {
        touchEnd: _.debounce(this.setTouchPosition, 100, {
          leading: true
        }),
        transitionEnd: _.debounce(this.setTouchPosition, 100, {
          leading: true
        })
      }
    }
    const { id } = props.data.product_search_slots[0]
    const cacheId = parseInt(storage.get('CollectionsSelectId'), 10)
    this.state = {
      isSelected: cacheId || id,
      isLoading: false
    }
    this.filters = {
      page: 1,
      per_page: 20
    }
  }

  componentDidMount() {
    const { collectionsProducts } = this.props
    const { isSelected } = this.state
    if (_.isEmpty(collectionsProducts[isSelected])) {
      this.fetchProducts()
    }
  }

  setTouchPosition = () => {
    if (this.swiperDom) {
      const initPosition = this.swiperDom.childNodes[0].style.transform
      storage.set(this.cacheId, initPosition)
    }
  }

  fetchProducts = id => {
    if (this.state.isLoading) {
      return null
    }
    this.setState({
      isLoading: true
    })
    const selectId = id || this.state.isSelected
    this.props.dispatch(
      Actions.collectionsProducts.collectionsProducts(
        {
          product_search_sections: [
            {
              product_search_slots: [{ id: selectId, selected: true }]
            }
          ]
        },
        this.filters,
        () => {
          storage.set('CollectionsSelectId', selectId)
          this.setState({
            isLoading: false,
            isSelected: selectId
          })
        }
      )
    )
  }

  handleSelect = id => () => {
    const { collectionsProducts } = this.props
    if (_.isEmpty(collectionsProducts[id])) {
      this.fetchProducts(id)
    } else {
      storage.set('CollectionsSelectId', id)
      this.setState({
        isSelected: id
      })
    }
  }

  toggleCloset = (id, reportData) => {
    const inCloset = _.includes(this.props.closetProductIds, id)
    if (inCloset) {
      this.props.dispatch(Actions.closet.remove([id]))
    } else {
      this.props.dispatch(Actions.closet.add([id], reportData))
    }
  }

  getLinkUrl = id => `/customize/product/${id}`

  getSwiper = swiper => {
    if (swiper) {
      this.swiperDom = swiper.$el[0]
      this.cacheId = !_.isEmpty(this.props.data)
        ? `toteSwap_collection_products`
        : ''
      const cacheStyle = storage.get(this.cacheId)
      if (cacheStyle && this.swiperDom) {
        this.swiperDom.childNodes[0].style.transform = cacheStyle
      }
    }
  }

  render() {
    const { data, collectionsProducts } = this.props
    const { isSelected } = this.state
    return (
      <div className="tote-swap-collections-container products">
        <div className="collection-title">{data.name}</div>
        <div className="collection-products">
          <div className="products-title-box">
            <Swiper getSwiper={this.getSwiper} {...this.options}>
              {_.map(data.product_search_slots, (v1, k1) => {
                return (
                  <span
                    onClick={this.handleSelect(v1.id)}
                    className={`products-title ${
                      isSelected === v1.id ? 'select' : ''
                    }`}
                    key={k1}
                  >
                    <span className="title-text">{v1.name}</span>
                  </span>
                )
              })}
            </Swiper>
          </div>
        </div>
        <Gallery
          {...this.props}
          toggleCloset={this.toggleCloset}
          closetProductIds={this.props.closetProductIds}
          primaryGallery={collectionsProducts[isSelected]}
          fetchProducts={() => {}}
          getLinkUrl={this.getLinkUrl}
          loading={false}
          gallery="collections"
          filters={this.filters}
          more={false}
          handleGoback={browserHistory.goBack}
          analyzeSlug="ToteSwapCollectionRecommend"
        />
        {this.state.isLoading && (
          <div className="loading-box">
            <ProductsLoading tipText="" />
          </div>
        )}
      </div>
    )
  }
}

export default function ToteSwapCollections(props) {
  const { collections } = props
  return (
    <div className="tote-swap-products-container">
      <div id="tote-swap-collections">
        <PageHelmet title="精选" link="/customize/collections" />
        {_.map(collections, (v, k) => {
          if (v.name === '她们都在穿') {
            return <CollectionsInfo key={k} data={v} />
          } else if (v.name === '下周穿什么') {
            return <CollectionsNewest key={k} data={v} />
          } else if (v.name === '搭配师推荐') {
            return <CollectionsProducts {...props} key={k} data={v} />
          } else {
            return null
          }
        })}
      </div>
    </div>
  )
}
