import '../../assets/stylesheets/all.scss'
import Routers from './routers'
import { Provider } from 'react-redux'
import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { map, includes, isEmpty } from 'lodash'
import TipsAction from '../actions/tips_actions'
import DeviceType from 'src/app/lib/device_type'
import urlTimestamp from 'src/app/lib/url_timestamp'
import Store, { persistor } from 'src/app/store/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import CurrentCustomerAction from '../actions/current_customer'
import { parseQueryString } from 'src/app/lib/parseQueryString.js'
import { addPlatformSelector } from 'src/app/lib/user_agent_selectors'
import withErrorHandler from 'src/app/components/HOC/with_errorhandle/witherrorhandle'
import { APPStatisticManager } from '../lib/statistics/app'

export class AppComponent extends Component {
  constructor(props) {
    super(props)
    this.props.globalManager.onAppConstructor()
  }

  // NOTE:KOL活动路由，不需要登陆
  isH5ActivityPage = ['/weibo_activity', '/collections', '/open_free_service']

  noNeedSignInPages = [
    '/agreement',
    '/free_password',
    '/agreement_free_password',
    '/collections',
    '/complete_size_success',
    '/share_photo_incentive'
  ]

  componentDidMount() {
    this.props.globalManager.onAppDidMount()
    APPStatisticManager.onAppDidMount({
      platform: Store.getState().app.platform
    })
    this.handleThingsOnAppMounted()
  }
  handleThingsOnAppMounted = () => {
    // NOTE:IOS12出现了输入框键盘弹出后顶起页面各种元素，造成一些问题
    // 用事件委托去处理该情况，不需要在大部分input加onblur
    window.addEventListener('focusout', e => {
      const nodesName = ['TEXTAREA', 'INPUT', 'SELECT']
      if (includes(nodesName, e.target.nodeName)) {
        const scrollPosition =
          document.body.scrollTop || document.documentElement.scrollTop
        window.scroll(0, scrollPosition || 0)
      }
    })
    // NOTE:增加低版本小程序环境变量兼容
    if (wx && wx.miniProgram) {
      wx.miniProgram.getEnv(res => {
        res.miniprogram && Store.dispatch({ type: 'SET:MINI_APP:ENV' })
      })
    }

    window.addEventListener('pageshow', e => {
      e.persisted && window.location.reload()
      // 通过persisted属性判断是否存在 BF Cache
    })

    setTimeout(() => addPlatformSelector(Store), 0)
  }

  needsSignin = () => {
    // NOTE: 特殊处理脉脉购买成功后的跳转
    const isH5PaymentSuccess = window.location.pathname === '/h5_plans_success'
    if (Store.getState().app.isWechat) {
      // FIXME:router不能跳转其他界面，如果baidu.com等，只能路由内path
      const WECHAT_AUTH_PATH = '/profile/auth/wechat'
      if (!window.location.pathname.match(WECHAT_AUTH_PATH)) {
        const handleOpenId = url => {
          const parmas = parseQueryString(window.location.href)
          if (!isEmpty(parmas) && !isEmpty(parmas.wechat_mini_app_openid)) {
            return `${url}${
              url.indexOf('?') > -1 ? '&' : '?'
            }wechat_mini_app_openid=${parmas.wechat_mini_app_openid}`
          }
          return url
        }
        const newHref = `${process.env.WECHAT_BROKER_HOST ||
          `https://${window.location.host}`}${WECHAT_AUTH_PATH}?return_uri=${encodeURIComponent(
          handleOpenId(urlTimestamp(window.location.href))
        )}`
        window.location.href = DeviceType().isAndroid
          ? urlTimestamp(newHref)
          : newHref
      }
    } else {
      let url
      if (isH5PaymentSuccess) {
        url = '/h5_follow_lt'
      } else {
        // NOTE：activity的路由都当作是活动路由，都不跳转h5_login去登录
        const { pathname, search } = window.location
        let isNotLogin = false
        map(this.isH5ActivityPage, value => {
          includes(pathname, value) && (isNotLogin = true)
        })
        url = `${isNotLogin ? pathname : '/h5_login'}${search}`
      }
      url = process.env.NODE_ENV === 'production' ? url : '/get-started/signin'
      browserHistory.replace(url)
    }
  }

  fetchMeError = () => {
    // 开发环境下总是退回登录页无法看到请求错误
    if (process.env === 'development') {
      throw new Error('fetchMe请求错误')
    }
    Store.dispatch(TipsAction.changeTips({ isShow: false, content: '' }))
    // TODO 考虑是否是网络错误等
    this.needsSignin()
  }

  fetchMeSuccess = (dispatch, res) => {
    if (isEmpty(res.data.me)) {
      this.needsSignin()
    } else {
      dispatch(TipsAction.changeTips({ isShow: false, content: '' }))
      APPStatisticManager.onLoginSuccess(res.data.me)
    }
  }

  fetchCurrentCustomer = () => {
    // NOTE：landingpage 不需要登录
    const { pathname } = window.location
    const isNotSignPages = includes(this.noNeedSignInPages, pathname)
    if (isNotSignPages || pathname.indexOf('/open/') !== -1) {
      return null
    }
    // NOTE：微信环境需要自动跳转回首页
    const { app } = Store.getState()
    if (app.isWechat && pathname.match('/h5_login')) {
      window.location.href =
        process.env.WECHAT_BROKER_HOST || `https://${window.location.host}`
      return null
    }
    // NOTE: 防止plans页并发，冲掉使用优惠券的价格
    const BLACK_LIST_CURRENT_ME = ['/plans']
    const isNotBlackList = !includes(BLACK_LIST_CURRENT_ME, pathname)
    if (isNotBlackList || app.platform !== 'jd') {
      Store.dispatch(
        CurrentCustomerAction.fetchMe(this.fetchMeSuccess, this.fetchMeError)
      )
    }
  }

  render() {
    // 放到异步队列中
    setTimeout(() => {
      this.fetchCurrentCustomer()
    }, 0)

    return (
      <Provider store={Store}>
        <PersistGate persistor={persistor} loading={<div>Loading...</div>}>
          <Routers />
        </PersistGate>
      </Provider>
    )
  }
}

const App = withErrorHandler(AppComponent, Store)
export default App
