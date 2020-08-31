import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import HorizontalFeed from './horizontal_feed'
import VerticalFeed from './vertical_feed'

const HORIZONTAL_FILTER = [
  'favorite_stat',
  'perfect_stat',
  'favorite_action',
  'perfect_action'
]

export default class FeedContainer extends Component {
  constructor(props) {
    super(props)

    this.horizontalItems = []
    this.verticalItems = []

    this._getFeedItems()

    this.currentIndex = -1
    const horizontal1 = this._getHorizontalItem()
    const horizontal2 = this._getHorizontalItem()
    const horizontal3 = this._getHorizontalItem()
    this.state = { horizontal1, horizontal2, horizontal3 }
  }

  componentWillUnmount() {
    this.didUnmount = true
  }

  _getHorizontalItem = () => {
    if (this.currentIndex + 1 > this.horizontalItems.length - 1) {
      this.currentIndex = 0
      return this.horizontalItems[this.currentIndex]
    } else {
      this.currentIndex = this.currentIndex + 1
      return this.horizontalItems[this.currentIndex]
    }
  }

  _getFeedItems = () => {
    const { data } = this.props
    data.forEach(i => {
      const bool = HORIZONTAL_FILTER.find(item => item === i.type)
      if (bool) {
        this.verticalItems.push(i)
      } else {
        this.horizontalItems.push(i)
      }
    })
  }

  _onFinishedHorizontal = index => {
    if (this.didUnmount) return

    const obj = {}
    if (index === 1) {
      obj.horizontal1 = this._getHorizontalItem()
    } else if (index === 2) {
      obj.horizontal2 = this._getHorizontalItem()
    } else if (index === 3) {
      obj.horizontal3 = this._getHorizontalItem()
    }

    this.setState(obj)
  }

  render() {
    const { horizontal1, horizontal2, horizontal3 } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.vertical}>
          {this.verticalItems.length > 2 ? (
            <VerticalFeed data={this.verticalItems} />
          ) : null}
        </View>
        {this.horizontalItems.length > 2 ? (
          <View style={styles.horizontal}>
            <HorizontalFeed
              index={1}
              data={horizontal1}
              onFinished={this._onFinishedHorizontal}
            />
            <HorizontalFeed
              index={2}
              data={horizontal2}
              onFinished={this._onFinishedHorizontal}
            />
            <HorizontalFeed
              index={3}
              data={horizontal3}
              onFinished={this._onFinishedHorizontal}
            />
          </View>
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 160,
    justifyContent: 'flex-end',
    overflow: 'hidden'
  },
  vertical: { height: 60 },
  horizontal: { height: 90 }
})
