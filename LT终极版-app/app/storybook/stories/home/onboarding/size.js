/* @flow */

import React, { Component } from 'react'
import { StyleSheet, Dimensions, ScrollView } from 'react-native'

const WIDTH = Dimensions.get('window').width
import BasicSize from './basic_size'
import DetailedSize from './detailed_size'

export default class Size extends Component {
  // 通过 state 更新
  constructor(props) {
    super(props)
    this.state = {
      heightInches: null,
      weight: null,
      bust: null
    }
    this.isTouch = false
  }

  _next = () => {
    const { changeStepSizeIndex, stepSizeIndex } = this.props
    if (this.isTouch) {
      return
    }
    _sizeList.scrollTo({ x: WIDTH, animated: true })
    let newNum = stepSizeIndex + 1
    changeStepSizeIndex(newNum)
    setTimeout(() => {
      this.isTouch = false
    }, 1000)
  }

  _onPress = value => {
    let state = {}
    let values = value.data
    state[value.dataType] = values
    this.setState(state)
  }

  render() {
    const {
      data,
      questionKeys,
      appStore,
      currentCustomerStore,
      next,
      modalStore
    } = this.props
    const { heightInches, weight } = this.state
    return (
      <ScrollView
        ref={sizeList => (_sizeList = sizeList)}
        horizontal={true}
        pagingEnabled={true}
        scrollEnabled={false}
        alwaysBounceVertical={false}
        style={styles.container}>
        <BasicSize
          data={data}
          questionKeys={questionKeys}
          appStore={appStore}
          next={this._next}
          onPress={this._onPress}
          currentCustomerStore={currentCustomerStore}
        />
        <DetailedSize
          data={data}
          questionKeys={questionKeys}
          appStore={appStore}
          next={next}
          heightInches={heightInches}
          weight={weight}
          currentCustomerStore={currentCustomerStore}
          modalStore={modalStore}
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WIDTH
  }
})
