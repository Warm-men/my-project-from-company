/* @flow */

import React, { Component } from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'

export default class Variant extends Component {
  render() {
    return <View style={{ ...this.props.style }}>{this.props.children}</View>
  }
}

Variant.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool
  ]).isRequired
}
