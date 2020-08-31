/* @flow */

import React, { Component, PureComponent } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image
} from 'react-native'
import { SERVICE_TYPES, QNetwork } from '../../../expand/services/services'
import { l10nForSize } from '../../../expand/tool/product_l10n'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../../storybook/stories/navigationbar'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { StarAndRating } from '../../../../storybook/stories/rate/tote_rating_details'

export default class RatingProductCheckContainer extends Component {
  constructor(props) {
    super(props)
    this.state = { rating: null }
  }
  _goBack = () => {
    this.props.navigation.goBack()
  }

  componentDidMount() {
    this._queryRatingResults()
  }

  _queryRatingResults = () => {
    const { id } = this.props.navigation.state.params.toteProduct
    QNetwork(SERVICE_TYPES.rating.QUERY_RATING_RESULTS, { id }, response => {
      const { tote_product } = response.data
      if (tote_product) {
        const { rating } = tote_product
        this.setState({ rating })
      }
    })
  }

  render() {
    const {
      product,
      product_size
    } = this.props.navigation.state.params.toteProduct
    const { rating } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'查看评价'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        {rating ? (
          <ScrollView
            style={styles.contentView}
            showsVerticalScrollIndicator={false}>
            <Header
              product={product}
              productSize={product_size}
              wornTimesDisplay={rating.worn_times_display}
            />
            <Fitting data={rating.size_rating} />
            <StarAndRating
              data={rating.style_rating}
              rating={rating.style_score}
              islike={rating.is_like_style}
              type={`style`}
            />
            <StarAndRating
              data={rating.quality_rating}
              rating={rating.quality_score}
              islike={rating.is_like_quality}
              type={`quality`}
            />
            <StarAndRating
              rating={rating.expensiveness_score}
              type={`expensiveness`}
            />
            {!!rating.comment && (
              <Text style={styles.comment}>{rating.comment}</Text>
            )}
          </ScrollView>
        ) : (
          <View style={styles.loadingView}>
            <Spinner size={40} type={'Pulse'} color={'#222'} />
          </View>
        )}
        <View style={styles.bottom}>
          <TouchableOpacity style={styles.button} onPress={this._goBack}>
            <Text style={styles.buttonTitle}>返回</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentView: { marginHorizontal: 16 },
  loadingView: { flex: 1, paddingTop: 30, alignItems: 'center' },
  bottom: {
    height: 60,
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    paddingHorizontal: 16,
    justifyContent: 'center'
  },
  button: {
    height: 44,
    borderRadius: 2,
    backgroundColor: '#E85C40',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonTitle: { color: '#fff', fontWeight: '600' },
  header: {
    paddingVertical: 16,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: '#F3F3F3'
  },
  image: { width: 56, height: 81, marginRight: 16 },
  headerContent: { justifyContent: 'center', flex: 1 },
  titleView: { flexDirection: 'row' },
  title: { color: '#242424', marginRight: 16 },
  itemTitle: {
    color: '#5e5e5e',
    fontSize: 12,
    borderRadius: 13,
    lineHeight: 26,
    marginRight: 8,
    marginBottom: 10,
    backgroundColor: '#f7f7f7',
    overflow: 'hidden',
    paddingHorizontal: 12
  },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', flex: 1 },
  subTitle: { color: '#242424', fontSize: 16, marginRight: 20, lineHeight: 26 },
  subComponent: { flexDirection: 'row', marginTop: 20 },
  comment: {
    backgroundColor: '#FCFCFC',
    borderWidth: 0.5,
    borderColor: '#efefef',
    padding: 16,
    color: '#5e5e5e',
    lineHeight: 22,
    marginTop: 32,
    marginBottom: 20
  }
})

class Header extends PureComponent {
  render() {
    const { product, productSize, wornTimesDisplay } = this.props
    const { catalogue_photos, title } = product
    return (
      <View style={styles.header}>
        <Image
          style={styles.image}
          source={{
            uri: catalogue_photos ? catalogue_photos[0].medium_url : ''
          }}
        />
        <View style={styles.headerContent}>
          <View style={styles.titleView}>
            <Text style={styles.title}>{title}</Text>
            {productSize ? (
              <Text style={styles.title}>
                {l10nForSize(productSize.size_abbreviation)}
              </Text>
            ) : null}
          </View>
          {wornTimesDisplay && (
            <View style={{ marginTop: 15, flexDirection: 'row' }}>
              <Text style={styles.itemTitle}>{wornTimesDisplay}</Text>
            </View>
          )}
        </View>
      </View>
    )
  }
}

class Fitting extends PureComponent {
  render() {
    const { data } = this.props
    if (!data || !data.length) {
      return null
    }
    return (
      <View style={styles.subComponent}>
        <Text style={styles.subTitle}>尺码</Text>
        <View style={styles.wrap}>
          {data.map(item => {
            return (
              <Text key={item} style={styles.itemTitle}>
                {item}
              </Text>
            )
          })}
        </View>
      </View>
    )
  }
}
