/* @flow */

import React, { Component } from 'react'
import HomeLookBook from '../../../../storybook/stories/home/lookbook'
import { SERVICE_TYPES, QNetwork } from '../../../expand/services/services.js'
import { inject, observer } from 'mobx-react'

@inject('lookBookStore')
@observer
export default class LookBookHome extends Component {
  constructor(props) {
    super(props)
    const { lookbooks } = this.props.lookBookStore
    this.state = {
      lookbooks
    }
    this.isLoading = false
  }

  UNSAFE_componentWillMount() {
    this._getLookbookData()
  }

  componentWillUnmount() {
    // 卸载异步操作设置状态
    this.setState = (state, callback) => {
      return
    }
  }

  _getLookbookData = () => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const { loadingStatus, isFinishLoading } = this.props
    loadingStatus.isFinishLoadingLookbook = false
    QNetwork(
      SERVICE_TYPES.lookbook.QUERY_LOOKTHEMES,
      { page: 1, per_page: 2 },
      response => {
        this.props.lookBookStore.updateLookBooks(response.data.look_themes)
        this.setState({ lookbooks: response.data.look_themes })
        this.isLoading = false
        loadingStatus.isFinishLoadingLookbook = true
        isFinishLoading()
      },
      () => {
        loadingStatus.isFinishLoadingLookbook = true
        isFinishLoading()
        this.isLoading = false
      }
    )
  }

  render() {
    const { navigation } = this.props
    return (
      !!this.state.lookbooks.length && (
        <HomeLookBook
          navigation={navigation}
          data={this.state.lookbooks}
          title={'主题穿搭'}
        />
      )
    )
  }
}
