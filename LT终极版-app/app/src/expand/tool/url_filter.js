import React from 'react'
import { SERVICE_TYPES, Mutate } from '../services/services'
import { Column } from './add_to_closet_status'
import Stores from '../../stores/stores'
import OccasionBanner from '../../../storybook/stories/alert/occasion_banner'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'
import { onClickJoinMember } from './plans/join_member'

const FILTER_DATA = [
  { slug: 'Account', keyword: 'letote.cn/account' }, //我的页面
  { slug: 'Brand', keyword: '/brands' }, //品牌详情页
  { slug: 'Collection', keyword: '/collections' }, //专题详情页
  { slug: 'Contract', keyword: 'letote.cn/free_password' }, //免密签约页
  { slug: 'FAQ', keyword: 'letote.cn/faq' }, //常见问题页
  { slug: 'JoinMember', keyword: 'letote.cn/plans' }, //订阅会员页
  { slug: 'JoinMemberList', keyword: 'letote.cn/mplans' }, //occation会员订阅页
  { slug: 'JoinMemberPromo', keyword: 'letote.cn/plans_promo' }, //订阅会员页
  { slug: 'MyCustomerPhotos', keyword: '/share_list' }, //晒单详情页
  { slug: 'Product', keyword: 'letote.cn/products' }, //商品详情页
  { slug: 'RateService', keyword: './rate_service' }, //商品投诉页
  { slug: 'Referral', keyword: 'letote.cn/referral' }, //referral页
  { slug: 'StyleAndSize', keyword: '/style_profile/figure_input' }, //尺码编辑页
  { slug: 'TransferMember', keyword: '/migration_details' }, //会员迁移页

  { slug: 'RemindPromo', keyword: '/remind_promo' }, //领取优惠券
  { slug: 'SavePromo', keyword: 'letote.cn/promo/newyear_activity' } //领取优惠券
]

const injectFilterInterceptArray = () => {
  const array = []
  FILTER_DATA.forEach(item => {
    array.push(item.keyword)
  })
  return array
}

const filterWeChatRedirect = url => {
  const key = 'mp.weixinbridge.com/mp/wapredirect?'
  const bool = url.indexOf(key) !== -1
  if (bool) {
    const urlPramaseObj = parseQueryString(url)
    if (urlPramaseObj.url) {
      const str = decodeURIComponent(urlPramaseObj.url)
      if (str) return str
    }
    return url
  } else {
    return url
  }
}

const allowToStartLoad = (link, navigation, useReplace = false) => {
  const url = filterWeChatRedirect(link)
  const data = FILTER_DATA.find(item => {
    return url.indexOf(item.keyword) !== -1
  })
  if (data) {
    doSomething(url, data, navigation, useReplace)
  }
  return !data
}

