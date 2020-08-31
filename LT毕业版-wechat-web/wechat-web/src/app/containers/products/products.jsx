import 'src/assets/stylesheets/components/desktop/browse_collection/browse_collection.scss'
import 'src/assets/stylesheets/components/desktop/brands/brands.scss'
import React from 'react'
import { format } from 'date-fns'
import classname from 'classnames'
import { connect } from 'react-redux'
import SortButtons from './sort_buttons'
import { withRouter } from 'react-router'
import Actions from '../../actions/actions'
import PageHelmet from 'src/app/lib/pagehelmet'
import { Column } from 'src/app/constants/column'
import FloatButtons from 'src/app/components/float_buttons'
import { placeholder_335_190 } from 'src/assets/placeholder'
import PreventScroll from 'src/app/components/HOC/PreventScroll'
import ProgressiveImage from 'src/app/components/ProgressiveImage'
import DescriptionText from 'src/app/containers/products/components/description'
import NewProductsSortBtn from 'src/app/containers/products/new_products_sort_btn'
import ProductScrollList, {
  ProductsScrollListComponent
} from './products_scroll_list/products_scroll_list'

const IKnowMask = ({ handleIKnow }) => (
  <i className="intel-select-hint">
    <div className="i-know" onClick={handleIKnow} />
  </i>
)

const EnhanceIKonwMask = PreventScroll(IKnowMask)

@connect(({ products: { products: modalProducts } }) => ({
  modalProducts: modalProducts
}))
@withRouter
export default class ProductsContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectSize: null,
      showProduct: null,
      showModalType: ''
    }
    this.handleClickAddToToteCarting = false
  }

  getProductById = id => {
    return new Promise(res => {
      const { modalProducts, dispatch } = this.props
      const product = modalProducts[id]
      if (!_.isEmpty(product)) {
        this.setState({ showProduct: product }, () => {
          res(product)
        })
        return null
      }
      dispatch(
        Actions.products.fetchBrowseProduct(id, (dispatch, data) => {
          const { product } = data.data
          dispatch(
            Actions.fullscreencarousel.setFullScreenPhoto(
              product.catalogue_photos
            )
          )
          this.setState({ showProduct: product }, () => {
            res(product)
          })
        })
      )
    })
  }

  showNewProductsSortBtn = () => {
    const {
      showNewProductsSortBtn,
      latest_call_to_actions,
      handleSelectSortBtn,
      filters
    } = this.props
    if (showNewProductsSortBtn) {
      let btns = []
      _.map(latest_call_to_actions, v => {
        btns.push({ text: format(v, 'MM.DD上架'), value: v })
      })
      return (
        <NewProductsSortBtn
          btns={btns}
          selectDate={filters.activated_date_intervals}
          handleClick={handleSelectSortBtn}
        />
      )
    }
  }

  render() {
    //PageHelmet props
    const { productsTitle, mini_share, miniAppShareUrl } = this.props
    //EnhanceIKonwMask props
    const { handleIKnow } = this.props
    //showIntroduction props
    const { showIntroduction, logo, description } = this.props
    //SortButtons props
    const {
      buttons,
      products,
      isNoSort,
      customer,
      authentication,
      showSortBotton,
      showFilterModal,
      intelligentSelect,
      location: { pathname, query }
    } = this.props

    const action_bar = classname('brand-detail-action-bar', {
      'brand-detail-action-bar-margin-top': pathname === '/customize/clothing'
    })

    const isShowHint =
      authentication &&
      authentication.isValidSubscriber &&
      query &&
      query.column === Column.Clothing

    return (
      <div>
        <PageHelmet
          title={productsTitle}
          link={pathname}
          shareUrl={
            miniAppShareUrl
              ? miniAppShareUrl
              : mini_share
              ? mini_share.link
              : ''
          }
          shareImg={mini_share && mini_share.imgUrl}
          shareTitle={mini_share && mini_share.title}
        />
        {isShowHint && customer && customer.is_reminded_with_size_filter && (
          <EnhanceIKonwMask handleIKnow={handleIKnow} />
        )}
        {showIntroduction && logo && (
          <div className="brand-header">
            <ProgressiveImage src={logo} placeholder={placeholder_335_190}>
              {image => (
                <img
                  className="brand-detail-banner"
                  src={image}
                  alt={'brand_icon'}
                />
              )}
            </ProgressiveImage>
            {description && <DescriptionText text={description} />}
          </div>
        )}
        {showSortBotton && !isNoSort && (
          <div className={action_bar}>
            {products && (
              <SortButtons
                products_size_filter={customer && customer.products_size_filter}
                toggleModal={showFilterModal}
                intelligentSelect={intelligentSelect}
                isShowIntelBox={isShowHint}
              />
            )}
          </div>
        )}
        <FloatButtons buttons={buttons} isInitScroll={!isNoSort} />
        {this.showNewProductsSortBtn()}
        <ProductScrollList
          {...ProductsScrollListComponent.mapPropsFromContainerProps(
            this.props,
            this.state.showProduct,
            this.getProductById
          )}
          realtimeProductRecommended={this.state.showProduct}
        />
      </div>
    )
  }
}
