import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import SizeChart from './sizechart'
import PageHelmet from 'src/app/lib/pagehelmet'
import {
  UserSizeTitle,
  TopsSizeTitle,
  SkirtsSizeTitle,
  PantsSizeTitle,
  ShortsSizeTitle,
  DressesSizeTitle,
  RANGE_TYPE
} from './sizechart/utils'
import * as storage from 'src/app/lib/storage.js'
import { l10nChartSize } from 'src/app/lib/product_l10n.js'
import { bustSizeComputed } from 'src/app/lib/calculate_size.js'
import DressesChart from 'src/assets/images/productSizeChart/dresses_chart.svg'
import JacketsChart from 'src/assets/images/productSizeChart/jackets_chart.png'
import PantsChart from 'src/assets/images/productSizeChart/pants_chart.svg'
import SkirtsChart from 'src/assets/images/productSizeChart/skirts_chart.png'
import TopsChart from 'src/assets/images/productSizeChart/tops_chart.png'
import ShortsChart from 'src/assets/images/productSizeChart/shorts_chart.png'
import SuitsChart from 'src/assets/images/productSizeChart/suits_chart.png'
import './sizechart/index.scss'
import 'src/assets/stylesheets/components/desktop/product/product_size_chart.scss'
import Actions from 'src/app/actions/actions.js'
class ProductSizeChartContainer extends React.Component {
  constructor(props) {
    super(props)
    this.sizeType = null
    this.productTitle = this.handleProductTitle()
    this.userRowList = this.handleUserRowList()
    this.chartImg = this.handleChartImg()
    this.productRowList = this.handleProductRowList()

    this.state = {
      realtimeProductRecommended: null,
      recommenIndex: null
    }
  }

  componentDidMount() {
    this.fetchRealtimeRecommended()
  }

  checkCurrentStyle = () => {
    const { style } = this.props.customer
    const { height_inches, weight, bra_size, bust_size_number } = style
    return height_inches && weight && (bra_size || bust_size_number)
  }

  updateSize = () => {
    storage.remove('displayedTips')
    storage.set('isReceivedRule', true)
    const { customer } = this.props
    const { height_inches, weight, bra_size } = customer.style
    if (!height_inches || !weight || !bra_size) {
      browserHistory.push('measure_detail_input')
    } else {
      browserHistory.push({
        pathname: '/style_profile/figure_input',
        query: { pre_page: 'size_chart' }
      })
    }
  }

  handleUserRowList = () => {
    const { style } = this.props.customer
    let rowList = []
    _.map(UserSizeTitle, v => {
      rowList.push(style[v.type] ? parseInt(style[v.type], 10) : '--')
    })
    return [rowList]
  }

  handleProductRowList = () => {
    const { product } = this.props
    if (!product) {
      return []
    }

    return this.handleRowList(product.product_sizes, this.handleProductTitle())
  }

  handleRowList = (productSizes, sizetitle) => {
    const { product } = this.props
    let rowList = []
    let emptyList = new Array(sizetitle.length).fill(0)
    _.map(productSizes, (v, k) => {
      let row = []
      if (product.recommended_size === v.size.name) {
        if (this.checkCurrentStyle()) {
          this.setState({ recommenIndex: k })
        }
      }
      _.map(sizetitle, (v1, k1) => {
        if (v1.type === 'abbreviation') {
          const chartSize = l10nChartSize(v.size.abbreviation)
          if (chartSize.type) {
            this.sizeType = chartSize.type
          }
          row.push(chartSize.size)
        } else {
          if (v1.type === 'hips' ? v['hip'] : v[v1.type]) {
            // NOTE: bust hips waist是有min max值
            if (_.includes(RANGE_TYPE, v1.type)) {
              const minValue = v[`${v1.type}_min_tolerance`],
                maxValue = v[`${v1.type}_max_tolerance`]
              row.push([minValue, '-', maxValue])
            } else {
              row.push(v[v1.type])
            }
          } else {
            emptyList[k1] = emptyList[k1] + 1
            row.push('--')
          }
        }
      })
      rowList.push(row)
    })
    const emptyIndex = _.findIndex(emptyList, o => o === productSizes.length)
    if (emptyIndex >= 0) {
      let title = [...this.productTitle]
      let emptyIndex = []
      _.map(emptyList, (v, k) => {
        if (v === productSizes.length) {
          emptyIndex.push(k)
        }
      })
      _.map(emptyIndex, (v, k) => {
        const index = v - k
        emptyList.splice(index, 1)
        title.splice(index, 1)
        _.map(rowList, (v1, k1) => rowList[k1].splice(index, 1))
      })
      this.productTitle = title
    }
    return rowList
  }

