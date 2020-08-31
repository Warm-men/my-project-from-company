import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Keyboard
} from 'react-native'
import {
  BarButtonItem,
  SafeAreaView
} from '../../../../storybook/stories/navigationbar'
import { QNetwork, SERVICE_TYPES } from '../../../expand/services/services'
import p2d from '../../../expand/tool/p2d'
import Icon from 'react-native-vector-icons/EvilIcons'
import Icons from 'react-native-vector-icons/Ionicons'
import { AllLoadedFooter } from '../../../../storybook/stories/products'
import _ from 'lodash'
import SearchProductItem from '../../../../storybook/stories/customer_photos/search/search_product'

export default class SearchProductContainer extends Component {
  constructor(props) {
    super(props)
    const { selectedProducts } = props.navigation.state.params
    this.state = {
      content: '',
      products: [],
      isMore: true,
      isLoading: false,
      selectedProducts: selectedProducts ? selectedProducts : []
    }
    this.page = 1
    this.per_page = 20
    this.idCounter = null

    this.searchProductWithKey = _.debounce(this._searchProduct, 500)
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  componentDidMount() {
    this.searchProductWithKey()
  }

  clearText = () => {
    if (this.state.content) {
      this.setState({ content: '', products: [], isMore: true }, () => {
        this.searchProductWithKey()
      })
    }
  }

  _searchProduct = isRefresh => {
    if (isRefresh) {
      this.page = 1
    }
    const input = {
      page: this.page,
      per_page: this.per_page,
      keyword: this.state.content
    }
    this.idCounter = QNetwork(
      SERVICE_TYPES.customerPhotos.QUERY_SEARCHING_PRODUCTS,
      input,
      response => {
        if (response.idCounter && this.idCounter !== response.idCounter) {
          return
        }
        this.page++
        const { searching_products } = response.data
        let isMore = searching_products.length === this.per_page
        const products = isRefresh
          ? searching_products
          : [...this.state.products, ...searching_products]
        this.setState({ products, isMore, isLoading: false })
      },
      () => {
        this.setState({ isLoading: false })
      }
    )
  }

  _onChangeText = content => {
    this.setState(
      { content, isLoading: true, products: [], isMore: true },
      () => {
        this.searchProductWithKey(true)
      }
    )
  }

  _listHeader = () => {
    return (
      <View style={styles.searchView}>
        <BarButtonItem onPress={this._goBack} buttonType={'back'} />
        <View style={styles.textInputView}>
          <Icon name={'search'} size={27} color={'#999'} />
          <TextInput
            style={styles.textInput}
            autoCorrect={false}
            autoFocus={true}
            enablesReturnKeyAutomatically={true}
            value={this.state.content}
            textAlignVertical={'center'}
            underlineColorAndroid={'transparent'}
            onChangeText={content => this._onChangeText(content)}
            placeholder={'输入商品款号或名称'}
            placeholderTextColor={'#ccc'}
          />
          <TouchableOpacity hitSlop={styles.hitSlop} onPress={this.clearText}>
            <Icons name={'ios-close-circle'} size={24} color={'#ccc'} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _keyExtractor = item => {
    return item.id.toString()
  }

  _didSelectedItem = item => {
    const selectedProducts = [...this.state.selectedProducts, item]
    this.setState({ selectedProducts }, () => {
      const { onSelectedProductsChanged } = this.props.navigation.state.params
      onSelectedProductsChanged && onSelectedProductsChanged(item)
    })
  }

  renderItem = ({ item }) => {
    return (
      <SearchProductItem
        item={item}
        products={this.state.selectedProducts}
        selectProduct={this._didSelectedItem}
      />
    )
  }

  _onEndReached = () => {
    this.setState({ isLoading: true }, () => {
      this.state.isMore && this.searchProductWithKey()
    })
  }

  _listFooter = () => {
    const { isMore } = this.state
    return <AllLoadedFooter isMore={isMore} />
  }

  _onScrollBeginDrag = () => {
    Keyboard.dismiss()
  }

  render() {
    const { products, selectedProducts } = this.state
    return (
      <SafeAreaView style={styles.safeAreaView}>
        {this._listHeader()}
        <FlatList
          onScrollBeginDrag={this._onScrollBeginDrag}
          showsVerticalScrollIndicator={false}
          data={products}
          extraData={selectedProducts}
          keyExtractor={this._keyExtractor}
          renderItem={this.renderItem}
          ListFooterComponent={this._listFooter}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.1}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: { flex: 1 },
  searchView: { flexDirection: 'row', alignItems: 'center' },
  textInputView: {
    flexDirection: 'row',
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: '#F7F7F7',
    width: p2d(310),
    height: p2d(32),
    borderRadius: 16,
    alignItems: 'center'
  },
  textInput: {
    marginHorizontal: 10,
    backgroundColor: '#F7F7F7',
    flex: 1,
    padding: 0,
    fontSize: 14,
    padding: 0,
    color: '#5e5e5e',
    height: p2d(32)
  },
  hitSlop: { top: 20, bottom: 20, left: 8, right: 20 }
})
