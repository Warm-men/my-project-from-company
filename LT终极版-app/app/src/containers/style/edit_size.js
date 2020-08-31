import React, { Component, PureComponent } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity
} from 'react-native'
import {
  SafeAreaView,
  NavigationBar,
  BarButtonItem
} from '../../../storybook/stories/navigationbar'
import {
  Mutate,
  SERVICE_TYPES,
  QNetwork
} from '../../expand/services/services.js'
import MeStyleCommonTitle from '../../../storybook/stories/account/me_style_common_title'
import p2d from '../../expand/tool/p2d'
import Image from '../../../storybook/stories/image'
import SizeSelector from '../../../storybook/stories/account/size_selector'
import {
  SHOULDERSIZE,
  WAISTSIZE,
  HIPSIZEINCHES,
  INSEAM,
  BODY_SIZE,
  BUST_SIZE_NUMBER
} from '../../expand/tool/size/size'
import { inject, observer } from 'mobx-react'
import { COUNT_BUST_SIZE } from '../../expand/tool/size/calSize'

@inject('currentCustomerStore', 'appStore')
@observer
export default class EditSizeContainer extends Component {
  constructor(props) {
    super(props)
    const { navigation } = props
    const { type } = navigation.state.params
    this.currentSizeData = this._getCurrentTypeData(type)
    const styleSizeValue = this._getStyleSizeValue(type)
    this.state = {
      currentSize: styleSizeValue
        ? styleSizeValue
        : this.currentSizeData.defaultSize,
      isLoading: false,
      maxValue: null,
      minValue: null,
      showSizePredict: false,
      hasSizePredict: false,
      skip: false
    }
    this.sizePredictType = null
    this.innitalSelector = true
  }

  componentDidMount() {
    this._fetchSizePredict()
    this._setInitalSelector()
  }

  componentWillUnmount() {
    this.timer = null
  }
  _setInitalSelector = () => {
    this.timer = setTimeout(() => {
      this.innitalSelector = false
    }, 500)
  }

  setSkip = () => {
    this.setState({ skip: !this.state.skip })
  }

  _fetchSizePredict = () => {
    const { params } = this.props.navigation.state
    const paramsHeightInches = params.height_inches
    const paramsWeight = params.weight
    let serviceType
    if (params.type === 'bust_size_number') {
      this.sizePredictType = 'bust_predict'
      serviceType = SERVICE_TYPES.me.QUERY_BUST_PREDICT
    } else if (params.type === 'waist_size') {
      this.sizePredictType = 'waist_predict'
      serviceType = SERVICE_TYPES.me.QUERY_WAIST_PREDICT
    } else if (params.type === 'hip_size_inches') {
      this.sizePredictType = 'hips_predict'
      serviceType = SERVICE_TYPES.me.QUERY_HIPS_PREDICT
    } else return null
    const { style } = this.props.currentCustomerStore
    const { weight, height_inches } = style
    const styleInput = {
      height_inches: paramsHeightInches || height_inches,
      weight: paramsWeight || weight
    }
    QNetwork(serviceType, { input: styleInput }, response => {
      const { available, max_value, min_value } = response.data[
        this.sizePredictType
      ]
      if (available) {
        this.setState({
          maxValue: max_value,
          minValue: min_value,
          hasSizePredict: true
        })
      }
    })
  }

