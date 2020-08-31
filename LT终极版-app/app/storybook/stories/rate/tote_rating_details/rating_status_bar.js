/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'

export default class RatingStatusBar extends PureComponent {
  render() {
    const { count, currentCount, hasIncentived, amount, rating } = this.props

    return (
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage}
          source={require('../../../../assets/images/rating/rating_details_bg.png')}
        />
        <View style={styles.header}>
          <Image
            style={styles.giftIcon}
            source={require('../../../../assets/images/rating/gift_icon.png')}
          />
          <Text style={styles.headerContent}>
            评价领<Text style={styles.headerAmount}>{amount}</Text>元奖励金
          </Text>
          <Text style={styles.headerCount}>
            已评{currentCount}件，共{count}件
          </Text>
        </View>
        <View style={styles.contentView}>
          <Progress {...this.props} />
          {hasIncentived ? (
            <Text style={styles.successContent}>已获得{amount}元奖励</Text>
          ) : (
            <View>
              <Text style={styles.content}>
                评完所有单品即可获得{amount}元奖励金
              </Text>
              {count > currentCount ? (
                <TouchableOpacity style={styles.button} onPress={rating}>
                  <Text style={styles.buttonTitle}>
                    {currentCount ? '继续评价' : '开始评价'}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { marginBottom: p2d(24), paddingHorizontal: 16 },
  backgroundImage: {
    width: p2d(375),
    height: p2d(214),
    position: 'absolute',
    top: p2d(-50)
  },

  header: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  giftIcon: { width: 36, height: 36, marginRight: 6 },
  headerContent: {
    fontWeight: '600',
    fontSize: 18,
    color: '#fff',
    flex: 1
  },
  headerAmount: {
    fontWeight: '600',
    fontSize: 22,
    color: '#FFF78C'
  },
  headerCount: { fontSize: 12, color: '#fff' },

  contentView: {
    marginTop: 10,
    paddingBottom: 21,
    borderRadius: 4,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#FF4F40',
    shadowOffset: { height: 6, width: 1 },
    shadowRadius: 4,
    shadowOpacity: 0.1
  },

  progress: { marginHorizontal: 16, marginTop: 26 },
  progressView: { backgroundColor: '#FFC9C7', height: 2, marginTop: 6 },
  progressValue: { backgroundColor: '#FF4536', height: 2 },
  pointView: {
    height: 8,
    width: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    marginLeft: -4
  },
  imageView: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: -6,
    marginLeft: -15
  },
  content: {
    fontSize: 12,
    color: '#989898',
    textAlign: 'center',
    marginTop: 26,
    marginBottom: 12
  },
  button: {
    marginHorizontal: p2d(32),
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF4034',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonTitle: {
    color: '#fff',
    fontWeight: '500'
  },
  successContent: {
    fontSize: 14,
    color: '#242424',
    textAlign: 'center',
    lineHeight: 40,
    marginTop: 20
  }
})

class Progress extends PureComponent {
  constructor(props) {
    super(props)
    const { count } = this.props
    this.pointWith = 100 / count
  }
  render() {
    const { hasIncentived, currentCount, count, amount } = this.props

    let currentPoint = 0
    let pointCount = currentCount
    if (pointCount) {
      if (pointCount > count) {
        pointCount = count
      }
      currentPoint = (pointCount * 100.0) / count - 100.0 / count / 2
    }
    return (
      <View style={styles.progress}>
        <View style={styles.progressView}>
          <View
            style={[
              styles.progressValue,
              { width: pointCount === count ? '100%' : currentPoint + '%' }
            ]}
          />
        </View>
        {Array.from({ length: count }).map((item, index) => {
          const left = this.pointWith / 2 + index * this.pointWith + '%'
          const point = ((index + 1) * 100.0) / count - 100.0 / count / 2
          if (index + 1 === count) {
            return (
              <View key={index} style={[styles.imageView, { left }]}>
                <Image
                  source={
                    hasIncentived
                      ? require('../../../../assets/images/rating/red_envelope_opened.png')
                      : require('../../../../assets/images/rating/red_envelope.png')
                  }
                />
              </View>
            )
          } else {
            return (
              <View
                key={index}
                style={[
                  styles.pointView,
                  { left },
                  currentPoint >= point
                    ? { backgroundColor: '#FF4536' }
                    : { backgroundColor: '#FFC9C7' }
                ]}
              />
            )
          }
        })}
      </View>
    )
  }
}
