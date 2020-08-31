import { getCategoriesWithSeason } from './categories'

const getCategoryListWithSeason = season => {
  const SPRING_ORDER = [
    ['连衣裙', '上衣', '裤子', '半裙', '套装', '毛衫', '外套', '短裤', '手套'],
    [
      '手镯',
      '耳环',
      '项链',
      '戒指',
      '包包',
      '帽饰',
      '围巾',
      '胸针',
      '腰带',
      '眼镜'
    ]
  ]
  const SUMMER_ORDER = [
    ['连衣裙', '上衣', '裤子', '半裙', '短裤', '套装', '外套', '毛衫', '手套'],
    [
      '手镯',
      '耳环',
      '项链',
      '戒指',
      '包包',
      '帽饰',
      '眼镜',
      '胸针',
      '腰带',
      '围巾'
    ]
  ]
  const FALL_ORDER = SPRING_ORDER
  const WINTER_ORDER = [
    ['连衣裙', '上衣', '裤子', '半裙', '外套', '毛衫', '套装', '短裤', '手套'],
    [
      '手镯',
      '耳环',
      '项链',
      '戒指',
      '包包',
      '围巾',
      '帽饰',
      '胸针',
      '腰带',
      '眼镜'
    ]
  ]
  switch (season) {
    case 'summer':
      return SUMMER_ORDER
    case 'spring':
      return SPRING_ORDER
    case 'fall':
      return FALL_ORDER
    case 'winter':
      return WINTER_ORDER
    default: {
      return SUMMER_ORDER
    }
  }
}

const getCategories = season => {
  const array = getCategoriesWithSeason(season)
  return array
}

export { getCategoryListWithSeason, getCategories }
