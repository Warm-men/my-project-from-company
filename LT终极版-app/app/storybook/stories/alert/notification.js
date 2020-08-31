import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  Platform,
  Image,
  TouchableOpacity
} from 'react-native'
import Icons from 'react-native-vector-icons/EvilIcons'
import RNLetoteIntent from 'react-native-letote-intent'
import p2d from '../../../src/expand/tool/p2d'
import { inject } from 'mobx-react'
@inject('modalStore')
export default class Notification extends Component {
  _goToSetting = () => {
    const { modalStore } = this.props
    RNLetoteIntent.gotoPermissionSetting()
    modalStore.hide()
  }

  _closeDialog = () => {
    const { modalStore } = this.props
    modalStore.hide()
  }
  render() {
    const { title, description, type } = this.props
    return (
      <View style={styles.dialogContainer}>
        <View style={styles.dialogViewContainer}>
          <Image
            style={styles.dialogImage}
            source={
              type === 'EXPRESS'
                ? require('../../../assets/images/free_service/notification_bg.png')
                : require('../../../assets/images/customer_photos/notification_bg.png')
            }
          />
          <View style={styles.dialogTextContainer}>
            <Text style={styles.dialogTextTitle}>{title}</Text>
            <Text style={styles.dialogTextMessage}>{description}</Text>
            <TouchableOpacity
              style={styles.dialogSetting}
              onPress={this._goToSetting}>
              <Text style={{ color: '#FFFFFF' }}>去设置</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={this._closeDialog}
            style={styles.dialogClose}>
            <Icons name={'close-o'} size={35} color={'#fff'} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  dialogContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0, 0.5)'
  },
  dialogViewContainer: {
    borderRadius: 6,
    width: p2d(249),
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dialogImage: {
    height: p2d(138),
    width: p2d(249),
    backgroundColor: 'transparent'
  },
  dialogTextContainer: {
    width: p2d(249),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6
  },
  dialogTextTitle: {
    marginTop: p2d(28),
    fontSize: 14,
    color: '#5E5E5E',
    fontWeight: '500'
  },
  dialogTextMessage: { color: '#989898', fontSize: 12, marginTop: 11 },
  dialogSetting: {
    borderRadius: 20,
    backgroundColor: '#E85C40',
    marginTop: p2d(28),
    height: p2d(40),
    width: p2d(178),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: p2d(21)
  },
  dialogClose: {
    position: 'absolute',
    right: p2d(-15),
    top: p2d(-20)
  }
})
