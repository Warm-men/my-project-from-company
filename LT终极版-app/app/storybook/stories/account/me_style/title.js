import React, { PureComponent } from 'react'
import { Text, StyleSheet } from 'react-native'

export default class Title extends PureComponent {
  render() {
    return (
      <Text style={[styles.title, this.props.style]}>{this.props.title}</Text>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    marginTop: 24,
    fontSize: 16,
    color: '#242424',
    marginBottom: 12,
    fontWeight: '500'
  }
})
