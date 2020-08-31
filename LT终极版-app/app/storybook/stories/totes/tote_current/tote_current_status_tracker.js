/* @flow */
import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import dateFns from 'date-fns'

export default class ToteStatusBarTracker extends PureComponent {
  _checkProgress = () => {
    const { status } = this.props.progressStatus
    let progress = '0%'
    let completedStep = 0
    if (status === 'locked') {
      progress = '12.5%'
      completedStep = 0
    } else if (status === 'shipped') {
      progress = '37.5%'
      completedStep = 1
    } else if (status === 'delivered') {
      progress = '62.5%'
      completedStep = 2
    } else if (status == 'scheduled_return') {
      progress = '87.5%'
      completedStep = 3
    }
    return { progress, completedStep }
  }

  _getChildrens = () => {
    const {
      locked_at,
      shipped_at,
      delivered_at,
      schedule_returned_at
    } = this.props.progressStatus
    const statusData = [
      {
        header: '已下单',
        completedDate: locked_at && dateFns.format(locked_at, 'MM月DD日')
      },
      {
        header: '已发货',
        completedDate: shipped_at && dateFns.format(shipped_at, 'MM月DD日')
      },
      {
        header: '已签收',
        completedDate: delivered_at && dateFns.format(delivered_at, 'MM月DD日')
      },
      {
        header: '还衣箱',
        completedDate:
          schedule_returned_at &&
          dateFns.format(schedule_returned_at, 'MM月DD日')
      }
    ]
    const { completedStep } = this._checkProgress()
    const childrens = statusData.map((item, index) => {
      const isCompleled = completedStep >= index
      return (
        <View style={styles.item} key={item.header}>
          <View style={styles.line} />
          <Text
            testID="header"
            style={[styles.captionHeader, isCompleled && styles.finished]}>
            {item.header}
          </Text>
          <Text testID="caption-date" style={styles.captionDate}>
            {item.completedDate}
          </Text>
        </View>
      )
    })
    return childrens
  }

  render() {
    const childrensComponent = this._getChildrens()
    const { progress } = this._checkProgress()
    return (
      <View style={styles.container}>
        <View style={styles.progress}>
          <View style={[styles.progressValue, { width: progress }]} />
        </View>
        <View style={styles.statusBar}>{childrensComponent}</View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 16
  },
  statusBar: {
    flexDirection: 'row'
  },
  progress: {
    height: 8,
    backgroundColor: '#f7f7f7',
    borderRadius: 5
  },
  progressValue: {
    backgroundColor: '#F3BF78',
    height: 8,
    borderRadius: 5
  },
  line: {
    width: 1,
    height: 10,
    backgroundColor: '#CDCDCD',
    marginVertical: 5
  },
  item: {
    width: '25%',
    alignItems: 'center'
  },
  captionHeader: {
    marginTop: 2,
    fontSize: 12,
    color: '#cdcdcd',
    letterSpacing: 0.4
  },
  captionDate: {
    fontSize: 10,
    color: '#989898',
    marginTop: 2,
    letterSpacing: 0.4
  },
  finished: {
    color: '#242424'
  }
})
