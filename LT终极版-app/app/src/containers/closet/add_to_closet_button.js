/* @flow */

import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Text
} from 'react-native'
import { inject, observer } from 'mobx-react'
import { Mutate, SERVICE_TYPES } from '../../expand/services/services'
import Animation from 'lottie-react-native'
import Image from '../../../storybook/stories/image'
import Statistics from '../../expand/tool/statistics'
import { updateViewableItemStatus } from '../../expand/tool/daq'

@inject('closetStore', 'currentCustomerStore')
@observer
export default class AddToClosetButton extends Component {
  constructor(props) {
    super(props)
    if (props.inDetails) {
      const inCloset = this.props.closetStore.closetIds.includes(
        this.props.product.id
      )
      this.progress = new Animated.Value(inCloset ? 0.8 : 0)
    }
  }
  _updateClosetStatus = () => {
    const { currentCustomerStore, closetStore, product } = this.props
    if (!currentCustomerStore.id) {
      currentCustomerStore.setLoginModalVisible(true)
      return
    }
    const inCloset = closetStore.closetIds.includes(product.id)
    inCloset ? this.removeFromCloset() : this.addToCloset()
  }
  removeFromCloset = () => {
    Statistics.onEvent({ id: 'closet_remove', label: '去藏' })
    const { closetStore, product, inDetails } = this.props
    if (product) {
      closetStore.removeFromCloset(product.id)
      inDetails &&
        Animated.timing(this.progress, {
          toValue: 0,
          duration: 1,
          useNativeDriver: true,
          isInteraction: false
        }).start()
      Mutate(SERVICE_TYPES.closet.MUTATION_REMOVE_FROM_CLOSET, {
        input: { product_ids: [product.id] }
      })
    }
  }
  addToCloset = () => {
    const {
      closetStore,
      product,
      inDetails,
      getReportData,
      updateClosetStatus
    } = this.props
    if (product) {
      closetStore.addToCloset(product)
      inDetails &&
        Animated.timing(this.progress, {
          toValue: 0.9,
          duration: 1500,
          useNativeDriver: true,
          isInteraction: false
        }).start()

      const { id, title, brand, category } = product

      let attributes = {
        id,
        title,
        brand_id: brand ? brand.id : '',
        first_category: category ? category.name : '',
        route: '',
        type: 'detail'
      }
      let input = {}
      if (getReportData) {
        const data = getReportData()
        if (!data) {
          input = { product_ids: [id] }
        } else {
          const { variables, column, router, index } = data
          input.product_ids = [id]
          const statistics_struct = {}
          if (column) {
            statistics_struct.column_name = column
            attributes.column_name = column
          }
          if (router) {
            statistics_struct.router = router
            attributes.route = router
          }
          if (variables) {
            statistics_struct.filter_and_sort = JSON.stringify(variables)
          }
          if (index !== null && index !== undefined) {
            statistics_struct.page_type = 'list'
            statistics_struct.index = index + 1
            attributes.type = 'list'
          } else {
            statistics_struct.page_type = 'detail'
            attributes.type = 'detail'
          }
          input.statistics_struct = statistics_struct
        }
        if (updateClosetStatus) {
          updateClosetStatus(id, true, data)
        } else {
          //DAQ
          updateViewableItemStatus(id, { id, closet: true }, data)
        }
      } else {
        input = { product_ids: [id] }
      }

      Statistics.onEvent({ id: 'closet_add', label: '收藏', attributes })

      Mutate(SERVICE_TYPES.closet.MUTATION_ADD_TO_CLOSET, { input })
    }
  }
  render() {
    const {
      buttonStyle,
      product,
      inDetails,
      animationStyle,
      animationSource,
      inClosetText,
      outOfClosetText,
      buttonTextStyle,
      hitSlop,
      iconStyle,
      white
    } = this.props
    const inCloset = this.props.closetStore.closetIds.includes(product.id)
    return inDetails ? (
      <TouchableOpacity
        hitSlop={hitSlop}
        style={buttonStyle}
        onPress={this._updateClosetStatus}
        activeOpacity={0.85}>
        <View style={[animationStyle]}>
          <Animation source={animationSource} progress={this.progress} />
        </View>
        <Text style={buttonTextStyle}>
          {inCloset ? inClosetText : outOfClosetText}
        </Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        hitSlop={hitSlop}
        style={buttonStyle}
        onPress={this._updateClosetStatus}>
        <Image
          style={iconStyle ? iconStyle : styles.closetIcon}
          source={
            inCloset
              ? require('../../../assets/images/closet/inCloset.png')
              : white
              ? require('../../../assets/images/closet/closet_white.png')
              : require('../../../assets/images/closet/closet.png')
          }
        />
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  closetIcon: { width: 19, height: 16 }
})
