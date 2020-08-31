/* @flow */

import React, { Component } from 'react'
import {
  StyleSheet,
  ScrollView,
  Clipboard,
  DeviceEventEmitter
} from 'react-native'
import { inject, observer } from 'mobx-react'
import { SERVICE_TYPES, Mutate } from '../../expand/services/services.js'

import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import { ToteReturnHiveBox } from '../../../storybook/stories/totes'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'

@inject('totesStore', 'appStore', 'modalStore')
@observer
export default class ToteReturnHiveBoxContainer extends Component {
  constructor(props) {
    super(props)
    const { fc_address } = this.props.totesStore.latest_rental_tote
    this.state = {
      FCAddress: fc_address
    }
    this.isLoading = false
  }

  _getContent = async () => {
    Clipboard.setString(this.state.FCAddress)
    try {
      let result = await Clipboard.getString()
      if (result) {
        this.props.appStore.showToast('复制成功', 'success')
      }
    } catch (e) {
      this.props.appStore.showToast('复制失败', 'error')
    }
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  _onClickConfirm = () => {
    const { modalStore } = this.props
    modalStore.show(
      <CustomAlertView
        message={`使用丰巢智能柜寄回，确认后\n将不能更改归还方式`}
        cancel={{ title: '取消', type: 'normal' }}
        other={[
          {
            title: '确认',
            type: 'highLight',
            onClick: this._reportHiveBox
          }
        ]}
      />
    )
  }

  _reportHiveBox = () => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const { id } = this.props.totesStore.latest_rental_tote
    const input = { tote_id: id }
    Mutate(
      SERVICE_TYPES.totes.MUTATION_UPDATE_HIVE_BOX_SCHEDULED_PICK_UP,
      { input },
      () => {
        this.isLoading = false
        DeviceEventEmitter.emit('onRefreshTotes')
        this.props.navigation.popToTop()
      },
      () => {
        this.isLoading = false
      }
    )
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'丰巢智能柜寄回'}
          style={styles.navigationbar}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}>
          <ToteReturnHiveBox
            FCAddress={this.state.FCAddress}
            getContent={this._getContent}
            confirm={this._onClickConfirm}
            navigation={this.props.navigation}
          />
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navigationbar: {
    borderBottomWidth: 0
  }
})
