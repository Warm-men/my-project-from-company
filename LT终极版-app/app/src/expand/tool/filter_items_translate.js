import filtersTermsStore from '../../stores/filter_terms'

const Terms = {
  dresses: '连衣裙',
  tops: '上衣',
  skirts: '半裙',
  shorts: '短裤',
  pants: '裤子',
  sweaters: '毛衫',
  jackets: '外套',
  bracelets: '手镯',
  earrings: '耳环',
  necklaces: '项链',
  rings: '戒指',
  scarves: '围巾',
  handbags: '包包',
  hats: '帽饰',
  gloves: '手套',
  clothing: '全部服装',
  accessory: '全部饰品',
  black: '黑色',
  gray: '灰色',
  white: '白色',
  cream: '米色',
  brown: '棕色',
  yellow: '黄色',
  orange: '橙色',
  red: '红色',
  pink: '粉色',
  purple: '紫色',
  blue: '蓝色',
  green: '绿色',
  gold: '金色',
  silver: '银色',
  rose_gold: '玫瑰金',
  cold: '寒冷',
  mild: '舒适',
  warm: '炎热'
}

const translateTerms = key => {
  if (Terms[key]) {
    return Terms[key]
  } else {
    const term = filtersTermsStore.allFilterTerms.find(term => {
      return Object.keys(term)[0] === key
    })
    if (term) {
      return Object.values(term)[0]
    } else {
      return key
    }
  }
}

export default {
  translateTerms
}
