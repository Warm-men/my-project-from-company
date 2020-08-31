/* @flow */

import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList
} from 'react-native'
import Image from '../image'
import Icons from 'react-native-vector-icons/Ionicons'
import p2d from '../../../src/expand/tool/p2d'
import { filterEmojiInNickname } from '../../../src/expand/tool/userInfo_inspect'
export default class ReferralSign extends PureComponent {
  render() {
    const {
      isAllowedToInvite,
      share,
      openRuleModal,
      url,
      successReferrals,
      senderAmount
    } = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.title}>邀请好友有礼</Text>
        {!!senderAmount && (
          <Text style={styles.message}>
            将链接分享给好友，双方各得
            <Text style={styles.redColor}>¥{senderAmount}奖励金</Text>
          </Text>
        )}
        <TouchableOpacity style={styles.ruleView} onPress={openRuleModal}>
          <Text style={styles.ruleTitle}>活动规则</Text>
          <Icons name={'ios-arrow-forward'} size={15} color={'#333'} />
        </TouchableOpacity>
        <SwiperView successReferrals={successReferrals} />
        {url && (
          <TouchableOpacity style={styles.referralButton} onPress={share}>
            {isAllowedToInvite ? (
              <Text style={styles.buttonTitle}>{'邀请得奖励'}</Text>
            ) : (
              <Text style={styles.buttonTitle}>{'加入会员'}</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

export class SwiperView extends PureComponent {
  constructor(props) {
    super(props)
    this.indexNum = 0
  }

  UNSAFE_componentWillMount() {
    this.swiperPlay()
  }

  componentWillUnmount() {
    this._timer && clearInterval(this._timer)
  }

  swiperPlay = () => {
    this._timer = setInterval(() => {
      const { successReferrals } = this.props
      if (successReferrals && successReferrals.length) {
        if (this.indexNum === successReferrals.length - 1) {
          this.indexNum = 0
        } else {
          this.indexNum++
        }
        this._flatList.scrollToIndex({
          viewPosition: 0,
          index: this.indexNum,
          animated: !!this.indexNum
        })
      }
    }, 2500)
  }

  _keyExtractor = (item, index) => index.toString()

  swiperItem = ({ item }) => {
    const name = filterEmojiInNickname(item.customer_name)
    return (
      <View style={styles.swiperItem}>
        <Image
          style={styles.avatarView}
          source={
            item.customer_avatar
              ? { uri: item.customer_avatar }
              : require('../../../assets/images/account/customer_avatar.png')
          }
          circle={true}
        />
        <Text style={styles.swiperItemText}>
          <Text>{name.length > 3 ? name.substr(0, 4) + '...' : name}</Text>
          成功邀请好友
          <Text style={{ color: '#Ea5c39' }}>{item.referral_count}名</Text>
          ，获得
          <Text style={{ color: '#Ea5c39' }}>¥{item.time_cash_amount}</Text>
          奖励金
        </Text>
      </View>
    )
  }

  render() {
    const { successReferrals } = this.props
    return (
      <FlatList
        ref={flatList => (this._flatList = flatList)}
        scrollEnabled={false}
        style={[
          styles.contentView,
          { borderWidth: !!successReferrals.length ? 1 : 0 }
        ]}
        data={successReferrals}
        keyExtractor={this._keyExtractor}
        renderItem={this.swiperItem}
        showsVerticalScrollIndicator={false}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    width: '90%',
    position: 'relative',
    top: -32,
    zIndex: 2,
    alignItems: 'center',
    elevation: 1,
    shadowColor: 'black',
    shadowOffset: { h: 0, w: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.08,
    borderRadius: 4,
    marginBottom: 20
  },
  contentView: {
    height: p2d(35),
    marginTop: 20,
    marginBottom: 11,
    borderRadius: 100,
    borderColor: '#F3F3F3',
    paddingLeft: p2d(8)
  },
  title: {
    marginTop: 30,
    marginBottom: 10,
    fontSize: 18,
    color: '#333',
    fontWeight: '600'
  },
  message: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center'
  },
  redColor: {
    color: '#Ea5c39',
    fontWeight: '600'
  },
  ruleView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16
  },
  ruleTitle: {
    marginRight: 6,
    fontSize: 12,
    color: '#333'
  },
  ruleAlert: {
    marginTop: 14,
    marginBottom: 40,
    fontSize: 12,
    fontWeight: '400',
    color: '#999'
  },
  referralButton: {
    height: 48,
    width: p2d(300),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EA5C39',
    marginBottom: 40,
    borderRadius: 4
  },
  buttonTitle: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500'
  },
  avatarView: {
    width: p2d(24),
    height: p2d(24),
    borderRadius: p2d(12),
    marginRight: p2d(4)
  },
  swiperItem: {
    flexDirection: 'row',
    width: p2d(298),
    height: p2d(35),
    alignItems: 'center'
  },
  swiperItemText: {
    fontSize: 12,
    color: '#666'
  }
})
