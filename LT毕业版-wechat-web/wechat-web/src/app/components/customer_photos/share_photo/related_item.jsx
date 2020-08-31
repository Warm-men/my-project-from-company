import Actions from 'src/app/actions/actions.js'

export default class RelatedItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSelected: false
    }
  }
  didSelectedItem = () => {
    const { isSelected } = this.state
    const { currentRelatedProducts, dispatch } = this.props
    if (currentRelatedProducts.length > 4 && !isSelected) {
      dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: '你最多只能关联5个商品'
        })
      )
      return null
    }
    this.setState({
      isSelected: !isSelected
    })
    const { didSelectedItem, product } = this.props
    didSelectedItem(product)
  }
  render() {
    const {
      product: {
        catalogue_photos,
        title,
        brand: { name }
      },
      product_size: { size_abbreviation }
    } = this.props.product
    const productImgUrl = catalogue_photos[0].medium_url
    const buttonImgUrl = this.state.isSelected
      ? require('../images/on.png')
      : require('../images/off.png')
    return (
      <div className="related-item-container" onClick={this.didSelectedItem}>
        <div className="select-button-view">
          <img src={buttonImgUrl} alt="" className="button-img" />
        </div>
        <img src={productImgUrl} alt="" className="related-item-img" />
        <div className="product-details">
          <div className="name">{name}</div>
          <div className="product-title">{title}</div>
          <div className="size">{size_abbreviation}</div>
        </div>
      </div>
    )
  }
}
