import Actions from 'src/app/actions/actions.js'
import { connect } from 'react-redux'
import './index.scss'
import { browserHistory } from 'react-router'
import wxInit from 'src/app/lib/wx_config'
import { sortRelatedProducts } from 'src/app/lib/customer_photos'
import Swiper from 'react-id-swiper'
import 'react-id-swiper/lib/styles/css/swiper.css'
import 'src/app/components/custom_components/swiper.scss'

function mapStateToProps(state, props) {
  return {
    location: props.location
  }
}
@connect(mapStateToProps)
export default class SharePhotosFinished extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      share_topics: [],
      content: '',
      style_tags: [],
      products: [],
      photos: [],
      isLoading: true
    }
    this.handleClick = /MicroMessenger/i.test(navigator.userAgent)
      ? this.handleWeChatClick
      : this.handleWebClick
    this.options = {
      slidesPerView: 'auto',
      paginationClickable: true,
      freeMode: true,
      preloadImages: false,
      lazy: true,
      spaceBetween: 8
    }
  }

  componentDidMount() {
    this.getToteProductCustomerPhoto()
  }
  handleWeChatClick = index => {
    const { photos } = this.state,
      NewArr = []
    _.map(photos, photo => {
      const url = photo.url || photo.mobile_url
      NewArr.push(url)
      return false
    })
    wx.ready(() => {
      wx.previewImage({
        current: NewArr[index], // 当前显示图片的http链接
        urls: NewArr, // 需要预览的图片http链接列表
        fail: () => wxInit(true, () => this.handleWeChatClick(index))
      })
    })
  }

  handleWebClick = index => {
    this.props.dispatch(Actions.fullScreenCarouselPhotos.setInitIndex(index))
    const path = {
      pathname: '/fullscreen',
      query: { isCustomerPhotosInDetails: true }
    }
    browserHistory.push(path)
  }

  getToteProductCustomerPhoto = () => {
    const { location, dispatch } = this.props
    const { id } = location.query
    const variables = { id }

    dispatch(
      Actions.customerPhotosSummary.fetchWebCustomerPhotosToteProduct(
        variables,
        this.getToteProductCustomerPhotoSuccess,
        () => {
          this.setState({ isLoading: false })
        }
      )
    )
  }

  getToteProductCustomerPhotoSuccess = (dis, response) => {
    const { tote_product } = response.data
    if (tote_product) {
      const { customer_photos_v2 } = tote_product
      if (customer_photos_v2 && customer_photos_v2.length) {
        const {
          share_topics,
          content,
          style_tags,
          products,
          photos
        } = customer_photos_v2[0]
        const { dispatch } = this.props
        dispatch(Actions.fullScreenCarouselPhotos.setFullScreenPhoto(photos))
        this.setState({
          share_topics,
          content,
          style_tags,
          products,
          photos,
          isLoading: false
        })
      }
    }
  }

  didSelectedProduct = item => {
    const { id } = item.product
    browserHistory.push({
      pathname: `/products/${id}`,
      state: { column_name: 'CustomerPhotoFinished' }
    })
  }

  render() {
    const { share_topics, content, photos, products, style_tags } = this.state
    const newProducts = sortRelatedProducts(products)
    if (_.isEmpty(photos)) return null
    const title = !!share_topics.length && share_topics[0].title
    const description = content && title ? title + content : content || title
    return (
      <div className="finished-share-container">
        {!_.isEmpty(description) && (
          <div className="share-topic">{description}</div>
        )}
        <div className="scroll-wrapper-view">
          <div className="photos-img-views">
            <Swiper
              slideClass="custom-swiper-slide"
              wrapperClass="custom-swiper-wrapper"
              {...this.options}
            >
              {_.map(photos, (photo, index) => {
                return (
                  <div
                    className="img-view-wrapper"
                    key={index}
                    onClick={() => this.handleClick(index)}
                  >
                    <div
                      className="img-wrapper"
                      style={{
                        backgroundImage: `url(${photo.mobile_url})`
                      }}
                    />
                  </div>
                )
              })}
            </Swiper>
          </div>
        </div>

        {!_.isEmpty(newProducts) && (
          <div className="related-product">
            <div className="related-product-title">关联单品</div>
            <div className="related-product-img-views">
              <Swiper
                slideClass="custom-swiper-slide"
                wrapperClass="custom-swiper-wrapper"
                {...this.options}
              >
                {_.map(newProducts, (item, index) => {
                  return (
                    <div className="img-wrapper" key={index}>
                      <ProductItem
                        item={item}
                        didSelectedProduct={this.didSelectedProduct}
                      />
                    </div>
                  )
                })}
              </Swiper>
            </div>
          </div>
        )}
        {!_.isEmpty(style_tags) && (
          <div className="tags-view">
            <div className="tags-view-title">风格标签</div>
            <div className="tage-wrapper">
              {_.map(style_tags, (item, index) => {
                return (
                  <div key={index} className="tag">
                    {item.name}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }
}

class ProductItem extends React.Component {
  didSelectedProduct = () => {
    const { didSelectedProduct, item } = this.props
    didSelectedProduct(item)
  }
  render() {
    const { item } = this.props
    const { catalogue_photos } = item.product
    const image =
      catalogue_photos &&
      catalogue_photos.length &&
      catalogue_photos[0].medium_url
    if (!image) return null
    return (
      <img
        className="related-product-img"
        alt=""
        src={image}
        onClick={this.didSelectedProduct}
      />
    )
  }
}
