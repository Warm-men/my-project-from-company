/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import RatingStar from '../rating_star'
import Row from './row'

export default class WearContainer extends PureComponent {
  constructor(props) {
    super(props)
    const { questions } = this.props.data
    const main = questions.find(item => item.key === 'worn_times')

    this.state = { main, worn_times: null }
  }

  _updateWearTimes = (key, item) => {
    this.setState({ worn_times: item.value })
    const { updateWearTimes } = this.props
    updateWearTimes(item.value)
  }

  render() {
    const { main, worn_times } = this.state
    if (!main) {
      return null
    }
    return (
      <View style={styles.container}>
        <Row
          data={main}
          hiddenTitle
          onPress={this._updateWearTimes}
          value={worn_times ? [worn_times] : []}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { marginTop: 15 }
})
