/* @flow */

import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { getAbFlag } from '../../components/ab_testing'
import { inject, observer } from 'mobx-react'
import dateFns from 'date-fns'

@inject('currentCustomerStore')
@observer
export default class GuideView extends Component {
  constructor(props) {
    super(props)
    this.state = { showView: false }
    const { currentCustomerStore } = props
    let days = dateFns.differenceInDays(
      new Date(),
      currentCustomerStore.lastShowGuideViewTime
    )
    getAbFlag('share_guide', 1, value => {
      //value=1原始版本不显示引导view
      if (value === 1) return
      if (days < 1) {
        if (currentCustomerStore.shareGuideViewCount + 1 >= value) {
          this.setState({ showView: false })
        } else {
          currentCustomerStore.updateShareGuideViewCount()
          this.showShareGuideView()
        }
      } else {
        currentCustomerStore.updateLastShowGuideViewTime(new Date())
        currentCustomerStore.resetShareGuideViewCount()
        this.showShareGuideView()
      }
    })
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  showShareGuideView = () => {
    this.setState({ showView: true })
    this.timer = setTimeout(() => {
      this.timer = null
      this.setState({ showView: false })
    }, 5000)
  }

  render() {
    const { referralSenderAmount } = this.props.currentCustomerStore
    return (
      <View style={styles.container}>
        {this.state.showView && referralSenderAmount ? (
          <View style={styles.triangleViewParent}>
            <View style={styles.triangleView} />
            <View style={styles.content}>
              <Text style={styles.text}>
                邀请好友得￥{referralSenderAmount}奖励金
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 5,
    bottom: Dimensions.get('window').height - 100,
    zIndex: 1000
  },
  triangleView: {
    marginRight: 17,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 7,
    borderColor: 'transparent',
    borderBottomColor: 'black',
    marginTop: -15
  },
  triangleViewParent: { width: '100%', alignItems: 'flex-end' },
  content: {
    justifyContent: 'center',
    paddingHorizontal: 5,
    height: 30,
    backgroundColor: 'black'
  },
  text: {
    fontSize: 12,
    color: 'white'
  }
})
