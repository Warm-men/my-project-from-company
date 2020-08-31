import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'

class CopyWritingStore {
  @persist('object')
  @observable
  non_subscriber_home_page = null

  @persist('object')
  @observable
  non_subscriber_tote_page = null

  @persist
  @observable
  searching_feature = false

  @action
  setCopywriting = copywriting_adjustments => {
    if (copywriting_adjustments) {
      const {
        non_subscriber_home_page,
        non_subscriber_tote_page,
        searching_feature
      } = copywriting_adjustments
      this.non_subscriber_home_page = non_subscriber_home_page
      this.non_subscriber_tote_page = non_subscriber_tote_page
      this.searching_feature = searching_feature
    } else {
      this.non_subscriber_home_page = null
      this.non_subscriber_tote_page = null
      this.searching_feature = false
    }
  }
}
export default new CopyWritingStore()
