import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Clipboard
} from 'react-native'
import Icons from 'react-native-vector-icons/Ionicons'
import p2d from '../../../src/expand/tool/p2d'
export default class ToteReturnHiveBoxInfoCard extends PureComponent {
  _getContent = async () => {
    Clipboard.setString(this.props.FCAddress)
    try {
      let result = await Clipboard.getString()
      if (result) {
        this.props.appStore.showToast('复制成功', 'success')
      }
    } catch (e) {
      this.props.appStore.showToast('复制失败', 'error')
    }
  }

  render() {
    const {
      FCAddress,
      hiveBoxScheduledPickup,
      aboutHiveBox,
      fillInTrackingNumber
    } = this.props
    const latestReturnAt =
      hiveBoxScheduledPickup && hiveBoxScheduledPickup.latest_return_at
    const trackingNumber =
      hiveBoxScheduledPickup && hiveBoxScheduledPickup.tracking_number
    return (
      latestReturnAt && (
        <View style={styles.container}>
          <View style={styles.titleView}>
            <Text style={styles.titleText}>{'丰巢智能柜自助寄回'}</Text>
            <TouchableOpacity
              onPress={aboutHiveBox}
              activeOpacity={0.6}
              hitSlop={{ top: 10, left: 20, right: 20, bottom: 10 }}>
              <Icons
                name={'ios-help-circle-outline'}
                size={18}
                color={'#999'}
              />
            </TouchableOpacity>
          </View>
          {trackingNumber ? (
            <View style={styles.trackingNumberView}>
              <Text style={styles.buttonText}>{'顺丰快递单号'}</Text>
              <TouchableOpacity
                hitSlop={{ top: 10, left: 20, right: 20, bottom: 10 }}
                activeOpacity={0.8}
                onPress={fillInTrackingNumber}
                style={styles.numberView}>
                <Text style={styles.numberText}>{trackingNumber}</Text>
                <Icons
                  style={styles.IconsArrowRight}
                  name={'ios-arrow-forward'}
                  size={13}
                  color={'#CCCCCC'}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View style={styles.FCView}>
                <Text style={styles.FCAddressText}>{FCAddress}</Text>
                <TouchableOpacity
                  style={styles.copyButton}
                  activeOpacity={0.6}
                  hitSlop={{ top: 10, left: 20, right: 20, bottom: 10 }}
                  onPress={this._getContent}>
                  <Text style={styles.copyText}>{'复制'}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.returnView}>
                <Text
                  style={
                    styles.returnText
                  }>{`衣箱最晚归还时间：${latestReturnAt}`}</Text>
              </View>
              <TouchableOpacity
                onPress={fillInTrackingNumber}
                activeOpacity={0.8}
                style={styles.buttonView}>
                <Text style={styles.buttonText}>{'输入顺丰快递单号'}</Text>
                <Icons
                  style={styles.IconsArrowRight}
                  name={'ios-arrow-forward'}
                  size={13}
                  color={'#CCCCCC'}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginVertical: 15,
    elevation: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4
  },
  titleView: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 20,
    paddingLeft: 15,
    alignItems: 'center'
  },
  titleText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginRight: 8
  },
  FCView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 8
  },
  FCAddressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginRight: 10,
    flex: 1
  },
  copyButton: {
    width: 47,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 3
  },
  copyText: {
    fontSize: 13,
    color: '#666666'
  },
  returnView: {
    height: 30,
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 3,
    marginHorizontal: 15,
    marginTop: 8,
    marginBottom: 28
  },
  returnText: {
    fontSize: 14,
    color: '#5E5E5E'
  },
  buttonView: {
    borderTopColor: '#F2F2F2',
    borderTopWidth: 1,
    height: p2d(40),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 13,
    color: '#666',
    marginRight: 8
  },
  IconsArrowRight: {
    marginTop: 2
  },
  trackingNumberView: {
    marginTop: 22,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 27
  },
  numberView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  numberText: {
    fontSize: 13,
    color: '#666',
    marginRight: 8
  }
})
