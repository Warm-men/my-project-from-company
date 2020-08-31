/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

export default class Review extends PureComponent {
  render() {
    const { review, incentives } = this.props

    if (!review) return null

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../../../../assets/images/customer_photos/headimage.png')}
          />
          <Text style={styles.nickname}>托特衣箱</Text>
        </View>
        <View style={styles.arrow}>
          <View style={styles.arrowA} />
          <View style={styles.arrowB} />
        </View>
        <View style={styles.contentView}>
          <Text style={styles.content}>{review.content}</Text>
          {incentives &&
            incentives.map((item, index) => {
              const { text } = item
              return (
                <View style={{ flexDirection: 'row' }} key={index}>
                  <View style={styles.incentive}>
                    <Image
                      source={require('../../../../assets/images/customer_photos/check.png')}
                    />
                    <Text style={styles.incentiveText}>{text}</Text>
                  </View>
                </View>
              )
            })}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 15 },
  header: { flexDirection: 'row', alignItems: 'center' },
  nickname: { fontWeight: '500', color: '#BD8846', paddingLeft: 9 },

  arrow: { marginLeft: 50, zIndex: 2, marginBottom: -1, marginTop: -10 },
  arrowA: {
    height: 0,
    width: 0,
    borderColor: 'transparent',
    borderBottomColor: '#E2CEB3',
    borderWidth: 11
  },
  arrowB: {
    position: 'absolute',
    top: 2,
    left: 1,
    height: 0,
    width: 0,
    borderBottomColor: '#FEF8F2',
    borderColor: 'transparent',
    borderWidth: 10
  },

  contentView: {
    padding: 12,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#E2CEB3',
    backgroundColor: '#FEF8F2',
    marginBottom: 24
  },
  content: {
    fontSize: 12,
    color: '#BD8846',
    letterSpacing: 0.26,
    lineHeight: 22
  },

  incentive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#E2CEB3',
    borderRadius: 2,
    padding: 6,
    marginTop: 8
  },
  incentiveText: { fontSize: 12, color: '#BD8846', paddingLeft: 6 }
})

Review.propTypes = {
  incentives: PropTypes.array,
  review: PropTypes.object
}
