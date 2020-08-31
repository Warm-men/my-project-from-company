import { ViewPagerAndroid } from 'react-native'
import React, { Component } from 'react'

let VIEWPAGER_REF = 'viewPager'
export default class ViewPager extends Component {
  static propTypes = { ...ViewPagerAndroid.propTypes }

  static defaultProps = {
    initialPage: 1,
    keyboardDismissMode: 'on-drag',
    onPageScroll: null,
    onPageSelected: null,
    onPageScrollStateChanged: null,
    pageMargin: 0,
    horizontalScroll: true
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ViewPagerAndroid
        {...this.props}
        initialPage={this.props.isLooped ? 1 : 0}
        ref={ref => (VIEWPAGER_REF = ref)}
        key={this.props.children ? this.props.children.length : 0}
        onPageScroll={this._onPageScrollOnAndroid}
        onPageSelected={this._onPageSelectedOnAndroid}
      />
    )
  }

  _onPageScrollOnAndroid = e => {
    if (this.props.onPageScroll) this.props.onPageScroll(e.nativeEvent)
  }

  _onPageSelectedOnAndroid = e => {
    if (this.props.onPageSelected) this.props.onPageSelected(e.nativeEvent)
  }

  setPageWithoutAnimation = selectedPage => {
    VIEWPAGER_REF && VIEWPAGER_REF.setPageWithoutAnimation(selectedPage)
  }

  setPage = selectedPage => {
    VIEWPAGER_REF && VIEWPAGER_REF.setPage(selectedPage)
  }
}
