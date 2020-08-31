/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'

export default class RatingStar extends PureComponent {
  returnToteRating = () => {
    const { rating } = this.props
    let toteRating = []
    Array.from({ length: rating }).map((item, index) => {
      toteRating.push(
        <Image
          key={index}
          style={styles.star}
          source={require('../../../../assets/images/rating/select_star.png')}
        />
      )
    })
    if (rating < 5) {
      Array.from({ length: 5 - rating }).map((item, index) => {
        toteRating.push(
          <Image
            key={index + 10}
            style={styles.star}
            source={require('../../../../assets/images/rating/unSelect_star.png')}
          />
        )
      })
    }
    return toteRating
  }
  render() {
    const { style } = this.props
    const stars = this.returnToteRating()
    return <View style={[styles.container, style]}>{stars}</View>
  }
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  star: { height: 20, width: 20, marginRight: 8 }
})