  handleProductTitle = () => {
    const { product } = this.props
    if (!product) {
      return []
    }
    if (product.category.name === 'pants') {
      return PantsSizeTitle
    } else if (product.category.name === 'skirts') {
      return SkirtsSizeTitle
    } else if (product.category.name === 'shorts') {
      return ShortsSizeTitle
    } else if (product.category.name === 'dresses') {
      return DressesSizeTitle
    } else {
      return TopsSizeTitle
    }
  }

  handleChartImg = () => {
    const { product } = this.props
    if (!product) {
      return null
    }
    if (product.category.name === 'pants') {
      return PantsChart
    } else if (product.category.name === 'skirts') {
      return SkirtsChart
    } else if (product.category.name === 'jackets') {
      return JacketsChart
    } else if (product.category.name === 'dresses') {
      return DressesChart
    } else if (product.category.name === 'shorts') {
      return ShortsChart
    } else if (product.category.name === 'suits') {
      return SuitsChart
    } else {
      return TopsChart
    }
  }

  get userStyleInfo() {
    const {
      bra_size,
      cup_size,
      bust_size_number,
      waist_size: waist,
      hip_size_inches: hips
    } = this.props.customerStyleInfo
    let bust = bust_size_number
    if (!bust && bra_size) bust = bustSizeComputed(bra_size, cup_size)
    return {
      bust,
      hips,
      waist
    }
  }

  fetchRealtimeRecommended = () => {
    const { product, dispatch } = this.props
    dispatch(
      Actions.products.fetchRealtimeRecommended(
        product.id,
        (dispatch, response) => {
          const data =
            response.data.realtime_product_recommended_size_and_product_sizes
          this.setState({ realtimeProductRecommended: data })

          if (data && data.recommended_size) {
            const recommenIndex = product.product_sizes.findIndex(i => {
              return data.recommended_size.name === i.size.name
            })

            if (recommenIndex !== -1 && this.checkCurrentStyle()) {
              this.setState({ recommenIndex })
            }
          }
        }
      )
    )
  }
  render() {
    const { realtimeProductRecommended, recommenIndex } = this.state
    return (
      <div className="product-size-chart">
        <PageHelmet title="尺码表" link={`/product_size_chart`} />
        <SizeChart
          key={1}
          leftTitle={'个人尺码'}
          rightTitle={'编辑'}
          titleList={UserSizeTitle}
          rowList={this.userRowList}
          handleTitleClick={this.updateSize}
        />
        <SizeChart
          key={2}
          leftTitle={'商品尺码'}
          recommenIndex={recommenIndex}
          rowList={this.productRowList}
          titleList={this.productTitle}
          sizeType={this.sizeType}
          userStyleInfo={this.userStyleInfo}
          realtimeProductRecommended={realtimeProductRecommended}
        />
        <div className="chart-container" key={3}>
          <h4 className="chart-title">尺码图示</h4>
          <img className="chart-img" alt="" src={this.chartImg} />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  const { location } = props.router
  const id = location.state.id,
    isToteSwap = location.state.isToteSwap,
    product = isToteSwap
      ? state.toteSwap.products[id]
      : state.products.products[id]
  return {
    product,
    customer: state.customer,
    customer_id: state.customer.id,
    customerStyleInfo: state.customer.style
  }
}

export default connect(mapStateToProps)(withRouter(ProductSizeChartContainer))
