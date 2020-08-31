/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import ImageCollection from '../../image_collection'
import AppendPhotoButton from '../../image_collection/append_photo'
import uploadFile from '../../../../src/expand/tool/upload_qiniu'
import { CustomAlertView } from '../../alert/custom_alert_view'
import { inject, observer } from 'mobx-react'

@inject('modalStore', 'guideStore')
@observer
export default class PhotosContainer extends PureComponent {
  _visitHepler = () => {
    const { navigation } = this.props
    navigation.push('WebPage', {
      uri: 'https://static.letote.cn/pages/newshow_inroduce/index.html'
    })
  }
  _deleteThePhoto = data => {
    const { modalStore } = this.props
    modalStore.show(
      <CustomAlertView
        message={'确认删除该照片'}
        cancel={{ title: '取消', type: 'normal' }}
        other={[
          {
            title: '确认',
            type: 'highLight',
            onClick: () => {
              this._updatePhoto(data, true)
            }
          }
        ]}
      />
    )
  }

  _updatePhoto = (photo, isDelete) => {
    const { updatePhotos, photos } = this.props
    if (isDelete) {
      const array = photos.filter(item => {
        return item.uri !== photo.uri
      })
      updatePhotos(array)
    } else {
      const index = photos.findIndex(item => {
        return item.uri === photo.uri
      })
      if (index === -1) {
        //避免删除后上传成功的照片再次加入到数据里
        if (!photo.upload_url) {
          const array = [...photos, photo]
          updatePhotos(array)
          this._uploadCurrentPhoto(photo)
        }
      } else {
        const array = [...photos]
        array.splice(index, 1, photo)
        updatePhotos(array)
      }
    }
  }

  _updatePhotos = photos => {
    const { taggingCustomerPhotos } = this.props
    taggingCustomerPhotos && taggingCustomerPhotos(photos)
    photos.forEach(object => {
      this._updatePhoto(object)
    })
  }

  _uploadCurrentPhoto = photo => {
    uploadFile(
      [photo.uri],
      urls => {
        if (urls && urls.length) {
          const obj = { ...photo, upload_url: urls[0] }
          this._updatePhoto(obj)
        }
      },
      () => {
        this.loopTimer = setTimeout(() => {
          this._uploadCurrentPhoto(photo)
        }, 3000)
      }
    )
  }

  componentWillUnmount() {
    this.loopTimer && clearTimeout(this.loopTimer)
  }

  render() {
    const { photos, onClickCollectionItem, maxLength, guideStore } = this.props
    return (
      <View style={styles.container}>
        <ImageCollection
          array={photos}
          maxLength={maxLength > 0 ? maxLength : 100}
          itemStyle={styles.itemStyle}
          deleteTheCollectionItem={this._deleteThePhoto}
          onClickCollectionItem={onClickCollectionItem}
          appendComponent={
            <AppendPhotoButton
              updatePhotos={this._updatePhotos}
              maxLength={maxLength > 0 ? maxLength : 100}
              currentCount={photos.length}
            />
          }
        />
        {!guideStore.photosTaggingBubble && !!photos.length && <Guide />}
      </View>
    )
  }
}

class Guide extends PureComponent {
  render() {
    return (
      <View style={styles.bubble}>
        <View style={styles.bubbleContent}>
          <Text style={styles.guideText}>点击图片可重新编辑</Text>
        </View>
        <View style={styles.arrow} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    paddingBottom: 0
  },
  bubble: {
    alignItems: 'center',
    position: 'absolute',
    left: 15,
    top: -13
  },
  itemStyle: {
    width: 90,
    height: 120
  },
  arrow: {
    borderWidth: 5,
    borderColor: 'transparent',
    borderTopColor: '#FF8D68',
    alignSelf: 'flex-start',
    marginLeft: 26
  },
  bubbleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#FF8D68',
    zIndex: 1000
  },
  guideText: { lineHeight: 22, color: '#fff', fontSize: 12 }
})
