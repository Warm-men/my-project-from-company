import React, { PureComponent } from 'react'
import { View, StyleSheet, ScrollView, Text, Dimensions } from 'react-native'
const width = Dimensions.get('window').width
const whiteSpaceWidth = (width - 80 - 40 - 16) / 2 - 1
export default class SizeSelector extends PureComponent {
  constructor(props) {
    super(props)
    const { currentSize } = props
    this.state = {
      currentSize
    }
    this.defaultSize = currentSize
  }

  componentDidMount() {
    setTimeout(() => {
      this._setScrollToIndex()
    }, 1)
  }

  _setScrollToIndex = () => {
    //设置FlatList指定位置
    const { range } = this.props
    let countInitialScrollIndex = this.defaultSize - range[0]
    let scrollOffsetX = countInitialScrollIndex * 5
    this._scrollView.scrollTo({
      x: scrollOffsetX,
      animated: true
    })
  }

  _getSizeArray = () => {
    const { range } = this.props
    let sizeArray = []
    sizeArray = range && [-1, ...range, -1]
    return sizeArray
  }

  _extractUniqueKey = (item, index) => {
    return index.toString()
  }

  _renderItem = () => {
    const data = this._getSizeArray()
    let viewArray = []
    data.map((item, index) => {
      let key = index.toString()
      let cellType = ''
      if (item === -1) {
        cellType = 'whiteSpace'
      } else if (item % 10 === 0) {
        cellType = 'number_10'
      } else if (item % 2 === 0) {
        cellType = 'number_2'
      }
      switch (cellType) {
        case 'whiteSpace':
          {
            const { range } = this.props
            let isRegularScale = true
            if (!index) {
              const minRange = range[0]
              isRegularScale = minRange % 2
            } else {
              const maxRange = range[range.length - 1]
              isRegularScale = maxRange % 2
            }
            viewArray.push(
              <View
                style={[
                  styles.whiteSpaceItem,
                  !isRegularScale && { width: whiteSpaceWidth - 5 }
                ]}
                key={key}
              />
            )
          }
          break
        case 'number_10':
          viewArray.push(
            <View
              style={[styles.flatListItem, { overflow: 'visible' }]}
              key={key}>
              <View style={styles.itemNumView10} />
              <Text style={styles.itemNum}>{item}</Text>
            </View>
          )
          break
        case 'number_2':
          viewArray.push(
            <View style={styles.flatListItem} key={key}>
              <View style={styles.itemNumView2} />
            </View>
          )
          break
        default:
          viewArray.push(<View key={key} />)
          break
      }
    })
    return viewArray
  }
  _getItemLayout = (_, index) => {
    return { length: 10, offset: 10 * index, index }
  }

  _onScroll = event => {
    const { range } = this.props
    let currentSize =
      Math.round(event.nativeEvent.contentOffset.x / 5) + range[0]
    const maxRange = range[range.length - 1]
    const minRange = range[0]
    currentSize =
      currentSize >= maxRange
        ? maxRange
        : currentSize <= minRange
        ? minRange
        : currentSize //若超出取值范围，取最大/小

    this.setState({ currentSize })
  }
  postCurrentSize = () => {
    this.props.onChange(this.state.currentSize)
  }

  render() {
    const ScrollViewContent = this._renderItem()
    return (
      <View style={styles.container}>
        <View style={styles.sizeNumberView}>
          <Text style={styles.sizeNumberText}>{this.state.currentSize}</Text>
          <Text style={styles.sizeNumberUnit}>{'cm'}</Text>
        </View>
        <View style={styles.sizeView}>
          <ScrollView
            style={styles.flatList}
            ref={scrollView => {
              this._scrollView = scrollView
            }}
            scrollEnabled={!this.props.isUpdating}
            scrollEventThrottle={6}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            onScroll={this._onScroll}
            onMomentumScrollEnd={this.postCurrentSize}
            onTouchEnd={this.postCurrentSize}>
            {ScrollViewContent}
          </ScrollView>
        </View>
        <View style={styles.markView} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 8,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40
  },
  sizeView: {
    marginHorizontal: 40,
    height: 44,
    borderRadius: 25
  },
  markView: {
    width: 2,
    height: 32,
    backgroundColor: '#F3BF78',
    borderRadius: 5,
    opacity: 0.7,
    marginTop: -44
  },
  flatList: {
    marginHorizontal: 20,
    height: 44
  },
  whiteSpaceItem: {
    width: whiteSpaceWidth,
    height: 36,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  flatListItem: {
    height: 36,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 10
  },
  itemNum: {
    width: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#999',
    marginBottom: 2
  },
  itemNumView10: {
    width: 1,
    height: 18,
    backgroundColor: '#999'
  },
  itemNumView2: {
    width: 1,
    height: 10,
    backgroundColor: '#999'
  },
  sizeNumberView: {
    flexDirection: 'row',
    marginBottom: 18,
    alignItems: 'flex-end'
  },
  sizeNumberText: {
    fontSize: 24,
    color: '#F3BF78'
  },
  sizeNumberUnit: {
    fontSize: 12,
    color: '#666',
    marginLeft: 3,
    marginBottom: 4
  }
})
