/* @flow */

import React, { PureComponent } from 'react'
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  Image
} from 'react-native'
import PropTypes from 'prop-types'
import ImagesStickers from './images_stickers/index.js'
import CImage from '../image'
import _ from 'lodash'
const SCREEN_WIDTH = Dimensions.get('window').width
import { Column } from '../../../../src/expand/tool/add_to_closet_status'
export default class Photos extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { currentIndex: 0 }

    this.showed = false
  }

  _extractUniqueKey(_, index) {
    return index.toString()
  }

  _renderItem = ({ item, index }) => {
    const { photos, column, navigation, isViewable } = this.props
    if (isViewable) {
      this.showed = true
    }
    const hideStickers = this.showed
      ? false
      : column === Column.CustomerPhotoDetails && !isViewable
    return (
      <View style={{ position: 'relative' }}>
        <CImage
          style={styles.photo}
          image={item}
          index={index}
          images={photos}
        />
        {this.state.currentIndex === index && item.stickers && !hideStickers ? (
          <ImagesStickers
            column={column}
            navigation={navigation}
            stickers={item.stickers}
            photo={item}
            offsetWidth={SCREEN_WIDTH - 30}
            offsetHeight={((SCREEN_WIDTH - 30) * 4) / 3}
          />
        ) : null}
      </View>
    )
  }
  _onViewableItemsChanged = ({ viewableItems }) => {
    const data = _.maxBy(viewableItems, item => item.index)
    if (data) {
      this.setState({ currentIndex: data.index })
    }
  }

  getItemLayout = (_, index) => {
    return {
      length: SCREEN_WIDTH - 30,
      offset: (SCREEN_WIDTH - 30) * index,
      index
    }
  }

  render() {
    const { photos, hasLabel, initialIndex, isViewable } = this.props
    return (
      <View style={styles.container}>
        <FlatList
          bounces={photos.length === 1 ? false : true}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          initialNumToRender={1}
          keyExtractor={this._extractUniqueKey}
          extraData={this.state.currentIndex || isViewable}
          data={photos}
          renderItem={this._renderItem}
          onViewableItemsChanged={this._onViewableItemsChanged}
          getItemLayout={this.getItemLayout}
          initialScrollIndex={initialIndex}
        />
        {hasLabel && (
          <Image
            style={styles.image}
            source={require('../../../../assets/images/customer_photos/choice_customer_photo.png')}
          />
        )}
        <View style={styles.pagingIndicator}>
          <Text style={styles.pagingText}>
            {this.state.currentIndex + 1}/{photos.length}
          </Text>
        </View>
      </View>
    )
  }
}

Photos.defaultProps = {
  photos: [{ mobile_url: '' }]
}

Photos.propTypes = {
  photos: PropTypes.array,
  hasLabel: PropTypes.bool,
  initialIndex: PropTypes.number
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH - 30,
    marginHorizontal: 15,
    marginTop: 8,
    borderRadius: 4,
    overflow: 'hidden'
  },
  photo: {
    width: SCREEN_WIDTH - 30,
    height: ((SCREEN_WIDTH - 30) / 3) * 4,
    backgroundColor: '#f3f3f3'
  },
  pagingIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 35,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pagingText: { fontSize: 12, color: '#fff' },
  image: { position: 'absolute', right: 16, top: -2 }
})
