import React from 'react'
import AuthenticationComponent from '../../components/authentication'
import {
  View,
  StyleSheet,
  ScrollView,
  DeviceEventEmitter,
  RefreshControl
} from 'react-native'
import { inject, observer } from 'mobx-react'
import {
  QNetwork,
  Mutate,
  SERVICE_TYPES
} from '../../expand/services/services.js'
import {
  SafeAreaView,
  NavigationBar
} from '../../../storybook/stories/navigationbar'
import {
  TotesGuideView,
  ToteStyling,
  ToteEmpty
} from '../../../storybook/stories/totes'
import Float from '../../../storybook/stories/alert/float_view'
import OccasionBanner from '../../../storybook/stories/alert/occasion_banner'
import ToteAbnormalCard from './tote_abnormal_card'
import TotePastCollections from './tote_past_collections'
import ToteCurrentCollections from './tote_current_collections'
import ShoppingCarIcon from '../../../storybook/stories/tote_cart/shopping_car_icon'
import { onClickJoinMember } from '../../expand/tool/plans/join_member'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'
import { CustomerPhotoTrend } from '../../../storybook/stories/customer_photos/customer_photos_in_home'

@inject('currentCustomerStore', 'modalStore', 'popupsStore', 'guideStore')
@observer
class Totes extends AuthenticationComponent {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      toteQuiz: null,
      hasOperableTote: null,
      isHasAbnormal: null,
      isNeedPayment: null
    }
    this.listeners = []

    this.loadingStatus = { card: false, current: false, past: false }
  }
  onSignIn() {
    this._getSubscription()
    this._getQuiz()
    this._getExtendCancelQuiz()
  }
  onSignOut() {
    this.setState({ toteQuiz: null })
  }

  componentDidMount() {
    this.listeners.push(
      DeviceEventEmitter.addListener('onRefreshTotes', () => {
        this._getSubscription()
      })
    )
    this.listeners.push(
      DeviceEventEmitter.addListener('onRefreshQuiz', () => {
        this._getQuiz()
      })
    )
    if (this.props.currentCustomerStore.id) {
      this._getQuiz()
      this._getExtendCancelQuiz()
      this._getSubscription()
    }
    // 页面状态
    this.listeners.push(
      this.props.navigation.addListener('willFocus', () => {
        this._showPopup()
      })
    )
  }

  showFreeSeverTip = (title, message) => {
    const { modalStore } = this.props
    modalStore.show(
      <CustomAlertView
        title={title}
        message={message}
        cancel={{ title: '我知道了' }}
      />
    )
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    this.listeners.map(item => {
      item.remove()
    })
  }

  _showPopup = () => {
    const { popupsStore, modalStore, navigation } = this.props
    popupsStore.showPopup(modalStore.currentRoute, popup => {
      if (popup) {
        modalStore.show(
          <OccasionBanner
            activityName={'Popup'}
            navigation={navigation}
            extraData={popup}
          />
        )
      }
    })
  }

  _getQuiz = () => {
    const input = { slug: 'TOTE_QUIZ' }
    QNetwork(SERVICE_TYPES.quiz.QUERY_FLOAT_HOVER, input, response => {
      const { float_hover } = response.data
      if (float_hover) {
        const toteQuiz = { ...float_hover, image: float_hover.pop_image }
        this.setState({ toteQuiz }, () => {
          this._showToteQuiz()
        })
      } else {
        this.setState({ toteQuiz: null })
      }
    })
  }

  _getExtendCancelQuiz = () => {
    const input = { slug: 'QUIZSubscribeCancel' }
    QNetwork(SERVICE_TYPES.quiz.QUERY_QUIZ, input, response => {
      const { quiz } = response.data
      this.setState({ extendCancelQuiz: quiz })
    })
  }

  _visitExtendCancelQuiz = () => {
    this.setState({ extendCancelQuiz: null })
  }

  _showToteQuiz = () => {
    if (!this.state.toteQuiz) {
      return
    }
    const { modalStore, navigation } = this.props
    if (
      !modalStore.modalVisible &&
      this.state.toteQuiz.display_type === 'pop'
    ) {
      modalStore.show(
        <OccasionBanner
          activityName={'FloatHover'}
          navigation={navigation}
          extraData={this.state.toteQuiz}
          willUnmount={this._isViewedFloatHover}
        />
      )
    }
  }
  _isViewedFloatHover = () => {
    if (!this.state.toteQuiz) {
      return
    }
    const input = { id: this.state.toteQuiz.id }
    Mutate(SERVICE_TYPES.quiz.MUTATION_FLOAT_HOVER, { input }, () => {
      this._getQuiz()
    })
  }
  _handleFloatHover = data => {
    const { navigation } = this.props
    const uri = data.url
    navigation.navigate('WebPage', { uri, hideShareButton: true })
  }

  //查看会员信息
  _getSubscription = () => {
    const { currentCustomerStore } = this.props
    QNetwork(
      SERVICE_TYPES.me.QUERY_ME_SUBSCRIPTION,
      {},
      response => {
        const { me } = response.data
        if (me) {
          currentCustomerStore.updateCurrentCustomerSubscription(me)
          const { subscription, display_cart_entry, first_delivered_tote } = me
          //要先获取会员身份，因为会员变化前可能没有组件的渲染 就没有ref
          currentCustomerStore.displayCartEntry = display_cart_entry
          //刷新用户第一个衣箱是否签收
          currentCustomerStore.firstDeliveredTote = first_delivered_tote
          //会员完成信息填写
          const isDone =
            subscription && subscription.tote_entry_state === 'default'
          if (isDone) {
            this._getData()
          } else {
            this.state.refreshing && this.setState({ refreshing: false })
          }
        }
      },
      () => {
        this.state.refreshing && this.setState({ refreshing: false })
      }
    )
  }

  _onPressShoppingIcon = () => {
    const { guideStore, currentCustomerStore } = this.props
    if (
      currentCustomerStore.displayCartEntry &&
      !guideStore.firstOrderGuideShowed
    ) {
      guideStore.firstOrderGuideShowed = true
    }
  }

  _finishedGetToteAbnormalData = (isHasAbnormal, isNeedPayment) => {
    this.loadingStatus.card = true
    this._isFinishLoading()
    this.setState({ isHasAbnormal, isNeedPayment })
  }
  _finishedGetCurrentTotes = hasOperableTote => {
    this.loadingStatus.current = true
    this._isFinishLoading()
    this.setState({ hasOperableTote })
  }
  _finishedGetPastTotes = () => {
    this.loadingStatus.past = true
    this._isFinishLoading()
  }

  _getData = () => {
    if (this.abnormalCard) {
      this.abnormalCard.wrappedInstance._getToteAbnormalData(
        this._finishedGetToteAbnormalData
      )
    }
    if (this.currentCollections) {
      /* 高阶组件加 wrappedInstance
      this.currentCollections 为什么是高阶组件
      因为 mobx @inject
      */
      this.currentCollections.wrappedInstance._getCurrentTotes(
        this._finishedGetCurrentTotes
      )
    }
    if (this.pastCollections) {
      // 一般组件不加 wrappedInstance
      this.pastCollections._getPastTotes(this._finishedGetPastTotes)
    }
  }

  //信息不全时候 补全信息
  _setInformation = () => {
    const { currentCustomerStore, navigation } = this.props
    const { tote_entry_state } = currentCustomerStore.subscription
    if (tote_entry_state === 'onboarding_question') {
      navigation.navigate('ConfirmName')
    } else if (tote_entry_state === 'normal_question') {
      navigation.navigate('MeStyle')
    }
  }

  _joinMember = id => {
    const { navigation } = this.props
    onClickJoinMember(navigation)
    if (id) {
      navigation.navigate('JoinMember', { ids: [id] })
    } else {
      navigation.navigate('JoinMember')
    }
  }

  _onRefresh = () => {
    if (this.state.refreshing) {
      return
    }
    this.setState({ refreshing: true }, () => {
      this.loadingStatus = { card: false, current: false, past: false }
      this._getSubscription()
    })
  }
  _isFinishLoading = () => {
    let isLoadingItem = Object.values(this.loadingStatus).find(item => {
      return !item
    })
    if (!isLoadingItem) {
      this.setState({ refreshing: false })
    }
  }

  _handleCustomerPhotoReview = () => {
    this.props.navigation.navigate('CustomerPhotosReviewed')
  }

  _returnPreTote = () => {
    this.currentCollections.wrappedInstance._returnPreTote()
  }

  render() {
    const { currentCustomerStore, navigation } = this.props
    const { subscription, unreadCustomerPhotoReview } = currentCustomerStore

    //会员完成信息填写
    const isDone = subscription && subscription.tote_entry_state === 'default'

    // 显示引导
    const hasGuide =
      subscription && subscription.tote_entry_state === 'cart_guide'

    const toteQuiz = this.state.toteQuiz,
      showQuizFloat = toteQuiz && toteQuiz.display_type === 'float'
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          {showQuizFloat && (
            <Float
              didSelectedFloat={this._handleFloatHover}
              data={{ ...toteQuiz, logo: toteQuiz.float_image }}
            />
          )}
          <NavigationBar
            title={'衣箱'}
            hasBottomLine={true}
            rightBarButtonItem={
              <View style={styles.barButtonItemStyle}>
                <ShoppingCarIcon
                  navigation={navigation}
                  onPress={this._onPressShoppingIcon}
                />
              </View>
            }
          />
          {currentCustomerStore.isSubscriber ? (
            <ScrollView
              refreshControl={
                <RefreshControl
                  onRefresh={this._onRefresh}
                  refreshing={this.state.refreshing}
                />
              }
              style={isDone && styles.grayBackground}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              {isDone ? (
                <View>
                  <ToteAbnormalCard
                    ref={ref => (this.abnormalCard = ref)}
                    navigation={navigation}
                    onRefresh={this._getSubscription}
                    finishedRefreshing={this._finishedGetToteAbnormalData}
                    returnPreTote={this._returnPreTote}
                  />
                  <ToteCurrentCollections
                    ref={ref => (this.currentCollections = ref)}
                    navigation={navigation}
                    isHasAbnormal={this.state.isHasAbnormal}
                    finishedRefreshing={this._finishedGetCurrentTotes}
                    showFreeSeverTip={this.showFreeSeverTip}
                    onRefresh={this._getSubscription}
                    extendCancelQuiz={this.state.extendCancelQuiz}
                    visitExtendCancelQuiz={this._visitExtendCancelQuiz}
                  />
                  <TotePastCollections
                    ref={ref => (this.pastCollections = ref)}
                    navigation={navigation}
                    finishedRefreshing={this._finishedGetPastTotes}
                    maxCount={2}
                  />
                </View>
              ) : hasGuide ? (
                <ToteEmpty
                  navigation={navigation}
                  displayCartEntry={currentCustomerStore.displayCartEntry}
                />
              ) : (
                <ToteStyling
                  navigation={navigation}
                  setInformation={this._setInformation}
                />
              )}
            </ScrollView>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              <TotesGuideView
                navigation={navigation}
                customer={currentCustomerStore}
                joinMember={this._joinMember}
              />
            </ScrollView>
          )}
          {unreadCustomerPhotoReview && (
            <CustomerPhotoTrend onClick={this._handleCustomerPhotoReview} />
          )}
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  grayBackground: {
    backgroundColor: '#fafafc'
  },
  barButtonItemStyle: {
    minHeight: 35,
    minWidth: 35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bubble: {
    zIndex: 1000,
    position: 'absolute',
    top: 32,
    right: 15
  }
})

export default Totes
