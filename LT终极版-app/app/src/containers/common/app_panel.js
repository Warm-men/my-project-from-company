/* @flow */

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
// import { SafeAreaView } from 'react-native'
import PopUpPanel from '../../components/pop_up_panel'

/*
 *** 主动触发关闭调用  panelStore.hide()

 *** 考虑安卓的物理键位返回
 */

@inject('panelStore')
@observer
export default class AppPanel extends Component {
  componentDidMount() {
    const { panelStore } = this.props
    panelStore.setPanelTag(this._popUpPanel)
  }
  onClose = () => {
    const { panelStore } = this.props
    panelStore.onClose()
  }
  render() {
    const { panelStore } = this.props
    return (
      <PopUpPanel
        ref={popUpPanel => (this._popUpPanel = popUpPanel)}
        onClose={this.onClose}
        visible={panelStore.panelVisible}>
        {panelStore.children}
      </PopUpPanel>
    )
  }
}
