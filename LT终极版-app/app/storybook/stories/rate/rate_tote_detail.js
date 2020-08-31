import React, { Component, PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  DeviceEventEmitter,
  Text
} from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
import Image from '../image.js'
import RatingStar from './rating_star'
import { SafeAreaView } from '../navigationbar'
import {
  SERVICE_TYPES,
  Mutate,
  QNetwork
} from '../../../src/expand/services/services'
import { sortToteProducts } from '../../../src/expand/tool/totes'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const labelArray = [
  { text: '尺码不合身', id: 1, value: 'didnt_fit' },
  { text: '商品质量不满意', id: 2, value: 'wasnt_customized' },
  { text: '不是我的风格', id: 3, value: 'wrong_style' },
  { text: '很难搭配', id: 4, value: 'difficult_match' },
  { text: '物流太慢', id: 5, value: 'arrived_slowly' },
  { text: '其他', id: 6, value: 'other' }
]

export default class RateToteDetail extends Component {
  constructor(props) {
    super(props)
    const { tote_rating, tote, rating } = props
    this.state = {
      rating,
      defaultRating: rating,
      arrived_slowly: tote_rating ? tote_rating.arrived_slowly : false,
      wrong_style: tote_rating ? tote_rating.wrong_style : false,
      didnt_fit: tote_rating ? tote_rating.didnt_fit : false,
      wasnt_customized: tote_rating ? tote_rating.wasnt_customized : false,
      other: tote_rating && tote_rating.reason !== '' ? true : false,
      reason: tote_rating ? tote_rating.reason : '',
      difficult_match: tote_rating ? tote_rating.difficult_match : false,
      toteProducts: sortToteProducts(
        tote.tote_products.filter(function(x) {
          return x.rating === null
        })
      ),
      focus: false
    }
    this.isSubmit = false
  }

  componentDidMount() {
    this.getRatingForTote()
  }

  getRatingForTote = () => {
    const { tote } = this.props
    QNetwork(
      SERVICE_TYPES.rating.QUERY_RATINGS_FOR_TOTE,
      { id: tote.id },
      response => {
        if (response.data.tote) {
          const { tote_products, tote_rating } = response.data.tote
          const {
            arrived_slowly,
            wrong_style,
            didnt_fit,
            wasnt_customized,
            difficult_match,
            reason
          } = tote_rating
          let toteProducts = sortToteProducts(
            tote_products.filter(x => {
              return x.rating === null
            })
          )
          this.setState({
            toteProducts,
            arrived_slowly,
            wrong_style,
            didnt_fit,
            wasnt_customized,
            difficult_match,
            reason,
            other: reason !== '' ? true : false
          })
        }
      }
    )
  }

  setRatingNum = rating => {
    if (rating > 3) {
      this.setState({
        rating,
        arrived_slowly: false,
        wrong_style: false,
        didnt_fit: false,
        wasnt_customized: false,
        other: false,
        reason: ''
      })
    } else {
      this.setState({ rating })
    }
  }

  labelCallBack = label => {
    let state = {}
    state[label] = !this.state[label]
    this.setState(state)
  }

  setRating = () => {
    if (this.isSubmit) {
      return
    }
    const {
      rating,
      arrived_slowly,
      wrong_style,
      didnt_fit,
      wasnt_customized,
      reason,
      difficult_match
    } = this.state
    if (!rating) {
      this.props.appStore.showToastWithOpacity('请先评价衣箱')
      return
    }
    this.isSubmit = true
    let reasons = this.state.other ? reason : ''
    const { tote } = this.props

    Mutate(
      SERVICE_TYPES.rating.MUTATION_RATE_TOTE,
      {
        tote_rating: {
          rating,
          tote_id: tote.id,
          arrived_slowly,
          wrong_style,
          didnt_fit,
          difficult_match,
          wasnt_customized,
          reason: reasons
        }
      },
      response => {
        const { rating_incentive } = response.data.RateTote
        this.isSubmit = false
        DeviceEventEmitter.emit('onRefreshTotes')
        this.showModal(rating_incentive)
      },
      () => {
        this.isSubmit = false
      }
    )
  }

  showModal = ratingIncentive => {
    const { modalStore, onFinishedRating } = this.props
    if (ratingIncentive && ratingIncentive.offer_incentive) {
      modalStore.show(<RatingIncentive ratingIncentive={ratingIncentive} />)
      setTimeout(() => {
        modalStore.hide()
        onFinishedRating && onFinishedRating()
      }, 3000)
    } else {
      onFinishedRating && onFinishedRating()
    }
  }

  setFocus = focus => {
    this.setState({
      focus
    })
  }

  _onFocus() {
    this.setFocus(true)
  }

  _onBlur() {
    this.setFocus(false)
  }

