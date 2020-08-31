import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, Animated, Image, Platform } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'

export default class Feed extends PureComponent {
  constructor(props) {
    super(props)
    const data = this.returnData()
    this.state = { currentIndex: 0, data }
    this.animatedValue = new Animated.Value(-1)
  }

  componentDidMount() {
    this._startAnimated()
  }

  returnData = () => {
    const currentIndex = Math.round(Math.random(0, 50) * 100)
    let newData = this.props.data
    let newStart = newData.splice(currentIndex, newData.length - currentIndex)
    return newStart.concat(newData)
  }

  _startAnimated = () => {
    Animated.sequence([
      Animated.timing(this.animatedValue, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        isInteraction: false
      }),
      Animated.timing(this.animatedValue, {
        toValue: 1,
        duration: 600,
        delay: 2000,
        useNativeDriver: true,
        isInteraction: false
      })
    ]).start(this._finishedAnimated)
  }

  _finishedAnimated = () => {
    Animated.timing(this.animatedValue, {
      toValue: -1,
      duration: 0,
      useNativeDriver: true,
      isInteraction: false
    }).start(() => {
      const { data } = this.state
      let currentIndex = 0
      if (this.state.currentIndex !== data.length - 1) {
        currentIndex = this.state.currentIndex + 1
      }
      this.setState({ currentIndex })
      this._startAnimated()
    })
  }

  returnStyle = () => {
    const { type } = this.state.data[this.state.currentIndex]
    let viewStyle, textStyle
    switch (type) {
      case 'feedback_summary':
        viewStyle = null
        textStyle = null
        break
      case 'new_month_subscription':
        viewStyle = { backgroundColor: '#F6ACBA' }
        textStyle = { color: '#fff' }
        break
      case 'renew_month_subscription':
        viewStyle = { backgroundColor: '#FFC978' }
        textStyle = { color: '#fff' }
        break
      case 'renew_quarter_subscription':
        viewStyle = { backgroundColor: '#FFA486' }
        textStyle = { color: '#fff' }
        break
    }
    return { viewStyle, textStyle }
  }

  render() {
    const item = this.state.data[this.state.currentIndex]
    const { icon_url, nickname, title } = item
    const { viewStyle, textStyle } = this.returnStyle()
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            Platform.OS === 'ios' ? styles.label : styles.androidLabel,
            viewStyle,
            {
              opacity: this.animatedValue.interpolate({
                inputRange: [-1, 0, 0.5, 1],
                outputRange: [0, 1, 0, 0]
              }),
              transform: [
                {
                  translateY: this.animatedValue.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [46, 0, -46]
                  })
                }
              ]
            }
          ]}>
          <Image style={styles.headImage} source={{ uri: icon_url }} />
          <Text
            numberOfLines={1}
            style={[styles.title, textStyle, { maxWidth: 48, paddingLeft: 6 }]}>
            {nickname}{' '}
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.title, textStyle, { paddingRight: 6 }]}>
            {title}
          </Text>
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    padding: 8,
    paddingTop: 16,
    overflow: 'hidden',
    flexWrap: 'wrap',
    flexDirection: 'row',
    left: 7
  },
  label: {
    height: 24,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#EBEAEA',
    backgroundColor: 'white',
    shadowColor: 'rgb(204,204,204)',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
  androidLabel: {
    height: 24,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    borderColor: '#EBEAEA',
    borderWidth: StyleSheet.hairlineWidth
  },
  headImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderColor: 'white',
    borderWidth: p2d(1)
  },
  title: {
    fontSize: 12,
    color: '#5E5E5E'
  }
})
