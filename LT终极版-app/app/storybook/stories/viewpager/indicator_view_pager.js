import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, ViewPropTypes } from 'react-native'
import ViewPager from './viewpager'
import isEqual from 'lodash.isequal'

let VIEWPAGER_REF = 'viewPager'
let INDICATOR_REF = 'indicator'
export default class IndicatorViewPager extends Component {
  static propTypes = {
    ...ViewPager.propTypes,
    indicator: PropTypes.node,
    pagerStyle: ViewPropTypes.style,
    horizontalScroll: PropTypes.bool
  }

  static defaultProps = {
    indicator: null,
    initialPage: 1,
    horizontalScroll: true,
    isLooped: true
  }

  constructor(props) {
    super(props)
    this._currentIndex = 0
    //在头部加入最后一个page 在尾部加入第一个page
    this.pages = []
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <ViewPager
          {...this.props}
          horizontalScroll={this.props.horizontalScroll}
          ref={ref => (VIEWPAGER_REF = ref)}
          style={[styles.pager, this.props.pagerStyle]}
          onPageScroll={this._onPageScroll}
          onPageSelected={this._onPageSelected}>
          {this.props.isLooped ? this.pages : this.props.children}
        </ViewPager>
        {this._renderIndicator()}
      </View>
    )
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.isLooped) {
      if (!isEqual(this.props.children, nextProps.children)) {
        this.pages = []
        if (nextProps.children && nextProps.children.length > 0) {
          this.pages.push(nextProps.children[nextProps.children.length - 1])
          this.pages.push(...nextProps.children)
          this.pages.push(nextProps.children[0])
        }
      }
    }
  }

  _onPageScroll = params => {
    let indicator = INDICATOR_REF
    indicator && indicator.onPageScroll && indicator.onPageScroll(params)
    this.props.onPageScroll && this.props.onPageScroll(params)
  }

  _onPageSelected = params => {
    if (this.props.isLooped) {
      if (params.position === 0) {
        this.setPageWithoutAnimation(this.pages.length - 2)
        this._currentIndex = this.pages.length - 3
      } else if (params.position === this.pages.length - 1) {
        this.setPageWithoutAnimation(1)
        this._currentIndex = 0
      } else {
        this._currentIndex = params.position - 1
      }
    } else {
      this._currentIndex = params.position
    }
    let indicator = INDICATOR_REF
    indicator &&
      indicator.onPageSelected &&
      indicator.onPageSelected(this._currentIndex)
    this.props.onPageSelected && this.props.onPageSelected(this._currentIndex)
  }

  _renderIndicator() {
    let { indicator } = this.props
    if (!indicator) return null
    return React.cloneElement(indicator, {
      ref: ref => (INDICATOR_REF = ref),
      pager: this,
      initialPage: 0
    })
  }

  setPage(selectedPage) {
    VIEWPAGER_REF && VIEWPAGER_REF.setPage(selectedPage)
  }

  setPageWithoutAnimation(selectedPage) {
    VIEWPAGER_REF && VIEWPAGER_REF.setPageWithoutAnimation(selectedPage)
  }
}

const styles = StyleSheet.create({
  container: {},
  pager: { flex: 1 }
})
