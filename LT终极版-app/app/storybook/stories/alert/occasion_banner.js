/* @flow */

import React, { Component, PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Linking,
  Image
} from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
import { SERVICE_TYPES, Mutate } from '../../../src/expand/services/services'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import { inject, observer } from 'mobx-react'
import dateFns from 'date-fns'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { allowToStartLoad } from '../../../src/expand/tool/url_filter'
import { onClickJoinMember } from '../../../src/expand/tool/plans/join_member'

@inject('modalStore', 'popupsStore', 'currentCustomerStore')
@observer
export default class OccasionBanner extends Component {
  componentWillUnmount() {
    const { activityName, currentCustomerStore, willUnmount } = this.props
    if (currentCustomerStore.id) {
      if (activityName === 'Popup') {
        //弹出弹窗后，标记看过
        this._isViewedPopup()
      }
    } else {
      this._removePopup()
    }
    willUnmount && willUnmount()
  }
  //标记看过 Popups
  _isViewedPopup = () => {
    const { extraData } = this.props
    const id = extraData && extraData.id
    if (!id) {
      return
    }
    const input = { popup_id: parseInt(id) }
    Mutate(SERVICE_TYPES.popups.MUTATION_MARKET_POPUP, { input })
    this._removePopup()
  }

  _removePopup = () => {
    const { popupsStore, extraData } = this.props
    const id = !!extraData && extraData.id
    id && popupsStore.removePopup(id)
  }

  _onClose = () => {
    const { onClose, modalStore } = this.props
    onClose && onClose()
    modalStore.setModalVisible(false)
  }

  _onClick = () => {
    const { onClick, modalStore, activityName } = this.props
    onClick && onClick()
    modalStore.setModalVisible(false)
    switch (activityName) {
      case 'summerPlan':
        this._pushToSummerPlan()
        break
      case 'AlertPromoCode':
        this._pushToJoinMember()
        break
      case 'PromoCodeSuccess':
        this._pushToJoinMember()
        break
      case 'VersionAlert':
        this._pushToUpdateVersion()
        break
      case 'TransferMember':
        this._pushToTransferMember()
        break
    }
  }

  _pushToSummerPlan = () => {
    this.props.navigation.navigate('SummerPlan')
  }

  _pushToJoinMember = () => {
    const { currentCustomerStore, navigation } = this.props
    const { subscription } = currentCustomerStore
    let ids
    if (
      subscription &&
      subscription.status !== 'cancelled' &&
      !subscription.subscription_type.occasion
    ) {
      ids = [subscription.subscription_type.id]
    }
    onClickJoinMember(navigation)
    navigation.navigate('JoinMember', { ids })
  }
  _pushToUpdateVersion = () => {
    const { extraData } = this.props
    Linking.canOpenURL(extraData.link)
      .then(supported => {
        if (!supported) {
        } else {
          return Linking.openURL(extraData.link)
        }
      })
      .catch()
  }
  _pushToTransferMember = () => {
    const { navigation, extraData } = this.props
    if (extraData && extraData.url) {
      navigation.navigate('WebPage', {
        uri: extraData.url
      })
    }
  }

  render() {
    const {
      activityName,
      extraData,
      popupsStore,
      navigation,
      currentCustomerStore
    } = this.props
    switch (activityName) {
      case 'summerPlan':
        return <SummerPlan onClick={this._onClick} onClose={this._onClose} />
        break
      case 'AlertPromoCode':
        return (
          <PromoCode
            onClick={this._onClick}
            onClose={this._onClose}
            extraData={extraData}
          />
        )
        break
      case 'Popup':
        return (
          <Popup
            onClick={this._onClick}
            onClose={this._onClose}
            extraData={extraData}
            navigation={navigation}
            currentCustomerStore={currentCustomerStore}
            isPopupLoading={popupsStore.isPopupLoading}
          />
        )
        break
      case 'PromoCodeSuccess':
        return (
          <Popup
            backgroundImage={require('../../../assets/images/activities/popup_end.png')}
            currentCustomerStore={currentCustomerStore}
            onClick={this._onClick}
            onClose={this._onClose}
          />
        )
        break
      case 'VersionAlert':
        return (
          <Popup
            backgroundImage={{ uri: extraData.url }}
            currentCustomerStore={currentCustomerStore}
            onClick={this._onClick}
            onClose={this._onClose}
          />
        )
        break
      case 'FloatHover':
        return (
          <Popup
            onClick={this._onClick}
            onClose={this._onClose}
            extraData={extraData}
            navigation={navigation}
            currentCustomerStore={currentCustomerStore}
            type={'FloatHover'}
          />
        )
        break
      case 'TransferMember':
        return (
          <Popup
            onClick={this._onClick}
            onClose={this._onClose}
            backgroundImage={require('../../../assets/images/totes/out_of_service.png')}
            navigation={navigation}
            currentCustomerStore={currentCustomerStore}
            type={'TransferMember'}
          />
        )
        break
    }
  }
}

