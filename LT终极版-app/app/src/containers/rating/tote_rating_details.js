import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity
} from 'react-native'
import { Column } from '../../expand/tool/add_to_closet_status'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import {
  RatingStatusBar,
  RatingStar,
  Product
} from '../../../storybook/stories/rate/tote_rating_details'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services'
import { sortToteProducts } from '../../expand/tool/totes'

// eslint-disable-next-line
import Spinner from 'react-native-spinkit'

export default class ToteRatingDetailsContainer extends Component {
  constructor(props) {
    super(props)
    this.state = { rating: 0, data: null, tote: null }
  }

  componentDidMount() {
    this.getRatingForTote()
  }

  getRatingForTote = () => {
    const { id } = this.props.navigation.state.params.tote
    QNetwork(SERVICE_TYPES.rating.QUERY_RATINGS_FOR_TOTE, { id }, response => {
      const { tote } = response.data
      if (tote) {
        const { tote_rating, tote_products } = tote
        const data = sortToteProducts(tote_products)
        if (tote_rating) {
          const { rating } = tote_rating
          this.setState({ data, tote, rating })
        } else {
          this.setState({ data, tote })
        }
      }
    })
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  listHeaderComponent = () => {
    const { rating, tote } = this.state
    if (!tote) return null

    const {
      rating_incentive,
      tote_products,
      display_rating_progress_bar
    } = tote
    const currentCount = tote_products.filter(i => !!i.rating).length

    return (
      <View>
        {display_rating_progress_bar && rating_incentive ? (
          <RatingStatusBar
            count={tote_products.length}
            currentCount={currentCount}
            hasIncentived={rating_incentive.has_incentived}
            amount={rating_incentive.has_incentived_amount}
            rating={this._ratingToteProducts}
          />
        ) : null}
        <View style={styles.bannerView}>
          <Text style={styles.bannerText}>{'衣箱满意度'}</Text>
          <View style={{ flex: 1 }}>
            <RatingStar rating={rating} />
          </View>
          {rating === 0 && (
            <TouchableOpacity
              style={styles.ratingButton}
              onPress={this._ratingTote}>
              <Text style={styles.ratingTitle}>评价衣箱</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.subTitle}>{'衣箱商品'}</Text>
      </View>
    )
  }

  _keyExtractor = (item, index) => index.toString()

  _didSelectedItem = product => {
    const { navigate, state } = this.props.navigation
    const { isCurrentTote } = state.params
    const column = isCurrentTote ? Column.CurrentTote : Column.PastTote
    navigate('Details', { item: product, column })
  }

  _ratingToteProduct = toteProduct => {
    const { navigation } = this.props

    const { rating, id } = toteProduct
    if (!rating) {
      navigation.navigate('RatingProductSubmit', {
        ids: [id],
        tote_id: navigation.state.params.tote.id,
        refreshRatingToteStatus: this.getRatingForTote
      })
    } else {
      navigation.navigate('RatingProductCheck', { toteProduct })
    }
  }

  _ratingToteProducts = () => {
    const { navigation } = this.props
    if (!this.state.data) return

    const ids = []
    this.state.data.forEach(item => {
      if (!item.rating) {
        ids.push(item.id)
      }
    })
    if (!ids.length) return

    const object = {
      ids,
      tote_id: navigation.state.params.tote.id,
      refreshRatingToteStatus: this.getRatingForTote
    }
    if (ids.length > 1) {
      object.sumCount = this.state.data.length
    }
    navigation.navigate('RatingProductSubmit', object)
  }

  _ratingTote = () => {
    const { navigation } = this.props
    navigation.navigate('RateTote', {
      tote: navigation.state.params.tote,
      isRating: true,
      refreshRatingToteStatus: this.getRatingForTote
    })
  }

  _renderItem = ({ item }) => {
    return (
      <Product
        item={item}
        didSelectedItem={this._didSelectedItem}
        ratingProduct={this._ratingToteProduct}
      />
    )
  }

  listFooterComponent = () => {
    return <View style={{ height: 48 }} />
  }

  render() {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar
          title={'衣箱详情'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <View style={styles.container}>
          {this.state.data ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={this.listHeaderComponent}
              data={this.state.data}
              extraData={this.state.tote}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              ListFooterComponent={this.listFooterComponent}
            />
          ) : (
            <View style={styles.emptyView}>
              <Spinner size={40} type={'Pulse'} color={'#222'} />
            </View>
          )}
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: { flex: 1 },
  container: { flex: 1 },
  bannerView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 23,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F3F3',
    paddingLeft: 16
  },
  bannerText: {
    fontSize: 16,
    color: '#242424',
    fontWeight: '600',
    marginRight: 12,
    marginTop: 3
  },
  subTitle: {
    paddingLeft: 16,
    fontSize: 16,
    color: '#242424',
    fontWeight: '600',
    marginTop: 30
  },
  emptyView: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  ratingButton: {
    width: 75,
    height: 26,
    borderWidth: 0.5,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#E85C40',
    marginRight: 16
  },
  ratingTitle: { color: '#E85C40', fontSize: 12 }
})
