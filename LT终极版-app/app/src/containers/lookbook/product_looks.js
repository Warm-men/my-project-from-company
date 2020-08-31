import React, { Component } from 'react'
import { View, StyleSheet, FlatList, Platform } from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services.js'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import ProductsLookItem from '../../../storybook/stories/lookbook/products_look/products_look_item'
import Statistics from '../../expand/tool/statistics'

export default class ProductLooksContainer extends Component {
  constructor(props) {
    super(props)
    this.state = { data: [], title: null }
    this.count = 0
  }
  componentDidMount() {
    this._getLookbookData()
  }

  componentWillUnmount() {
    this.count &&
      Statistics.onEvent({
        id: 'products_look_alter',
        attributes: { count: this.count }
      })
  }

  _getLookbookData = () => {
    QNetwork(
      SERVICE_TYPES.lookbook.LOOK_SUB_THEME_BY_LOOK,
      { id: this.props.navigation.state.params.id },
      response => {
        const { looks, name } = response.data.look_sub_theme_by_look
        this.setState({ data: looks, title: name })
      }
    )
  }

  _renderItem = ({ item, index }) => {
    return (
      <ProductsLookItem
        onPressAllowButton={this._onPressAllowButton}
        navigation={this.props.navigation}
        data={item}
        index={index}
      />
    )
  }
  _onPressAllowButton = () => {
    this.count++
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
  _goBack = () => {
    this.props.navigation.goBack()
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          hasBottomLine={false}
          title={this.state.title}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <FlatList
          initialNumToRender={3}
          ListEmptyComponent={this._lookbookListEmptyComponent}
          keyExtractor={this._extractUniqueKey}
          data={this.state.data}
          renderItem={this._renderItem}
          removeClippedSubviews={true}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