  _getStyleSizeValue = type => {
    const { style } = this.props.currentCustomerStore
    let styleSizeValue
    if (type === 'bust_size_number') {
      styleSizeValue = style.bust_size_number
        ? style.bust_size_number
        : COUNT_BUST_SIZE(style.bra_size, style.cup_size)
    } else {
      styleSizeValue = style[type]
    }
    return styleSizeValue
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  _getCurrentTypeData = type => {
    let sizeArray
    let defaultSize
    switch (type) {
      case 'shoulder_size':
        sizeArray = SHOULDERSIZE()
        defaultSize = 40
        break
      case 'waist_size':
        sizeArray = WAISTSIZE()
        defaultSize = 70
        break
      case 'hip_size_inches':
        sizeArray = HIPSIZEINCHES()
        defaultSize = 80
        break
      case 'inseam':
        sizeArray = INSEAM()
        defaultSize = 70
        break
      case 'bust_size_number':
        sizeArray = BUST_SIZE_NUMBER()
        defaultSize = 80
        break
    }
    return { sizeArray, defaultSize }
  }

  _onChange = currentSize => {
    const { hasSizePredict, maxValue, minValue } = this.state
    if (hasSizePredict && (currentSize > maxValue || currentSize < minValue)) {
      this.setState({
        currentSize,
        showSizePredict: this.innitalSelector ? false : true
      })
    } else {
      this.setState({ currentSize })
    }
  }

  _updateStyle = () => {
    if (this.state.isLoading) {
      return
    }
    const { currentCustomerStore, navigation } = this.props
    const { type } = navigation.state.params
    if (!currentCustomerStore.id) {
      currentCustomerStore.setLoginModalVisible(true)
      return
    }
    const newSize = currentCustomerStore.style[type]
    if (newSize === this.state.currentSize && !this.state.skip) {
      //尺码没做修改，不提交
      navigation.goBack()
      return
    }
    this.setState({ isLoading: true })
    const style = { rescheduled_product_sizer: true, require_incentive: true }
    style[type] = this.state.currentSize
    if (type === 'shoulder_size') {
      style['shoulder_size_skip'] = this.state.skip
      if (this.state.skip) {
        style['shoulder_size'] = null
      }
    }
    if (type === 'inseam') {
      style['inseam_skip'] = this.state.skip
      if (this.state.skip) {
        style['inseam'] = null
      }
    }
    Mutate(
      SERVICE_TYPES.me.MUTAITON_UPDATE_STYLE,
      { input: style },
      response => {
        this.setState({ isLoading: false })
        const {
          style,
          incentive_url,
          incentive_granted
        } = response.data.UpdateStyle
        const url = incentive_granted && incentive_url ? incentive_url : ''
        style && currentCustomerStore.updateStyle(style)
        this._updateRecommendedSize(url)
      },
      () => {
        this.setState({ isLoading: false })
      }
    )
  }

  _updateRecommendedSize = url => {
    const { navigation, appStore } = this.props
    Mutate(
      SERVICE_TYPES.totes.MUTATION_TOTE_QUEUE_PRODUCT_SIZER,
      { input: {} },
      () => {
        if (url) {
          navigation.replace('WebPage', {
            uri: url,
            hideShareButton: true
          })
          return
        }
        appStore.showToastWithOpacity('保存成功')
        this.timer = setTimeout(() => {
          this.sizeOrder()
        }, 1500)
      }
    )
  }

  sizeOrder = () => {
    const { currentCustomerStore, navigation } = this.props
    const {
      style: {
        waist_size,
        bust_size_number,
        hip_size_inches,
        height_inches,
        weight,
        shoulder_size,
        inseam,
        shape,
        shoulder_size_skip,
        inseam_skip
      }
    } = currentCustomerStore
    if (!waist_size) {
      navigation.replace('EditSize', {
        type: 'waist_size',
        height_inches,
        weight
      })
      return
    }
    if (!bust_size_number) {
      navigation.replace('EditSize', {
        type: 'bust_size_number',
        height_inches,
        weight
      })
      return
    }
    if (!hip_size_inches) {
      navigation.replace('EditSize', {
        type: 'hip_size_inches',
        height_inches,
        weight
      })
      return
    }
    if (!shoulder_size && !shoulder_size_skip) {
      navigation.replace('EditSize', {
        type: 'shoulder_size',
        height_inches,
        weight
      })
      return
    }
    if (!inseam && !inseam_skip) {
      navigation.replace('EditSize', {
        type: 'inseam',
        height_inches,
        weight
      })
      return
    }
    if (!shape) {
      navigation.replace('MeStyleShape', { isModifyShape: true })
      return
    }
    navigation.goBack()
  }

  _TextComponent = () => {
    const { type } = this.props.navigation.state.params
    if (type === 'shoulder_size') {
      return (
        <Text style={styles.sizeDescriptionText}>
          从左边<Text style={styles.decTextColor}>肩骨</Text>到右边肩骨，测量
          <Text style={styles.decTextColor}>直线距离</Text>
          尽量<Text style={styles.decTextColor}>水平拉直</Text>
        </Text>
      )
    } else if (type === 'waist_size') {
      return (
        <Text style={styles.sizeDescriptionText}>
          用卷尺在<Text style={styles.decTextColor}>肚脐眼上方3cm</Text>
          位置贴身围上一圈，尽量
          <Text style={styles.decTextColor}>水平拉直</Text>
        </Text>
      )
    } else if (type === 'bust_size_number') {
      return (
        <Text style={styles.sizeDescriptionText}>
          用卷尺经过<Text style={styles.decTextColor}>乳头</Text>
          位置贴身围上一圈，尽量
          <Text style={styles.decTextColor}>水平拉直</Text>
        </Text>
      )
    } else if (type === 'hip_size_inches') {
      return (
        <Text style={styles.sizeDescriptionText}>
          双腿<Text style={styles.decTextColor}>靠拢站直</Text>，用卷尺经过
          <Text style={styles.decTextColor}>臀部最高点贴身</Text>围上一圈，尽量
          <Text style={styles.decTextColor}>水平拉直</Text>
        </Text>
      )
    } else if (type === 'inseam') {
      return (
        <Text style={styles.sizeDescriptionText}>
          双腿<Text style={styles.decTextColor}>靠拢站直</Text>，测量
          <Text style={styles.decTextColor}>裤裆到脚底</Text>的长度
        </Text>
      )
    }
  }

  _sizePredictText = () => {
    let string = ''
    const { maxValue, minValue } = this.state
    const {
      navigation,
      currentCustomerStore: { style }
    } = this.props
    const { type } = navigation.state.params
    const bodySizeData = BODY_SIZE[type]
    if (this.sizePredictType === 'bust_predict') {
      const { bra_size, cup_size } = style
      string = `根据内衣尺码${bra_size}${cup_size}推算，你的${
        bodySizeData.title
      }很可能是${minValue}-${maxValue}cm`
    } else {
      string = `根据你的身材数据推算，你的${
        bodySizeData.title
      }很可能是${minValue}-${maxValue}cm`
    }
    return string
  }

  render() {
    const { currentCustomerStore, navigation } = this.props
    const { type } = navigation.state.params
    const bodySizeData = BODY_SIZE[type]
    const styleSizeValue = currentCustomerStore.style[type]
    const isSizeChange = styleSizeValue !== this.state.currentSize
    const TextComponent = this._TextComponent()
    const sizePredictText =
      this.state.showSizePredict && this._sizePredictText()
    const url = this.state.skip
      ? require('../../../assets/images/home/select.png')
      : require('../../../assets/images/home/unselect.png')
    return (
      !!bodySizeData && (
        <SafeAreaView style={styles.container}>
          <NavigationBar
            hasBottomLine={false}
            leftBarButtonItem={
              <BarButtonItem onPress={this._goBack} buttonType={'back'} />
            }
          />
          <ScrollView
            style={styles.container}
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}>
            <View style={styles.contentView}>
              <View style={styles.commenTitleView}>
                <MeStyleCommonTitle
                  titleText={bodySizeData.title}
                  descriptText={bodySizeData.description}
                  style={styles.meStyleCommonTitle}
                  showStep={false}
                />
              </View>
              <Image
                source={bodySizeData.imageUrl}
                style={styles.bodySizeImage}
              />
              {TextComponent}
              <SizeSelector
                isUpdating={this.state.isLoading}
                range={this.currentSizeData.sizeArray}
                onChange={this._onChange}
                currentSize={this.state.currentSize}
              />
              {this.state.showSizePredict && (
                <View
                  style={styles.sizePredictView}
                  testID={'size-predict-view'}>
                  <Text style={styles.sizePredictText}>{sizePredictText}</Text>
                </View>
              )}
            </View>
          </ScrollView>
          {(type === 'inseam' || type === 'shoulder_size') &&
            !styleSizeValue && <SkipView setSkip={this.setSkip} url={url} />}
          <View style={styles.buttonView}>
            <TouchableOpacity
              disabled={!isSizeChange && !this.state.skip}
              style={
                isSizeChange || this.state.skip
                  ? styles.doneButton
                  : styles.blurButton
              }
              onPress={this._updateStyle}>
              <Text style={styles.saveButton}>{'保存'}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )
    )
  }
}

