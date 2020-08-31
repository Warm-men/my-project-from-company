/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import RatingStar from '../rating_star'

export default class ExpensivenessContainer extends PureComponent {
  setRatingNum = rating => {
    const { updateExpensiveness } = this.props
    updateExpensiveness && updateExpensiveness(rating)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>品质感</Text>
          <RatingStar setRatingNum={this.setRatingNum} style={styles.stars} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { marginBottom: 30 },
  header: { flexDirection: 'row', alignItems: 'center' },
  title: { marginRight: 20, fontSize: 16, color: '#242424' },
  stars: { marginTop: 0, marginBottom: 0 }
})
