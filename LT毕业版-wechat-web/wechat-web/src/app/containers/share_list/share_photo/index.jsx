import Actions from 'src/app/actions/actions.js'
import { connect } from 'react-redux'
import ActionButton from 'src/app/components/shared/action_button/index'
import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import PageHelmet from 'src/app/lib/pagehelmet'
import {
  Experience,
  AddRelated,
  StyleTag
} from 'src/app/components/customer_photos/share_photo'
import { browserHistory } from 'react-router'
import AddPhotos from 'src/app/components/upload_img/index.jsx'
import './index.scss'

function mapStateToProps(state) {
  const {
    share_list,
    toteProduct,
    totes: { current_totes },
    relatedProducts: { relatedProducts },
    customerPhotos: { customer_photo_summary_input }
  } = state
  const totes = [...share_list.current_totes, ...share_list.delivered_totes]
  return {
    products: toteProduct,
    currentTotes: current_totes,
    totes,
    relatedProducts,
    customer_photo_summary_input,
    customer_photo_data: state.shareListProduct.customer_photo_data
  }
}

@connect(mapStateToProps)
export default class SharePhoto extends React.Component {
  static helpPages = `https://static.letote.cn/pages/newshow_inroduce/index.html`

  constructor(props) {
    super(props)
    const { customer_photo_data, products } = props
    this.state = {
      isSubmiting: false,
      customerPhoto:
        !_.isEmpty(products.customer_photos) && products.customer_photos[0].url
    }
    this.uploadToken = null
    this.maxProductLength = 6
    this.postData = {
      postImgs: customer_photo_data.postImgs,
      styleTags: customer_photo_data.styleTags,
      content: customer_photo_data.content,
      sign: this.initSelectSign(props)
    }
  }
  componentDidMount() {
    const { params, dispatch } = this.props
    dispatch(Actions.totes.getToteProduct(parseInt(params.id, 10)))
  }

  initSelectSign = props => {
    const {
      customer_photo_data,
      customer_photo_summary_input: { customer_photo_summary }
    } = props
    return _.isEmpty(customer_photo_data)
      ? !_.isEmpty(customer_photo_summary) &&
        !_.isEmpty(customer_photo_summary.share_topics)
        ? customer_photo_summary.share_topics[0].title
        : null
      : customer_photo_data.sign
  }

