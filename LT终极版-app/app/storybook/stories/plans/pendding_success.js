/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Dimensions, Animated } from 'react-native'
import Animation from 'lottie-react-native'

export default class PenddingSuccess extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      progress: new Animated.Value(0)
    }
  }

  componentDidMount() {
    this._toPendding()
  }

  _toPendding = () => {
    if (this.isPlaying) {
      return
    }
    this.isPlaying = true
    this.state.progress.setValue(0)
    Animated.timing(this.state.progress, {
      toValue: 0.29,
      duration: 500,
      useNativeDriver: true,
      isInteraction: false
    }).start(this._checkStatus)
  }

  _checkStatus = () => {
    this.isPlaying = false
    const { checkStatus } = this.props
    const isPaymentSucceed = checkStatus && checkStatus()
    if (isPaymentSucceed) {
      this._finishPayment()
    } else {
      this._toPendding()
    }
  }

  _finishPayment = () => {
    this.state.progress.setValue(0)
    Animated.timing(this.state.progress, {
      toValue: 1,
      duration: 1250,
      useNativeDriver: true,
      isInteraction: false
    }).start(() => {
      setTimeout(() => {
        const { finishPayment } = this.props
        finishPayment && finishPayment()
      }, 100)
    })
  }

  render() {
    return (
      <View style={styles.backgroundView}>
        <View style={styles.animationView}>
          <Animation
            loop={true}
            source={require('../../../assets/animation/payment/paysucces.json')}
            progress={this.state.progress}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)'
  },
  animationView: {
    height: 150,
    width: 150,
    position: 'absolute',
    top: Dimensions.get('window').height / 2 - 75,
    left: Dimensions.get('window').width / 2 - 75
  }
})
