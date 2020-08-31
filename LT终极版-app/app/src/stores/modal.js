/* @flow */

import { observable, action } from 'mobx'

class ModalStore {
  @observable modalVisible = false
  @observable isAllowCancel = true
  @observable currentRoute = null
  @observable currentRoutes = []

  @action
  show = (children, isAllowCancel = true) => {
    this.children = children
    this.isAllowCancel = isAllowCancel
    if (this.children) {
      this.modalVisible = true
    }
  }

  @action
  hide = () => {
    this.children = null
    this.modalVisible = false
  }

  @action
  setModalVisible = bool => {
    this.modalVisible = bool
  }

  @observable.ref children = null
}

export default new ModalStore()
