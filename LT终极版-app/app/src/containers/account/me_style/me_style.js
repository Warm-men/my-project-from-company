import React, { Component } from 'react'
import { StyleSheet, BackHandler, Platform, FlatList } from 'react-native'
import MeStyleLoading from './me_style_loading'
import { inject, observer } from 'mobx-react'
import ProgressBar from '../../../../storybook/stories/account/me_style/progress_bar'
import PageItem from '../../../../storybook/stories/account/me_style/page_item'
import p2d from '../../../expand/tool/p2d'
import {
  NavigationBar,
  SafeAreaView
} from '../../../../storybook/stories/navigationbar'

const data = [
  { id: 1, step: 0, type: 'BASIC_INFO' },
  { id: 2, step: 0, type: 'BASIC_SIZE' },
  { id: 3, step: 1, type: 'SHAPE_WAIST' },
  { id: 4, step: 1, type: 'SHAPE_BELLY' },
  { id: 5, step: 1, type: 'SHAPE_SHOULDER' },
  { id: 6, step: 1, type: 'SHAPE' },
  { id: 7, step: 2, type: 'SizeBasic' },
  { id: 8, step: 2, type: 'SizeSkirt' },
  { id: 9, step: 2, type: 'SizeJean' },
  { id: 10, step: 2, type: 'SizeJeanSize' },
  { id: 11, step: 3, type: 'Preferences' }
]
@inject('currentCustomerStore')
@observer
export default class MeStyleContainer extends Component {
  // 通过 state 更新
  constructor(props) {
    super(props)
    this.state = {
      step: 0,
      complete: false
    }
    this.currentIndex = 0
    const { style } = props.currentCustomerStore
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
    }
  }

  handleBackPress = () => {
    return true
  }

  _gobackToTotes = () => {
    this.props.navigation.replace('ShoppingCar', { goTotes: true })
  }

  getItemLayout = (_, index) => {
    return {
      length: p2d(375),
      offset: p2d(375) * index,
      index
    }
  }

  _renderItem = ({ item, index }) => {
    return (
      <PageItem
        showLeft={index !== 0 && index !== data.length - 1}
        showRight={index !== data.length - 1}
        item={item}
        index={index}
        previous={this._previous}
        next={this._next}
        navigation={this.props.navigation}
      />
    )
  }
  _previous = () => {
    this.currentIndex--
    this._scrollToPage()
  }
  _next = param => {
    if (param === 'COMPLETE') {
      this.setState({ complete: true })
      return
    }
    this.currentIndex++
    this._scrollToPage(param)
  }
  _scrollToPage = param => {
    if (param === 'CREAT_FIRST_TOTE') {
      this.currentIndex = data.length - 1
    }
    this._flatList.scrollToIndex({
      viewPosition: 0,
      index: this.currentIndex,
      animated: false
    })
    this.setState({ step: data[this.currentIndex].step })
  }
  _extractUniqueKey = (item, index) => {
    return item.id.toString()
  }
  render() {
    return !this.state.complete ? (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar
          style={styles.navigationBar}
          title={'个人风格档案'}
          hasBottomLine={false}
        />
        <ProgressBar step={this.state.step} />
        <FlatList
          ref={flatList => (this._flatList = flatList)}
          horizontal={true}
          initialNumToRender={0}
          keyExtractor={this._extractUniqueKey}
          data={data}
          renderItem={this._renderItem}
          windowSize={1}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          getItemLayout={this.getItemLayout}
          {...Platform.select({
            ios: {
              removeClippedSubviews: false
            },
            android: {
              removeClippedSubviews: true
            }
          })}
        />
      </SafeAreaView>
    ) : (
      <MeStyleLoading goback={this._gobackToTotes} />
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  navigationBar: {
    borderBottomWidth: 0
  }
})
