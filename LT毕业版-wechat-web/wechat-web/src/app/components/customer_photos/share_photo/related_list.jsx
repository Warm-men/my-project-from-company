import './index.scss'
import { connect } from 'react-redux'
import ProductItem from './related_item'
import Actions from 'src/app/actions/actions.js'
import ActionButton from 'src/app/components/shared/action_button/index'
import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import { sortProducts } from 'src/app/lib/related_product'

function mapStateToProps(state, props) {
  const {
    share_list,
    relatedProducts: { relatedProducts }
  } = state
  const { tote_id, product_id } = props.location.query
  const totes = [...share_list.current_totes, ...share_list.delivered_totes]
  const currentTote = _.find(totes, v => v.id === Number(tote_id))
  let toteProducts = _.filter(currentTote.tote_products, v => {
    return v.product.id !== Number(product_id)
  })
  return {
    toteProducts,
    relatedProducts
  }
}
@connect(mapStateToProps)
export default class RelatedList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSubmit: false,
      currentRelatedProducts: props.relatedProducts
    }
  }
  didSelectedItem = product => {
    let index = -1
    const { currentRelatedProducts } = this.state
    let newRelatedProducts = []
    if (!_.isEmpty(currentRelatedProducts)) {
      index = _.findIndex(
        currentRelatedProducts,
        item => item.id === product.id
      )
    }
    if (index > -1) {
      newRelatedProducts = _.filter(
        currentRelatedProducts,
        item => item.id !== product.id
      )
    } else {
      newRelatedProducts = [...currentRelatedProducts, product]
    }
    this.setState({
      currentRelatedProducts: newRelatedProducts
    })
  }

  updateRelatedProduct = async () => {
    const { currentRelatedProducts } = this.state
    if (_.isEmpty(currentRelatedProducts)) {
      this.props.dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: '请先选择商品'
        })
      )
      return null
    }
    const { type } = this.props.location.query
    const isAccessory = type !== 'Clothing'
    let resortCurrentRelatedProducts = sortProducts(
      currentRelatedProducts,
      isAccessory
    )
    await this.props.dispatch(
      Actions.relatedProduct.updateRelatedProduct(resortCurrentRelatedProducts)
    )
    this.updatedFinished()
  }
  updatedFinished = () => {
    const timer = 1
    this.props.dispatch(
      Actions.tips.changeTips({
        isShow: true,
        image: require('../images/submit.png'),
        content: '关联成功',
        timer
      })
    )
    setTimeout(browserHistory.goBack, timer * 1000)
  }
  render() {
    const { relatedProducts, toteProducts, dispatch } = this.props
    const { currentRelatedProducts, isSubmit } = this.state
    return (
      <div className="related-list-container">
        <PageHelmet title="添加关联" link="/related_list" />
        <div className="product-item">
          {_.map(toteProducts, (item, index) => {
            const isSelected = _.findIndex(
              relatedProducts,
              v => v.id === item.id
            )
            if (isSelected > -1) return null
            return (
              <ProductItem
                product={item}
                key={index}
                didSelectedItem={this.didSelectedItem}
                currentRelatedProducts={currentRelatedProducts}
                dispatch={dispatch}
              />
            )
          })}
        </div>
        <StickyButtonContainer>
          <ActionButton size="stretch" onClick={this.updateRelatedProduct}>
            {isSubmit ? '提交中...' : '关联至晒单'}
          </ActionButton>
        </StickyButtonContainer>
      </div>
    )
  }
}
