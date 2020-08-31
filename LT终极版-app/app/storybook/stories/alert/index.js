import React, { Component } from 'react'
import { Modal } from 'react-native'
import { inject, observer } from 'mobx-react'

@inject('modalStore')
@observer
export default class Alert extends Component {
  onHide = () => {
    const { modalStore } = this.props
    if (modalStore.isAllowCancel) modalStore.hide()
  }
  render() {
    const { modalStore } = this.props
    return (
      <Modal
        animationType={'none'}
        transparent={true}
        visible={modalStore.modalVisible}
        onRequestClose={this.onHide}>
        {modalStore.children}
      </Modal>
    )
  }
}
