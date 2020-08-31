import { observable } from 'mobx'

class OrdersStore {
  @observable orders = []
}

export default new OrdersStore()
