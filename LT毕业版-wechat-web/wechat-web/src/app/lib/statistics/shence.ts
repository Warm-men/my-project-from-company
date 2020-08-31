import authentication from '../authentication'
import { isEmpty } from 'lodash'
import * as sensor from 'sa-sdk-javascript'
import { StatisticService } from './index'

/**
 * 神策统计服务
 *
 * @export
 * @class ShenceStatisService
 * @extends {StatisticService}
 */
export class ShenceStatisService implements StatisticService {
  static id = 'SHENCE'

  private _sensor: any

  public sensor() {
    if (!this._sensor) {
      this._sensor = this._init()
    }
    return this._sensor
  }

  public track(...args: any[]) {
    this.sensor().track(...args)
  }

  public onAppDidMount(props: { platform: string }) {
    const { platform } = props
    this._init()
    this.sensor().quick('autoTrack')
    this.sensor().registerPage({
      platform_type: platform
    })
  }

  public onRouterLeaveBefore() {
    this._sensor.quick('autoTrackSinglePage')
  }

  public onLoginSuccess(user: any) {
    this.sensor().login(user.id)
    this.sensor().setProfile(this._getSensorsProfileWithMe(user))
    this._registerPageWithMe(user)
  }

  public onUserUpdate(user: any) {
    this._registerPageWithMe(user)
  }

  public onClickElement(element: HTMLElement) {
    this.sensor().quick('trackHeatMap', element)
  }

  private _init(config = {}) {
    // 神策版本号
    const sensorsVersion = '1.13.2'
    // https://s-api.letote.cn/sa
    let server_url = 'https://s-api.letote.cn/sa?project=default' //NOTE:测试环境
    if (
      window.location.href &&
      window.location.href.match('wechat.letote.cn')
    ) {
      server_url = 'https://s-api.letote.cn/sa?project=production' //NOTE:正式环境
    }
    sensor.init({
      sdk_url: `https://static.sensorsdata.cn/sdk/${sensorsVersion}/sensorsdata.min.js`,
      heatmap_url: `https://static.sensorsdata.cn/sdk/${sensorsVersion}/heatmap.min.js`,
      server_url,
      show_log: false, //是否开启打印信息
      heatmap: {
        //是否开启点击图，默认 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
        clickmap: 'default',
        //是否开启触达注意力图，默认 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
        scroll_notice_map: 'default',
        // 设置触达图的有效停留时间，默认超过3秒以上算有效停留
        scroll_delay_time: 3000,
        //设置多少毫秒后开始渲染点击图,因为刚打开页面时候页面有些元素还没加载
        loadTimeout: 3000
      },
      ...config
    })

    // 全部使用异步队列执行
    function wrapperFunction(func: Function) {
      return (...args: any[]) =>
        setTimeout(() => {
          try {
            func(...args)
          } catch (e) {
            console.warn(e, 'error occur when use 神策')
          }
        }, 0)
    }

    sensor.quick = wrapperFunction(sensor.quick)
    sensor.track = wrapperFunction(sensor.track)
    sensor.login = wrapperFunction(sensor.login)
    sensor.setProfile = wrapperFunction(sensor.setProfile)
    sensor.registerPage = wrapperFunction(sensor.registerPage)
    this._sensor = sensor
    return sensor
  }

  private _registerPageWithMe(me: any) {
    const {
      current_subtype_name,
      current_subtype_value
    } = this._getCurrentUserSubscription(me)
    this.sensor().registerPage({
      current_subtype_name,
      current_subtype_value
    })
  }

  private _getCurrentUserSubscription(me: any) {
    const { subscription } = me
    const { isValidSubscriber, isSubscriber } = authentication(me)
    let current_subtype_name
    let current_subtype_value
    if (isValidSubscriber) {
      const { subscription_type, promo_code } = subscription
      current_subtype_name = subscription_type.display_name
      if (
        promo_code === 'LTCN_FREE_TOTE' ||
        promo_code === 'LTCN_FREE_TOTE_79'
      ) {
        current_subtype_name = '试用会员'
      }
    } else {
      if (isSubscriber) {
        current_subtype_name = '过期会员'
      } else {
        current_subtype_name = me.id ? '非会员' : '未登入'
      }
    }

    let subscriptionId: string
    if (isEmpty(subscription) || isEmpty(subscription.subscription_type)) {
      subscriptionId = 'null'
    } else {
      subscriptionId = subscription.subscription_type.id
    }

    current_subtype_value = subscriptionId
    return { current_subtype_name, current_subtype_value }
  }

  private _getSensorsProfileWithMe(me: any) {
    const { style, shipping_address, subscription } = me
    const {
        occupation,
        birthday,
        marital_status,
        mom,
        height_inches,
        weight,
        bust_size_number,
        top_size,
        dress_size
      } = style,
      { state, city, district } = shipping_address || {}
    const { isExpiredSubscriber, isSubscriber } = authentication(me)
    let type = '非会员'
    if (isSubscriber) {
      if (isExpiredSubscriber) {
        type = '过期会员'
      } else {
        type = `${
          subscription.display_interval ? subscription.display_interval : ''
        }${subscription.display_name}`
      }
    }
    return {
      subscriptionType: type,
      shipping_address_state: state,
      shipping_address_city: city,
      shipping_address_district: district,
      occupation,
      birthday,
      marital_status,
      mom,
      height_inches,
      weight,
      bust_size_number,
      top_size,
      dress_size
    }
  }
}
