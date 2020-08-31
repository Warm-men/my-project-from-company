/* @flow */

import { observable, action } from 'mobx'
import { BackHandler, Platform } from 'react-native'

class PanelStore {
  @observable panelVisible = false
  @observable.ref panel = null
  @observable shareImageUri = null

  @action
  show = children => {
    this.children = children
    if (this.children) {
      this.panelVisible = true
    }
    if (Platform.OS === 'android') {
      this.listener = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress
      )
    }
  }
  handleBackPress = () => {
    this.panel._onHide()
    return true
  }

  @action
  setPanelTag = panel => {
    this.panel = panel
  }

  @action
  onClose = () => {
    this.children = null
    this.panelVisible = false
    if (this.listener) {
      this.listener.remove()
      this.listener = null
    }
  }

  @action
  hide = () => {
    this.panel._onHide()
  }

  @observable.ref children = null
}

export default new PanelStore()
