/* @flow */

import { observable } from 'mobx'
const Dimensions = require('Dimensions')

class UIScreenStore {
  @observable.ref
  window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }

  constructor() {
    Dimensions.addEventListener('change', e => {
      this.window = {
        width: e.window.width,
        height: e.window.height
      }
    })
  }
}

export default new UIScreenStore()
