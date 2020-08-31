import React, { Component, PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
  Image
} from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
import Icons from 'react-native-vector-icons/SimpleLineIcons'
import { inject, observer } from 'mobx-react'
@inject('modalStore', 'guideStore')
@observer
export default class OperationGuideView extends Component {
  constructor(props) {
    super(props)
    const height = Dimensions.get('window').height
    this.isiPhoneX = Platform.OS === 'ios' && height >= 812 && height !== 1024

    this.guideArray = this._getGuideArray()
    this.state = { index: 0 }
  }
  componentWillUnmount() {
    const { onFinishedGuide } = this.props
    onFinishedGuide && onFinishedGuide()
  }

  _getGuideArray = () => {
    const { column } = this.props
    let array = []
    switch (column) {
      case 'defaultToteCart':
        {
          array = [
            {
              image: require('../../../assets/images/guide/novice_guide1.png'),
              style: { flex: 1 }
            },
            {
              image: require('../../../assets/images/guide/novice_guide2.png'),
              style: { height: 125 },
              customComponents: (
                <View
                  style={{
                    height: 126,
                    alignItems: 'flex-end',
                    paddingRight: 4
                  }}>
                  <Image
                    style={{ width: 60, height: 60 }}
                    source={require('../../../assets/images/totes/help_me_choose.png')}
                  />
                </View>
              )
            },
            {
              image: require('../../../assets/images/guide/novice_guide3.png'),
              style: { width: p2d(375), height: p2d(300) }
            },
            {
              image: require('../../../assets/images/guide/novice_guide4.png')
            }
          ]
        }
        break
      case 'onboardingToteCart':
        array = [
          {
            image: require('../../../assets/images/guide/novice_guide2.png'),
            style: { height: 125 },
            customComponents: (
              <View
                style={{
                  height: 126,
                  alignItems: 'flex-end',
                  paddingRight: 4
                }}>
                <Image
                  style={{ width: 60, height: 60 }}
                  source={require('../../../assets/images/totes/help_me_choose.png')}
                />
              </View>
            )
          },
          {
            image: require('../../../assets/images/guide/novice_guide3.png'),
            style: { width: p2d(375), height: p2d(300) }
          },
          {
            image: require('../../../assets/images/guide/novice_guide4.png')
          }
        ]
        break
      case 'cloest':
        array = [
          {
            image: require('../../../assets/images/guide/guide_closet.png'),
            style: {
              width: p2d(375),
              height: p2d(306),
              marginTop: this.isiPhoneX ? 276 : 230
            },
            contentStyle: { flex: 1 }
          }
        ]

        break
      case 'productDetails':
        array = [
          {
            image: require('../../../assets/images/guide/guide_product_details.png'),
            customComponents: (
              <View
                style={{
                  height: 44,
                  paddingLeft: 160,
                  paddingRight: 16,
                  marginBottom: 8
                }}>
                <View
                  style={{
                    backgroundColor: '#EA5C39',
                    flex: 1,
                    borderRadius: 2,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 14,
                      fontWeight: 'bold'
                    }}>
                    加入S码
                  </Text>
                </View>
              </View>
            )
          }
        ]
        break
      case 'oldToteCart':
        array = [
          {
            image: require('../../../assets/images/guide/guide_tote_cart_old.png'),
            style: { height: 125 },
            customComponents: (
              <View
                style={{
                  height: 126,
                  alignItems: 'flex-end',
                  paddingRight: 4
                }}>
                <Image
                  style={{ width: 60, height: 60 }}
                  source={require('../../../assets/images/totes/help_me_choose.png')}
                />
              </View>
            )
          }
        ]
        break
      case 'TaggingCustomerPhotos':
        const top = Platform.OS === 'ios' ? 64 : 44
        array = [
          {
            image: require('../../../assets/images/guide/tagging_1.png'),
            style: {
              marginTop:
                (this.isiPhoneX ? 90 : top) +
                ((Dimensions.get('window').width - 30) / 3) * 2 -
                6
            },
            contentStyle: { flex: 1, alignItems: 'center' }
          },
          {
            image: require('../../../assets/images/guide/tagging_2.png'),
            style: {
              marginTop:
                (this.isiPhoneX ? 90 : top) +
                ((Dimensions.get('window').width - 30) / 3) * 4 -
                150
            },
            contentStyle: { flex: 1, alignItems: 'center' },
            customComponents: (
              <View style={{ alignItems: 'center', paddingHorizontal: 10 }}>
                <View
                  style={{
                    width: Dimensions.get('window').width - 20,
                    backgroundColor: '#fff',
                    paddingHorizontal: 5,
                    paddingBottom: 10
                  }}>
                  <Text
                    style={{
                      fontWeight: '500',
                      fontSize: 14,
                      color: '#333',
                      marginVertical: 14
                    }}>
                    标记照片中搭配的单品
                  </Text>
                  <Image
                    style={{ width: p2d(343) }}
                    source={require('../../../assets/images/guide/tagging_2_p.png')}
                    resizeMode={'contain'}
                  />
                </View>
              </View>
            )
          },
          {
            image: require('../../../assets/images/guide/tagging_3.png'),
            style: {
              marginTop:
                (this.isiPhoneX ? 90 : top) +
                ((Dimensions.get('window').width - 30) / 3) * 4 -
                200
            },
            customComponents: (
              <View style={{ alignItems: 'flex-end', paddingRight: 16 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderWidth: 1,
                    borderColor: '#fff',
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    marginTop: 3,
                    marginRight: 13
                  }}>
                  <Icons name="arrow-right" size={18} color="#fff" />
                </View>
              </View>
            ),
            contentStyle: { flex: 1, alignItems: 'flex-end' }
          }
        ]
        break
      case 'toteCartFreeService':
        array = [
          {
            image: require('../../../assets/images/guide/tote_cart_free_service.png'),
            style: {
              width: p2d(375),
              height: p2d(370)
            },
            contentStyle: { flex: 1 }
          }
        ]
        break
    }
    return array
  }

  _changeIndex = () => {
    const { modalStore } = this.props
    let nextIndex = this.state.index + 1
    if (nextIndex >= this.guideArray.length) {
      modalStore.hide()
    } else {
      this.setState({ index: nextIndex })
    }
  }

  render() {
    const item = this.guideArray[this.state.index]
    return (
      <View style={[styles.overlay, this.isiPhoneX && { paddingBottom: 34 }]}>
        <GuideImage
          index={this.state.index}
          item={item}
          didSelectedItem={this._changeIndex}
        />
      </View>
    )
  }
}

class GuideImage extends PureComponent {
  render() {
    const { item, didSelectedItem } = this.props
    const { style, image, contentStyle, customComponents } = item
    return (
      <TouchableOpacity
        onPress={didSelectedItem}
        style={contentStyle ? contentStyle : styles.contentView}
        activeOpacity={0.9}>
        <Image
          style={style ? style : styles.guideImage}
          source={image}
          resizeMode="contain"
        />
        {customComponents}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  contentView: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  guideImage: { width: p2d(375), height: p2d(250) }
})
