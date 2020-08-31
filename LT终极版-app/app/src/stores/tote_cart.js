import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'

class ToteCartStore {
  @persist('object')
  @observable
  toteCart = null

  @persist
  @observable
  nowAccessoryCount = 0

  @persist
  @observable
  nowClothingCount = 0

  @observable reportData = null

  @action
  updateToteCart = toteCart => {
    if (!toteCart) {
      return
    }
    // const {
    // accessory_items,
    // clothing_items,
    // customer_coupon_id,
    // disable_coupon,
    // display_more_product_entry,
    // id,
    // max_accessory_count,
    // max_clothing_count,
    // onboarding,
    // with_free_service,
    // display_free_service_banner,
    // validate_result
    // } = ToteCart
    this.toteCart = toteCart
    this.updateToteSlot(toteCart)
  }

  @action
  updateToteSlot = toteCart => {
    if (!toteCart) {
      return
    }
    const { accessory_items, clothing_items } = toteCart
    this.nowAccessoryCount = this.computeCount(accessory_items)
    this.nowClothingCount = this.computeCount(clothing_items)
  }

  /*
    重置 tote cart =>  登出
   */
  @action
  resetToteCart = () => {
    this.toteCart = null
    this.nowAccessoryCount = 0
    this.nowClothingCount = 0
  }

  computeCount = items => {
    let count = 0
    items.map(i => {
      count = count + i.slot
    })
    return count
  }

  @action updateReportData = data => {
    if (!data) {
      this.reportData = null
      return
    }

    const { variables, column, router, index } = data
    const statistics_struct = {}
    if (column) {
      statistics_struct.column_name = column
    }
    if (router) {
      statistics_struct.router = router
    }
    if (variables) {
      statistics_struct.filter_and_sort = JSON.stringify(variables)
    }
    if (index !== null && index !== undefined) {
      statistics_struct.page_type = 'list'
      statistics_struct.index = index + 1
    } else {
      statistics_struct.page_type = 'detail'
    }
    this.reportData = statistics_struct
  }
}
export default new ToteCartStore()
