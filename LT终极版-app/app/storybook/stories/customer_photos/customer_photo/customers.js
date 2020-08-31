/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import LikeButton from '../../../../src/containers/customer_photos/like'
import Likes from './likes'

export default class Customers extends PureComponent {
  render() {
    const { id, shouldAnimatedButton, customer, style } = this.props
    return (
      <View style={[styles.likeView, style]}>
        <Likes id={id} customer={customer} />
        <LikeButton id={id} shouldAnimatedButton={shouldAnimatedButton} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  likeView: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20
  }
})

Customers.defaultProps = {
  id: 0
}

Customers.propTypes = {
  id: PropTypes.number,
  customer: PropTypes.object
}
