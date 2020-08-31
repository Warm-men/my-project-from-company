/* @flow */

import { Component } from 'react'
import { intercept } from 'mobx'

export default class AuthenticationComponent extends Component {
  constructor(props) {
    super(props)
    this.__dispose__ = intercept(props.currentCustomerStore, 'id', change => {
      if (props.currentCustomerStore.id !== change.newValue) {
        if (change.newValue) {
          this.onSignIn()
        } else {
          this.onSignOut()
        }
      }
      return change
    })
  }
  onSignIn() {
    throw new Error('Implements onSignIn in your subclass')
  }
  onSignOut() {
    throw new Error('Implements onSignOut in your subclass')
  }

  componentWillUnmount() {
    this.__dispose__ && this.__dispose__()
  }
}
