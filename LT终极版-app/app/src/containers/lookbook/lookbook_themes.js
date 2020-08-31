/* @flow */

import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform
} from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import Image from '../../../storybook/stories/image'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services.js'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import p2d from '../../../src/expand/tool/p2d'

export default class LookbookThemesContainer extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      isLoading: false,
      isMore: true,
      per_page: 10,
      page: 1
    }
  }
  UNSAFE_componentWillMount() {
    this._getLookbookData()
  }
  _goBack = () => {
    this.props.navigation.goBack()
  }
  _addLookbookTheme = themes => {
    this.setState({
      data: [...this.state.data, ...themes],
      isMore: !(themes.length < this.state.per_page),
      page: this.state.page + 1,
      isLoading: false
    })
  }
  _getLookbookData = () => {
    if (this.state.isLoading) {
      return
    }
    this.setState({ isLoading: true })
    const { page, per_page } = this.state
    QNetwork(
      SERVICE_TYPES.lookbook.QUERY_LOOKTHEMES,
      { page, per_page },
      response => {
        if (response.data.look_themes) {
          this._addLookbookTheme(response.data.look_themes)
        } else {
          this.setState({ isMore: false, isLoading: false })
        }
      },
      () => {
        this.setState({ isLoading: false })
      }
    )
  }
  getItemLayout = (_, index) => {
    const itemHeight = 24 + p2d(375)
    return { length: itemHeight, offset: itemHeight * index, index }
  }
  _renderItem = ({ item }) => {
    return <Theme openLookBookDetail={this._openLookBookDetail} item={item} />
  }
  _extractUniqueKey(item, index) {
    return index.toString()
  }
  _lookbookListEmptyComponent = () => {
    return (
      <View style={styles.emptyView}>
        <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
      </View>
    )
  }
  _openLookBookDetail = id => {
    this.props.navigation.navigate('LookBooks', { id })
  }
  _onEndReached = () => {
    const { data, isLoading, isMore } = this.state
    if (!isLoading && isMore && data.length) {
      this._getLookbookData()
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'主题穿搭'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <FlatList
          windowSize={5}
          initialNumToRender={3}
          onEndReachedThreshold={2}
          onEndReached={this._onEndReached}
          ListEmptyComponent={this._lookbookListEmptyComponent}
          keyExtractor={this._extractUniqueKey}
          data={this.state.data}
          renderItem={this._renderItem}
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
    )
  }
}

class Theme extends PureComponent {
  _openLookBookDetail = () => {
    const { openLookBookDetail, item } = this.props
    openLookBookDetail && openLookBookDetail(item.id)
  }
  render() {
    const { item } = this.props
    return (
      <TouchableOpacity
        style={styles.imageView}
        delayPressIn={100}
        onPress={this._openLookBookDetail}>
        <Image
          qWidth={1050}
          style={styles.image}
          source={{ uri: item.image_url || '' }}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imageView: {
    marginBottom: 24
  },
  image: {
    height: p2d(375),
    width: p2d(375)
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
