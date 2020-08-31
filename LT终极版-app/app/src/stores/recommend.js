import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'

class Recommend {
  @persist('list')
  @observable
  products = []

  @action
  updateProducts = products => {
    this.products = [...products]
  }
}

export default new Recommend()
