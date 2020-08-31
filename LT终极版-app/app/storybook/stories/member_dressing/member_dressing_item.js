/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import UserInfo from '../customer_photos/customer_photo/recommend_tote/userinfo'
import { differenceInDays, startOfDay } from 'date-fns'
import DressingProductCard from './dressing_product_card'
import CustomerPhoto from './customer_photo'

export default class MemberDressingItem extends PureComponent {
  _getSubscriberDescrition = () => {
    const { exhibitingTote } = this.props
    const { customer, customer_nth_tote } = exhibitingTote
    if (customer_nth_tote === 1) {
      return '首次使用'
    } else if (customer.in_first_month_and_monthly_subscriber) {
      return '首月会员'
    } else {
      const didferrentDay = differenceInDays(
        new Date(),
        startOfDay(customer.first_subscribed_at)
      )
      return `加入托特衣箱${didferrentDay}天`
    }
  }

  _goCustomerPhotoDetails = (customerPhoto, index) => {
    const { navigation } = this.props
    navigation.navigate('ProductCustomerPhoto', {
      data: customerPhoto,
      hiddenRelated: false,
      id: customerPhoto.id,
      index
    })
  }

  render() {
    const { exhibitingTote, currentColunm } = this.props
    const {
      customer,
      tote_products,
      customer_photos,
      locked_at
    } = exhibitingTote
    const subscriberDescrition = this._getSubscriberDescrition()
    const currentCustomerPhotos =
      currentColunm === 'home' ? [customer_photos[0]] : customer_photos
    return (
      <View
        style={[styles.contianer, currentColunm !== 'home' && styles.fixStyle]}>
        <UserInfo
          customer={customer}
          subscriberDescrition={subscriberDescrition}
        />
        <DressingProductCard
          toteProducts={tote_products}
          customerPhotos={currentCustomerPhotos}
          lockedAt={locked_at}
        />
        {currentCustomerPhotos.map((item, index) => {
          return (
            <CustomerPhoto
              key={index}
              index={index}
              length={currentCustomerPhotos.length}
              customerPhoto={item}
              currentColunm={currentColunm}
              goCustomerPhotoDetails={this._goCustomerPhotoDetails}
            />
          )
        })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  contianer: {
    backgroundColor: '#fff'
  },
  fixStyle: {
    paddingTop: 12,
    marginBottom: 8
  }
})
