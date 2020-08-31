import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'

const COLOR_FAMILY = [
  { black: '黑色' },
  { gray: '灰色' },
  { white: '白色' },
  { cream: '米色' },
  { brown: '棕色' },
  { yellow: '黄色' },
  { orange: '橙色' },
  { red: '红色' },
  { pink: '粉色' },
  { purple: '紫色' },
  { blue: '蓝色' },
  { green: '绿色' },
  { gold: '金色' },
  { silver: '银色' },
  { rose_gold: '玫瑰金' }
]

const TEMPERATURE = [{ cold: '寒冷' }, { mild: '舒适' }, { warm: '炎热' }]

const FILTER_TERMS_CLOTHING = [
  { 464: '连衣裙' },
  { 465: '上衣' },
  { 466: '裤子' },
  { 467: '半裙' },
  { 468: '短裤' },
  { 469: '套装' },
  { 470: '外套' },
  { 471: '毛衫' }
]

const FILTER_TERMS_ACCESSORY = [
  { 472: '手镯' },
  { 473: '耳环' },
  { 474: '项链' },
  { 475: '戒指' },
  { 476: '包包' },
  { 477: '帽饰' },
  { 478: '眼镜' },
  { 479: '胸针' },
  { 480: '腰带' },
  { 481: '围巾' },
  { 482: '手套' }
]

const INIT_DATA = [
  { '464': '连衣裙' },
  { '465': '上衣' },
  { '466': '裤子' },
  { '467': '半裙' },
  { '468': '短裤' },
  { '469': '套装' },
  { '470': '外套' },
  { '471': '毛衫' },
  { '472': '手镯' },
  { '473': '耳环' },
  { '474': '项链' },
  { '475': '戒指' },
  { '476': '包包' },
  { '477': '帽饰' },
  { '478': '眼镜' },
  { '479': '胸针' },
  { '480': '腰带' },
  { '481': '围巾' },
  { '482': '手套' },
  { '483': 'A字裙' },
  { '484': '紧身裙' },
  { '485': '直筒裙' },
  { '486': '修身裙' },
  { '487': '风衣' },
  { '488': '大衣' },
  { '489': '夹克' },
  { '490': '马甲' },
  { '491': '羽绒服' },
  { '492': '棉衣' },
  { '493': '西装外套' },
  { '494': '牛仔外套' },
  { '495': '衬衣' },
  { '496': '卫衣' },
  { '497': 'T恤' },
  { '498': '背心' },
  { '499': '套头' },
  { '500': '开衫' },
  { '501': '七/九分裤' },
  { '502': '长裤' },
  { '503': '牛仔裤' },
  { '504': '连身裤' },
  { '505': '长裙' },
  { '506': '中长裙' },
  { '507': '短裙' },
  { '508': '高端商务' },
  { '509': '职业简约' },
  { '510': '日常通勤' },
  { '511': '都市休闲' },
  { '512': '户外街头' },
  { '513': '度假旅行' },
  { '514': '约会' },
  { '515': '宴会' },
  { '516': '婚礼' }
]

class FiltersTerms {
  @persist('list')
  @observable
  filterTermsClothing = FILTER_TERMS_CLOTHING
  @persist('list')
  @observable
  filterTermsAccessory = FILTER_TERMS_ACCESSORY
  @persist('list')
  @observable
  filterTerms = [...FILTER_TERMS_CLOTHING, ...FILTER_TERMS_ACCESSORY]
  @persist('list')
  @observable
  product_search_sections = []
  @persist('list')
  @observable
  allFilterTerms = INIT_DATA
  @observable colorFamilies = COLOR_FAMILY
  @observable temperature = TEMPERATURE

  @persist('list')
  @observable
  occasions = []

  @action
  updateFilterTerms = data => {
    this.product_search_sections = data ? data : []
    if (data && data.length) {
      const allFilterTerms = []
      data.forEach(item => {
        if (item.product_search_slots) {
          item.product_search_slots.forEach(item => {
            const obj = {}
            obj[item.id] = item.name
            allFilterTerms.push(obj)
          })
        }
      })
      this.allFilterTerms = allFilterTerms
      this.updateTerms(data)
      this.updateOccasions(data)
    }
  }

  //品类
  updateTerms = data => {
    const type = data.find(item => {
      return item.name === '品类' && item.parent_slot_id === null
    })

    const terms = [],
      clothingTerms = [],
      accessoryTerms = []

    if (type.product_search_slots) {
      type.product_search_slots.forEach(item => {
        const obj = {}
        obj[item.id] = item.name
        terms.push(obj)
        if (item.clothing) {
          clothingTerms.push(obj)
        } else {
          accessoryTerms.push(obj)
        }
      })
    }

    this.filterTerms = terms
    this.filterTermsClothing = clothingTerms
    this.filterTermsAccessory = accessoryTerms
  }

  //场合
  updateOccasions = data => {
    const type = data.find(item => {
      return item.name === '场合' && item.parent_slot_id === null
    })

    const occasions = []

    if (type.product_search_slots) {
      type.product_search_slots.forEach(item => {
        const obj = {}
        obj[item.id] = item.name
        occasions.push(obj)
      })
    }

    this.occasions = occasions
  }
}

export default new FiltersTerms()
