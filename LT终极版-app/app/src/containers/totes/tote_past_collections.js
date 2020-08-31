/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services.js'
import { PastTotes } from '../../../storybook/stories/totes'
import { Column } from '../../expand/tool/add_to_closet_status'
import Icon from 'react-native-vector-icons/Ionicons'

export default class TotePastCollectionsContainer extends Component {
  constructor(props) {
    super(props)
    const { maxCount } = this.props
    this.state = {
      pastToteData: null
    }
    this.variables = { per_page: maxCount, page: 1, filter: 'history' }
    this.isLoading = false
  }

  componentDidMount() {
    const { finishedRefreshing } = this.props
    this._getPastTotes(finishedRefreshing)
  }

  _getPastTotes = callback => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const variables = this.variables
    QNetwork(
      SERVICE_TYPES.totes.QUERY_HISTORY_TOTES,
      variables,
      response => {
        this.isLoading = false
        callback && callback()
        if (response.data) {
          this.setState({ pastToteData: response.data.totes })
        }
      },
      () => {
        callback && callback()
        this.isLoading = false
      }
    )
  }

  _rateTote = tote => {
    this.props.navigation.navigate('ToteRatingDetails', { tote })
  }

  _didSelectedItem = product => {
    const column = Column.PastTote
    this.props.navigation.navigate('Details', { item: product, column })
  }

  _morePastTotes = () => {
    this.props.navigation.navigate('TotePast')
  }

  render() {
    const { pastToteData } = this.state
    if (!pastToteData || !pastToteData.length) {
      return null
    }
    return (
      <View style={styles.container}>
        <View style={styles.historyView}>
          <Text testID="title" style={styles.historyTitle}>
            {'历史衣箱'}
          </Text>
        </View>
        {!!pastToteData.length && (
          <PastTotes
            testID="past-totes"
            totes={[pastToteData[0]]}
            rateTote={this._rateTote}
            didSelectedItem={this._didSelectedItem}
            navigation={this.props.navigation}
          />
        )}
        {pastToteData.length > 1 && (
          <View style={styles.moreView}>
            <TouchableOpacity
              testID="more-totes"
              activeOpacity={0.8}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              onPress={this._morePastTotes}
              style={styles.moreButton}>
              <Text style={styles.moreText}>{'查看全部历史衣箱'}</Text>
              <Icon name={'ios-arrow-forward'} size={12} color={'#979797'} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 48
  },
  moreView: {
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  moreButton: {
    marginTop: 12,
    alignItems: 'center',
    flexDirection: 'row'
  },
  moreText: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 12,
    letterSpacing: 0.2,
    color: '#5E5E5E'
  },
  historyView: {
    marginTop: 24,
    marginLeft: 24
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
    letterSpacing: 0.6
  }
})