class SkipView extends PureComponent {
  render() {
    const { setSkip, url } = this.props
    return (
      <TouchableOpacity
        onPress={setSkip}
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 25
        }}>
        <Image style={{ width: 18, height: 18 }} source={url} />
        <Text style={{ fontSize: 14, color: '#989898', marginLeft: 8 }}>
          暂时跳过
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sizeView: {
    marginBottom: p2d(20),
    marginHorizontal: p2d(15)
  },
  meStyleCommonTitle: {
    marginHorizontal: p2d(40)
  },
  commenTitleView: {
    width: '100%',
    alignItems: 'flex-start'
  },
  decTextColor: {
    color: '#e85c40'
  },
  contentView: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20
  },
  buttonView: {
    height: p2d(60),
    width: '100%',
    backgroundColor: '#FFF',
    paddingHorizontal: p2d(15),
    paddingVertical: p2d(10)
  },
  doneButton: {
    height: p2d(40),
    width: '100%',
    backgroundColor: '#EA5C39',
    alignItems: 'center',
    justifyContent: 'center'
  },
  blurButton: {
    height: p2d(40),
    width: '100%',
    backgroundColor: '#F8CFC4',
    alignItems: 'center',
    justifyContent: 'center'
  },
  saveButton: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600'
  },
  bodySizeImage: {
    width: p2d(228),
    height: p2d(228),
    marginVertical: p2d(10)
  },
  sizeDescriptionText: {
    marginHorizontal: p2d(40),
    fontSize: 14,
    color: '#5E5E5E',
    lineHeight: 24,
    textAlign: 'center'
  },
  sizePredictView: {
    width: '100%',
    paddingHorizontal: 15,
    marginTop: 30
  },
  sizePredictText: {
    paddingLeft: 18,
    lineHeight: 44,
    fontSize: 12,
    color: '#BD8846',
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E2CEB3',
    backgroundColor: '#FEF8F2'
  }
})
