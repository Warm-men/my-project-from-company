/* @flow */

import React, { Component, PureComponent } from 'react'
import {
  View,
  AsyncStorage,
  Platform,
  Dimensions,
  StyleSheet,
  DeviceEventEmitter,
  Text,
  Animated,
  Easing
} from 'react-native'
import Toaster from '../storybook/stories/toast'
import Udesk from './expand/tool/udesk'
import Alert from '../storybook/stories/alert'
import appsFlyer from 'react-native-appsflyer'
import CopyWriting from './expand/tool/copywriting'
import ProductsOccasion from './request/products_occasion'
import { getSeason } from './request/me/season'

import {
  createStackNavigator,
  createDrawerNavigator,
  createMaterialTopTabNavigator,
  createBottomTabNavigator,
  createAppContainer
} from 'react-navigation'
// eslint-disable-next-line
import CookieManager from 'react-native-cookies'
import {
  AboutUsContainer,
  AccountContainer,
  BindPhoneContainer,
  BrandContainer,
  BrandsContainer,
  BrandsPageContainer,
  BonusContainer,
  CollectionContainer,
  CollectionListContainer,
  ContractContainer,
  CreateMemberContainer,
  CustomerPhotosContainer,
  CustomerPhotoDetailsContainer,
  TheCustomerPhotoContainer,
  CustomerPhotosReviewedContainer,
  RelatedToteProductsContainer,
  TaggingCustomerPhotosContainer,
  CreditAccountContainer,
  CancelFreeServiceContainer,
  DisableContractContainer,
  EditAndAddShippingAddress,
  EditSizeContainer,
  ExpressInformationContainer,
  FeedbackContainer,
  FiltersContainer,
  FreeServiceActiveContainer,
  FreeServiceHelpContainer,
  GuideContainer,
  HomeContainer,
  HelperContainner,
  HiveBoxContainer,
  ModifyNameContainer,
  ModifyProfileContainer,
  MyClosetContainer,
  SwapSatisfiedClosetController,
  SatisfiedClosetController,
  OpenQuestionsContainer,
  OpenFreeServiceContainer,
  OpenFreeServiceSuccessfulContainer,
  PaymentPendingContainer,
  ProductsClothingContainer,
  ProductsAccessoryContainer,
  ProductDetailsContainer,
  ProductDetailsTutorialContainer,
  ProductSizeChartContainer,
  ShippingAddressContainer,
  SwapController,
  SwapOccasionController,
  SwapOnboardingController,
  SwapClosetController,
  TotesContainer,
  TotePastContainer,
  ToteLockContainer,
  ToteReturnContainer,
  TrackingNumberInputContainer,
  UserProfileContainer,
  JoinMemberContainer,
  MeStyleContainer,
  ServiceHoldContainer,
  UnlikeContainer,
  SceneContainer,
  SelectionProductListContainer,
  BasicSizeContainer,
  ToteReturnDetailContainer,
  LikeContainer,
  LookBooksContainer,
  LookbookDetailContainer,
  LookbookThemesContainer,
  CouponContainer,
  RateToteContainer,
  RatingProductSubmitContainer,
  RatingProductCheckContainer,
  RateServiceContainer,
  ReferralContainer,
  RefundingFreeServiceContainer,
  ProductsOccasionContainer,
  MyCustomerPhotosContainer,
  SubmitCustomerPhotoContainer,
  SummerPlanContainer,
  ProductCustomerPhotoListContainer,
  ProductLooksContainer,
  UseCouponContainer,
  ToteBuyClothesContainer,
  JoinMemberListContainer,
  RateToteSwapContainer,
  RedeemInputContainer,
  MeStyleShapeContainer,
  ToteLockSuccessContainer,
  UsePromoCodeContainer,
  IdentityAuthenticationContainer,
  OnboardingContainer,
  CustomizedToteContainer,
  OnboardingToteContainer,
  ConfirmNameContainer,
  TransferMemberContainer,
  ShoppingCarContainer,
  ToteReturnModifyScheduleContainer,
  ToteBuyClothesDetailsContainer,
  NewArrivalHomeDetailContainer,
  ToteFirstContainer,
  ToteRatingDetailsContainer,
  ToteReturnScheduledDoneContainer,
  RatingResultsContainer,
  SatisfiedProductContainer,
  SearchProductContainer,
  SearchInputContainer,
  SearchProductResultContainer,
  StylistContainer,
  StyleAndSizeContainer,
  OnlyStyleContainer,
  CustomerPhotoCenterContainer,
  MemberDressingListContainer,
  PrivilegeContainer
} from './containers'

