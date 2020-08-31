import { observable, action } from 'mobx'

class ViewableStore {
  @observable
  onFocusIndex = 0

  @action
  updateOnfocusIndex = onFocusIndex => {
    this.onFocusIndex = onFocusIndex
  }
}

export default new ViewableStore()