const doSomething = (url, data, navigation, useReplace) => {
  if (!data) return
  const { slug, keyword } = data

  const navigatorAction = useReplace ? navigation.replace : navigation.navigate

  const { currentCustomerStore } = Stores
  const isWebView = navigation.state.routeName === 'WebPage'

  switch (slug) {
    case 'Account':
      navigatorAction('Account')
      break

    case 'Brand':
      {
        const id = getVariablesInUrl(keyword, url)
        navigatorAction('Brand', { brandId: id })
      }
      break

    case 'Collection':
      {
        const id = getVariablesInUrl(keyword, url)
        const urlPramaseObj = parseQueryString(url)

        if (id) {
          const variables = { collection: { id } }
          if (urlPramaseObj.btn && urlPramaseObj.url) {
            variables.displayButton = {
              title: decodeURI(urlPramaseObj.btn),
              url: urlPramaseObj.url,
              occasion: urlPramaseObj.occasion
            }
          }
          navigatorAction('Collection', { ...variables, type: 'collection' })
        }
      }
      break

    case 'Contract':
      navigatorAction('Contract')
      break

    case 'Helper':
      navigatorAction('Helper')
      break

    case 'JoinMember':
      {
        onClickJoinMember(navigation, isWebView)
        const urlPramaseObj = parseQueryString(url)
        let variables
        if (urlPramaseObj.id) {
          variables = { id: urlPramaseObj.id }
        }
        checkLoginStatus(useReplace, navigation, 'JoinMember', variables)
      }
      break

    case 'JoinMemberList':
      {
        const urlPramaseObj = parseQueryString(url)
        const variables = { occasion_filter: urlPramaseObj.occasion }
        checkLoginStatus(useReplace, navigation, 'JoinMemberList', variables)
      }
      break

    case 'JoinMemberPromo':
      checkLoginStatus(useReplace, navigation, 'JoinMember')
      break

    case 'MyCustomerPhotos':
      {
        const { toteId } = navigation.state.params
        checkLoginStatus(useReplace, navigation, 'MyCustomerPhotos', { toteId })
      }

      break
    case 'Product':
      {
        const id = getVariablesInUrl(keyword, url)
        item = {
          id,
          category: { accessory: false },
          catalogue_photos: [{ full_url: 'url' }]
        }
        const column = Column.Link
        navigatorAction('Details', { item, column })
      }
      break

    case 'RateService':
      {
        QNetwork(
          SERVICE_TYPES.totes.QUERY_TOTES,
          { filter: 'current' },
          response => {
            const tote = response.data.totes[0]
            checkLoginStatus(useReplace, navigation, 'RateService', { tote })
          }
        )
      }
      break

    case 'Referral':
      {
        let params
        if (url.indexOf('fromToteLockSuccess')) {
          params = { fromToteLockSuccess: true }
        }
        checkLoginStatus(useReplace, navigation, 'Referral', params)
      }
      break

    case 'StyleAndSize':
      navigatorAction('StyleAndSize')
      break

    case 'TransferMember':
      checkLoginStatus(useReplace, navigation, 'TransferMember')
      break

    case 'RemindPromo':
      {
        Stores.popupsStore.isPopupLoading = true
        if (!currentCustomerStore.id) {
          currentCustomerStore.setLoginModalVisible(true, () => {
            const hasPromoCodes =
              Stores.couponStore.validPromoCodes &&
              Stores.couponStore.validPromoCodes.length
            if (!currentCustomerStore.telephone) {
              navigatorAction('BindPhone', {
                variables: { url, navigation },
                loginModalAction: !hasPromoCodes && savePromoCodeToWallet,
                isLogin: true
              })
            } else {
              !hasPromoCodes && savePromoCodeToWallet({ url, navigation })
            }
          })
        } else {
          savePromoCodeToWallet({ url, navigation })
        }
      }
      break

    case 'SavePromo':
      {
        if (isWebView) {
          if (!currentCustomerStore.id) {
            currentCustomerStore.setLoginModalVisible(true, () => {
              if (!currentCustomerStore.telephone) {
                navigatorAction('BindPhone', {
                  variables: { url, navigation },
                  loginModalAction: savePromoCodeToWalletInWebview,
                  isLogin: true
                })
              } else {
                savePromoCodeToWalletInWebview({ url, navigation })
              }
            })
          } else {
            savePromoCodeToWalletInWebview({ url, navigation })
          }
        }
      }
      break
    default:
  }
}

//获取 url 参数
const parseQueryString = url => {
  let obj = {}
  const paraString = url.substring(url.indexOf('?') + 1, url.length).split('&')
  for (let i in paraString) {
    if (paraString[i].indexOf('url=') !== -1) {
      const urlValue = paraString[i].split('url=')[1]
      const urlKey = paraString[i].split('=')[0]
      obj[urlKey] = urlValue
    } else {
      const keyValue = paraString[i].split('=')
      obj[keyValue[0]] = keyValue[1]
    }
  }
  return obj
}

//获取路由内所带属性
const getVariablesInUrl = (tag, url) => {
  let str
  if (url.indexOf('?') > -1) {
    str = url.substring(url.indexOf(tag) + tag.length + 1, url.indexOf('?'))
  } else {
    str = url.substring(url.indexOf(tag) + tag.length + 1)
  }
  return str
}