class CustomerButton extends PureComponent {
  render() {
    return (
      <View style={[styles.buttonBottom, this.props.style]}>
        <TouchableOpacity onPress={this.props.onPress} style={styles.button}>
          <Text style={styles.buttonTitle}>{this.props.title}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class PromoCode extends PureComponent {
  render() {
    const { onClick, onClose, extraData } = this.props
    const { title, expiration_date, discount_amount } = extraData
    const time = dateFns.format(expiration_date, 'YYYY年MM月DD日')
    return (
      <View style={styles.activityView}>
        <View style={styles.contentView}>
          <Image
            source={require('../../../assets/images/activities/alert_promo_code.png')}
            style={styles.imageView}
          />
          <View style={styles.promoCodePopupView}>
            <Text style={styles.promoCodeText}>
              <Text style={styles.promoCodeTextCYN}>¥</Text>
              {discount_amount}
            </Text>
            <View style={styles.tiketView}>
              <Text numberOfLines={1} style={styles.tiketText}>
                {title}
              </Text>
              <Text numberOfLines={1} style={styles.dateText}>
                有效期至{time}
              </Text>
            </View>
          </View>
          <CustomerButton onPress={onClick} title={'立即开通'} />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name={'close'} size={40} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

class SummerPlan extends PureComponent {
  render() {
    const { onClick, onClose } = this.props
    return (
      <View style={styles.activityView}>
        <Image
          source={require('../../../assets/images/activities/summer_plan.png')}
          style={styles.summerPlanImage}
        />
        <TouchableOpacity style={styles.onClickButton} onPress={onClick} />
        <TouchableOpacity
          style={styles.summerPlancloseButton}
          onPress={onClose}>
          <Icon name={'close'} size={40} color={'white'} />
        </TouchableOpacity>
      </View>
    )
  }
}

class Popup extends PureComponent {
  //点击弹框确定按钮
  _handlePopupNext = () => {
    const { extraData, type } = this.props
    if (!extraData) {
      return
    }
    const { navigation, onClick, isPopupLoading } = this.props
    const { url } = extraData

    const useWebView = allowToStartLoad(url, navigation)
    if (useWebView) {
      const isHttpUrl =
        url && (url.startsWith('http://') || url.startsWith('https://'))
      if (isHttpUrl) {
        if (type === 'FloatHover') {
          navigation.navigate('WebPage', { uri: url, hideShareButton: true })
        } else {
          navigation.navigate('WebPage', { uri: url })
        }
      }
      onClick && onClick()
    } else if (!isPopupLoading) {
      onClick && onClick()
    }
  }

  _onClick = () => {
    const { onClick, backgroundImage, currentCustomerStore } = this.props
    if (!backgroundImage) {
      // 判断是不是本地弹出任务
      this._handlePopupNext()
    }
    if (!currentCustomerStore.id || backgroundImage) {
      onClick && onClick()
    }
  }

  render() {
    const { extraData, isPopupLoading, backgroundImage, onClose } = this.props
    const imageSource = backgroundImage
      ? backgroundImage
      : { uri: extraData ? extraData.image : '' }
    return (
      <View style={styles.activityView}>
        <View style={styles.popupContentView}>
          <Image source={imageSource} style={styles.popupImage} />
          <TouchableOpacity
            style={styles.popupOnClick}
            onPress={this._onClick}
          />
          <TouchableOpacity style={styles.popupCloseButton} onPress={onClose}>
            <Icon name={'close'} size={30} color={'white'} />
          </TouchableOpacity>
          {isPopupLoading && (
            <View>
              <Spinner
                isVisible={true}
                size={50}
                type={'Pulse'}
                color={'#333'}
              />
            </View>
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  activityView: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  onClickButton: {
    backgroundColor: 'red',
    marginTop: 20,
    width: 50,
    height: 50
  },
  contentView: {
    width: p2d(295),
    height: p2d(467),
    alignItems: 'center'
  },
  imageView: {
    width: p2d(295),
    height: p2d(397)
  },
  buttonBottom: {
    marginTop: 20,
    height: 50,
    borderRadius: 25,
    width: '85%',
    backgroundColor: '#9a3222'
  },
  button: {
    height: 48,
    backgroundColor: 'rgb(249,83,65)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  buttonTitle: { color: 'white', fontSize: 16, fontWeight: '600' },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 10
  },
  promoCodePopupView: {
    position: 'absolute',
    flexDirection: 'row',
    top: p2d(280),
    width: p2d(240),
    height: p2d(80)
  },
  promoCodeText: {
    color: 'rgb(249,83,65)',
    fontSize: 36,
    fontWeight: '500',
    paddingHorizontal: 10,
    lineHeight: p2d(80)
  },
  promoCodeTextCYN: {
    fontSize: 14,
    fontWeight: '400'
  },
  tiketView: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  tiketText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 30
  },
  dateText: {
    fontSize: 10,
    color: '#999',
    lineHeight: 30
  },
  summerPlanImage: {
    width: p2d(375),
    height: p2d(420)
  },
  summerPlancloseButton: {
    marginTop: p2d(-30)
  },
  popupImage: {
    width: p2d(296),
    height: p2d(348),
    position: 'absolute'
  },
  popupContentView: {
    width: p2d(295),
    height: p2d(348),
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  popupCloseButton: {
    width: p2d(60),
    height: p2d(60),
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    position: 'absolute',
    top: 0,
    right: 0
  },
  popupOnClick: {
    width: '100%',
    height: p2d(89),
    position: 'absolute',
    bottom: 0,
    right: 0
  }
})
