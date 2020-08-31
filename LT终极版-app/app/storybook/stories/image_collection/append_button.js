/* @flow */

import React, { PureComponent } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import Image from '../image'

export default class AppendButton extends PureComponent {
  render() {
    const { itemStyle, onPress } = this.props
    return (
      <TouchableOpacity style={[styles.button, itemStyle]} onPress={onPress}>
        <Image
          source={require('../../../assets/images/customer_photos/append_button.png')}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: { width: 60, height: 90, marginRight: 12, marginBottom: 12 }
})

AppendButton.defaultProps = {
  itemStyle: null
}

AppendButton.propTypes = {
  itemStyle: PropTypes.object
}
