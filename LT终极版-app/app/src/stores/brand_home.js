import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'

const subscriberBrandBanners = [
  {
    extra: null,
    height: 392,
    id: '53',
    image_url: require('../../assets/images/home/member/Marisfrolg.SU.png'),
    link: '/brands/167',
    title: '玛丝菲尔·素',
    width: 530
  },
  {
    extra: null,
    height: 392,
    id: '54',
    image_url: require('../../assets/images/home/member/yesel.png'),
    link: '/brands/166',
    title: '影儿十二篮',
    width: 530
  },
  {
    extra: null,
    height: 392,
    id: '55',
    image_url: require('../../assets/images/home/member/BCBGGeneration.png'),
    link: '/brands/4',
    title: 'BCBGeneration',
    width: 530
  },
  {
    extra: null,
    height: 392,
    id: '56',
    image_url: require('../../assets/images/home/member/UR.png'),
    link: '/brands/111',
    title: 'URBAN REVIVO',
    width: 530
  },
  {
    extra: null,
    height: 392,
    id: '57',
    image_url: require('../../assets/images/home/member/Lily.png'),
    link: '/brands/13',
    title: 'LILY',
    width: 530
  },
  {
    extra: null,
    height: 392,
    id: '58',
    image_url: require('../../assets/images/home/member/MO&Co.png'),
    link: '/brands/16',
    title: 'Mo&Co.摩安珂',
    width: 530
  }
]
const brandBanners = [
  {
    extra: null,
    height: 164,
    id: '44',
    image_url: require('../../assets/images/home/non_member/BCBGGeneration.png'),
    link: '/brands/4',
    title: 'BCBGeneration',
    width: 218
  },
  {
    extra: null,
    height: 164,
    id: '45',
    image_url: require('../../assets/images/home/non_member/Summer&Sage.png'),
    link: '/brands/23',
    title: 'SUMMER & SAGE',
    width: 218
  },
  {
    extra: null,
    height: 164,
    id: '46',
    image_url: require('../../assets/images/home/non_member/UR.png'),
    link: '/brands/111',
    title: 'URBAN REVIVO',
    width: 218
  },
  {
    extra: null,
    height: 164,
    id: '47',
    image_url: require('../../assets/images/home/non_member/EVA_OUXIU.png'),
    link: '/brands/34',
    title: 'EVA OUXIU伊华欧秀',
    width: 218
  },
  {
    extra: null,
    height: 164,
    id: '48',
    image_url: require('../../assets/images/home/non_member/Lily.png'),
    link: '/brands/13',
    title: 'LILY',
    width: 218
  },
  {
    extra: null,
    height: 164,
    id: '49',
    image_url: require('../../assets/images/home/non_member/MO&Co.png'),
    link: '/brands/16',
    title: 'Mo&Co.摩安珂',
    width: 218
  },
  {
    extra: null,
    height: 164,
    id: '50',
    image_url: require('../../assets/images/home/non_member/Ochirly.png'),
    link: '/brands/17',
    title: 'OCHIRLY欧时力',
    width: 218
  },
  {
    extra: null,
    height: 164,
    id: '51',
    image_url: require('../../assets/images/home/non_member/DOTACOKO.png'),
    link: '/brands/69',
    title: 'DOTACOKO',
    width: 218
  },
  {
    extra: null,
    height: 164,
    id: '52',
    image_url: require('../../assets/images/home/non_member/FivePlus.png'),
    link: '/brands/32',
    title: 'FIVE PLUS（5+）',
    width: 218
  }
]
class BrandHomeStore {
  @persist('list')
  @observable
  brands = []

  @persist('list')
  @observable
  nonMemberBrands = []

  @persist('list')
  @observable
  subscriberBanners = subscriberBrandBanners

  @persist('list')
  @observable
  banners = brandBanners

  @action
  updateSubscriberBanners = subscriberBanners => {
    this.subscriberBanners = subscriberBanners ? subscriberBanners : []
  }

  @action
  updateBanners = banners => {
    this.banners = banners ? banners : []
  }
}

export default new BrandHomeStore()
