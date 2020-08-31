/* @flow */

import React, { Component, PureComponent } from 'react'
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform
} from 'react-native'
import { inject } from 'mobx-react'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import Video from 'react-native-video'
import p2d from '../../expand/tool/p2d'
import Image from '../../../storybook/stories/image'
import _ from 'lodash'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services'
import { CustomerPhotoItem } from '../../../storybook/stories/customer_photos/customer_photos_in_home'
import { WebView } from 'react-native-webview'
@inject('appStore', 'modalStore', 'currentCustomerStore', 'customerPhotosStore')
export default class PrivilegeContainer extends Component {
  // 通过 state 更新
  constructor(props) {
    super(props)
    this.state = {
      nowIndex: 0,
      subscription_type: null,
      customer_photos: [],
      isLoading: true,
      clickedVideo: false
    }
    this.data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  }

  componentDidMount() {
    this.getSubscriptionLandingPage()
  }

  getSubscriptionLandingPage = () => {
    QNetwork(
      SERVICE_TYPES.banner.QUERY_SUBSCRIPTION_LANDING_PAGE,
      {},
      response => {
        const {
          subscription_type,
          customer_photos
        } = response.data.subscription_landing_page
        const { customerPhotosStore } = this.props
        customerPhotosStore.updateLikesStatus(customer_photos)
        this.setState({ subscription_type, customer_photos, isLoading: false })
      }
    )
  }

  _extractUniqueKey = item => {
    return item.toString()
  }

  goIndex = index => {
    if (!this.state.isLoading) {
      this.setState({ nowIndex: index })
      if (index === 0) {
        this._flatList.scrollToOffset({ x: 0, y: 0, animated: false })
        return
      }
      this._flatList.scrollToIndex({ viewPosition: 0, index, animated: false })
    }
  }

  _didSelectedItem = data => {
    const { navigation, hiddenRelated } = this.props
    const id = data.id
    navigation.navigate('ProductCustomerPhoto', { data, hiddenRelated, id })
  }

  onSignIn = () => {
    const { currentCustomerStore, navigation } = this.props
    if (currentCustomerStore.isSubscriber) {
      navigation.popToTop()
    }
  }

  _renderItem = ({ item }) => {
    const { subscription_type, customer_photos } = this.state
    switch (item) {
      case 1:
        return (
          <View style={styles.line}>
            <Image
              style={{ width: p2d(375), height: p2d(338) }}
              source={require('../../../assets/images/home/privilege/1.png')}
            />
            <CardText data={subscription_type} />
            <CardTextTwo data={subscription_type} />
          </View>
        )
      case 2:
        return (
          <Image
            style={styles.imageItem}
            source={require('../../../assets/images/home/privilege/2.png')}
          />
        )
      case 3:
        return (
          <Image
            style={styles.imageItem}
            source={require('../../../assets/images/home/privilege/3.png')}
          />
        )
      case 4:
        return (
          <Image
            style={styles.imageItem}
            source={require('../../../assets/images/home/privilege/4.png')}
          />
        )
      case 5:
        return (
          <Image
            style={styles.imageItem}
            source={require('../../../assets/images/home/privilege/5.png')}
          />
        )
      case 6:
        return (
          <Image
            style={[styles.imageItem, { height: p2d(141) }]}
            source={require('../../../assets/images/home/privilege/6.png')}
          />
        )
      case 7:
        return (
          <Image
            style={styles.imageItem}
            source={require('../../../assets/images/home/privilege/7.png')}
          />
        )
      case 8:
        return (
          <Image
            style={styles.imageItem}
            source={require('../../../assets/images/home/privilege/8.png')}
          />
        )
      case 9:
        return (
          <Image
            style={[styles.imageItem, { height: p2d(255) }]}
            source={require('../../../assets/images/home/privilege/9.png')}
          />
        )
      case 10: {
        const width = Dimensions.get('window').width / 2 - 13
        const leftStyle = { width, marginLeft: 8, marginRight: 4 }
        const rightStyle = { width, marginLeft: 4, marginRight: 8 }

        return (
          <View>
            <Image
              style={[styles.imageItem, { height: p2d(103) }]}
              source={require('../../../assets/images/home/privilege/10.png')}
            />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {customer_photos.map((item, index) => {
                const style = !(index % 2) ? leftStyle : rightStyle
                return (
                  <CustomerPhotoItem
                    key={index}
                    data={item}
                    style={style}
                    onSignIn={this.onSignIn}
                    didSelectedItem={this._didSelectedItem}
                  />
                )
              })}
            </View>
          </View>
        )
      }
      case 11:
        return (
          <Image
            style={styles.imageItem}
            source={require('../../../assets/images/home/privilege/11.png')}
          />
        )
      case 12:
        return (
          <Image
            style={styles.imageItem}
            source={require('../../../assets/images/home/privilege/12.png')}
          />
        )
      case 13:
        return (
          <Image
            style={styles.imageItem}
            source={require('../../../assets/images/home/privilege/13.png')}
          />
        )
      case 14:
        return (
          <Image
            style={styles.imageItem}
            source={require('../../../assets/images/home/privilege/14.png')}
          />
        )
      case 15:
        return (
          <Image
            style={[styles.imageItem, { height: p2d(214) }]}
            source={require('../../../assets/images/home/privilege/15.png')}
          />
        )
    }
  }