import SplashScreen from 'react-native-splash-screen'
import { inject, observer } from 'mobx-react'
import { QNetwork, SERVICE_TYPES } from './expand/services/services.js'
import { Client } from './expand/services/client.js'
import { create } from 'mobx-persist'
import AppPanel from './containers/common/app_panel'
import LoginModal from './containers/login'
import CommonWebPage from './containers/common/WebPage'
import ProductsTabbar from './containers/products/products_top_bar'
import Image from '../storybook/stories/image'
import Statistics from './expand/tool/statistics'
import { fetchNewVersion } from './expand/tool/check_version'
import { didFinishLaunching } from './expand/tool/app/status'

const homeSelected = require('../assets/images/tabbar/home_selected.png')
const homeNormal = require('../assets/images/tabbar/home_normal.png')
const productsSelected = require('../assets/images/tabbar/products_selected.png')
const productsNormal = require('../assets/images/tabbar/products_normal.png')
const totesSelected = require('../assets/images/tabbar/totes_selected.png')
const totesNormal = require('../assets/images/tabbar/totes_normal.png')
const closetSelected = require('../assets/images/tabbar/closet_selected.png')
const closetNormal = require('../assets/images/tabbar/closet_normal.png')
const mineSelected = require('../assets/images/tabbar/mine_selected.png')
const mineNormal = require('../assets/images/tabbar/mine_normal.png')

const ProductsController = createMaterialTopTabNavigator(
  {
    Clothing: { screen: ProductsClothingContainer },
    Accessory: { screen: ProductsAccessoryContainer },
    Brands: { screen: BrandsContainer }
  },
  {
    tabBarComponent: ProductsTabbar,
    tabBarPosition: 'top',
    lazy: true,
    animationEnabled: true,
    swipeEnabled: true,
    tabBarOptions: {
      showIcon: false,
      activeTintColor: '#000',
      inactiveTintColor: '#bbb',
      labelStyle: {
        fontSize: 12
      },
      style: {
        backgroundColor: 'white'
      }
    }
  }
)
const ClosetContainer = createStackNavigator(
  {
    MyCloset: MyClosetContainer
  },
  {
    headerMode: 'none',
    defaultNavigationOptions: {
      header: null,
      gesturesEnabled: true,
      gestureResponseDistance: {
        horizontal: 50,
        vertical: 135
      }
    }
  }
)

const TabController = createBottomTabNavigator(
  {
    Home: {
      screen: HomeContainer,
      navigationOptions: () => TabOptions('首页', homeNormal, homeSelected)
    },
    Products: {
      screen: ProductsController,
      //新版双层嵌套createBottomTabNavigator不能把Icon写到里面
      navigationOptions: () =>
        TabOptions('选衣', productsNormal, productsSelected)
    },
    Totes: {
      screen: TotesContainer,
      path: 'Totes',
      navigationOptions: () => TabOptions('衣箱', totesNormal, totesSelected)
    },
    Closet: {
      screen: ClosetContainer,
      navigationOptions: () => TabOptions('愿望', closetNormal, closetSelected)
    },
    Account: {
      screen: AccountContainer,
      navigationOptions: () => TabOptions('我的', mineNormal, mineSelected)
    }
  },
  {
    lazy: true,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      showIcon: true,
      activeTintColor: '#000',
      inactiveTintColor: '#bbb',
      labelStyle: {
        fontSize: 12
      },
      style: {
        backgroundColor: 'white'
      },

      bottomNavigationOptions: {
        labelColor: 'black',
        rippleColor: 'white',
        tabs: {
          Home: {
            barBackgroundColor: 'white'
          },
          Account: {
            barBackgroundColor: 'white'
          }
        }
      }
    }
  }
)

const TabOptions = (tabBarTitle, normalImage, selectedImage) => {
  const tabBarLabel = ({ focused }) => {
    return (
      <Text style={[styles.tabBarLabel, { color: focused ? '#000' : '#bbb' }]}>
        {tabBarTitle}
      </Text>
    )
  }
  const tabBarIcon = ({ focused }) => {
    return (
      <Image
        source={focused ? selectedImage : normalImage}
        description={tabBarTitle + '图标'}
      />
    )
  }
  return { tabBarLabel, tabBarIcon }
}

TabController.navigationOptions = ({ navigation }) => {
  let drawerLockMode = 'locked-closed'
  let activeRoute = navigation.state.routes[navigation.state.index]
  if (activeRoute.routes && activeRoute.index > 0) {
    drawerLockMode = 'locked-closed'
  }
  return {
    drawerLockMode
  }
}

