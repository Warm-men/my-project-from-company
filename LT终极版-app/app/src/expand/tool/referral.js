import { Client } from '../../expand/services/client'
//下单成功活动页
const UTM_ACTIVITY =
  '&utm_source=Activity&utm_medium=Order&utm_campaign=Referral'
//我的页面
const UTM_MY = '&utm_source=Wechat&utm_medium=My&utm_campaign=Referral'
//下单成功BUTTON
const UTM_TOTE_SUCCESS =
  '&utm_source=Wechat&utm_medium=Order&utm_campaign=Referral'
//晒单详情
const UTM_CUSTOMER_PHOTO =
  '&utm_source=Wechat&utm_medium=CustomerPhoto&utm_campaign=Referral'
const URL = `${Client.ORIGIN}/referral_free_tote`
const REFERRAL = {
  UTM_ACTIVITY,
  UTM_MY,
  UTM_TOTE_SUCCESS,
  UTM_CUSTOMER_PHOTO,
  URL
}

export { REFERRAL }
