import React, { Component, PureComponent } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Animated,
  Dimensions
} from 'react-native'
import { getDisplaySizeName } from '../../../../src/expand/tool/product_l10n'
import QualityIssues from './quality_issues'
const SCREEN_HEIGHT = Dimensions.get('window').height
import Image from '../../image'
import {
  dismissFullscreenImage,
  showFullscreenImage
} from '../../products/Carousel'
import p2d from '../../../../src/expand/tool/p2d'
import Icon from 'react-native-vector-icons/Entypo'

class PanelRateServiceItem extends Component {
  constructor(props) {
    super(props)
    const { rating } = props
    if (rating) {
      this.state = { showTips: false, photos: [], ...rating.state }
    } else {
      this.state = { showTips: false, photos: [] }
    }
    this.HEIGHT = -SCREEN_HEIGHT
    this.heightAnim = new Animated.Value(this.HEIGHT)
  }

  componentDidMount() {
    this._startAnimated()
  }

  _startAnimated() {
    Animated.spring(this.heightAnim, {
      toValue: 0
    }).start()
  }

  updatePhotos = photos => {
    this.setState({ photos })
  }

  _didSelectedQuality = quality => {
    this.setState({ ...this.state, ...quality })
  }

  removeObjectValueIsNull = obj => {
    if (!(typeof obj === 'object')) {
      return
    }
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && !obj[key] && key !== 'quality') {
        delete obj[key]
      }
      if (obj['quality']) {
        delete obj['quality']
      }
      if (obj['style'] === 'ok') {
        delete obj['style']
      }
      if (obj['photos'] && !!!obj['photos'].length) {
        delete obj['photos']
      }
      delete obj['showTips']
    }
    return obj
  }

  didSaveRating = () => {
    const {
      didChangeRating,
      rating,
      hideModal,
      toteProduct,
      appStore
    } = this.props
    let newRating = rating
      ? { ...rating.state, ...this.state }
      : { ...this.state }
    newRating = this.removeObjectValueIsNull(newRating)
    const qualityGroup = toteProduct.service_question_sets.find(i => {
      return (i.group_name = 'quality')
    })
    const qualityQuestions = qualityGroup.questions.find(i => {
      return (i.key = 'quality_issues')
    })
    const qualityIssues = qualityQuestions.options
    let keys = []
    qualityIssues.map(item => {
      if (item.value !== 'smelled') {
        keys.push(item.value)
      }
    })
    let qualityState = []
    keys.forEach(key => {
      if (newRating[key]) {
        qualityState.push(key)
      }
    })
    let stateNum = Object.keys(newRating)
    if (!!!stateNum.length) {
      appStore.showToastWithOpacity('请先选择问题选项')
      return
    }
    if (newRating.photos && newRating.quality === undefined) {
      appStore.showToastWithOpacity('请选择质量问题')
      return
    }
    if (!!qualityState.length) {
      if (
        !newRating.photos ||
        (newRating.photos && newRating.photos.length < 2)
      ) {
        appStore.showToastWithOpacity('请上传至少2张照片')
        return
      } else {
        let findNull = newRating.photos.find(i => {
          return !i.upload_url
        })
        if (!!findNull) {
          return
        }
      }
    }
    didChangeRating && didChangeRating(newRating, toteProduct)
    hideModal && hideModal()
  }

  _didSelectedQualityRating = quality => {
    this.setState({ quality: !quality })
  }

  showTips = () => {
    this.setState({ showTips: true })
  }

  hideTips = () => {
    this.setState({ showTips: false })
  }

  returnNowRating = () => {
    const nowState = { ...this.state }
    return this.removeObjectValueIsNull(nowState)
  }

  render() {
    const { photos, showTips } = this.state
    const { toteProduct, hideModal } = this.props
    const { product, service_question_sets } = toteProduct
    const qualityGroup = service_question_sets.find(i => {
      return (i.group_name = 'quality')
    })
    const qualityQuestions = qualityGroup.questions.find(i => {
      return (i.key = 'quality_issues')
    })
    const qualityIssues = qualityQuestions.options
    const title =
      product.type === 'Clothing'
        ? `${product.title} ${getDisplaySizeName(
            toteProduct.product_size.size_abbreviation
          )}`
        : product.title
    if (showTips) {
      return <TipsView hideTips={this.hideTips} />
    }
    const nowRating = this.returnNowRating()
    return (
      <View>
        <ScrollView bounces={false} style={{ maxHeight: SCREEN_HEIGHT * 0.86 }}>
          <View style={styles.titleView}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              style={styles.icon}
              hitSlop={styles.hitSlop}
              onPress={hideModal}>
              <Image
                source={require('../../../../assets/images/rating/close.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            <QualityIssues
              issues={qualityIssues}
              rating={nowRating}
              didSelected={this._didSelectedQuality}
              rateTheIssue={this._didSelectedQualityRating}
              photos={photos}
              updatePhotos={this.updatePhotos}
              showTips={showTips}
            />
            <View style={styles.tipsView}>
              <Text style={styles.tipsViewTitle}>
                {`Tips：须提供2-5张照片展示详细情况，异味问题除外\n尽量上传清晰大图，质检员才能快速核查 `}
                <Text onPress={this.showTips} style={{ color: '#70AAEF' }}>
                  查看图片示例
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.button} onPress={this.didSaveRating}>
            <Text style={styles.buttonText}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
class SeePanelRateServiceItem extends PureComponent {
  showFullscreenImage = (imgRefs, index, getProductImages, fullscreenImage) => {
    showFullscreenImage(
      imgRefs,
      index,
      getProductImages,
      fullscreenImage,
      dismissFullscreenImage
    )
  }

  render() {
    const { toteProduct, hidePanel } = this.props
    const { product, service_feedback } = toteProduct
    const { quality_issues_human_names, quality_photo_urls } = service_feedback
    const title =
      product.type === 'Clothing'
        ? `${product.title} ${getDisplaySizeName(
            toteProduct.product_size.size_abbreviation
          )}`
        : product.title
    return (
      <View style={styles.container}>
        <View style={[styles.titleView, { borderBottomWidth: 0 }]}>
          <Text style={[styles.title, { marginLeft: 0, fontSize: 18 }]}>
            投诉详情
          </Text>
          <TouchableOpacity
            hitSlop={styles.hitSlop}
            style={[styles.icon, { marginRight: 0 }]}
            onPress={hidePanel}>
            <Image
              source={require('../../../../assets/images/rating/close.png')}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{title}</Text>
        <View style={styles.labelView}>
          {quality_issues_human_names.map((item, index) => {
            return (
              <View style={styles.label} key={index}>
                <Text style={styles.labelText}>{item}</Text>
              </View>
            )
          })}
        </View>
        <View style={styles.labelView}>
          {quality_photo_urls &&
            quality_photo_urls.map((item, index) => {
              const newStyle =
                index + 1 === quality_photo_urls.length
                  ? { marginRight: 0 }
                  : {}
              return (
                <SwiperItem
                  item={item}
                  key={index}
                  style={newStyle}
                  number={index}
                  imageArray={quality_photo_urls}
                />
              )
            })}
        </View>
      </View>
    )
  }
}

class SwiperItem extends PureComponent {
  constructor(props) {
    super(props)
    this.imgRefs = {}
  }

  _getProductImages = () => {
    const { imageArray } = this.props
    const { height, width } = Dimensions.get('window')
    return imageArray.map((item, index) => {
      return (
        <Image
          key={index}
          resizeMode="contain"
          style={{ height, width }}
          source={{ uri: item }}
        />
      )
    })
  }

  showFullscreenImage = (imgRefs, index, getProductImages, fullscreenImage) => {
    showFullscreenImage(
      imgRefs,
      index,
      getProductImages,
      fullscreenImage,
      dismissFullscreenImage
    )
  }

  render() {
    const { item, style, number } = this.props
    return (
      <TouchableOpacity
        activeOpacity={1}
        ref={ref => (this.imgRefs[number] = ref)}
        onPress={() =>
          this.showFullscreenImage(
            this.imgRefs[number],
            number,
            this._getProductImages,
            this.fullscreenImage
          )
        }>
        <Image
          qWidth={200}
          style={[styles.image, style]}
          source={{ uri: item }}
        />
      </TouchableOpacity>
    )
  }
}

class TipsView extends PureComponent {
  render() {
    const { hideTips } = this.props
    return (
      <View>
        <View style={styles.titleView}>
          <Text style={styles.title}>图片示例</Text>
          <TouchableOpacity
            style={styles.icon}
            hitSlop={styles.hitSlop}
            onPress={hideTips}>
            <Icon name={'chevron-thin-down'} size={20} color={'#ccc'} />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Text style={styles.tipsHeader}>* 以纽扣脱落为例</Text>
          <View style={styles.tipsContainer}>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../../../../assets/images/rating/rate_service_tips1.png')}
              />
              <Text style={styles.tipsTitleWide}>整体照</Text>
              <Text
                style={styles.tipsTitle}>{`拍摄服饰整体\n并指出问题区域`}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../../../../assets/images/rating/rate_service_tips2.png')}
              />
              <Text style={styles.tipsTitleWide}>局部照</Text>
              <Text
                style={styles.tipsTitle}>{`拍摄服饰局部\n并展示质量情况`}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: p2d(16)
  },
  titleView: {
    height: p2d(56),
    flexDirection: 'row',
    borderBottomColor: '#F3F3F3',
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 16,
    color: '#333',
    fontWeight: '700',
    marginLeft: p2d(16)
  },
  icon: {
    marginRight: p2d(26)
  },
  buttonView: {
    borderTopColor: '#F0F0F0',
    borderTopWidth: 1,
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#EA5C39',
    width: p2d(343),
    height: p2d(44),
    borderRadius: 2,
    marginVertical: p2d(8),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
    marginRight: p2d(8),
    fontWeight: '700'
  },
  name: {
    fontSize: 14,
    color: '#999',
    letterSpacing: 0,
    marginBottom: p2d(16)
  },
  labelView: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  label: {
    paddingHorizontal: p2d(16),
    paddingVertical: p2d(7),
    borderRadius: 100,
    backgroundColor: '#FDEDE9',
    borderColor: '#E85C40',
    borderWidth: 0.5,
    marginBottom: p2d(16),
    marginHorizontal: p2d(4)
  },
  labelText: {
    fontSize: 12,
    color: '#E85C40'
  },
  image: {
    height: p2d(60),
    width: p2d(60),
    marginBottom: p2d(24),
    marginRight: p2d(8)
  },
  hitSlop: { top: 20, left: 20, right: 20, bottom: 20 },
  tipsView: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F7F7F7',
    marginVertical: 16
  },
  tipsViewTitle: {
    fontSize: 12,
    color: '#7A7A7A',
    lineHeight: 18
  },
  tipsHeader: {
    fontSize: 14,
    color: '#5E5E5E',
    marginTop: 24,
    marginBottom: 20
  },
  tipsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 42
  },
  tipsTitle: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18
  },
  tipsTitleWide: {
    fontSize: 15,
    color: '#242424',
    fontWeight: '700',
    marginTop: 23,
    marginBottom: 8
  }
})

export { PanelRateServiceItem, SeePanelRateServiceItem }
