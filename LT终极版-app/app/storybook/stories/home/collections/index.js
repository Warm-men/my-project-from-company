/* @flow */

import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import CollectionItem from './collection_item'
import { TitleView } from '../titleView'
import { Column } from '../../../../src/expand/tool/add_to_closet_status'
import MoreView from '../moreView'

export default class Collections extends Component {
  _didSelectedProductItem = item => {
    const { navigation, type } = this.props

    let column
    if (type === 'hot') {
      column = Column.RecentHotCollection
    } else if (type === 'newest') {
      column = Column.NewArrivalCollection
    } else if (type === 'collection') {
      column = Column.Collection
    }

    navigation.navigate('Details', { item: item, column })
  }
  _didSelectedCollection = collection => {
    const { navigation, type, navigateName } = this.props
    if (collection && collection.collection_type === 'link') {
      navigation.navigate('WebPage', {
        uri: collection.link,
        shareThumbImage: collection.banner_photo_url,
        title: collection.title,
        actions: collection.website_render_actions
      })
    } else {
      navigation.navigate(navigateName, {
        collection: collection,
        type: type
      })
    }
  }

  _getReportData = (index, type, collection) => {
    const { navigation } = this.props
    switch (type) {
      case 'hot':
        {
          const variables = { filters: { sort: 'swappable_first_and_newest' } }
          return {
            variables,
            index,
            column: Column.RecentHotCollection,
            router: navigation.state.routeName
          }
        }
        break
      case 'newest':
        {
          return {
            index,
            variables: collection.filters,
            column: Column.NewArrivalCollection,
            router: navigation.state.routeName
          }
        }
        break
      default:
        break
    }
  }
  _showMoreColletion = () => {
    const { showMoreColletion } = this.props
    showMoreColletion && showMoreColletion()
  }
  render() {
    const {
      collections,
      title,
      showCollectionItem,
      style,
      type,
      maxCount,
      subTitle
    } = this.props
    return (
      <View style={styles.container}>
        <TitleView title={title} subTitle={subTitle} />
        {collections.map((item, index) => {
          return (
            <CollectionItem
              type={type}
              collection={item}
              getReportData={this._getReportData}
              key={index}
              newestId={index}
              style={styles.collectionItem}
              bannerStyle={style}
              showCollectionItem={showCollectionItem}
              didSelectedProductItem={this._didSelectedProductItem}
              didSelectedCollection={this._didSelectedCollection}
            />
          )
        })}
        {type === 'collection' && collections.length >= maxCount && (
          <TouchableOpacity
            delayPressIn={100}
            activeOpacity={0.6}
            style={styles.moreView}
            onPress={this._showMoreColletion}>
            <MoreView />
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  collectionItem: {
    marginBottom: 24,
    flex: 1
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: '#000',
    fontSize: 16,
    fontWeight: '100',
    marginHorizontal: 10,
    letterSpacing: 1
  },
  line: {
    height: 1,
    width: 27,
    backgroundColor: '#eee'
  },
  moreView: {
    alignItems: 'center'
  }
})
