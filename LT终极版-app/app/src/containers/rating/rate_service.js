import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  DeviceEventEmitter,
  BackHandler,
  Platform
} from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import { SERVICE_TYPES, Mutate, QNetwork } from '../../expand/services/services'
import { inject, observer } from 'mobx-react'
import {
  Header,
  Products
} from '../../../storybook/stories/rate/rating_service'
import {
  PanelRateServiceItem,
  SeePanelRateServiceItem
} from '../../../storybook/stories/rate/rating_service/panel_rate_service_item'
import {
  OtherSayModal,
  SeeOtherSayModal
} from '../../../storybook/stories/rate/other_say_modal'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'
import RateTotesGuide from '../../../storybook/stories/rate/rate_guide'
import p2d from '../../expand/tool/p2d'
import Icon from 'react-native-vector-icons/Ionicons'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import PopUpPanel from '../../components/pop_up_panel'
@inject(
  'appStore',
  'modalStore',
  'panelStore',
  'guideStore',
  'currentCustomerStore'
)
@observer
export default class RateServiceContainer extends Component {
  constructor(props) {
    super(props)
    const { tote, isReturnTote } = props.navigation.state.params
    this.state = {
      ratings: {},
      toteProducts: [],
      otherSay: tote.other_product_feedback ? tote.other_product_feedback : [],
      modalVisible: false,
      modalRating: null,
      modalProduct: null,
      allRate: null,
      isLoading: true,
      pupVisible: false
    }
    this.hasRating = tote.tote_products.find(i => {
      return i.service_feedback !== null
    })
    this.immutableOtherSay = !!tote.other_product_feedback
    this.isReturnTote = !!isReturnTote
  }

