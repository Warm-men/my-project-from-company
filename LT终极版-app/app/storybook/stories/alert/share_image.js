import React, { PureComponent } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import Image from '../image.js'
import p2d from '../../../src/expand/tool/p2d'
import ViewShot from 'react-native-view-shot'
import { inject } from 'mobx-react'

@inject('panelStore')
export default class ShareImage extends PureComponent {
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }
  onImageLoad = () => {
    this.timer = setTimeout(() => {
      this.viewShot.capture().then(uri => {
        this.props.panelStore.shareImageUri = uri
      })
    }, 100)
  }
  render() {
    const { imageUrl, miniProgramCodeUrl } = this.props
    return (
      <ViewShot
        ref={ref => (this.viewShot = ref)}
        style={styles.shareImageContainer}>
        <Image style={styles.customerImage} source={{ uri: imageUrl }} />
        <View style={styles.qrCodeContainer}>
          <Image
            useRNImage={true}
            qWidth={160}
            onLoad={this.onImageLoad}
            style={styles.qrCodeImage}
            source={{ uri: miniProgramCodeUrl }}
          />
          <View style={styles.descContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>扫码来为我的最新穿搭点赞！</Text>
              <Image
                style={styles.like}
                source={require('../../../assets/images/customer_photos/liked_red.png')}
              />
            </View>
            <Text style={styles.content}>高品质品牌服饰随心穿你也可以！</Text>
          </View>
        </View>
      </ViewShot>
    )
  }
}

const styles = StyleSheet.create({
  shareImageContainer: {
    height: p2d(410, { maxLock: true }),
    width: p2d(265, { maxLock: true }),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: p2d(25, { maxLock: true }),
    paddingHorizontal: p2d(14, { maxLock: true }),
    backgroundColor: 'white',
    paddingTop: p2d(14, { maxLock: true })
  },
  customerImage: {
    height: p2d(316, { maxLock: true }),
    width: p2d(237, { maxLock: true }),
    backgroundColor: 'white'
  },
  qrCodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    height: p2d(80, { maxLock: true }),
    width: p2d(265, { maxLock: true }),
    padding: p2d(14, { maxLock: true })
  },
  qrCodeImage: {
    height: p2d(59, { maxLock: true }),
    width: p2d(58, { maxLock: true })
  },
  descContainer: {
    marginLeft: p2d(7, { maxLock: true }),
    flexDirection: 'column',
    justifyContent: 'space-evenly'
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  like: {
    height: p2d(12, { maxLock: true }),
    width: p2d(12, { maxLock: true })
  },
  title: { fontSize: p2d(12, { maxLock: true }), color: '#242424' },
  content: { fontSize: p2d(11, { maxLock: true }), color: '#989898' }
})
