import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'
import Stores from './stores'

class CustomerPhotosStore {
  @persist('list')
  @observable
  homeCustomerPhotos = []

  @observable
  likesStatus = {}

  @action
  updateLikesStatus = array => {
    array.forEach(item => {
      const { id, liked, like_customers, likes_count } = item
      if (this.likesStatus[id]) {
        this.likesStatus[id] = { ...this.likesStatus[id], liked, likes_count }
        if (like_customers) {
          this.likesStatus[id].like_customers = like_customers
        }
      } else {
        this.likesStatus[id] = { liked, like_customers, likes_count }
      }
    })
    this.likesStatus = { ...this.likesStatus }
  }

  @action
  getLikeStatus = id => {
    const likeStatus = this.likesStatus[id]
    if (!likeStatus) {
      return { id, liked: false, likes_count: 0 }
    }
    if (!Stores.currentCustomerStore.id) {
      return { ...likeStatus, liked: false }
    }
    return likeStatus
  }

  @action
  resetCustomerPhotos = () => {
    this.likesStatus = {}
  }
}

export default new CustomerPhotosStore()
