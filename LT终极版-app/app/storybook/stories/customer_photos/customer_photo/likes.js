/* @flow */

import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import Image from '../../image'
import { inject, observer } from 'mobx-react'

@inject('customerPhotosStore', 'currentCustomerStore')
@observer
export default class Likes extends Component {
  render() {
    const { customerPhotosStore, currentCustomerStore } = this.props
    const { id, maxCount, customer } = this.props

    const placeholder =
      customer && customer.id === parseInt(currentCustomerStore.id)
        ? `你的穿搭真好看，快来给自己点个赞吧`
        : `你的赞美至关重要，快来给她点赞吧`

    const likesStatus = customerPhotosStore.likesStatus[id]
    let like_customers, likes_count
    if (likesStatus) {
      like_customers = likesStatus.like_customers
      likes_count = likesStatus.likes_count
    }

    return likes_count ? (
      <View style={styles.container}>
        {like_customers &&
          like_customers.map((customer, index) => {
            if (index === maxCount) {
              return (
                <View
                  key={index}
                  style={[styles.avatar, { left: maxCount * 19 }]}>
                  <Text style={styles.moreTitle}>...</Text>
                </View>
              )
            } else if (index > maxCount) {
              return null
            }
            const { avatar } = customer
            const image = avatar
              ? { uri: avatar }
              : require('../../../../assets/images/account/customer_avatar.png')
            return (
              <Image
                key={index}
                style={[styles.avatar, { left: index * 19 }]}
                source={image}
              />
            )
          })}
      </View>
    ) : (
      <Text style={styles.emptyText}>{placeholder}</Text>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#fff',
    position: 'absolute',
    top: 3,
    backgroundColor: '#f3f3f3'
  },
  moreTitle: { lineHeight: 15, color: '#ccc', textAlign: 'center' },
  emptyText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#ccc',
    flex: 1,
    lineHeight: 30
  }
})

Likes.defaultProps = {
  customers: [],
  maxCount: 6
}

Likes.propTypes = {
  customers: PropTypes.array,
  maxCount: PropTypes.number
}
