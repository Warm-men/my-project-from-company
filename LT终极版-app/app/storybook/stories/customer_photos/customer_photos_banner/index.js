import React, { Component } from 'react'
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  View
} from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import Image from '../../image'
import { getCustomerName } from '../../../../src/expand/tool/userInfo_inspect'
import Icons from 'react-native-vector-icons/SimpleLineIcons'
import { inject, observer } from 'mobx-react'

const SCREEN_WIDTH = Dimensions.get('window').width

@inject('currentCustomerStore')
@observer
export default class CustomerPhotosBanner extends Component {
  _onClick = () => {
    const { navigation } = this.props
    navigation.navigate('CustomerPhotoCenter')
  }

  returnNum = () => {
    let customerPhotoCount, likedCount
    const {
      customer_photo_count,
      liked_count
    } = this.props.currentCustomerStore.customer_photo
    customerPhotoCount = this.abbreviationNum(customer_photo_count)
    likedCount = this.abbreviationNum(liked_count)
    return { customerPhotoCount, likedCount }
  }

  abbreviationNum = num => {
    let newNum = num
    if (num > 999 && num < 9999) {
      newNum = (num / 1000).toFixed(1) + `k`
    } else if (num > 9999) {
      newNum = (num / 10000).toFixed(1) + 'w'
    }
    return newNum
  }

  render() {
    const { topics, currentCustomerStore } = this.props
    const { avatarUrl, nickname, telephone, roles } = currentCustomerStore

    if (!topics) return null
    const name = getCustomerName(nickname, telephone)
    const uri = avatarUrl
      ? { uri: avatarUrl }
      : require('../../../../assets/images/account/customer_avatar.png')
    const { customerPhotoCount, likedCount } = this.returnNum()
    const isStylist = !!roles.find(item => {
      return item.type === 'stylist'
    })
    return (
      <TouchableOpacity onPress={this._onClick} style={styles.container}>
        <Image
          style={styles.backgroundImage}
          source={require('../../../../assets/images/home/join_customer_photos_banner.png')}
        />
        <View style={styles.contentView}>
          <View>
            <Image style={styles.headerImage} source={uri} />
            {isStylist && (
              <Image
                style={styles.stylistIcon}
                source={require('../../../../assets/images/customer_photos/stylist_tip.png')}
              />
            )}
          </View>
          <Text numberOfLines={1} style={styles.nameTitle}>
            {name}
          </Text>
          <View style={styles.line} />
          <View style={styles.rightView}>
            <Text style={[styles.rightViewTitle, { marginRight: 10 }]}>
              <Text style={styles.rightViewBigTitle}>{customerPhotoCount}</Text>{' '}
              晒单
            </Text>
            <Text style={styles.rightViewTitle}>
              <Text style={styles.rightViewBigTitle}>{likedCount}</Text> 获赞
            </Text>
          </View>
          <View style={styles.seeView}>
            <Text style={styles.seeViewTitle}>查看</Text>
            <Icons name="arrow-right" size={10} color="#E5535D" />
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    marginBottom: 16
  },
  backgroundImage: {
    position: 'absolute',
    left: 8,
    width: SCREEN_WIDTH - 16,
    height: ((SCREEN_WIDTH - 16) / 358) * 56
  },
  contentView: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    height: ((SCREEN_WIDTH - 16) / 358) * 56,
    alignItems: 'center'
  },
  headerImage: { width: 36, height: 36, borderRadius: 100 },
  line: { width: 1, height: 20, backgroundColor: '#fff' },
  nameTitle: {
    color: '#fff',
    fontWeight: '600',
    maxWidth: p2d(72),
    marginHorizontal: 10
  },
  rightView: { flexDirection: 'row', flex: 1, paddingHorizontal: 10 },
  rightViewTitle: { fontSize: 12, color: '#fff' },
  rightViewBigTitle: {
    fontSize: 16,
    fontWeight: '600'
  },
  seeView: {
    width: 50,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingLeft: 4
  },
  seeViewTitle: {
    fontSize: 12,
    color: '#E5535D'
  },
  stylistIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 14,
    height: 14
  }
})