//判断用户登录状态
const checkLoginStatus = (useReplace, navigation, routeName, variables) => {
  const navigatorAction = useReplace ? navigation.replace : navigation.navigate
  //已登录
  const { currentCustomerStore } = Stores
  if (currentCustomerStore.id) {
    checkSubscritionStatus(navigatorAction, routeName, variables)
  } else {
    //未登录 跳转登录
    if (routeName === 'JoinMember' || routeName === 'JoinMemberList') {
      // 开通会员触发的登录事件
      currentCustomerStore.setLoginModalVisible(true, () => {
        //登录成功后 不是会员
        if (!currentCustomerStore.isSubscriber) {
          // 判断是否绑定手机号 没绑定，跳转绑定手机号页面 把当前页面参数带过去
          if (!currentCustomerStore.telephone) {
            navigatorAction('BindPhone', {
              routeName,
              variables,
              isLogin: true
            })
          } else {
            variables
              ? navigatorAction(routeName, variables)
              : navigatorAction(routeName)
          }
        } else {
          //登录成功后 是会员
          const isWebView = navigation.state.routeName === 'WebPage'
          if (isWebView) {
            navigation.goBack()
          }
        }
      })
    } else {
      currentCustomerStore.setLoginModalVisible(true, () => {
        checkSubscritionStatus(navigatorAction, routeName, variables)
      })
    }
  }
}

//检查是否需要开通会员
const checkSubscritionStatus = (navigatorAction, routeName, variables) => {
  const { isSubscriber } = Stores.currentCustomerStore
  if (isSubscriber) {
    variables
      ? navigatorAction(routeName, variables)
      : navigatorAction(routeName)
  } else {
    switch (routeName) {
      case 'MyCustomerPhotos':
        navigatorAction('JoinMember')
        break
      default:
        variables
          ? navigatorAction(routeName, variables)
          : navigatorAction(routeName)
        break
    }
  }
}

const savePromoCodeToWallet = ({ url, navigation, error }) => {
  const { popupsStore, couponStore, modalStore, appStore } = Stores
  if (error) {
    appStore.showToast(error, 'error')
    return
  }

  const variables = parseQueryString(url)
  const input = { promo_code: variables.promo_code }
  Mutate(
    SERVICE_TYPES.popups.MUTATION_SAVE_PROMO_CODE_TO_WALLET,
    { input },
    response => {
      if (response.data.SavePromoCodeToWallet.customer) {
        popupsStore.isPopupLoading = false
        couponStore.updateValidCoupons(
          response.data.SavePromoCodeToWallet.customer
        )
        modalStore.hide()
        // 弹出成功
        modalStore.show(
          <OccasionBanner
            activityName={'PromoCodeSuccess'}
            navigation={navigation}
          />
        )
      }
    },
    error => {
      modalStore.setModalVisible(false)
      appStore.showToast(error, 'error')
      popupsStore.isPopupLoading = false
    }
  )
}

const savePromoCodeToWalletInWebview = ({ url, navigation, error }) => {
  const { couponStore, modalStore } = Stores
  if (error) {
    modalStore.show(
      <CustomAlertView
        title={'领取失败'}
        message={error}
        image={require('../../../assets/images/account/fail.png')}
        other={[{ type: 'highLight', title: '好的' }]}
      />
    )
    return
  }

  const variables = parseQueryString(url)
  const input = { promo_code: variables.promo_code }
  Mutate(
    SERVICE_TYPES.popups.MUTATION_SAVE_PROMO_CODE_TO_WALLET,
    { input },
    response => {
      if (response.data.SavePromoCodeToWallet.customer) {
        couponStore.updateValidCoupons(
          response.data.SavePromoCodeToWallet.customer
        )
        // 弹出成功
        modalStore.show(
          <CustomAlertView
            title={'领取成功'}
            image={require('../../../assets/images/account/contract_success.png')}
            other={[
              { title: '先逛逛' },
              {
                type: 'highLight',
                title: '去使用',
                onClick: () => {
                  const {
                    valid_promo_codes
                  } = response.data.SavePromoCodeToWallet.customer

                  let nowCoupon = valid_promo_codes.find(promoCode => {
                    return promoCode.code === variables.promo_code
                  })
                  nowCoupon = nowCoupon ? nowCoupon : valid_promo_codes[0]

                  navigation.navigate('JoinMember', {
                    nowCoupon: nowCoupon,
                    ids: nowCoupon.subscription_type_ids
                  })
                }
              }
            ]}
          />
        )
      }
    },
    error => {
      modalStore.show(
        <CustomAlertView
          title={'领取失败'}
          message={error}
          image={require('../../../assets/images/account/fail.png')}
          other={[{ type: 'highLight', title: '好的' }]}
        />
      )
    }
  )
}

export { allowToStartLoad, injectFilterInterceptArray, parseQueryString }
