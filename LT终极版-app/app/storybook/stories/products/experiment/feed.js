/* @flow */

import React, { PureComponent, Component } from 'react'
import { View, Text, StyleSheet, Animated, Image, Platform } from 'react-native'
import { inject, observer } from 'mobx-react'
import p2d from '../../../../src/expand/tool/p2d'

@inject('daqStore')
@observer
export default class FeedContainer extends Component {
  render() {
    const { data, id, index, daqStore } = this.props
    if (data && data.items && data.items.length) {
      const isViewable = !!daqStore.viewableArray.find(i => i.id === id)
      if (!isViewable) return null
      const array = index % 2 === 0 ? data.items : data.items.reverse()

      return <Feed data={array} />
    } else {
      return null
    }
  }
}

class Feed extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { currentIndex: 0 }
    this.animatedValue = new Animated.Value(-1)
  }

  componentDidMount() {
    this._startAnimated()
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
      const { data } = this.props
      let currentIndex = 0
      if (this.state.currentIndex !== data.length - 1) {
        currentIndex = this.state.currentIndex + 1
      }
      this.setState({ currentIndex })
      this._startAnimated()
    })
  }

  render() {
    const item = this.props.data[this.state.currentIndex]
    const { title, icon_url } = item
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            Platform.OS === 'ios' ? styles.label : styles.androidLabel,
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
          <Text numberOfLines={1} style={styles.title}>
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
    width: '100%',
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
    color: '#5E5E5E',
    paddingHorizontal: 6,
    maxWidth: '90%'
  }
})