  render() {
    const { tote, isRating } = this.props
    const { rating, other, reason, focus } = this.state
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          extraScrollHeight={40}
          keyboardOpeningTime={0}
          showsVerticalScrollIndicator={false}>
          <Image
            style={{ width: p2d(375), height: p2d(170) }}
            source={require('../../../assets/images/rating/rate_guide.png')}
          />
          <View style={styles.bannerView}>
            <Text style={styles.shadowText}>满意本次的衣箱体验吗？</Text>
          </View>
          <View style={styles.alignItemsCenter}>
            <RatingStar
              tote_id={tote.id}
              setRatingNum={this.setRatingNum}
              style={styles.ratingStar}
            />
            {rating > 3 ? (
              <Text style={{ fontSize: 14, color: '#333' }}>
                谢谢你的评价，我们会继续努力
              </Text>
            ) : (
              <View style={styles.alignItemsCenter}>
                {!rating ? null : (
                  <ReasonView label={this.state} onPress={this.labelCallBack} />
                )}
                {other ? (
                  <View
                    style={[
                      focus || !!reason.length
                        ? styles.textInputView
                        : styles.blurTextInputView
                    ]}>
                    <TextInput
                      style={styles.textInput}
                      placeholderTextColor={'#989898'}
                      maxLength={150}
                      multiline={true}
                      onFocus={() => this._onFocus()}
                      onBlur={() => this._onBlur()}
                      autoCorrect={false}
                      value={reason}
                      textAlignVertical={'top'}
                      underlineColorAndroid={'transparent'}
                      placeholder={'请告诉我们具体原因'}
                      onChangeText={reason => this.setState({ reason })}
                    />
                    {(focus || !!reason.length) && (
                      <Text style={styles.wordNum}>{reason.length}/150</Text>
                    )}
                  </View>
                ) : null}
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.submitView}>
          {this.state.rating !== 0 ? (
            <TouchableOpacity
              onPress={this.setRating}
              style={styles.ratingButton}>
              <Text style={styles.ratingButtonText}>
                {isRating ? '提交' : '下一步'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </SafeAreaView>
    )
  }
}

export class ReasonView extends PureComponent {
  selectItem = value => {
    this.props.onPress(value)
  }

  render() {
    return (
      <View style={styles.labelView}>
        {labelArray.map((item, index) => {
          return (
            <Item
              item={item}
              label={this.props.label}
              key={index}
              onPress={this.selectItem}
            />
          )
        })}
      </View>
    )
  }
}

export class Item extends PureComponent {
  selectItem = () => {
    this.props.onPress(this.props.item.value)
  }

  render() {
    const { item, label } = this.props
    const select = label[item.value]
    return (
      <TouchableOpacity
        style={[
          styles.labelItem,
          select ? styles.selectLabelItem : styles.unSelectLabelItem
        ]}
        onPress={this.selectItem}>
        <Text
          style={[
            styles.labelItemText,
            select ? styles.selectLabelText : styles.unSelectLabelText
          ]}>
          {item.text}
        </Text>
      </TouchableOpacity>
    )
  }
}

class RatingIncentive extends PureComponent {
  render() {
    const {
      incentive_amount,
      main_text,
      secondary_text
    } = this.props.ratingIncentive
    return (
      <View style={styles.modalView}>
        <View style={styles.imageView}>
          <Image
            source={require('../../../assets/images/rating/jiangli.png')}
          />
          <Text style={styles.incentiveHeaderText}>
            ￥<Text style={{ fontSize: 24 }}>{incentive_amount}</Text>
          </Text>
          <View style={styles.incentiveContentView}>
            <Text style={styles.incentiveMainText}>{main_text}</Text>
            <Text style={styles.incentiveSecondText}>{secondary_text}</Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  bannerView: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginTop: -28
  },
  ratingStar: {
    marginBottom: 24
  },
  alignItemsCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  shadowText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
    marginTop: 48
  },
  labelView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  labelItem: {
    height: 32,
    borderRadius: 39,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 12
  },
  selectLabelItem: {
    backgroundColor: '#FDEDE9',
    borderColor: '#E85C40'
  },
  unSelectLabelItem: {
    borderColor: '#ccc'
  },
  labelItemText: {
    marginLeft: 16,
    marginRight: 16,
    fontSize: 12
  },
  selectLabelText: {
    color: '#E85C40'
  },
  unSelectLabelText: {
    color: '#5e5e5e'
  },
  textInputView: {
    padding: 15,
    width: p2d(315),
    height: 138,
    backgroundColor: '#F7F7F7'
  },
  blurTextInputView: {
    width: p2d(315),
    backgroundColor: '#F7F7F7',
    padding: 15
  },
  textInput: {
    backgroundColor: '#F7F7F7',
    flex: 1,
    fontSize: 12,
    lineHeight: 20
  },
  wordNum: {
    alignSelf: 'flex-end',
    color: '#989898',
    fontSize: 12
  },
  submitView: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center'
  },
  ratingButton: {
    width: p2d(345),
    height: 40,
    backgroundColor: '#EA5C39',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 2
  },
  ratingButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700'
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  imageView: {
    alignItems: 'center'
  },
  incentiveHeaderText: {
    fontSize: 20,
    color: '#fff',
    position: 'absolute',
    top: 30,
    textAlignVertical: 'bottom'
  },
  incentiveContentView: {
    position: 'absolute',
    bottom: 24
  },
  incentiveMainText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '700'
  },
  incentiveSecondText: {
    fontSize: 12,
    color: '#999'
  }
})