const width = Dimensions.get('window').width * 0.8

const DrawerController = createDrawerNavigator(
  {
    TabController: {
      screen: TabController
    }
  },
  {
    drawerWidth: width,
    drawerPosition: 'right',
    navigationOptions: {
      drawerLockMode: 'locked-closed'
    },
    contentComponent: props => {
      return (
        <FiltersContainer navigation={props.navigation} name={'products'} />
      )
    }
  }
)

const OccationDrawerController = createDrawerNavigator(
  {
    ProductsOccasion: {
      screen: ProductsOccasionContainer
    }
  },
  {
    drawerWidth: width,
    drawerPosition: 'right',
    navigationOptions: {
      drawerLockMode: 'locked-closed'
    },
    contentComponent: props => {
      return (
        <FiltersContainer navigation={props.navigation} name={'occasion'} />
      )
    }
  }
)

OccationDrawerController.navigationOptions = ({ navigation }) => {
  let drawerLockMode = 'locked-closed'
  let activeRoute = navigation.state.routes[navigation.state.index]
  if (activeRoute.routes && activeRoute.index > 0) {
    drawerLockMode = 'locked-closed'
  }
  return {
    drawerLockMode
  }
}

const UnAuthenticatedContainer = createStackNavigator(
  {
    Guide: {
      screen: GuideContainer
    }
  },
  {
    headerMode: 'none',
    defaultNavigationOptions: {
      header: null,
      gesturesEnabled: true,
      gestureResponseDistance: {
        horizontal: 50,
        vertical: 135
      }
    }
  }
)

