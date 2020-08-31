import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../image'

export default class ErrorView extends PureComponent {
  onPress = () => {
    const { customerService, error, joinMember } = this.props
    const isExpire = error.error_code === 'error_not_active'
    if (isExpire) {
      joinMember && joinMember()
    } else {
      customerService && customerService()
    }
  }
  render() {
    const { error } = this.props
    const isExpire = error.error_code === 'error_not_active'
    return (
      <View style={styles.errorView}>
        <Image
          style={styles.errorImage}
          source={require('../../../assets/images/rating/fail.png')}
        />
        <Text style={styles.errorText}>升级失败</Text>
        <Text style={styles.errorTips}>{error.message}</Text>
        <TouchableOpacity
          testID="button"
          style={styles.contactButton}
          onPress={this.onPress}>
          <Text testID="button-text" style={styles.errorButtonText}>
            {isExpire ? '立即续费' : '咨询客服'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  errorView: {
    marginTop: 100,
    alignItems: 'center',
    flex: 1
  },
  errorImage: {
    width: 76,
    height: 76
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    fontWeight: '700',
    lineHeight: 30
  },
  contactButton: {
    width: 164,
    height: 48,
    borderWidth: 1,
    borderColor: '#B2B2AF',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '800'
  },
  errorTips: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    marginBottom: 32
  }
})
