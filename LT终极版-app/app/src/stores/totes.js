import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'

class TotesStore {
  @observable latest_rental_tote = null
  @observable customizeable_tote = null
  @observable past_totes = []
  @observable isMore = true
  @observable per_page = 5
  @observable page = 1
  //所有tote总量
  @observable totalToteCount = 0
  @observable current_totes = []

  @persist('list')
  @observable
  next_tote = []

  // FIXME: 3 个为一般会员套餐的默认值 先写死 后面修改
  @observable maxClothingCount = 3
  @observable maxAccessoryCount = 2

  @action
  refreshPastTotes = past_totes => {
    if (past_totes.length === 1 && past_totes[0].state === 'styling') {
      this.past_totes = []
      this.isMore = false
      this.page = 2
    } else {
      this.past_totes = [...past_totes]
      if (past_totes.length < this.per_page) {
        this.isMore = false
      } else {
        this.isMore = true
      }
      // 历史衣箱初始化数据后，下次请求从page：2开始
      this.page = 2
    }
  }
  @action
  addPastTotes = past_totes => {
    this.past_totes = [...this.past_totes, ...past_totes]
    if (past_totes.length < this.per_page) {
      this.isMore = false
    }
    this.page++
  }

  @action
  updateCurrentTotes = current_totes => {
    this.current_totes = current_totes
  }

  @action
  updateAtestRentalTote = latest_rental_tote => {
    if (
      latest_rental_tote &&
      this.latest_rental_tote &&
      latest_rental_tote.id === this.latest_rental_tote.id
    ) {
      this.latest_rental_tote = Object.assign(
        this.latest_rental_tote,
        latest_rental_tote
      )
    } else {
      this.latest_rental_tote = latest_rental_tote
    }
  }

  @action
  swapToteProduct = (swapToteProductId, newToteProduct) => {
    if (this.latest_rental_tote) {
      const index = this.latest_rental_tote.tote_products.findIndex(function(
        toteProduct
      ) {
        return toteProduct.id === swapToteProductId
      })
      if (index !== -1) {
        this.latest_rental_tote.tote_products[index] = newToteProduct
        this.latest_rental_tote = {
          ...this.latest_rental_tote,
          tote_products: [...this.latest_rental_tote.tote_products]
        }
      }
    }
  }
}

export default new TotesStore()