  isUnValidSubmit = () => {
    const { postImgs, content } = this.postData
    const { dispatch } = this.props
    if (_.isEmpty(content)) {
      dispatch(
        Actions.tips.changeTips({ isShow: true, content: '请填写晒单内容' })
      )
      return true
    } else if (content.length < 6) {
      dispatch(
        Actions.tips.changeTips({ isShow: true, content: '需要超过6个字' })
      )
      return true
    } else if (_.isEmpty(postImgs)) {
      dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: '请先上传至少一张图片'
        })
      )
      return true
    }
    return false
  }

  panddingToSubmit = () => {
    if (this.state.isSubmiting || this.isUnValidSubmit()) {
      return null
    }
    this.setState({ isSubmiting: true }, this.uploadImage)
  }

  uploadImage = () => {
    this.handleSubmit(this.postData.postImgs)
  }

  handleSubmit = url => {
    const {
      params,
      customer_photo_summary_input: { customer_photo_summary },
      relatedProducts,
      location
    } = this.props
    const { share_topics } = customer_photo_summary
    const { styleTags, content, sign } = this.postData
    const tote_product_id = parseInt(params.id, 10)
    const tote_product_ids = [tote_product_id]
    _.map(relatedProducts, v => {
      tote_product_ids.push(v.id)
    })

    const input = {
      content: content,
      photo_urls: url,
      tote_product_ids,
      style_tag_ids: _.map(styleTags, v => v.id)
    }
    if (!_.isEmpty(share_topics) && !_.isEmpty(sign)) {
      input['share_topic_id'] = share_topics[0].id
    }
    this.props.dispatch(
      Actions.ratings.createCustomerPhoto(
        input,
        {
          tote_id: location.query.tote_id,
          tote_product_id
        },
        this.handleUploadSuccess,
        this.handleUploadError
      )
    )
  }

  handleUploadSuccess = (dispatch, response) => {
    const { errors, incentive } = response.data.CreateCustomerPhoto
    if (!_.isEmpty(errors)) {
      dispatch(Actions.tips.changeTips({ isShow: true, content: errors[0] }))
      this.setState({ isSubmiting: false })
      return null
    }
    // NOTE:晒单成功
    if (incentive && incentive.time_cash_amount > 0) {
      dispatch(Actions.currentCustomer.didFinishedFirstCustomerPhotoIncentive())
      browserHistory.replace('/share_photo_incentive')
    } else {
      browserHistory.goBack()
    }
  }

  handleUploadError = () => {
    const { dispatch } = this.props
    dispatch(Actions.tips.changeTips({ isShow: true, content: '提交晒单失败' }))
    this.setState({ isSubmiting: false })
  }

  linkToHelp = () => {
    browserHistory.push({
      pathname: '/web-view',
      query: { url: SharePhoto.helpPages }
    })
  }

  updateStyleTag = styleTags => (this.postData.styleTags = styleTags)

  updateSign = sign => (this.postData.sign = sign.sign)

  onChangeValue = value => (this.postData.content = value)

  addRelatedProduct = async () => {
    const {
      location,
      dispatch,
      products: { product }
    } = this.props
    await dispatch(
      Actions.customerPhotosSummary.setCustomerPhotoData({
        ...this.postData
      })
    )
    browserHistory.push({
      pathname: `/related_list`,
      query: {
        tote_id: location.query.tote_id,
        product_id: location.query.product_id,
        type: product.type
      }
    })
  }

  updatePhotoImageSuccess = url => {
    this.postData.postImgs = url
  }

  deleteImage = index => {
    const newPostImgs = [...this.postData.postImgs]
    this.postData.postImgs = _.remove(newPostImgs, (v, key) => index !== key)
  }

  render() {
    const {
      products,
      dispatch,
      relatedProducts,
      customer_photo_summary_input: { customer_photo_summary }
    } = this.props
    const { share_topics, style_tags, share_incentive } =
      customer_photo_summary || {}
    const isOver = relatedProducts.length < this.maxProductLength - 1
    const currentRelatedProducts = isOver
      ? [...relatedProducts, { empty: true }]
      : [...relatedProducts]
    return (
      <div className="share-phote">
        <PageHelmet title="晒单" link={`/share_list/${this.props.params.id}`} />
        <Experience
          updateSign={this.updateSign}
          onChangeValue={this.onChangeValue}
          shareTopics={!_.isEmpty(share_topics) ? share_topics[0] : {}}
          textareaMaxLength={120}
          content={this.postData.content}
          share_incentive={share_incentive}
          sign={this.postData.sign}
        />
        <div className="share-img">
          <AddPhotos
            updateSuccess={this.updatePhotoImageSuccess}
            postImgsMax={3}
            postImgs={this.postData.postImgs}
            deleteImage={this.deleteImage}
          />
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <span className="help" onClick={this.linkToHelp}>
              <i />
              晒单帮助
            </span>
          </div>
        </div>
        {!_.isEmpty(products.product) && (
          <AddRelated
            products={products}
            addRelatedProduct={this.addRelatedProduct}
            dispatch={dispatch}
            currentRelatedProducts={currentRelatedProducts}
          />
        )}
        <StyleTag
          styleTags={style_tags}
          maxTagsLength={2}
          updateStyleTag={this.updateStyleTag}
          dispatch={dispatch}
          tags={this.postData.styleTags}
        />
        {share_incentive && share_incentive.time_cash_amount > 0 && (
          <div className="share-incentive">
            *评选为精选晒单得{' '}
            <span className="text">{share_incentive.text}</span>
          </div>
        )}
        <StickyButtonContainer>
          <ActionButton size="stretch" onClick={this.panddingToSubmit}>
            {this.state.isSubmiting ? '提交中...' : '发布晒单赢好礼'}
          </ActionButton>
        </StickyButtonContainer>
      </div>
    )
  }
}