  componentDidMount() {
    this.getToteProducts()
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
    }
  }

  handleBackPress = () => {
    if (this.state.pupVisible) {
      this.setState({ pupVisible: false })
      return true
    } else if (this.props.modalStore.modalVisible) {
      this.hideModal()
      return true
    } else {
      this._goBack()
      return true
    }
    return false
  }

  getToteProducts = () => {
    const { tote } = this.props.navigation.state.params
    QNetwork(
      SERVICE_TYPES.rating.QUERY_RATINGS_FOR_TOTE,
      { id: tote.id },
      response => {
        const { tote_products } = response.data.tote
        const allRate = tote_products.find(i => {
          return i.service_feedback === null
        })
        this.setState({
          isLoading: false,
          toteProducts: tote_products,
          allRate
        })
      }
    )
  }

  _goBack = () => {
    const { tote } = this.props.navigation.state.params
    const alreadyReturn =
      tote.progress_status.status === 'scheduled_return' || !this.state.allRate
    if (alreadyReturn) {
      this.props.navigation.popToTop()
      return
    }
    const stateNum = Object.keys(this.state.ratings)
    if (!!stateNum.length) {
      this.props.modalStore.show(
        <CustomAlertView
          message={'投诉还没提交，确定离开吗？'}
          other={[
            {
              title: '离开',
              onClick: this.props.navigation.popToTop
            },
            {
              type: 'highLight',
              title: '留下'
            }
          ]}
        />
      )
    } else {
      this.props.navigation.popToTop()
    }
  }

  removeObjectValueIsNull = obj => {
    let newObj = { ...obj }
    if (!(typeof newObj === 'object')) {
      return
    }
    for (var key in newObj) {
      if (newObj.hasOwnProperty(key) && !newObj[key] && key !== 'quality') {
        delete newObj[key]
      }
      newObj['photos'] && delete newObj['photos']
      delete newObj['quality']
    }
    return newObj
  }

  _isSubmting = () => {
    const { tote } = this.props.navigation.state.params
    const stateNum = Object.keys(this.state.ratings)
    if (!!!stateNum.length) {
      if (this.isReturnTote) {
        const { perfect_closets, skip_perfect_closet } = tote
        if (!!perfect_closets.length || skip_perfect_closet) {
          this.props.navigation.navigate('ToteReturn', { tote })
        } else {
          this.props.navigation.navigate('SatisfiedProduct', { tote })
        }
        return
      }
      this.props.appStore.showToastWithOpacity('请选择商品')
      return
    } else {
      this.submitRating()
    }
  }

  submitRating = () => {
    const { tote } = this.props.navigation.state.params
    const feedbacks = []
    Object.keys(this.state.ratings).forEach(key => {
      let quality_photo_urls = []
      quality_photo_urls =
        this.state.ratings[key].state.photos &&
        this.state.ratings[key].state.photos.map(item => {
          return item.upload_url
        })
      const newState = this.removeObjectValueIsNull(
        this.state.ratings[key].state
      )
      let quality_issues = []
      Object.keys(newState).forEach(key => {
        quality_issues.push(key)
      })
      if (this.state.ratings[key].state.photos) {
        feedbacks.push({
          quality_photo_urls,
          tote_product_id: parseInt(key),
          quality_issues
        })
      } else {
        feedbacks.push({
          tote_product_id: parseInt(key),
          quality_issues
        })
      }
    })
    const input = {
      feedbacks,
      tote_id: tote.id,
      other_product_feedback: this.state.otherSay.toString()
    }
    Mutate(
      SERVICE_TYPES.rating.MUTATION_CREATE_SERVICE_FEEDBACK,
      { input },
      response => {
        DeviceEventEmitter.emit('onRefreshTotes')
        const {
          show_free_service_question
        } = response.data.CreateServiceFeedback
        if (show_free_service_question) {
          this.props.modalStore.show(
            <CustomAlertView
              message={
                '开通「自在选」每次可多选2个衣位\n是否能解决你本次所遇到的商品问题？'
              }
              other={[
                {
                  type: 'highLight',
                  title: '无法解决',
                  onClick: () => {
                    this.goRatingResults(false)
                  }
                },
                {
                  type: 'highLight',
                  title: '可以解决',
                  onClick: () => {
                    this.goRatingResults(true)
                  }
                }
              ]}
            />
          )
        } else {
          this.goRatingResults()
        }
      }
    )
  }

  goRatingResults = solve => {
    const { tote } = this.props.navigation.state.params
    const isReturnTote = this.isReturnTote
    const variables =
      solve === undefined
        ? { tote_id: tote.id }
        : { tote_id: tote.id, resolve_tote_issue: solve }
    QNetwork(
      SERVICE_TYPES.rating.QUERY_RATINGS_FEEDBACK_RESULT,
      variables,
      response => {
        const { feedback_result } = response.data
        this.props.navigation.navigate('RatingResults', {
          isReturnTote,
          tote,
          feedback_result
        })
      }
    )
  }

  seeRate = (toteProduct, rating) => {
    this.props.panelStore.show(
      <SeePanelRateServiceItem
        toteProduct={toteProduct}
        rating={rating}
        hidePanel={this.hidePanel}
      />
    )
  }

  _didChangeRating = (rating, toteProduct) => {
    let newRatings = { ...this.state.ratings }
    newRatings[toteProduct.id] = {
      state: { ...rating },
      product: { id: toteProduct.product.id }
    }
    this.setState({ ratings: newRatings })
  }

  showPanel = (toteProduct, rating) => {
    this.setState({
      pupVisible: true,
      modalProduct: toteProduct,
      modalRating: rating
    })
  }

  hidePanelModal = () => {
    this.setState({
      pupVisible: false,
      modalProduct: null,
      modalRating: null
    })
  }

  hidePanel = () => {
    this.props.panelStore.hide()
  }

  hideRateGuide = () => {
    this.props.guideStore.rateToteGuideShowed = true
  }

  setOtherSay = otherSay => {
    this.setState({ otherSay })
  }

  hideModal = () => {
    this.props.modalStore.hide()
  }

  otherSay = () => {
    this.props.modalStore.show(
      this.immutableOtherSay ? (
        <SeeOtherSayModal
          hideModal={this.hideModal}
          otherSay={this.state.otherSay}
        />
      ) : (
        <OtherSayModal
          setOtherSay={this.setOtherSay}
          hideModal={this.hideModal}
          otherSay={this.state.otherSay}
        />
      )
    )
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
        </View>
      )
    }
    const { guideStore, currentCustomerStore, navigation } = this.props
    const { modalProduct, modalRating, pupVisible } = this.state
    const { tote } = navigation.state.params
    const alreadyReturn =
      tote.progress_status.status === 'scheduled_return' || !this.state.allRate
    return (
      <View style={styles.safeAreaView}>
        <SafeAreaView style={styles.safeAreaView}>
          <NavigationBar
            title={'商品投诉'}
            leftBarButtonItem={
              guideStore.rateToteGuideShowed && (
                <BarButtonItem onPress={this._goBack} buttonType={'back'} />
              )
            }
          />
          {guideStore.rateToteGuideShowed ? (
            <View style={styles.safeAreaView}>
              <ScrollView>
                <Header
                  hasRating={this.hasRating}
                  alreadyReturn={alreadyReturn}
                />
                <Products
                  toteProducts={this.state.toteProducts}
                  ratings={this.state.ratings}
                  rateProduct={this.showPanel}
                  seeRate={this.seeRate}
                  alreadyReturn={alreadyReturn}
                />
                {(!alreadyReturn || this.immutableOtherSay) && (
                  <TouchableOpacity
                    hitSlop={styles.hitSlop}
                    style={styles.otherView}
                    onPress={this.otherSay}>
                    <Text style={styles.otherText}>
                      {!!this.state.otherSay.length || this.immutableOtherSay
                        ? '已提交其他反馈'
                        : '我还有其他反馈'}
                    </Text>
                    <Icon name={'ios-arrow-forward'} size={16} color={'#999'} />
                  </TouchableOpacity>
                )}
                {alreadyReturn && (
                  <View style={[styles.buttonView, { borderTopWidth: 0 }]}>
                    <View style={styles.alreadyReturnButton}>
                      <Text style={styles.alreadyReturnButtonText}>
                        如需反馈更多商品问题，请联系客服
                      </Text>
                    </View>
                  </View>
                )}
              </ScrollView>
              {!alreadyReturn && (
                <View style={styles.buttonView}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={this._isSubmting}>
                    <Text style={styles.buttonText}>确认提交</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <RateTotesGuide
              hideRateGuide={this.hideRateGuide}
              nickname={currentCustomerStore.nickname}
            />
          )}
        </SafeAreaView>
        <PopUpPanel
          ref={popUpPanel => (this._popUpPanel = popUpPanel)}
          visible={pupVisible}>
          <PanelRateServiceItem
            toteProduct={modalProduct}
            didChangeRating={this._didChangeRating}
            rating={modalRating}
            hideModal={this.hidePanelModal}
            appStore={this.props.appStore}
          />
        </PopUpPanel>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: { flex: 1 },
  modalView: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%'
  },
  container: {
    paddingHorizontal: p2d(19),
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: p2d(26)
  },
  buttonView: {
    borderTopWidth: 1,
    borderTopColor: '#f6f6f6',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  button: {
    width: p2d(343),
    height: p2d(44),
    backgroundColor: '#EA5C39',
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2
  },
  alreadyReturnButton: {
    width: p2d(343),
    height: p2d(44),
    backgroundColor: '#F7F7F7',
    marginVertical: p2d(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2
  },
  buttonText: { fontSize: 14, color: '#fff', fontWeight: '700' },
  alreadyReturnButtonText: { fontSize: 12, color: '#999' },
  otherView: {
    marginBottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  hitSlop: { top: 20, left: 20, right: 20, bottom: 20 },
  otherText: { fontSize: 13, color: '#333', marginRight: 8 }
})
