/* @flow */

import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text
} from 'react-native'
import Image from '../../../storybook/stories/image'

export default class ShippingAddressInfoItem extends PureComponent {
  constructor(props) {
    super(props)
    const { textContent } = this.props
    this.state = {
      textContent: textContent
    }
  }

  _onChangeText = text => {
    const { getInputValue } = this.props
    this.setState({
      textContent: text
    })
    getInputValue(text)
  }

  render() {
    const {
      categoryTitle,
      isAreaPicker,
      showPicker,
      keyboardType,
      selectedValue,
      onFocus,
      placeholder
    } = this.props
    return (
      <View style={styles.infoView}>
        <Text style={styles.categoryText}>{categoryTitle}</Text>
        {isAreaPicker ? (
          <TouchableOpacity onPress={showPicker} style={styles.infoViewRight}>
            <Text style={styles.addressTextInput}>{selectedValue[0]}</Text>
            <Text style={styles.addressTextInput}>{selectedValue[1]}</Text>
            <Text style={styles.addressTextInput}>{selectedValue[2]}</Text>
            <Image
              source={require('../../../assets/images/account/arrow_right.png')}
            />
          </TouchableOpacity>
        ) : (
          <TextInput
            style={styles.textInput}
            placeholder={placeholder ? placeholder : '请填写'}
            placeholderTextColor={'#8e939a'}
            value={this.state.textContent}
            onChangeText={this._onChangeText}
            onFocus={onFocus}
            keyboardType={keyboardType || 'default'}
            maxLength={keyboardType ? 11 : null}
            underlineColorAndroid="transparent"
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  infoView: {
    marginLeft: 20,
    marginRight: 20,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#F2F2F2',
    borderBottomWidth: 1
  },
  categoryText: {
    flex: 2,
    fontSize: 13,
    color: '#666',
    marginRight: 10
  },
  textInput: {
    flex: 8,
    height: 60,
    width: 100,
    fontSize: 13,
    textAlign: 'right',
    marginRight: 12,
    color: '#333333'
  },
  addressTextInput: {
    maxWidth: 75,
    fontSize: 13,
    textAlign: 'right',
    color: '#333333',
    marginRight: 5
  },
  infoViewRight: {
    flex: 8,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
})