const AuthenticatedContainer = createStackNavigator(
  {
    Root: {
      screen: DrawerController,
      path: 'Root'
    },
    BindPhone: {
      screen: BindPhoneContainer,
      navigationOptions: { header: null, gesturesEnabled: false }
    },
    AboutUs: {
      screen: AboutUsContainer,
      path: 'AboutUs'
    },
    Brand: {
      screen: BrandContainer
    },
    BrandsPage: {
      screen: BrandsPageContainer
    },
    Bonus: {
      screen: BonusContainer
    },
    Collection: {
      screen: CollectionContainer
    },
    CollectionList: {
      screen: CollectionListContainer
    },
    CustomizedTote: {
      screen: CustomizedToteContainer
    },
    CreditAccount: {
      screen: CreditAccountContainer
    },
    CancelFreeService: {
      screen: CancelFreeServiceContainer
    },
    ToteFirst: {
      screen: ToteFirstContainer,
      navigationOptions: { header: null, gesturesEnabled: false }
    },
    ToteRatingDetails: {
      screen: ToteRatingDetailsContainer
    },
    ToteReturnScheduledDone: {
      screen: ToteReturnScheduledDoneContainer,
      navigationOptions: { header: null, gesturesEnabled: false }
    },
    NewArrivalCollection: {
      screen: CollectionContainer
    },
    RecentHotCollection: {
      screen: CollectionContainer
    },
    OccasionCollection: {
      screen: CollectionContainer
    },
    Contract: {
      screen: ContractContainer
    },
    CreateMember: {
      screen: CreateMemberContainer,
      navigationOptions: { header: null, gesturesEnabled: false }
    },
    CreditAccount: {
      screen: CreditAccountContainer
    },
    CustomerPhotoList: {
      screen: CustomerPhotosContainer
    },
    CustomerPhotoCenter: {
      screen: CustomerPhotoCenterContainer
    },
    SwapSatisfiedClosetController: {
      screen: SwapSatisfiedClosetController
    },
    SatisfiedClosetController: {
      screen: SatisfiedClosetController
    },
    CustomerPhotoDetails: {
      screen: CustomerPhotoDetailsContainer
    },
    MemberDressingList: {
      screen: MemberDressingListContainer
    },
    CustomerPhotosReviewed: {
      screen: CustomerPhotosReviewedContainer
    },
    CustomerPhotoFinished: {
      screen: TheCustomerPhotoContainer
    },
    ProductCustomerPhoto: {
      screen: TheCustomerPhotoContainer
    },
    ProductLooks: {
      screen: ProductLooksContainer
    },
    RelatedToteProducts: {
      screen: RelatedToteProductsContainer
    },
    TaggingCustomerPhotos: {
      screen: TaggingCustomerPhotosContainer,
      navigationOptions: { header: null, gesturesEnabled: false }
    },
    Details: {
      screen: ProductDetailsContainer
    },
    DetailsTutorial: {
      screen: ProductDetailsTutorialContainer
    },
    DisableContract: {
      screen: DisableContractContainer
    },
    EditAndAddShippingAddress: {
      screen: EditAndAddShippingAddress
    },
    EditSize: {
      screen: EditSizeContainer
    },
    ExpressInformation: {
      screen: ExpressInformationContainer
    },
    Feedback: {
      screen: FeedbackContainer
    },
    Helper: {
      screen: HelperContainner
    },
    ModifyName: {
      screen: ModifyNameContainer
    },
    ModifyProfile: {
      screen: ModifyProfileContainer
    },
    OpenQuestions: {
      screen: OpenQuestionsContainer
    },
    OpenFreeService: {
      screen: OpenFreeServiceContainer
    },
    OpenFreeServiceSuccessful: {
      screen: OpenFreeServiceSuccessfulContainer
    },
    FreeServiceActive: {
      screen: FreeServiceActiveContainer
    },
    FreeServiceHelp: {
      screen: FreeServiceHelpContainer
    },
    PaymentPending: {
      screen: PaymentPendingContainer,
      path: 'PaymentPending'
    },
    SelectionProducts: {
      screen: SelectionProductListContainer
    },
    ShippingAddress: {
      screen: ShippingAddressContainer
    },
    StyleAndSize: {
      screen: StyleAndSizeContainer
    },
    OnlyStyle: {
      screen: OnlyStyleContainer
    },
    SizeChart: {
      screen: ProductSizeChartContainer
    },
    SwapController: {
      screen: SwapController
    },
    SwapOccasionController: {
      screen: SwapOccasionController
    },
    SwapClosetController: {
      screen: SwapClosetController
    },
    SwapOnboardingController: {
      screen: SwapOnboardingController
    },
    TotePast: {
      screen: TotePastContainer
    },
    ToteReturnDetail: {
      screen: ToteReturnDetailContainer
    },
    ToteLock: {
      screen: ToteLockContainer
    },
    ToteLockSuccess: {
      screen: ToteLockSuccessContainer,
      navigationOptions: { header: null, gesturesEnabled: false }
    },
    ToteReturn: {
      screen: ToteReturnContainer,
      navigationOptions: { header: null, gesturesEnabled: false }
    },
    TransferMember: {
      screen: TransferMemberContainer
    },
    UserProfile: {
      screen: UserProfileContainer
    },
    WebPage: {
      screen: CommonWebPage
    },
    JoinMember: {
      screen: JoinMemberContainer,
      path: 'JoinMember'
    },
    MeStyle: {
      screen: MeStyleContainer,
      navigationOptions: { header: null, gesturesEnabled: false }
    },
    ServiceHold: {
      screen: ServiceHoldContainer
    },
    Unlike: {
      screen: UnlikeContainer
    },
    LookBooks: {
      screen: LookBooksContainer
    },
    LookbookDetail: {
      screen: LookbookDetailContainer
    },
    LookbookThemes: {
      screen: LookbookThemesContainer
    },
    Scene: {
      screen: SceneContainer
    },
    BasicSize: {
      screen: BasicSizeContainer
    },
    Like: {
      screen: LikeContainer
    },
    Coupon: {
      screen: CouponContainer
    },
    RateTote: {
      screen: RateToteContainer
    },
    RatingProductSubmit: {
      screen: RatingProductSubmitContainer
    },
    RatingProductCheck: {
      screen: RatingProductCheckContainer
    },
    RateService: {
      screen: RateServiceContainer,
      navigationOptions: { header: null, gesturesEnabled: false }
    },
    Referral: {
      screen: ReferralContainer
    },
    RefundingFreeService: {
      screen: RefundingFreeServiceContainer
    },
    IdentityAuthentication: {
      screen: IdentityAuthenticationContainer
    },
    ClothingOccasion: {
      screen: OccationDrawerController
    },
    AccessoryOccasion: {
      screen: OccationDrawerController
    },
    MyCustomerPhotos: {
      screen: MyCustomerPhotosContainer
    },

    SubmitCustomerPhoto: {
      screen: SubmitCustomerPhotoContainer,
      navigationOptions: { header: null, gesturesEnabled: false }
    },
    Stylist: {
      screen: StylistContainer,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    SummerPlan: {
      screen: SummerPlanContainer
    },
    ShoppingCar: {
      screen: ShoppingCarContainer
    },
    SearchProduct: {
      screen: SearchProductContainer
    },
    SearchInput: {
      screen: SearchInputContainer
    },
    SearchProductResult: {
      screen: SearchProductResultContainer
    },
    ToteBuyClothes: {
      screen: ToteBuyClothesContainer,
      navigationOptions: { header: null, gesturesEnabled: false }
    },
    ToteBuyClothesDetails: {
      screen: ToteBuyClothesDetailsContainer
    },
    ProductCustomerPhotoList: {
      screen: ProductCustomerPhotoListContainer
    },
    UseCoupon: {
      screen: UseCouponContainer
    },
    UsePromoCode: {
      screen: UsePromoCodeContainer
    },
    JoinMemberList: {
      screen: JoinMemberListContainer
    },
    RateToteSwap: {
      screen: RateToteSwapContainer,
      navigationOptions: { header: null, gesturesEnabled: false }
    },
    RatingResults: {
      screen: RatingResultsContainer,
      navigationOptions: { header: null, gesturesEnabled: false }
    },
    SatisfiedProduct: {
      screen: SatisfiedProductContainer,
      navigationOptions: { header: null, gesturesEnabled: false }
    },
    RedeemInput: {
      screen: RedeemInputContainer
    },
    MeStyleShape: {
      screen: MeStyleShapeContainer
    },
    HiveBox: {
      screen: HiveBoxContainer
    },
    TrackingNumberInput: {
      screen: TrackingNumberInputContainer
    },
    Onboarding: {
      screen: OnboardingContainer,
      navigationOptions: { header: null, gesturesEnabled: false }
    },
    OnboardingTote: {
      screen: OnboardingToteContainer,
      navigationOptions: { header: null, gesturesEnabled: false }
    },
    ConfirmName: {
      screen: ConfirmNameContainer,
      navigationOptions: { header: null, gesturesEnabled: false }
    },
    ToteReturnModifySchedule: {
      screen: ToteReturnModifyScheduleContainer
    },
    NewArrivalHomeDetail: {
      screen: NewArrivalHomeDetailContainer
    },
    Privilege: {
      screen: PrivilegeContainer
    }
  },
  {
    headerMode: 'none',
    cardStyle: { backgroundColor: 'white' },
    defaultNavigationOptions: {
      header: null,
      gesturesEnabled: true,
      gestureResponseDistance: { horizontal: 50, vertical: 135 }
    },
    transitionConfig: sceneProps => ({
      transitionSpec:
        sceneProps.scene.route.routeName === 'SearchProductResult'
          ? {
              duration: 0,
              timing: Animated.timing,
              easing: Easing.step0
            }
          : {}
    })
  }
)

const UnAuthenticatedAppContainer = createAppContainer(UnAuthenticatedContainer)
const AuthenticatedAppContainer = createAppContainer(AuthenticatedContainer)
@inject(
  'currentCustomerStore',
  'closetStore',
  'totesStore',
  'appStore',
  'subscriptionStore',
  'ordersStore',
  'couponStore',
  'toteCartStore',
  'filtersTermsStore'
)
@observer
class AppNavigator extends Component {
  constructor(props) {
    super(props)
    this.state = { isFinishHydrate: false, isFinishCheckCookies: false }
    this.rehydrate()
  }
  initUdeskManager = () => {
    const { currentCustomerStore, appStore } = this.props
    let customer = {}
    if (currentCustomerStore.id) {
      customer.nickname = currentCustomerStore.nickname
      customer.id = currentCustomerStore.id
    } else {
      customer.nick_name = ''
      customer.id = appStore.getGUID()
    }
    Udesk.initUdeskManager(customer)
  }

  rehydrate = async () => {
    const { currentCustomerStore, totesStore } = this.props
    const hydrate = create({ storage: AsyncStorage })
    try {
      const store = await hydrate(
        'currentCustomer',
        currentCustomerStore
      ).rehydrate()
      Statistics.setSuperProperties()
      if (store.id) {
        appsFlyer.setCustomerUserId(store.id, () => {})
        if (Platform.OS === 'ios') {
          CookieManager.getAll().then(result => {
            this.checkSession(store, result)
          })
        } else {
          CookieManager.get(Client.ORIGIN).then(result => {
            this.checkSession(store, result)
          })
        }
      } else {
        this.getProductSearchSections()
        this.setState({ isFinishCheckCookies: true })
      }
      hydrate('totes', totesStore).rehydrate()
    } catch (e) {
      console.error(e)
    }
  }

  checkSession = (store, result) => {
    const { _letote_session } = result
    if (!_letote_session) {
      store.setCookie(
        () => {
          this.getProductSearchSections()
          this.getCurrentCustomer()
          this.setState({ isFinishCheckCookies: true })
        },
        () => {
          this.getProductSearchSections()
          this.setState({ isFinishCheckCookies: true })
          store.signOut()
        }
      )
    } else {
      this.getProductSearchSections()
      this.setState({ isFinishCheckCookies: true })
      this.getCurrentCustomer()
    }
  }

  componentDidMount() {
    const { appStore } = this.props
    fetchNewVersion()
    const hydrate = create({ storage: AsyncStorage })
    hydrate('app', appStore)
      .rehydrate()
      .then(store => {
        if (!store.isInstall) {
          Statistics.onEvent({ id: 'app_install', label: 'app激活' })
          appStore.isInstall = true
        }
        if (store.isGuided) {
          Statistics.onPageStart('Home')
          didFinishLaunching(() => {
            this.setState({ isFinishHydrate: true }, () => SplashScreen.hide())
          })
        } else {
          Statistics.onPageStart('Guide')
          this.setState({ isFinishHydrate: true }, () => SplashScreen.hide())
        }
        this.initUdeskManager()
      })
  }

  getCurrentCustomer = () => {
    const {
      toteCartStore,
      currentCustomerStore,
      closetStore,
      totesStore,
      couponStore
    } = this.props
    QNetwork(SERVICE_TYPES.me.QUERY_ME, {}, response => {
      const { me } = response.data
      if (me) {
        const { canViewNewestProducts } = currentCustomerStore
        let refreshHomeList = false
        if (me.can_view_newest_products !== canViewNewestProducts) {
          refreshHomeList = true
        }
        this.getOrders()
        currentCustomerStore.updateCurrentCustomer(me)
        closetStore.updateClosetIds(me.closet)
        toteCartStore.updateToteCart(me.tote_cart)

        //更新加衣券和优惠券
        couponStore.updateValidCoupons(me)
        totesStore.latest_rental_tote = response.data.latest_rental_tote
        refreshHomeList && DeviceEventEmitter.emit('refreshHomeList')
        getSeason()
      } else {
        currentCustomerStore.signOut()
      }
    })
  }

  getOrders = () => {
    QNetwork(SERVICE_TYPES.orders.QUERY_ORDERS, {}, response => {
      this.props.ordersStore.orders = response.data.orders
        ? [...response.data.orders]
        : []
    })
  }

  getProductSearchSections = () => {
    QNetwork(
      SERVICE_TYPES.products.QUERY_PRODUCT_SEARCH_SECTIONS,
      {},
      response => {
        const { product_search_context } = response.data
        const { filtersTermsStore } = this.props

        if (product_search_context) {
          filtersTermsStore.updateFilterTerms(
            product_search_context.product_search_sections
          )
        }
      }
    )
    CopyWriting.updateCopyWritingData()
    ProductsOccasion.queryClothingOccasionBanner('clothing_list_top')
    ProductsOccasion.queryClothingOccasionBanner('accessory_list_top')
  }

  _cleanToast = () => {
    const { appStore } = this.props
    appStore.toastMessage = null
  }

  render() {
    const { appStore, currentCustomerStore } = this.props
    const { onNavigationStateChange } = this.props
    const prefix = Platform.OS == 'android' ? 'letote://letote/' : 'letote://'
    return this.state.isFinishHydrate && this.state.isFinishCheckCookies ? (
      <View style={{ flex: 1 }}>
        {appStore.isGuided ? (
          <AuthenticatedAppContainer
            uriPrefix={prefix}
            onNavigationStateChange={onNavigationStateChange}
          />
        ) : (
          <UnAuthenticatedAppContainer
            onNavigationStateChange={onNavigationStateChange}
          />
        )}
        {!currentCustomerStore.id && <LoginModal />}
        <Toaster
          message={appStore.toastMessage}
          cleanToast={this._cleanToast}
        />
        <Alert />
        <AppPanel />
      </View>
    ) : (
      <LaunchScreen />
    )
  }
}

class LaunchScreen extends PureComponent {
  render() {
    return (
      <View style={styles.launchScreen}>
        <Image
          style={styles.launchScreenImage}
          source={require('../assets/images/logo/launch_screen.png')}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 1.5,
    backgroundColor: 'transparent'
  },
  launchScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  launchScreenImage: { backgroundColor: 'black', height: '100%', width: '100%' }
})
export default AppNavigator
