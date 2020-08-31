import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../../image'
import { format } from 'date-fns'

class SeasonGuide extends PureComponent {
  translationSeason = () => {
    const { seasonChangePrompt } = this.props
    let fisrtTitle, secondTitle, timeTitle, url
    switch (seasonChangePrompt) {
      case 'transport_to_spring':
        fisrtTitle = `优先展示春款商品`
        secondTitle = `如果你仍想租用冬款`
        url = require('../../../../assets/images/product_list/transport_to_spring.png')
        break
      case 'transport_to_summer':
        fisrtTitle = `优先展示夏款商品`
        secondTitle = `如果你仍想租用春款`
        url = require('../../../../assets/images/product_list/transport_to_summer.png')
        break
      case 'transport_to_fall':
        fisrtTitle = `优先展示秋款商品`
        secondTitle = `如果你仍想租用夏款`
        url = require('../../../../assets/images/product_list/transport_to_fall.png')
        break
      case 'transport_to_winter':
        fisrtTitle = `优先展示冬款商品`
        secondTitle = `如果你仍想租用秋款`
        url = require('../../../../assets/images/product_list/transport_to_winter.png')
        break
    }
    timeTitle = `今天是${format(new Date(), 'MM月DD日')}`
    return { fisrtTitle, secondTitle, timeTitle, url }
  }

  render() {
    const { nickname } = this.props
    const { fisrtTitle, secondTitle, timeTitle, url } = this.translationSeason()
    return (
      <View style={styles.guideView}>
        <View style={styles.guideImage}>
          <Image style={styles.guideImage} source={url} />
          <View style={[styles.guideImage, styles.guideContent]}>
            <Text style={styles.nickName}>
              亲爱的{nickname ? nickname : '会员'}
            </Text>
            <View style={styles.line} />
            <Text style={styles.gudieText}>
              {timeTitle}，我们已为你
              <Text style={styles.gudieTextBolb}>{fisrtTitle}</Text>，
              {secondTitle}
              ，可以在选衣页面手动切换
            </Text>
            <TouchableOpacity
              style={styles.guideButton}
              onPress={this.props.hideSeasonGuide}>
              <Text style={styles.guideButtonText}>我知道啦</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  guideView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  guideImage: {
    width: 249,
    height: 286
  },
  guideContent: {
    alignItems: 'center',
    position: 'absolute',
    paddingTop: 55,
    paddingHorizontal: 35
  },
  nickName: {
    fontSize: 15,
    color: '#242424',
    fontWeight: '700'
  },
  line: {
    width: 47,
    height: 1,
    backgroundColor: '#242424',
    marginTop: 16,
    marginBottom: 12
  },
  gudieText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#5e5e5e',
    lineHeight: 21
  },
  gudieTextBolb: {
    color: '#121212',
    fontWeight: '700'
  },
  guideButton: {
    width: 173,
    height: 40,
    borderRadius: 20,
    borderColor: '#E85C40',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14
  },
  guideButtonText: {
    fontSize: 13,
    color: '#F26043'
  }
})

export { SeasonGuide }
