import React, { PureComponent } from 'react'
import { Text, StyleSheet, View, Dimensions } from 'react-native'
import DashLine from '../../dashLine'
import p2d from '../../../../src/expand/tool/p2d'
const data = ['基础档案', '身型', '常穿尺码', '品类偏好']
export default class ProgressBar extends PureComponent {
  render() {
    const { step } = this.props
    return (
      <View style={styles.container}>
        {data.map((item, index) => {
          return (
            <View style={styles.itemContainer} key={index}>
              {index !== data.length - 1 ? (
                index < step ? (
                  <View style={styles.line} />
                ) : (
                  <DashLine lineWidth={0.7} style={styles.dashLine} />
                )
              ) : null}
              <View style={styles.step}>
                <View
                  style={[
                    styles.point,
                    { backgroundColor: index <= step ? '#E85C40' : '#CCCCCC' }
                  ]}>
                  <Text style={styles.text}> {index + 1} </Text>
                </View>
                <Text
                  style={[
                    styles.stepText,
                    { color: index <= step ? '#242424' : '#CCCCCC' }
                  ]}>
                  {item}
                </Text>
              </View>
            </View>
          )
        })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 24,
    borderBottomWidth: 0.7,
    borderBottomColor: '#F3F3F3',
    paddingBottom: 24
  },
  itemContainer: {
    alignItems: 'center',
    width: p2d(80)
  },
  step: {
    alignItems: 'center'
  },
  stepText: { marginTop: 12, fontSize: 13 },
  point: {
    height: 22,
    width: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: 'white'
  },
  dashLine: {
    top: 11,
    left: p2d(40),
    width: p2d(61)
  },
  line: {
    top: 11,
    left: p2d(40),
    height: 1,
    width: p2d(61),
    backgroundColor: '#E85C40'
  }
})
