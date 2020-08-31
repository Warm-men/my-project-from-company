import React, { PureComponent } from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import Image from '../image'
import p2d from '../../../src/expand/tool/p2d'
export default class ToteReturnHiveBox extends PureComponent {
  render() {
    const { params } = this.props.navigation.state
    const isPadding = params && params.isPadding
    const { FCAddress, getContent, confirm } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.introduceView}>
          <Text style={styles.introduceText}>
            {
              '使用丰巢智能柜自助寄回，无需承担快递费。复制衣箱寄回地址，在丰巢公众号自助下单，粘贴衣箱寄回地址，快递服务选择“顺丰揽件”，付款方式选择“到付”。'
            }
          </Text>
        </View>
        {!isPadding && (
          <View style={styles.FCWrapView}>
            <Text style={styles.inputTitle}>{'衣箱寄回地址'}</Text>
            <View style={styles.FCView}>
              <Text style={styles.FCAddressText}>{FCAddress}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                activeOpacity={0.6}
                hitSlop={{ top: 10, left: 20, right: 20, bottom: 10 }}
                onPress={getContent}>
                <Text style={styles.copyText}>{'复制'}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.confirmButton}
              activeOpacity={0.8}
              onPress={confirm}>
              <Text style={styles.confirmText}>{'确定使用丰巢智能柜寄回'}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.guideView}>
          <Text style={styles.guideTitle}>{'丰巢智能柜寄回衣箱指南'}</Text>
          <Image
            source={require('../../../assets/images/totes/hive_guide.png')}
            style={styles.guideImage}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  introduceView: {
    margin: 15,
    padding: 12,
    backgroundColor: '#F7F7F7',
    borderRadius: 2
  },
  introduceText: {
    fontSize: 13,
    color: '#999',
    lineHeight: 22,
    letterSpacing: 0
  },
  FCWrapView: {
    borderBottomColor: '#F7F7F7',
    borderBottomWidth: 7,
    paddingBottom: 30,
    marginTop: 5
  },
  inputTitle: {
    marginLeft: 24,
    fontSize: 15,
    color: '#333',
    fontWeight: '600'
  },
  FCView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 8
  },
  FCAddressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginRight: 20,
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
  confirmButton: {
    marginHorizontal: 20,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EA5C39',
    marginTop: 30,
    borderRadius: 2
  },
  confirmText: {
    fontSize: 14,
    color: '#FFF'
  },
  guideImage: {
    width: p2d(375),
    height: p2d(537)
  },
  guideView: {
    alignItems: 'center',
    paddingBottom: 35
  },
  guideTitle: {
    marginTop: 30,
    marginBottom: 24,
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  }
})
