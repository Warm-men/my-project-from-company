import React from 'react'
import { Mutate, SERVICE_TYPES } from '../../services/services'
import { DeviceEventEmitter } from 'react-native'
import Stores from '../../../stores/stores'
import { getRefreshShippingAdress } from './base_info_utils'

const updateCustomerStyle = style => {
  let input = {
    ...style,
    rescheduled_product_sizer: true
  }
  Mutate(
    SERVICE_TYPES.me.MUTAITON_UPDATE_STYLE,
    { input },
    response => {
      response &&
        Stores.currentCustomerStore.updateStyle(response.data.UpdateStyle.style)
    },
    error => {
      console.log(error)
    }
  )
}
const createFirstTote = () => {
  const { totesStore } = Stores
  const product_size_ids = totesStore.next_tote.map(
    item => item.product_size.id
  )
  Mutate(
    SERVICE_TYPES.totes.MUTATION_TOTE_QUEUE_PRODUCT_SIZER,
    { input: { product_size_ids } },
    () => {
      DeviceEventEmitter.emit('onRefreshTotes')
      totesStore.next_tote = []
    },
    () => {}
  )
}

const updateAttributePreferences = input => {
  console.log(input)
  const { totesStore } = Stores
  Mutate(
    SERVICE_TYPES.me.MUTAITON_UPDATE_ATTRIBUTE_PREFERENCES,
    { input },
    response => {
      totesStore.currentCustomerStore.attribute_preferences = input.preferences.map(
        item => {
          return { name: item }
        }
      )
      createFirstTote()
    },
    error => {
      console.log(error)
    }
  )
}
const updateShipping = data => {
  const shipping = getRefreshShippingAdress(data)
  if (shipping) {
    const { currentCustomerStore } = Stores
    const { style } = currentCustomerStore
    Mutate(
      SERVICE_TYPES.me.MUTATION_UPDATE_SHIPPING_ADDRESS,
      {
        shipping
      },
      response => {
        const customerShippingAddress =
          response.data.UpdateShippingAddress.shipping_address
        if (customerShippingAddress) {
          currentCustomerStore.updateShippingAddress(
            customerShippingAddress,
            this.addressIndex
          )
          if (style.top_size && style.dress_size) {
            createFirstTote()
          }
        }
      },
      error => {
        console.log(error)
      }
    )
  }
}
const updateCustomerName = nickname => {
  const { currentCustomerStore } = Stores
  if (currentCustomerStore.nickname === nickname) {
    return
  }
  Mutate(
    SERVICE_TYPES.me.MUTATION_UPDATE_CUSTOMER,
    {
      customer: { nickname: nickname }
    },
    () => {
      currentCustomerStore.updateNickName(nickname)
    }
  )
}
export {
  updateCustomerStyle,
  updateAttributePreferences,
  updateCustomerName,
  updateShipping,
  createFirstTote
}
