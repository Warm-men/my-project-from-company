import React, { Component } from 'react'
import { View, StyleSheet, FlatList, Text, Platform } from 'react-native'
import { AllLoadedFooter } from '../../../../storybook/stories/products'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../../storybook/stories/navigationbar'
import { ToteProductItem } from '../../../../storybook/stories/customer_photos/customer_photos_in_tote'
import { QNetwork, SERVICE_TYPES } from '../../../expand/services/services'
import { inject, observer } from 'mobx-react'
import { sortToteProducts } from '../../../expand/tool/totes'
import { Column } from '../../../expand/tool/add_to_closet_status'
import Image from '../../../../storybook/stories/image'

@inject('UIScreen', 'modalStore', 'appStore')
@observer
export default class MyCustomerPhotosContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      latestCustomerPhotos: [], //最近在穿 或者 指定Tote
      pastCustomerPhotos: [], //曾经穿过
      isLoading: true, //初始化请求状态标记
      isMore: true, //判断是否有更多的 past tote
      page: 1 //past tote 当前在第几页
    }
  }

  componentDidMount() {
    const { navigation } = this.props
    if (navigation) {
      const { params } = navigation.state
      if (params && params.toteId) {
        this._getCustomerPhotosForTheTote(params.toteId)
        return
      }
    }
    this._getLatestToteData()
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  _getCustomerPhotosForTheTote = toteId => {
    QNetwork(
      SERVICE_TYPES.customerPhotos.QUERY_CUSTOMER_PHOTOS_IN_TOTE,
      { id: toteId },
      response => {
        const { tote } = response.data
        const object = { isLoading: false, isMore: false }
        if (tote) {
          object.latestCustomerPhotos = [tote]
        }
        this.setState(object)
      },
      () => {
        this.setState({ isLoading: false, isMore: false })
      }
    )
  }

  _getLatestToteData = () => {
    QNetwork(
      SERVICE_TYPES.customerPhotos.QUERY_MY_CUSTOMER_PHOTOS_WITH_TOTES,
      { filter: 'delivered', per_page: 1, page: 1 },
      response => {
        const { totes } = response.data
        if (totes.length) {
          this.setState({ latestCustomerPhotos: totes }, () => {
            this._getPastTotes()
          })
        } else {
          this.setState({ isLoading: false, isMore: false })
        }
      },
      () => {
        this.setState({ isLoading: false, isMore: false })
      }
    )
  }

  //获取历史衣箱
  _getPastTotes = () => {
    const variables = {
      filter: 'delivered',
      exclude_tote_ids: [this.state.latestCustomerPhotos[0].id],
      per_page: 5,
      page: this.state.page
    }

    if (this.isLoading) {
      return
    }
    this.isLoading = true
    QNetwork(
      SERVICE_TYPES.customerPhotos.QUERY_MY_CUSTOMER_PHOTOS_WITH_TOTES,
      variables,
      response => {
        const { totes } = response.data
        const pastCustomerPhotos = [...this.state.pastCustomerPhotos, ...totes]

        const page = this.state.page + 1
        const isMore = totes.length === 5
        const object = { pastCustomerPhotos, page, isMore, isLoading: false }
        this.setState(object)
        this.isLoading = false
      },
      () => {
        this.setState({ isLoading: false })
        this.isLoading = false
      }
    )
  }

  updataProductCustomerPhotos = (data, toteId, toteProductId, isLatest) => {
    const customerPhotos = isLatest
      ? this.state.latestCustomerPhotos
      : this.state.pastCustomerPhotos

    const indexTote = customerPhotos.findIndex(tote => tote.id === toteId)

    if (indexTote !== -1) {
      const index = customerPhotos[indexTote].tote_products.findIndex(item => {
        return item.id === toteProductId
      })
      if (index !== -1) {
        customerPhotos[indexTote].tote_products[index].customer_photos_v2 = [
          data
        ]
      }
    }
    let object = {}
    if (isLatest) {
      object.latestCustomerPhotos = [...this.state.latestCustomerPhotos]
    } else {
      object.pastCustomerPhotos = [...this.state.pastCustomerPhotos]
    }
    this.setState(object)
  }

  _keyExtractor = tote => {
    return tote.id.toString()
  }

  _productListEmptyComponent = () => {
    const { isMore, isLoading } = this.state
    return !isMore && !isLoading ? (
      <View
        style={[
          styles.emptyView,
          { marginTop: this.props.UIScreen.window.height / 2 - 150 }
        ]}>
        <Image
          source={require('../../../../assets/images/customer_photos/customer_photos_null.png')}
        />
        <Text style={styles.emptyPhotoText}>衣箱到手后即可晒单</Text>
      </View>
    ) : (
      <View style={styles.emptyView}>
        <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
      </View>
    )
  }

  latestHeader = () => {
    return this.state.latestCustomerPhotos.length ? (
      <View>
        <Text style={styles.title}>晒单</Text>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>最近正在穿</Text>
        </View>
      </View>
    ) : null
  }
  pastHeader = () => {
    return (
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={this.latestHeader}
          data={this.state.latestCustomerPhotos}
          extraData={this.state.isLoading}
          keyExtractor={this._keyExtractor}
          renderItem={this.renderLatestItem}
          ListEmptyComponent={this._productListEmptyComponent}
        />
        {this.state.pastCustomerPhotos.length > 0 && (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>曾经穿过</Text>
          </View>
        )}
      </View>
    )
  }

  renderLatestItem = ({ item }) => {
    return this.renderItem(item, true)
  }

  renderPastItem = ({ item }) => {
    return this.renderItem(item, false)
  }

  renderItem = (item, isLatest) => {
    const { tote_products } = item
    let newTote_products = sortToteProducts(tote_products)
    return (
      <View>
        {newTote_products.map(toteProduct => {
          return (
            <ToteProductItem
              key={toteProduct.id}
              goProductCustomerPhotos={this.goProductCustomerPhotos}
              toteProduct={toteProduct}
              toteProducts={newTote_products}
              isLatest={isLatest}
              toteId={item.id}
              didSelectedItem={this._didSelectedItem}
            />
          )
        })}
      </View>
    )
  }
  _listFooter = () => {
    return this.state.pastCustomerPhotos.length ? (
      <AllLoadedFooter isMore={this.state.isMore} />
    ) : null
  }
  _onEndReached = () => {
    this.state.isMore && this._getPastTotes()
  }

  _didSelectedItem = item => {
    const { navigation } = this.props
    navigation.navigate('Details', { item, column: Column.MyCustomerPhotos })
  }

  goProductCustomerPhotos = (toteProducts, toteProduct, toteId, isLatest) => {
    const { customer_photos_v2 } = toteProduct
    const isDone =
      customer_photos_v2.length && customer_photos_v2[0].photos.length
        ? true
        : false
    const { navigation } = this.props

    if (isDone) {
      navigation.navigate('CustomerPhotoFinished', {
        data: customer_photos_v2[0],
        id: customer_photos_v2[0].id,
        sharePoster: true,
        column: Column.CustomerPhotoFinished
      })
    } else {
      navigation.navigate('SubmitCustomerPhoto', {
        toteProducts,
        toteProduct,
        toteId,
        isLatest,
        updataProductCustomerPhotos: this.updataProductCustomerPhotos
      })
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar
          style={styles.navigationBar}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <View style={styles.container}>
          <FlatList
            testID="past-customer-photos-header"
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={this.pastHeader}
            data={this.state.pastCustomerPhotos}
            extraData={this.state.isLoading || this.state.latestCustomerPhotos}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderPastItem}
            ListFooterComponent={this._listFooter}
            onEndReached={this._onEndReached}
            onEndReachedThreshold={0.1}
          />
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  navigationBar: {
    borderBottomWidth: 0
  },
  container: {
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1
  },
  title: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 29,
    marginBottom: 16
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    paddingVertical: 16
  },
  headerTitle: { fontSize: 16, color: '#333' },
  emptyView: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyPhotoText: { marginTop: 24, fontSize: 16, color: '#999' }
})
