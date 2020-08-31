import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text
} from 'react-native'
import { SERVICE_TYPES, Mutate } from '../../expand/services/services'
import { inject } from 'mobx-react'
import ImagePicker from 'react-native-syan-image-picker'

@inject('modalStore', 'currentCustomerStore', 'appStore')
export default class PhotoPanel extends PureComponent {
  static options = {
    imageCount: 1,
    isCrop: true,
    CropW: 300,
    CropH: 300,
    enableBase64: true
  }

  selectPicture = () => {
    this.props.cancel()
    ImagePicker.asyncShowImagePicker(PhotoPanel.options)
      .then(photos => {
        if (photos && photos.length) {
          const avatar = photos[0].base64
          this.uploadCustomerPhoto(avatar)
        }
      })
      .catch(err => {
        // 取消选择，err.message为"取消"
      })
  }

  uploadCustomerPhoto = avatar => {
    const { modalStore, appStore } = this.props
    modalStore.show(
      <View style={styles.loadingModal}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    )
    Mutate(
      SERVICE_TYPES.me.MUTATION_UPDATE_CUSTOMER,
      { customer: { avatar } },
      response => {
        const { errors, customer } = response.data.UpdateCustomer
        if (errors) {
        } else {
          if (customer && customer.avatar_url) {
            this.props.currentCustomerStore.avatarUrl = customer.avatar_url
          }
        }
        modalStore.hide()
        appStore.showToastWithOpacity('更换成功')
      },
      () => {
        modalStore.hide()
      }
    )
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          style={[styles.cancelTouch, styles.line]}
          onPress={this.selectPicture}>
          <Text style={styles.text}>更换头像</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cancelTouch, styles.line]}
          onPress={this.props.cancel}>
          <Text style={styles.text}>取消</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  line: { borderTopWidth: 1, borderTopColor: '#F7F7F7' },
  text: { color: '#666', fontSize: 14, textAlign: 'center' },
  textChannel: { color: '#666', fontSize: 12 },
  cancelTouch: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width: '100%'
  },
  loadingModal: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255, 0.5)',
    justifyContent: 'center'
  }
})
