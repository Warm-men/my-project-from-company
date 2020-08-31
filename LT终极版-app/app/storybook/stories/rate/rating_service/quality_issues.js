import React, { PureComponent, Component } from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import ImageCollection from '../../image_collection'
import AppendPhotoButton from '../../image_collection/append_photo'
import uploadFile from '../../../../src/expand/tool/upload_qiniu'

export default class QualityIssues extends Component {
  constructor(props) {
    super(props)
    const { rating, issues } = this.props
    const dic = {}
    issues.forEach(item => {
      if (rating) {
        dic[item.value] = rating[item.value] ? rating[item.value] : null
      } else {
        dic[item.value] = false
      }
    })
    this.state = { ...rating, ratingItems: dic }
  }

  didSelected = item => {
    const { didSelected, issues, rateTheIssue } = this.props
    let dic = {}
    dic[item.value] = !this.state.ratingItems[item.value]
    const newRatingItems = { ...this.state.ratingItems, ...dic }
    this.setState({ ratingItems: newRatingItems }, () => {
      let key = issues.filter(item => {
        return this.state.ratingItems[item.value]
      })
      didSelected(newRatingItems)
      rateTheIssue(!!key.length)
    })
  }

  _deleteThePhoto = data => {
    this._updatePhoto(data, true)
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
        // TODO: 上传失败处理
      }
    )
  }

  _updatePhotos = photos => {
    photos.forEach(object => {
      this._updatePhoto(object)
    })
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

  render() {
    const { issues, photos, showTips } = this.props
    if (showTips) {
      return null
    }
    return (
      <View style={styles.container}>
        <Text style={styles.bannerViewText}>质量问题</Text>
        <View style={styles.buttonsBox}>
          {issues.map((item, index) => {
            return (
              <Button
                item={item}
                rating={this.state.ratingItems}
                onPress={this.didSelected}
                key={index}
              />
            )
          })}
        </View>
        <ImageCollection
          array={photos}
          maxLength={5}
          itemStyle={{ height: 60, width: 60, marginRight: 8 }}
          deleteTheCollectionItem={this._deleteThePhoto}
          appendComponent={
            <AppendPhotoButton
              updatePhotos={this._updatePhotos}
              currentCount={photos.length}
              maxLength={5}
              isQuality
            />
          }
        />
      </View>
    )
  }
}

export class Button extends PureComponent {
  didSelected = () => {
    const { item, onPress } = this.props
    onPress(item)
  }

  render() {
    const { item, rating } = this.props
    let show = rating[item.value]
    return (
      <TouchableOpacity
        onPress={this.didSelected}
        style={[styles.button, show ? styles.likeButton : styles.unLikeButton]}>
        <Text
          style={[
            styles.buttonText,
            show ? styles.likeButtonText : styles.unLikeButtonText
          ]}>
          {item.display}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  bannerbox: {
    flexDirection: 'row'
  },
  bannerView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 26,
    marginRight: p2d(32)
  },
  bannerViewText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 16
  },
  buttonsBox: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  button: {
    borderRadius: 100,
    paddingVertical: 7,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    marginRight: 8,
    borderWidth: 0.5
  },
  buttonText: {
    fontSize: 12
  },
  likeButton: {
    backgroundColor: '#FDEDE9',
    borderColor: '#E85C40'
  },
  likeButtonText: {
    color: '#E85C40'
  },
  unLikeButton: {
    borderColor: '#ccc'
  },
  unLikeButtonText: {
    color: '#5e5e5e'
  },
  smelled: {
    fontSize: 12,
    color: '#999'
  },
  qualityTips: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    marginBottom: 12
  }
})
