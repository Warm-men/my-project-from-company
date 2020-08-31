/* @flow */

import React, { Component } from 'react'
import {
  StyleSheet,
  DeviceEventEmitter,
  ActivityIndicator,
  View
} from 'react-native'

import { QNetwork, SERVICE_TYPES } from '../../expand/services/services.js'
import { Column } from '../../expand/tool/add_to_closet_status'

import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import { PastTotes } from '../../../storybook/stories/totes'
import { AllLoadedFooter } from '../../../storybook/stories/products'

export default class TotePastContainer extends Component {
  constructor(props) {
    super(props)
    this.isLoading = false
    this.state = {
      totes: [],
      per_page: 5,
      page: 1,
      isMore: true,
      isLoading: true
    }
    this.listenner = []
  }

  componentDidMount() {
    this._getPastTotes()
    this.listenner.push(
      DeviceEventEmitter.addListener('updatePastToteRatingStatus', data => {
        this._resetToteStatus(data)
      })
    )
  }

  componentWillUnmount() {
    this.listenner.map(item => {
      item.remove()
    })
  }

  _resetToteStatus = data => {
    const totes = [...this.state.totes]
    const currentToteIndex = totes.findIndex(item => item.id === data.tote_id)
    totes[currentToteIndex].display_rate_incentive_guide = false
    this.setState({ totes })
  }

  addPastTotes = past_totes => {
    const totes = [...this.state.totes, ...past_totes]
    const data = { totes, isLoading: false }
    data.page = this.state.page + 1
    if (past_totes.length < this.state.per_page) {
      data.isMore = false
    }
    this.setState(data)
  }

  _getPastTotes = () => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const { page, per_page } = this.state
    const variables = { page, per_page, filter: 'history' }
    QNetwork(
      SERVICE_TYPES.totes.QUERY_HISTORY_TOTES,
      variables,
      response => {
        this.addPastTotes(response.data.totes)
        this.isLoading = false
      },
      () => {
        this.setState({ isLoading: false })
        this.isLoading = false
      }
    )
  }

  _onEndReached = () => {
    this.state.isMore && this._getPastTotes()
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  rateTote = tote => {
    this.props.navigation.navigate('ToteRatingDetails', { tote })
  }

  _didSelectedItem = product => {
    const column = Column.PastTote
    this.props.navigation.navigate('Details', { item: product, column })
  }

  _listFooter = () => {
    const { totes, isMore } = this.state
    return totes.length ? <AllLoadedFooter isMore={isMore} /> : null
  }

  render() {
    const { totes, isLoading } = this.state
    if (!totes) {
      return null
    }
    if (isLoading) {
      return (
        <View style={styles.activityIndicator}>
          <ActivityIndicator animating={true} style={{ height: 80 }} />
        </View>
      )
    }
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'历史衣箱'}
          style={styles.navigationbar}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        {!!totes.length && (
          <PastTotes
            testID="past-totes"
            totes={totes}
            style={styles.marginTop}
            rateTote={this.rateTote}
            ListFooterComponent={this._listFooter}
            didSelectedItem={this._didSelectedItem}
            onEndReached={this._onEndReached}
            navigation={this.props.navigation}
          />
        )}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  marginTop: {
    marginTop: 16
  },
  navigationbar: {
    borderBottomWidth: 0
  }
})