  _playVideo = () => {
    this.setState({ clickedVideo: true })
  }

  _listHeaderComponent = () => {
    return this.state.clickedVideo ? (
      Platform.OS === 'ios' ? (
        <Video
          controls={true}
          hideShutterView={true}
          ref={ref => (this.videoRefs = ref)}
          source={{
            uri: 'https://static.letote.cn/kol_activity/clean/clean.mp4'
          }}
          rate={1.0}
          volume={1.0}
          paused={false}
          resizeMode="contain"
          repeat
          autoPlay={true}
          style={styles.videoView}
        />
      ) : (
        <WebView
          mediaPlaybackRequiresUserAction={false}
          source={{
            uri: 'https://static.letote.cn/kol_activity/clean/clean.mp4'
          }}
          style={styles.videoView}
        />
      )
    ) : (
      <TouchableOpacity onPress={this._playVideo}>
        <Image
          style={styles.videoView}
          resizeMode="contain"
          source={require('../../../assets/images/home/privilege/clean_poster.png')}
        />
      </TouchableOpacity>
    )
  }

  _onViewableItemsChanged = ({ viewableItems }) => {
    if (!viewableItems.length) return

    const item = _.maxBy(viewableItems, item => item.index)
    const { index } = item
    if (index < 6) {
      this.setState({ nowIndex: 0 })
    } else if (index < 9) {
      this.setState({ nowIndex: 6 })
    } else {
      this.setState({ nowIndex: 9 })
    }
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  _joinMember = () => {
    const { navigation, currentCustomerStore } = this.props

    if (!currentCustomerStore.id) {
      currentCustomerStore.setLoginModalVisible(true, this.onSignIn)
      return
    }
    navigation.navigate('JoinMember')
  }

  _faq = () => {
    this.props.navigation.navigate('Helper')
  }

  render() {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar
          titleView={
            <Header
              goIndex={this.goIndex}
              isLoading={this.state.isLoading}
              nowIndex={this.state.nowIndex}
            />
          }
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        {this.state.isLoading ? (
          <View>
            <ActivityIndicator animating={true} style={{ height: 80 }} />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <FlatList
              ref={flatList => (this._flatList = flatList)}
              bounces={false}
              keyExtractor={this._extractUniqueKey}
              showsVerticalScrollIndicator={false}
              data={this.data}
              extraData={this.state}
              renderItem={this._renderItem}
              ListHeaderComponent={this._listHeaderComponent}
              onViewableItemsChanged={this._onViewableItemsChanged}
            />
            <Bottom
              joinMember={this._joinMember}
              faq={this._faq}
              data={this.state.subscription_type}
            />
          </View>
        )}
      </SafeAreaView>
    )
  }
}

class Header extends PureComponent {
  goIndex = index => {
    const { goIndex } = this.props
    goIndex && goIndex(index)
  }

