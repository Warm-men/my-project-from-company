import React, { PureComponent } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import Icon from 'react-native-vector-icons/Ionicons'
export default class CreditAccountBar extends PureComponent {
  render() {
    const { message, onClick, buttonText } = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.messageText} testID={'credit-account-bar-message'}>
          {message}
        </Text>
        <TouchableOpacity
          style={styles.buttonView}
          activeOpacity={0.8}
          hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
          onPress={onClick}>
          <Text
            style={styles.buttonText}
            testID={'credit-account-bar-button-text'}>
            {buttonText}
          </Text>
          <Icon name={'ios-arrow-forward'} size={15} color="#E85C40" />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: p2d(18),
    paddingHorizontal: p2d(16),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    elevation: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4
  },
  messageText: {
    color: '#333333',
    fontSize: 14
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#E85C40',
    fontSize: 12,
    fontWeight: '500',
    marginRight: 5
  }
})
