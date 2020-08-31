import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
const screenWidth = Dimensions.get('window').width

export default class OpenFreeServiceExperiment extends Component {
  render() {
    const { isContarcted, openFreeServiceHelp, openFreeService } = this.props
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <Image
            style={{ width: screenWidth, height: screenWidth * (475 / 750) }}
            resizeMode={'contain'}
            source={require('../../../assets/images/free_service/free_service_test_1.png')}
          />
          <View>
            <Image
              style={{ width: screenWidth, height: screenWidth * (1130 / 750) }}
              resizeMode={'contain'}
              source={require('../../../assets/images/free_service/free_service_test_2.png')}
            />
          </View>
          <View>
            <Image
              style={{ width: screenWidth, height: screenWidth * (897 / 750) }}
              resizeMode={'contain'}
              source={require('../../../assets/images/free_service/free_service_test_3.png')}
            />
          </View>
          <Image
            style={{ width: screenWidth, height: screenWidth * (1260 / 750) }}
            resizeMode={'contain'}
            source={require('../../../assets/images/free_service/free_service_test_4.png')}
          />
          <TouchableOpacity
            style={styles.openFreeServiceHelp}
            onPress={openFreeServiceHelp}
          />
        </ScrollView>
        <View style={styles.openContainer}>
          <Text style={styles.desc}>
            {isContarcted
              ? '自动续费会员可免费开通自在选服务'
              : '开通自动续费，免费享自在选特权，可随时取消'}
          </Text>
          <TouchableOpacity
            onPress={openFreeService}
            style={styles.openTextContainer}>
            <Text style={styles.openText}>{'免费开通'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  openContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: p2d(88),
    paddingVertical: p2d(8),
    paddingHorizontal: p2d(15)
  },
  openTextContainer: {
    width: '100%',
    height: p2d(44),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E85C40',
    borderRadius: p2d(3)
  },
  openText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600'
  },
  desc: { marginBottom: 14, fontSize: 12, color: '#989898', marginTop: p2d(4) },
  openFreeServiceHelp: {
    position: 'absolute',
    bottom: 18,
    left: p2d(132),
    height: 40,
    width: 110
  }
})
