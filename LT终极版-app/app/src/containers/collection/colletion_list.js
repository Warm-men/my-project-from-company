/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, FlatList, Platform } from 'react-native'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import CollectionItem from '../../../storybook/stories/home/collections/collection_item'
import p2d from '../../expand/tool/p2d'
import { Column } from '../../expand/tool/add_to_closet_status'
export default class ColletionList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      per_page: 10,
      data: [],
      refreshing: false,
      isMore: true,
      isLoading: false
    }
  }

  componentDidMount() {
    this._getCollectionsData()
  }

  _getCollectionsData = () => {
    if (this.state.isLoading) {
      return
    }
    this.setState({ isLoading: true })
    QNetwork(
      SERVICE_TYPES.collections.QUERY_COLLCTIONS,
      { page: this.state.page, per_page: this.state.per_page, filter: 'all' },
      response => {
        const { browse_collections } = response.data
        const obj = {
          page: this.state.page + 1,
          isMore: browse_collections.length === this.state.per_page,
          refreshing: false,
          isLoading: false
        }
        if (this.state.refreshing) {
          obj.data = [...browse_collections]
        } else {
          obj.data = [...this.state.data, ...browse_collections]
        }
        this.setState(obj)
      },
      () => {
        this.setState({
          isLoading: false,
          refreshing: false
        })
      }
    )
  }

  _didSelectedProductItem = item => {
    const { navigation } = this.props
    let column = Column.Collection
    navigation.navigate('Details', { item, column })
  }

  _didSelectedCollection = collection => {
    const { navigation } = this.props
    if (collection && collection.collection_type === 'link') {
      navigation.navigate('WebPage', {
        uri: collection.link,
        shareThumbImage: collection.banner_photo_url,
        actions: collection.website_render_actions,
        title: collection.title
      })
    } else {
      navigation.navigate('Collection', { collection, type: 'collection' })
    }
  }

  _renderItem = ({ item }) => {
    return (
      <CollectionItem
        type={'collection'}
        collection={item}
        style={styles.collectionItem}
        bannerStyle={styles.homeCollections}
        showCollectionItem={false}
        didSelectedCollection={this._didSelectedCollection}
      />
    )
  }
  _listEmptyComponent = () => {
    return (
      !this.state.refreshing &&
      this.state.isMore && (
        <View style={styles.emptyView}>
          <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
        </View>
      )
    )
  }
  _onRefresh = () => {
    if (!this.state.refreshing) {
      this.setState({ page: 1, isMore: true, refreshing: true }, () => {
        this._getCollectionsData()
      })
    }
  }
  _goBack = () => {
    this.props.navigation.goBack()
  }
  getItemLayout = (_, index) => {
    return {
      length: p2d(399),
      offset: p2d(399) * index,
      index
    }
  }

  _extractUniqueKey(item) {
    return item.id.toString()
  }
  _onEndReached = () => {
    const { isLoading, isMore, data } = this.state
    if (!isLoading && isMore && data.length) {
      this._getCollectionsData()
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'时尚专题'}
          style={styles.navigationBar}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <FlatList
          initialNumToRender={4}
          onEndReachedThreshold={2}
          keyExtractor={this._extractUniqueKey}
          onEndReached={this._onEndReached}
          data={this.state.data}
          windowSize={5}
          extraData={this.state.isMore}
          renderItem={this._renderItem}
          getItemLayout={this.getItemLayout}
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
          {...Platform.select({
            ios: {
              removeClippedSubviews: false
            },
            android: {
              removeClippedSubviews: true
            }
          })}
          ListEmptyComponent={this._listEmptyComponent}
          showsHorizontalScrollIndicator={false}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navigationBar: {
    borderBottomWidth: 0
  },
  collectionItem: {
    marginBottom: p2d(24),
    flex: 1
  },
  homeCollections: {
    width: p2d(375),
    height: p2d(375)
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