  render() {
    const { nowIndex, isLoading } = this.props
    return (
      <View style={styles.headerView}>
        <TouchableOpacity
          disabled={isLoading}
          style={[styles.headerItem, !nowIndex && styles.redline]}
          onPress={() => {
            this.goIndex(0)
          }}>
          <Text style={!nowIndex ? styles.redText : styles.headerText}>
            会员特权
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isLoading}
          style={[styles.headerItem, nowIndex === 6 && styles.redline]}
          onPress={() => {
            this.goIndex(6)
          }}>
          <Text style={nowIndex === 6 ? styles.redText : styles.headerText}>
            使用案例
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isLoading}
          style={[styles.headerItem, nowIndex === 9 && styles.redline]}
          onPress={() => {
            this.goIndex(9)
          }}>
          <Text style={!nowIndex === 9 ? styles.redText : styles.headerText}>
            用户评价
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class CardText extends PureComponent {
  render() {
    const {
      clothing_count,
      accessory_count,
      original_price,
      visitor_discount_price,
      display_name,
      max_totes,
      interval
    } = this.props.data
    return (
      <View style={styles.cardView}>
        <Text style={styles.cardDisplayName}>{display_name}套餐</Text>
        <Text style={styles.cardDisplayTitle}>
          每月{max_totes / interval}箱 ，每箱{clothing_count}件衣服+
          {accessory_count}件配饰
        </Text>
        <View style={styles.cardBottomView}>
          <Text style={styles.originalPrice}>¥{original_price}</Text>
          <Text style={styles.basePrice}>
            ¥{original_price - visitor_discount_price}
          </Text>
          <Text style={styles.preview}>
            新用户首月减{visitor_discount_price}元
          </Text>
        </View>
      </View>
    )
  }
}

class CardTextTwo extends PureComponent {
  render() {
    const {
      clothing_count,
      accessory_count,
      max_totes,
      interval
    } = this.props.data
    return (
      <View style={styles.cardTwoView}>
        <Text style={styles.cardTwoText}>{`每月${max_totes /
          interval}箱\n每箱${clothing_count}件衣服+${accessory_count}件配饰`}</Text>
      </View>
    )
  }
}

class Bottom extends PureComponent {
  render() {
    const {
      joinMember,
      faq,
      data: { original_price, visitor_discount_price }
    } = this.props
    return (
      <View style={styles.bottomView}>
        <TouchableOpacity style={styles.bottomProblemView} onPress={faq}>
          <Image
            source={require('../../../assets/images/home/privilege/problem.png')}
          />
          <Text style={styles.bottomProblemText}>常见问题</Text>
        </TouchableOpacity>
        <Text style={styles.price}>¥{original_price}</Text>
        <TouchableOpacity style={styles.bottomButton} onPress={joinMember}>
          <Text style={styles.bottomButtonText}>
            新用户¥{original_price - visitor_discount_price}加入会员
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  videoView: {
    width: p2d(375),
    height: p2d(215)
  },
  headerView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'flex-end',
    flex: 1
  },
  headerItem: {
    paddingBottom: 8
  },
  redText: {
    fontSize: 13,
    color: '#EA5C39'
  },
  redline: {
    borderBottomWidth: 2,
    borderBottomColor: '#EA5C39'
  },
  headerText: {
    fontSize: 13,
    color: '#999'
  },
  line: {
    borderBottomWidth: 7,
    borderBottomColor: '#F7F7F7'
  },
  imageItem: {
    width: p2d(375),
    height: p2d(667)
  },
  bottomView: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    borderTopColor: '#E6E6E6',
    borderTopWidth: 0.5
  },
  bottomProblemView: {
    width: p2d(70),
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
    borderRightColor: '#E6E6E6',
    borderRightWidth: 1
  },
  bottomProblemText: {
    fontSize: 10,
    color: '#242424',
    marginTop: 4
  },
  price: {
    fontSize: 18,
    color: '#242424',
    textDecorationLine: 'line-through',
    marginHorizontal: p2d(22)
  },
  bottomButton: {
    width: p2d(224),
    height: 44,
    backgroundColor: '#EA5C39',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2
  },
  bottomButtonText: {
    fontSize: 14,
    color: '#fff'
  },
  cardView: {
    height: p2d(150),
    width: p2d(343),
    position: 'absolute',
    top: p2d(24),
    left: p2d(16),
    padding: p2d(20)
  },
  cardDisplayName: {
    lineHeight: p2d(23),
    fontSize: 20,
    color: '#EDE1C7'
  },
  cardDisplayTitle: {
    lineHeight: p2d(15),
    fontSize: 12,
    color: '#9D9074',
    marginTop: p2d(9)
  },
  cardBottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: p2d(36)
  },
  originalPrice: {
    lineHeight: p2d(28),
    fontSize: 22,
    color: '#9D9074',
    textDecorationLine: 'line-through'
  },
  basePrice: {
    lineHeight: p2d(21),
    fontSize: 18,
    color: '#EDE1C7',
    marginLeft: p2d(8),
    marginRight: p2d(42)
  },
  preview: {
    position: 'absolute',
    right: p2d(20),
    fontSize: p2d(15),
    color: '#fff'
  },
  cardTwoView: {
    position: 'absolute',
    bottom: p2d(22),
    right: p2d(90)
  },
  cardTwoText: {
    fontSize: 11,
    color: '#EE8168',
    textAlign: 'center',
    lineHeight: 18
  }
})
