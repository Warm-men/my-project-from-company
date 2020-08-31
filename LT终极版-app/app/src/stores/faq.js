import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'

class FaqStore {
  @persist('object')
  @observable
  faqData = null

  @persist
  @observable
  faqVersion = 0

  @action
  setFaqData = (data, version) => {
    this.faqData = data
    this.faqVersion = version
  }
}
export default new FaqStore()
