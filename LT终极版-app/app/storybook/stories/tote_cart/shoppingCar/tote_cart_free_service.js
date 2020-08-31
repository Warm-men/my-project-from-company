import React, { PureComponent } from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { inject, observer } from 'mobx-react'
import Icon from 'react-native-vector-icons/Ionicons'
@inject('toteCartStore')
@observer
export default class ToteCartFreeService extends PureComponent {
  _buttonOnPress = () => {
    const {
      applyFreeServiceToToteCart,
      removeFreeServiceFromToteCart,
      toteCartStore
    } = this.props
    const { disable_free_service } = toteCartStore.toteCart
    if (disable_free_service) {
      applyFreeServiceToToteCart && applyFreeServiceToToteCart()
    } else {
      removeFreeServiceFromToteCart && removeFreeServiceFromToteCart()
    }
  }

  render() {
    const { disable_free_service } = this.props.toteCartStore.toteCart
    const buttonText = disable_free_service ? `恢复启用` : `临时关闭`
    const tipsText = disable_free_service ? `已临时关闭自在选` : `已启用自在选`
    const buttonStyle = disable_free_service
      ? [styles.button, { borderColor: '#E85C40' }]
      : styles.button
    const buttonTextStyle = disable_free_service
      ? [styles.buttonText, { color: '#E85C40' }]
      : styles.buttonText
    return (
      <View style={styles.toteCartFreeService}>
        <View style={styles.container}>
          <View style={styles.fdView}>
            <Text style={styles.tipsText}>{tipsText}</Text>
            <TouchableOpacity
              onPress={this.props.togglePop}
              activeOpacity={0.8}
              hitSlop={styles.iconHitSlop}>
              <Icon
                name={'ios-help-circle-outline'}
                size={18}
                style={styles.iconHelp}
                color={'#989A9C'}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={this._buttonOnPress} style={buttonStyle}>
            <Text style={buttonTextStyle}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  toteCartFreeService: {
    paddingHorizontal: 4,
    paddingTop: 16,
    position: 'relative',
    zIndex: 1
  },
  container: {
    backgroundColor: '#F7F7F7',
    borderRadius: 4,
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    flexDirection: 'row'
  },
  fdView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  tipsText: {
    fontSize: 14,
    color: '#5E5E5E',
    marginLeft: 8
  },
  iconHelp: {
    marginLeft: 3,
    marginTop: 2
  },
  iconHitSlop: {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10
  },
  button: {
    width: 73,
    height: 26,
    borderColor: '#ccc',
    borderRadius: 2,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 12,
    color: '#5e5e5e'
  }
})
