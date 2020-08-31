/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import Image from '../../image'
import LikeButton from '../../../../src/containers/customer_photos/like/like_button_in_home'
export default class CustomerPhotoItem extends PureComponent {
  constructor(props) {
    super(props)
    const { style } = this.props
    this.imageStyle = {
      width: style.width,
      height: (style.width / 3) * 4,
      backgroundColor: '#f3f3f3'
    }
  }
  _onClick = () => {
    const { didSelectedItem, data } = this.props
    didSelectedItem(data)
  }
  render() {
    const { style, data, onSignIn } = this.props
    const { photos, content, id, customer } = data
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={this._onClick}
        style={[styles.container, style]}>
        <Image
          style={this.imageStyle}
          source={
            photos && photos.length ? { uri: photos[0].mobile_url } : null
          }
        />
        <Text numberOfLines={2} style={styles.content}>
          {content}
        </Text>
        <View style={styles.bottom}>
          <Customer customer={customer} />
          <LikeButton id={id} onSignIn={onSignIn} />
        </View>
      </TouchableOpacity>
    )
  }
}

class Customer extends PureComponent {
  render() {
    const { avatar, nickname, roles } = this.props.customer
    const is_stylist = roles.find(item => {
      return item.type === 'stylist'
    })
    const image = avatar
      ? { uri: avatar }
      : require('../../../../assets/images/account/customer_avatar.png')

    return (
      <View style={styles.customer}>
        <View style={styles.headImageView}>
          <Image useRNImage={true} style={styles.headImage} source={image} />
          {is_stylist && (
            <Image
              style={styles.stylistTip}
              source={require('../../../../assets/images/customer_photos/stylist_tip.png')}
            />
          )}
        </View>
        <Text
          numberOfLines={1}
          style={[styles.nickname, is_stylist && styles.nameColor]}>
          {nickname}
        </Text>
      </View>
    )
  }
}

CustomerPhotoItem.defaultProps = {
  style: { width: 0, height: 0 },
  data: {
    content: '描述内容',
    share_topics: [{ title: '#话题#' }],
    photos: [{ mobile_url: '晒单地址' }],
    customer: { nickname: '昵称', avatar: '' }
  },
  didSelectedItem: () => {}
}

CustomerPhotoItem.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#f3f3f3',
    marginBottom: 8,
    paddingBottom: 12,
    overflow: 'hidden'
  },
  content: {
    height: 48,
    color: '#242424',
    fontSize: 12,
    padding: 8,
    lineHeight: 15
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  customer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 8,
    alignItems: 'center',
    marginRight: 2
  },
  headImageView: {
    width: 20,
    height: 20,
    marginRight: 8
  },
  headImage: {
    borderRadius: 10,
    width: 20,
    height: 20
  },
  stylistTip: {
    position: 'absolute',
    height: 10,
    width: 10,
    bottom: -2,
    right: -2
  },
  nickname: {
    flex: 1,
    fontSize: 12,
    color: '#989898',
    fontWeight: '400'
  },
  nameColor: { color: '#E8A046' }
})
