import React, { PureComponent } from 'react'
import { View, StyleSheet, SectionList, Platform, Text } from 'react-native'
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
import { EmptyProduct } from './products'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import p2d from '../../src/expand/tool/p2d'
const BAR_ITEM_HEIGHT = p2d(20)
const SECTION_HEIDER_HEIGHT = 60
const ITEM_HEIGHT = 50
class SectionIndexList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      letters: [],
      currentSelectLetter: null
    }

    this.getItemLayout = sectionListGetItemLayout({
      // The height of the row with rowData at the given sectionIndex and rowIndex
      getItemHeight: (rowData, sectionIndex) => {
        const { data } = rowData
        return ITEM_HEIGHT * data.length
      },
      getSeparatorHeight: () => 0, // The height of your separators
      getSectionHeaderHeight: () => SECTION_HEIDER_HEIGHT, // The height of your section headers
      getSectionFooterHeight: () => 0, // The height of your section footers
      listHeaderHeight: 0 // The height of your list header
    })
  }

  groupBy = (data, keyGetter) => {
    const map = {}
    let letters = []
    data.forEach(item => {
      const key = keyGetter(item).toUpperCase()
      const collection = map[key]
      if (!collection) {
        letters.push(key)
        map[key] = [item]
      } else {
        collection.push(item)
      }
    })
    let dataState = []
    for (let key in map) {
      const item = { key: key, data: [{ data: map[key], key: key }] }
      dataState.push(item)
    }
    this.setState({
      letters: letters,
      data: dataState
    })
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { sections } = nextProps
    this.groupBy(sections, pet => pet.slug.charAt(0))
  }

  onTouchMove = e => {
    const { length } = this.state.letters
    this.index = Math.floor(e.nativeEvent.locationY / BAR_ITEM_HEIGHT)
    if (this.index > length - 1) {
      this.index = length - 1
    }
    if (this.index < 0) {
      this.index = 0
    }
    this.sectionList.scrollToLocation({
      animated: true,
      itemIndex: 0,
      sectionIndex: this.index,
      viewOffset: SECTION_HEIDER_HEIGHT
    })
    const letter = this.state.letters[this.index]
    this.setState({
      currentSelectLetter: letter
    })
  }
  onTouchEnd = () => {
    this.setState({
      currentSelectLetter: null
    })
  }
  renderHeader = item => {
    const { textHeaderStyle } = this.props
    return (
      <Text style={textHeaderStyle || styles.textHeader}>
        {item.section.key}
      </Text>
    )
  }
  _listEmptyComponent = () => {
    return this.props.isLoading ? (
      <View style={styles.emptyView}>
        <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
      </View>
    ) : (
      <EmptyProduct />
    )
  }
  extractUniqueKey(item) {
    return item.key
  }
  render() {
    //fix android carsh
    if (!this.state.data.length) {
      return null
    }
    return (
      <View style={styles.container}>
        {this.state.currentSelectLetter ? (
          <View style={styles.viewContainer}>
            <Text style={styles.letterCenter}>
              {this.state.currentSelectLetter}
            </Text>
          </View>
        ) : null}
        <SectionList
          {...this.props}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ref={ref => (this.sectionList = ref)}
          getItemLayout={this.getItemLayout}
          renderSectionHeader={this.renderHeader}
          sections={this.state.data}
          keyExtractor={this.extractUniqueKey}
          ListEmptyComponent={this._listEmptyComponent}
          stickySectionHeadersEnabled={true}
          {...Platform.select({
            ios: {
              removeClippedSubviews: false
            },
            android: {
              removeClippedSubviews: true
            }
          })}
        />
        <View style={styles.lettersListContainer}>
          <View>
            {this.state.letters.map((item, index) => {
              return (
                <Text key={index} style={styles.textBar}>
                  {item}
                </Text>
              )
            })}
            <View
              style={styles.touchLayer}
              onTouchStart={this.onTouchMove}
              onTouchMove={this.onTouchMove}
              onTouchEnd={this.onTouchEnd}
            />
          </View>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  lettersListContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewContainer: {
    zIndex: 1,
    position: 'absolute',
    borderRadius: 5,
    height: 55,
    width: 55,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textHeader: {
    paddingLeft: 15,
    lineHeight: SECTION_HEIDER_HEIGHT,
    backgroundColor: 'white',
    fontSize: 28,
    color: '#333333',
    fontWeight: '600'
  },
  touchLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1
  },
  textBar: {
    fontSize: 15,
    lineHeight: BAR_ITEM_HEIGHT,
    color: '#333333',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  letterCenter: {
    color: 'white',
    fontSize: 28
  },
  emptyView: {
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default SectionIndexList
