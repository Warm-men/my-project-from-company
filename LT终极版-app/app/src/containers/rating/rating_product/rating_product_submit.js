/* @flow */

import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  DeviceEventEmitter
} from 'react-native'
import {
  SERVICE_TYPES,
  Mutate,
  QNetwork
} from '../../../expand/services/services'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../../storybook/stories/navigationbar'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  Header,
  FitContainer,
  StyleContainer,
  QualityContainer,
  ContentContainer,
  ProgressContainer,
  ExpensivenessContainer
} from '../../../../storybook/stories/rate/rating_product'
import RatingIncentive from '../../../../storybook/stories/rate/rating_incentive'
import { CustomAlertView } from '../../../../storybook/stories/alert/custom_alert_view'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { inject } from 'mobx-react'

@inject('appStore', 'modalStore')
export default class RatingProductSubmitContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      product: null,
      product_size: null,
      wearQuestions: null,
      sizeQuestions: null,
      styleQuestions: null,
      qualityQuestions: null,
      currentIndex: 0
    }
    this.isSubmitting = false
    this.tote = null

    this._initRatingInput()
  }

  _initRatingInput = () => {
    const { ids } = this.props.navigation.state.params
    this.input = {
      tote_product_id: ids[this.state.currentIndex],
      worn_times: null,
      style_score: 0,
      style_issues: [],
      liked_style: [],
      quality_score: 0,
      quality_issues: [],
      liked_quality: [],
      expensiveness_score: 0,
      comment: ''
    }
    this.fit = null
    this.fitInput = {}
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  _goBackCheck = () => {
    this.props.modalStore.show(
      <CustomAlertView
        title={'评价未完成'}
        message={'你的评价很重要，确定放弃评价吗？'}
        cancel={{ title: '放弃', type: 'normal', onClick: this._goBack }}
        other={[{ title: '继续评价', type: 'highLight' }]}
      />
    )
  }

  componentDidMount() {
    this._getRatingQuestions()
  }

  _getRatingQuestions = () => {
    const { tote_id, ids } = this.props.navigation.state.params
    QNetwork(
      SERVICE_TYPES.rating.QUERY_RATING_QUESTIONS,
      { tote_id, ids },
      response => {
        const { tote } = response.data
        if (tote && tote.tote_products && tote.tote_products.length) {
          this.tote = tote
          const data = this._updateRatingQuestions(tote)
          this.setState(data)
        }
      }
    )
  }

  _updateRatingQuestions = tote => {
    const toteProduct = tote.tote_products[this.state.currentIndex]
    const {
      rating_question_sets,
      product,
      product_size,
      rating_loose_reason_display
    } = toteProduct
    const object = {
      product,
      product_size,
      rating_loose_reason_display,
      wearQuestions: null,
      sizeQuestions: null,
      styleQuestions: null,
      qualityQuestions: null
    }
    if (rating_question_sets) {
      const wearQuestions = rating_question_sets.find(
        item => item.group_name === 'worn_times'
      )
      object.wearQuestions = wearQuestions

      const sizeQuestions = rating_question_sets.find(
        item => item.group_name === 'size'
      )
      object.sizeQuestions = sizeQuestions

      const styleQuestions = rating_question_sets.find(
        item => item.group_name === 'style'
      )
      object.styleQuestions = styleQuestions

      const qualityQuestions = rating_question_sets.find(
        item => item.group_name === 'quality'
      )
      object.qualityQuestions = qualityQuestions
    }

    return object
  }

  _updateWearTimes = value => {
    this.input.worn_times = value
  }

  _updateFitting = (fit, data) => {
    this.fit = fit === 'true' ? true : false
    this.fitInput = data
  }

  _updateStyle = (style_score, style) => {
    this.input.style_score = style_score
    if (style_score < 4) {
      this.input.style_issues = style
      this.input.liked_style = []
    } else {
      this.input.style_issues = []
      this.input.liked_style = style
    }
  }

  _updateQuality = (quality_score, quality) => {
    this.input.quality_score = quality_score
    if (quality_score < 4) {
      this.input.quality_issues = quality
      this.input.liked_quality = []
    } else {
      this.input.quality_issues = []
      this.input.liked_quality = quality
    }
  }

  _updateExpensiveness = expensiveness_score => {
    this.input.expensiveness_score = expensiveness_score
  }

  _updateComment = comment => {
    this.input.comment = comment
  }

  _submit = () => {
    if (this.isSubmitting) {
      return
    }
    const {
      worn_times,
      style_score,
      quality_score,
      expensiveness_score
    } = this.input
    const { accessory } = this.state.product.category

    if (!worn_times || !style_score || !quality_score || !expensiveness_score) {
      this.props.appStore.showToastWithOpacity('请先评完当前单品')
      return
    }

    if (!accessory && worn_times !== 'never' && this.fit === null) {
      this.props.appStore.showToastWithOpacity('请先评完当前单品')
      return
    }
    this.isSubmitting = true

    const ratings = accessory
      ? [{ ...this.input }]
      : [{ ...this.input, fit: this.fit, ...this.fitInput }]
    const { tote_id } = this.props.navigation.state.params
    const input = { ratings, tote_id }

    Mutate(
      SERVICE_TYPES.rating.MUTATION_RATE_PRODUCTS,
      { input },
      response => {
        this.isSubmitting = false
        const { errors, rating_incentive } = response.data.RateProductsV2

        const { appStore, modalStore } = this.props
        if (errors && errors.length) {
          appStore.showToastWithOpacity(errors[0])
          return
        }

        if (rating_incentive && rating_incentive.has_incentived) {
          DeviceEventEmitter.emit('onRefreshTotes')
          DeviceEventEmitter.emit('updatePastToteRatingStatus', { tote_id })
          modalStore.show(
            <RatingIncentive amount={rating_incentive.has_incentived_amount} />
          )

          setTimeout(() => {
            modalStore.hide()
            this._finishedRating()
          }, 3000)
        } else {
          this._finishedRating()
        }
      },
      () => {
        this.isSubmitting = false
      }
    )
  }

  _finishedRating = () => {
    const { refreshRatingToteStatus, ids } = this.props.navigation.state.params
    refreshRatingToteStatus && refreshRatingToteStatus()

    if (this.state.currentIndex !== ids.length - 1) {
      this._ratingNextToteProduct()
    } else {
      this._goBack()
    }
  }

  _ratingNextToteProduct = () => {
    const currentIndex = this.state.currentIndex + 1
    this.setState({ currentIndex, product: null }, () => {
      this._initRatingInput()
      if (this.tote) {
        const data = this._updateRatingQuestions(this.tote)
        this.setState(data)
      }
    })
  }

  render() {
    const {
      product,
      product_size,
      wearQuestions,
      sizeQuestions,
      rating_loose_reason_display,
      styleQuestions,
      qualityQuestions,
      currentIndex
    } = this.state

    const { sumCount, ids } = this.props.navigation.state.params
    let buttonTitle = '提交'
    if (currentIndex !== ids.length - 1) {
      buttonTitle = '下一件'
    }

    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'评价单品'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBackCheck} buttonType={'back'} />
          }
        />
        {product ? (
          <KeyboardAwareScrollView
            style={styles.contentView}
            keyboardOpeningTime={0}
            extraScrollHeight={40}
            keyboardDismissMode={'on-drag'}
            showsVerticalScrollIndicator={false}>
            {!!sumCount && (
              <ProgressContainer
                ids={ids}
                currentCount={this.state.currentIndex}
                count={sumCount}
              />
            )}
            <Header
              product={product}
              productSize={product_size}
              data={wearQuestions}
              updateWearTimes={this._updateWearTimes}
            />
            {!!sizeQuestions ? (
              <FitContainer
                data={sizeQuestions}
                ratingLooseReasonDisplay={rating_loose_reason_display}
                updateFitting={this._updateFitting}
              />
            ) : (
              <View style={{ height: 24 }} />
            )}
            {!!styleQuestions && (
              <StyleContainer
                appStore={this.props.appStore}
                data={styleQuestions}
                updateStyle={this._updateStyle}
              />
            )}
            {!!qualityQuestions && (
              <QualityContainer
                data={qualityQuestions}
                updateQuality={this._updateQuality}
              />
            )}
            <ExpensivenessContainer
              updateExpensiveness={this._updateExpensiveness}
            />
            <ContentContainer updateComment={this._updateComment} />
          </KeyboardAwareScrollView>
        ) : (
          <View style={styles.loadingView}>
            <Spinner size={40} type={'Pulse'} color={'#222'} />
          </View>
        )}
        <View style={styles.bottom}>
          <TouchableOpacity style={styles.submitButton} onPress={this._submit}>
            <Text style={styles.submitTitle}>{buttonTitle}</Text>
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
  submitButton: {
    height: 44,
    borderRadius: 2,
    backgroundColor: '#E85C40',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitTitle: { color: '#fff', fontWeight: '600' }
})
