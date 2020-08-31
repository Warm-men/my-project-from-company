/* @flow */

import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

export default props => {
  const { toteShippingStatus } = props
  const status = [
    { ...toteShippingStatus.steps.styled, title: '已开启' },
    { ...toteShippingStatus.steps.preparing, title: '已下单' },
    { ...toteShippingStatus.steps.in_transit, title: '已发货' },
    { ...toteShippingStatus.steps.delivered, title: '已签收' }
  ]
  let progress = 0
  const childrens = status.map(item => {
    item.complete === true && (progress += 25)
    return (
      <View style={styles.item} key={item.title}>
        <View style={styles.line} />
        <Text style={[styles.caption, item.complete && styles.complete]}>
          {item.title}
        </Text>
        <Text
          style={[
            styles.caption,
            { marginTop: 5 },
            item.header && { marginBottom: 20 }
          ]}>
          {item.header}
        </Text>
      </View>
    )
  })
  progress = progress + '%'

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        <View style={[styles.progressValue, { width: progress }]} />
      </View>
      <View style={styles.statusBar}>{childrens}</View>
      {/* <Text style={styles.message}>{toteShippingStatus.message}</Text> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 15,
    marginRight: 15
  },
  message: {
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 20
  },
  statusBar: {
    flexDirection: 'row'
  },
  progress: {
    height: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 5
  },
  progressValue: {
    backgroundColor: '#F3BF78',
    height: 10,
    borderRadius: 5
  },
  line: {
    width: 1,
    height: 15,
    backgroundColor: '#cdcdcd',
    marginTop: 5,
    marginBottom: 10
  },
  item: {
    width: '25%',
    alignItems: 'center'
  },
  caption: {
    fontWeight: '400',
    fontSize: 12,
    color: '#cdcdcd',
    letterSpacing: -0.41
  },
  complete: {
    color: '#333'
  }
})
