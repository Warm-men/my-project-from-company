import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Text,
  Dimensions,
  Animated,
  Platform
} from 'react-native'
import {
  ReferralSign,
  ReferralList,
  ReferralPurchaseCredit
} from '../../../storybook/stories/referral'
import Icons from 'react-native-vector-icons/Ionicons'
import p2d from '../../expand/tool/p2d'
import { inject, observer } from 'mobx-react'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services'
import { allowToStartLoad } from '../../../src/expand/tool/url_filter'
import SharePanel from '../common/SharePanel'
import Statistics from '../../expand/tool/statistics'
import ReferralBanner from '../../../storybook/stories/account/referral_banner'
import { REFERRAL } from '../../expand/tool/referral'
import {
  NavigationBar,
  BarButtonItem
} from '../../../storybook/stories/navigationbar/index'
import { onClickJoinMember } from '../../expand/tool/plans/join_member'

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView)

@inject('currentCustomerStore', 'panelStore')
@observer
export default class ReferralContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      referrals: [],
      purchaseCredit: null, //总数
      spentPurchaseCredit: null, //已使用
      availablePurchaseCredit: null, //可使用
      number: null,
      ruleModalVisible: false,
      url: null,
      successReferrals: [],
      navigationBarOpacity: 0,
      scrollEventThrottle: 1
    }
    this.scrollY = new Animated.Value(0)
    this.animatedViewHeight = (p2d(200) * deviceWidth) / 750
  }
  // panel
  _share = () => {
    const { panelStore, currentCustomerStore, navigation } = this.props
    const { isSubscriber, subscription, nickname } = currentCustomerStore
    const isAllowedToInvite =
      isSubscriber &&
      subscription &&
      subscription.promo_code !== 'LTCN_FREE_TOTE' &&
      subscription.promo_code !== 'LTCN_FREE_TOTE_79'
    if (isAllowedToInvite) {
      Statistics.onEvent({ id: 'referral_click', label: '邀请好友_点击邀请' })

      const title = (nickname ? nickname : '') + '送你一个超超超大衣橱！'
      const description = '立即领取TA送你的专属优惠，来自美国的时装共享平台'
      panelStore.show(
        <SharePanel
          utm={this.utm}
          url={this.state.url}
          title={title}
          description={description}
          route={'Account'}
        />
      )
    } else {
      onClickJoinMember(navigation)
      navigation.navigate('JoinMember')
    }
  }
  openRuleModal = () => {
    this.setState({ ruleModalVisible: true })
  }
  closeRuleModal = () => {
    this.setState({ ruleModalVisible: false })
  }

  componentDidMount() {
    this.getAvailablePurchaseCredit()
    this.getReferrals()
    this.getReferralBanner()
    this.getSuccessReferral()
    this._addObservers()
    Statistics.onEvent({ id: 'referral_intent', label: '邀请好友_打开页面' })
  }
  _goBack = () => {
    this.props.navigation.goBack()
  }
  //获取奖励金
  getAvailablePurchaseCredit = () => {
    QNetwork(SERVICE_TYPES.me.QUERY_ME_PURCHASE_CREDIT, {}, response => {
      const { me } = response.data
      let spentPurchaseCredit = me.spent_purchase_credit.amount
      let expiredPurchaseCredit = me.expired_purchase_credit.amount
      let availablePurchaseCredit = me.available_purchase_credit.amount
      let purchaseCredit =
        spentPurchaseCredit + expiredPurchaseCredit + availablePurchaseCredit
      this.setState({
        purchaseCredit,
        spentPurchaseCredit,
        availablePurchaseCredit
      })
    })
  }
  //获取邀请信息
  getReferrals = () => {
    const { currentCustomerStore, navigation } = this.props
    QNetwork(SERVICE_TYPES.me.QUERY_ME_REFERRALS, {}, response => {
      const {
        referral_url,
        referrals,
        active_referral_program
      } = response.data.me

      currentCustomerStore.referralUrl = referral_url

      if (active_referral_program) {
        currentCustomerStore.referralSenderAmount =
          active_referral_program.sender_amount
      }
      this.setState({ referrals })
    })
    const { params } = navigation.state
    const fromToteLockSuccess = params && params.fromToteLockSuccess
    this.utm = fromToteLockSuccess ? REFERRAL.UTM_ACTIVITY : REFERRAL.UTM_MY
    this.setState({ url: REFERRAL.URL })
  }

  getReferralBanner = () => {
    const { currentCustomerStore } = this.props
    QNetwork(SERVICE_TYPES.me.QUERY_ME_REFERRAL_BANNER, {}, response => {
      const { me } = response.data
      currentCustomerStore.referralBanner = me.referral_banner
    })
  }

  getSuccessReferral = () => {
    QNetwork(SERVICE_TYPES.me.QUERY_SUCCESS_REFERRAL, {}, response => {
      this.setState({ successReferrals: response.data.success_referrals })
    })
  }

  openWebView = () => {
    const { navigation, currentCustomerStore } = this.props
    const { referralBanner } = currentCustomerStore
    if (referralBanner.referral_program_jump_url) {
      const url = referralBanner.referral_program_jump_url
      const useWebView = allowToStartLoad(url, navigation)
      if (useWebView) {
        const isHttpUrl =
          url && (url.startsWith('http://') || url.startsWith('https://'))
        if (isHttpUrl) {
          navigation.navigate('WebPage', { uri: url })
        }
      }
    }
  }

  _addObservers = () => {
    this.scrollY.addListener(({ value }) => {
      const hiddenContentOffsetY = (this.animatedViewHeight * 3) / 4
      if (
        value > this.animatedViewHeight &&
        this.state.navigationBarOpacity !== 1
      ) {
        this.setState({ navigationBarOpacity: 1, scrollEventThrottle: 16 })
      } else if (
        value <= this.animatedViewHeight &&
        value >= hiddenContentOffsetY
      ) {
        this.setState({
          scrollEventThrottle: 16,
          navigationBarOpacity:
            (value - hiddenContentOffsetY) /
            (this.animatedViewHeight - hiddenContentOffsetY)
        })
      } else if (
        value < hiddenContentOffsetY &&
        this.state.navigationBarOpacity !== 0
      ) {
        this.setState({ navigationBarOpacity: 0, scrollEventThrottle: 1 })
      }
    })
  }

  render() {
    const {
      isSubscriber,
      subscription,
      referralBanner,
      referralSenderAmount
    } = this.props.currentCustomerStore
    const isAllowedToInvite =
      isSubscriber &&
      subscription &&
      subscription.promo_code !== 'LTCN_FREE_TOTE' &&
      subscription.promo_code !== 'LTCN_FREE_TOTE_79'

    const bannerwidth = Dimensions.get('window').width
    const disabled =
      referralBanner && !!!referralBanner.referral_program_banner_url

    const senderAmount = referralSenderAmount ? referralSenderAmount : ''
    return (
      <View style={{ flex: 1 }}>
        <NavigationBar
          isAnimated={true}
          style={[
            styles.navigationBar,
            {
              paddingTop:
                Platform.OS === 'ios' ? (deviceHeight >= 812 ? 30 : 20) : 0,
              height:
                Platform.OS === 'ios' ? (deviceHeight >= 812 ? 84 : 64) : 44,
              backgroundColor: `rgba(255, 255, 255, ${
                this.state.navigationBarOpacity
              })`
            }
          ]}
          titleView={
            <View
              style={[
                styles.titleView,
                { opacity: this.state.navigationBarOpacity }
              ]}>
              <Text numberOfLines={1} style={styles.titleText}>
                {'邀请好友有礼'}
              </Text>
            </View>
          }
        />
        <BarButtonItem
          onPress={this._goBack}
          buttonType={'back'}
          style={styles.backIcon}
        />
        <AnimatedScrollView
          scrollEventThrottle={this.state.scrollEventThrottle}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          alwaysBounceVertical={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
            {
              useNativeDriver: true,
              isInteraction: false
            }
          )}>
          <View style={styles.container}>
            <View
              style={{
                width: bannerwidth,
                height:
                  (referralBanner.referral_banner_height /
                    referralBanner.referral_banner_width) *
                  bannerwidth
              }}>
              <ReferralBanner
                referralBanner={referralBanner}
                onPress={this.openWebView}
                column={'referral'}
                disabled={disabled}
              />
            </View>
            <ReferralSign
              url={this.state.url}
              isAllowedToInvite={isAllowedToInvite}
              share={this._share}
              senderAmount={senderAmount}
              successReferrals={this.state.successReferrals}
              openRuleModal={this.openRuleModal}
            />
            {isAllowedToInvite ? (
              <View>
                <ReferralPurchaseCredit
                  purchaseCredit={this.state.purchaseCredit}
                  availablePurchaseCredit={this.state.availablePurchaseCredit}
                  spentPurchaseCredit={this.state.spentPurchaseCredit}
                  referrals={this.state.referrals}
                />
                {this.state.referrals.length > 0 ? (
                  <ReferralList referrals={this.state.referrals} />
                ) : null}
              </View>
            ) : null}
          </View>
        </AnimatedScrollView>
        {/* 详细规则 */}
        <Modal
          animationType={'none'}
          transparent={true}
          visible={this.state.ruleModalVisible}
          onRequestClose={this.closeRuleModal}>
          <View style={styles.ruleModal}>
            <View style={styles.ruleView}>
              <Text style={styles.ruleTitle}>活动规则</Text>
              <Text style={styles.ruleMessage}>
                1、好友通过你的邀请链接，可用¥
                {senderAmount}
                奖励金优惠成为托特衣箱会员；
                {'\n'}
                {'\n'}
                2、好友加入会员7天后，你可获得¥{senderAmount}
                奖励金，成功邀请越多，获得奖励越多；
                {'\n'}
                {'\n'}
                3、奖励金从获得之日起一年内有效，可用于续费或购买服饰，并可累计使用；
                {'\n'}
                {'\n'}
                4、请勿恶意刷奖励金，如发现违规行为，我们有权取消因此获得的奖励金。
                {'\n'}
                {'\n'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={this.closeRuleModal}
              style={styles.closeRuleModal}>
              <Icons
                name={'ios-close-circle-outline'}
                size={40}
                color={'#fff'}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  navigationBar: {
    position: 'absolute',
    borderBottomWidth: 0,
    zIndex: 1
  },
  titleView: {
    alignItems: 'center'
  },
  titleText: {
    fontSize: 16
  },
  backIcon: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? (deviceHeight >= 812 ? 34 : 20) : 0,
    zIndex: 10
  },
  ruleView: {
    width: p2d(310),
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 20
  },
  ruleTitle: {
    marginTop: 20,
    marginBottom: 12,
    fontSize: 18,
    color: '#333',
    fontWeight: '600'
  },
  ruleMessage: {
    color: '#666',
    fontSize: 14,
    lineHeight: 22
  },
  ruleModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeRuleModal: {
    width: '100%',
    height: 100,
    alignItems: 'center'
  }
})
