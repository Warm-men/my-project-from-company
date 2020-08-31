import { observable } from 'mobx'

class SubscriptionStore {
  @observable
  subscriptionGroups = []
  @observable
  charge_after_entrust_id = null
}

export default new SubscriptionStore()
