/* @flow */

import React, { PureComponent } from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

export default class StyleTag extends PureComponent {
  _onClick = () => {
    const { onClick, data } = this.props
    onClick(data)
  }
  render() {
    const { title, isSelected, disabled, style } = this.props
    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={this._onClick}
        style={[
          styles.button,
          isSelected ? styles.selectedButton : styles.normalButton,
          style
        ]}>
        <Text
          style={[
            styles.title,
            isSelected ? styles.selectedTitle : styles.normalTitle
          ]}>
          {title}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    height: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    paddingHorizontal: 10
  },
  normalButton: { borderColor: '#B2B2AF' },
  selectedButton: { borderColor: '#E85C40', backgroundColor: '#FFF2EF' },
  title: { fontSize: 12, fontWeight: '400' },
  normalTitle: { color: '#989898' },
  selectedTitle: { color: '#E85C40' }
})

StyleTag.defaultProps = {
  id: 0,
  title: '风格标签',
  isSelected: false,
  style: null,
  onClick: () => {},
  disabled: false
}

StyleTag.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  isSelected: PropTypes.bool,
  disabled: PropTypes.bool,
  style: PropTypes.object
}
