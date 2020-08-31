import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'
import _ from 'lodash'
const localBanners = [
  {
    extra: 'business_professional_intellectual_elegance',
    height: 441,
    id: '59',
    image_url: require('../../assets/images/home/occasion/business_affairs.png'),
    link: '/occasion/455',
    title: '高端商务',
    width: 333
  },
  {
    extra: 'minimalist_neutral_minimalist',
    height: 441,
    id: '60',
    image_url: require('../../assets/images/home/occasion/simplicity.png'),
    link: '/occasion/456',
    title: '职业简约',
    width: 333
  },
  {
    extra: 'commuting_elegance_job_interview',
    height: 441,
    id: '61',
    image_url: require('../../assets/images/home/occasion/commute.png'),
    link: '/occasion/457',
    title: '日常通勤',
    width: 333
  },
  {
    extra: 'home_leisure',
    height: 441,
    id: '62',
    image_url: require('../../assets/images/home/occasion/urban.png'),
    link: '/occasion/458',
    title: '都市休闲',
    width: 333
  },
  {
    extra: 'personality_street_sweet_and_cute_sports_and_leisure',
    height: 441,
    id: '63',
    image_url: require('../../assets/images/home/occasion/street.png'),
    link: '/occasion/459',
    title: '户外街头',
    width: 333
  },
  {
    extra: 'beach_vacation',
    height: 441,
    id: '64',
    image_url: require('../../assets/images/home/occasion/vacation.png'),
    link: '/occasion/460',
    title: '度假旅行',
    width: 333
  },
  {
    extra: 'romantic_dating_dating',
    height: 441,
    id: '65',
    image_url: require('../../assets/images/home/occasion/appointment.png'),
    link: '/occasion/461',
    title: '约会',
    width: 333
  },
  {
    extra: 'annual_meeting_party',
    height: 441,
    id: '66',
    image_url: require('../../assets/images/home/occasion/banquet.png'),
    link: '/occasion/462',
    title: '宴会',
    width: 333
  },
  {
    extra: 'wedding',
    height: 441,
    id: '67',
    image_url: require('../../assets/images/home/occasion/wedding.png'),
    link: '/occasion/463',
    title: '婚礼',
    width: 333
  }
]
class OccasionStore {
  // @persist('list')
  // @observable
  // occasion = []弃用

  // @persist('list')
  // @observable
  // occasion_v2 = []弃用

  //作为用户，在首页可以看到9种新的Occasion
  @persist('list')
  @observable
  banners = localBanners

  // @persist('object')
  // @observable
  // filter_items = {}弃用

  // @persist('list')
  // @observable
  // occasion_filter_items = []弃用

  @action
  updateOccasion = response => {
    const { banners } = response.data.banner_group
    this.banners = banners ? banners : []
  }
}

export default new OccasionStore()
