import { DEFAULT_APP_LINK } from '../../../constants/global_config'

const profile = [
  {
    title: '尺码',
    link: '/style_profile/figure_input',
    img: require('src/app/containers/account/select_box/images/size.svg')
  },
  {
    title: '场合',
    link: '/style_profile/workplace',
    img: require('src/app/containers/account/select_box/images/place.svg')
  },
  {
    title: '喜欢',
    link: '/style_profile/style',
    img: require('src/app/containers/account/select_box/images/love.svg')
  },
  {
    title: '不喜欢',
    link: '/style_profile/Filters',
    img: require('src/app/containers/account/select_box/images/hate.svg')
  }
]

const common = [
  {
    title: '会员中心',
    link: '/membership',
    img: require('src/app/containers/account/select_box/images/membership.svg')
  },
  {
    title: '待付款',
    link: '/payment_pending',
    img: require('src/app/containers/account/select_box/images/payment.svg')
  },
  {
    title: '愿望衣橱',
    link: '/closet',
    img: require('src/app/containers/account/select_box/images/closet.svg')
  },
  {
    title: '晒单',
    link: '/share_list',
    img: require('src/app/containers/account/select_box/images/share.svg')
  }
]

const jdCommon = [
  {
    title: '愿望衣橱',
    link: '/closet',
    img: require('src/app/containers/account/select_box/images/closet.svg')
  },
  {
    title: '待付款',
    link: '/payment_pending',
    img: require('src/app/containers/account/select_box/images/payment.svg')
  },
  {
    title: '解绑小白信用',
    link: '/unbind_jdcredit',
    img: require('src/app/containers/account/select_box/images/credit.svg')
  },
  {
    title: '常见问题',
    link: 'https://mp.weixin.qq.com/s/EAsJL6zbvvQ11KiEGVYYGw#wechat_redirect',
    isExternal: true,
    img: require('src/app/containers/account/select_box/images/common.svg')
  }
]

const service = [
  {
    title: '会员卡兑换',
    link: '/card_exchange',
    img: require('src/app/containers/account/select_box/images/avoid_close_manage.svg')
  },
  {
    title: '免密管理',
    link: '/free_password',
    isValid: true,
    img: require('src/app/containers/account/select_box/images/free_password.svg')
  },
  {
    title: '自在选',
    link: '/free_service',
    img: require('src/app/containers/account/select_box/images/free_service.svg')
  },
  {
    title: '常见问题',
    link: 'https://mp.weixin.qq.com/s/EAsJL6zbvvQ11KiEGVYYGw#wechat_redirect',
    isExternal: true,
    img: require('src/app/containers/account/select_box/images/common.svg')
  },
  {
    title: '下载App',
    isExternal: true,
    link: DEFAULT_APP_LINK,
    img: require('src/app/containers/account/select_box/images/download.svg')
  },
  {
    title: '关于我们',
    link: '/about_us',
    img: require('src/app/containers/account/select_box/images/about.svg')
  }
]

export default {
  profile,
  common,
  jdCommon,
  service
}
