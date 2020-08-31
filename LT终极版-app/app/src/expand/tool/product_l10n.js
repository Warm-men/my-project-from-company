import dateFns from 'date-fns'
import _ from 'lodash'

function l10nForDetail(productDetail) {
  const index = productDetail.indexOf(':')
  var localDescription, localValue
  if (productDetail && index > -1) {
    const descriptionStr = productDetail.slice(0, index),
      valueStr = productDetail.slice(index)

    //获取详情的描述名称和对应内容
    localDescription = PRODUCT_DESCRIPTIONS[descriptionStr.toLowerCase()]
    localValue = valueStr
    //本地化颜色描述
    // if (descriptionStr === 'Color') {
    //   const colorArray = valueStr.replace(': ', '').split(', ')
    //   let localColor = ': '
    //   colorArray.map((item, key) => {
    //     //不在本地记录的颜色，默认原数据返回
    //     localColor =
    //       localColor +
    //       (PRODUCT_COLORS[item.toLowerCase()] !== undefined
    //         ? PRODUCT_COLORS[item.toLowerCase()]
    //         : item)
    //     if (key + 1 !== colorArray.length) {
    //       localColor = localColor + ', '
    //     }
    //     return null
    //   })
    //   localValue = localColor
    // }

    //替换中文冒号
    if (localValue.startsWith(': ')) {
      localValue = localValue.slice(2)
    }
    if (localValue.startsWith(':')) {
      localValue = localValue.slice(1)
    }
  }
  return {
    localDescription,
    localValue
  }
}

function l10nForSize(sizeName) {
  if (!sizeName) return ''
  const localSizeName =
    PRODUCT_SIZES[sizeName.toLowerCase()] !== undefined
      ? PRODUCT_SIZES[sizeName.toLowerCase()].join('')
      : sizeName
  return localSizeName
}

function l10nForSizeUI(sizeName) {
  if (!sizeName) return ''
  const localSizeName =
    PRODUCT_SIZES_UI[sizeName.toLowerCase()] !== undefined
      ? PRODUCT_SIZES_UI[sizeName.toLowerCase()]
      : sizeName
  return localSizeName
}

function l10nForRatingKey(ratingKey) {
  const localRatingKey =
    RATING_KEY[ratingKey.toLowerCase()] !== undefined
      ? RATING_KEY[ratingKey.toLowerCase()]
      : ratingKey
  return localRatingKey
}

function l10nForRatingValue(ratingValue) {
  const localRatingValue =
    RATING_VALUE[ratingValue.toLowerCase()] !== undefined
      ? RATING_VALUE[ratingValue.toLowerCase()]
      : ratingValue
  return localRatingValue
}

function isNewProduct(activated_at) {
  const currentTime = new Date()
  return dateFns.differenceInDays(currentTime, activated_at) <= 7
}

// 筛选重复商品
function filterSameProducts(array, newArray, count = 20, key = 'id') {
  if (array && array.length >= count) {
    const tempArray = _.drop(array, array.length - count)
    const products = _.differenceBy(newArray, tempArray, key)
    return products
  } else {
    return newArray
  }
}

// 筛选重复商品
function filterSameProductsSlug(array, categoryRule, swapToteProduct) {
  //当前的衣服是普通款式，或者替换相同类型的商品，默认可换
  if (
    !categoryRule ||
    (swapToteProduct.product.category_rule &&
      categoryRule.slug === swapToteProduct.product.category_rule.slug)
  ) {
    return false
  }
  const sameSlugProducts = array.filter(item => {
    const { category_rule } = item.product
    return category_rule && category_rule.slug === categoryRule.slug
  })
  if (sameSlugProducts.length < categoryRule.swap_hint_threshold) {
    return false
  } else if (sameSlugProducts.length < categoryRule.swap_ban_threshold) {
    const message = categoryRule.hint_msg.replace(
      '#{count}',
      sameSlugProducts.length
    )
    return { message, type: 'hint' }
  } else {
    const message = categoryRule.error_msg
    return { message, type: 'error' }
  }
}

function l10nChartSize(sizeName) {
  if (!sizeName) return null
  const ProductSize = PRODUCT_SIZES[sizeName.toLowerCase()]
  if (!ProductSize) {
    return {
      size: sizeName,
      type: null
    }
  }
  const localSizeName =
    ProductSize.length > 1
      ? {
          size: ProductSize[1],
          type: ProductSize[0]
        }
      : {
          size: ProductSize[0],
          type: null
        }
  return localSizeName
}

function getDisplaySizeName(sizeAbbreviation) {
  const abbreviation = l10nForSize(sizeAbbreviation)
  const font =
    abbreviation.substr(abbreviation.length - 1, 1) !== '码' ? '码' : ''
  const name = abbreviation + font
  return name
}

function getProductAbnormalStatus(product, product_size) {
  let tip = null
  if (product.disabled) {
    tip = '已下架'
  } else if (product.swappable) {
    if (product_size && !product_size.swappable) {
      const sizeName = getDisplaySizeName(product_size.size_abbreviation)
      tip = sizeName + '无货'
    }
  } else {
    tip = `待返架`
  }
  return tip
}

const PRODUCT_DESCRIPTIONS = {
  fabric: '面料成分',
  fit: '商品版型',
  stretch: '弹力指数',
  opacity: '透明指数',
  thickness: '厚薄指数',
  metal: '商品材质',
  closure: '闭合方式'
}

// const PRODUCT_COLORS = {
//   red: '红色',
//   burgundy: '深紫红色',
//   maroon: '栗色',
//   pink: '粉色',
//   magenta: '品红色',
//   'light pink': '浅粉色',
//   'hot pink': '艳粉色',
//   orange: '橙色',
//   copper: '铜色',
//   'burnt orange': '焦橙色',
//   coral: '珊瑚色',
//   yellow: '黄色',
//   green: '绿色',
//   'green blue': '蓝绿色',
//   'lime green': '石灰绿',
//   'kelly green': '黄绿色',
//   'hunter green': '森林绿',
//   'olive green': '橄榄绿',
//   blue: '蓝色',
//   'light blue': '浅蓝色',
//   mint: '薄荷色',
//   turquoise: '绿松石色',
//   aqua: '浅绿色',
//   peacock: '孔雀绿',
//   'royal blue': '皇室蓝',
//   navy: '深蓝色',
//   purple: '紫色',
//   lavender: '薰衣草色',
//   eggplant: '深紫色',
//   violet: '紫罗兰',
//   black: '黑色',
//   'faded black': '褪色黑',
//   gray: '灰色',
//   'light heather gray': '浅灰色',
//   charcoal: '炭笔色',
//   white: '白色',
//   cream: '米色',
//   pearl: '珍珠色',
//   beige: '米色',
//   brown: '棕色',
//   tan: '棕褐色',
//   cognac: '干邑色',
//   gold: '金色',
//   'rose gold': '玫瑰金',
//   silver: '银色',
//   crystal: '透明'
// }

const PRODUCT_SIZES = {
  'x-small': ['XS'],
  small: ['S'],
  medium: ['M'],
  large: ['L'],
  'x-large': ['XL'],
  'xx-large': ['XXL'],
  '0': ['美码', '0'],
  '2': ['美码', '2'],
  '4': ['美码', '4'],
  '6': ['美码', '6'],
  '8': ['美码', '8'],
  '10': ['美码', '10'],
  '12': ['美码', '12'],
  '14': ['美码', '14'],
  '16': ['美码', '16'],
  os: ['均码'],
  '24': ['24'],
  '25': ['25'],
  '26': ['26'],
  '27': ['27'],
  '28': ['28'],
  '29': ['29'],
  '30': ['30'],
  '31': ['31'],
  '32': ['32'],
  'cn-150': ['150'],
  'cn-155': ['155'],
  'cn-160': ['160'],
  'cn-165': ['165'],
  'cn-170': ['170'],
  'cn-175': ['175'],
  'eu-32': ['欧码', '32'],
  'eu-34': ['欧码', '34'],
  'eu-36': ['欧码', '36'],
  'eu-38': ['欧码', '38'],
  'eu-40': ['欧码', '40'],
  'eu-42': ['欧码', '42'],
  'eu-44': ['欧码', '44'],
  'eu-46': ['欧码', '46'],
  'uk-6': ['英码', '6'],
  'uk-8': ['英码', '8'],
  'uk-10': ['英码', '6'],
  'uk-12': ['英码', '12'],
  'uk-14': ['英码', '14'],
  'uk-16': ['英码', '16'],
  'uk-18': ['英码', '18'],
  'uk-20': ['英码', '20'],
  'us-xs': ['美码', 'XS'],
  'us-xxs': ['美码', 'XXS'],
  'us-s': ['美码', 'S'],
  'us-m': ['美码', 'M'],
  'us-l': ['美码', 'L'],
  'us-xl': ['美码', 'XL'],
  'us-xxl': ['美码', 'XLL']
}

const PRODUCT_SIZES_UI = {
  'x-small': 'XS',
  small: 'S',
  medium: 'M',
  large: 'L',
  'x-large': 'XL',
  'xx-large': 'XXL',
  '0': '美码\n0',
  '2': '美码\n2',
  '4': '美码\n4',
  '6': '美码\n6',
  '8': '美码\n8',
  '10': '美码\n10',
  '12': '美码\n12',
  '14': '美码\n14',
  '16': '美码\n16',
  os: '均码',
  '24': '24',
  '25': '25',
  '26': '26',
  '27': '27',
  '28': '28',
  '29': '29',
  '30': '30',
  '31': '31',
  '32': '32',
  'cn-150': '150',
  'cn-155': '155',
  'cn-160': '160',
  'cn-165': '165',
  'cn-170': '170',
  'cn-175': '175',
  'eu-32': '欧码\n32',
  'eu-34': '欧码\n34',
  'eu-36': '欧码\n36',
  'eu-38': '欧码\n38',
  'eu-40': '欧码\n40',
  'eu-42': '欧码\n42',
  'eu-44': '欧码\n44',
  'eu-46': '欧码\n46',
  'uk-6': '英码\n6',
  'uk-8': '英码\n8',
  'uk-10': '英码\n10',
  'uk-12': '英码\n12',
  'uk-14': '英码\n14',
  'uk-16': '英码\n16',
  'uk-18': '英码\n18',
  'uk-20': '英码\n20',
  'us-xs': '美码\nXS',
  'us-s': '美码\nS',
  'us-m': '美码\nM',
  'us-l': '美码\nL',
  'us-xl': '美码\nXL',
  'us-xxl': '美码\nXXL'
}

const RATING_KEY = {
  bust: '胸部',
  waist: '腰部',
  shoulder: '肩部',
  length: '长度',
  inseam: '内腿长',
  thigh: '大腿',
  hips: '臀部'
}
const RATING_VALUE = {
  tight: '太紧了',
  fit: '合适',
  loose: '太松了',
  short: '太短了',
  long: '太长了'
}

/*
  获取fitMessages
*/
const getFitMessage = (recommendedSize, fitMessages, selectedSize) => {
  let objcet = { fitMessage: '可能没有合适你的尺码' }

  if (!selectedSize && !recommendedSize) {
    return objcet
  }

  if (!fitMessages) {
    objcet.fitMessage = ''
    return objcet
  }

  // 如果有推荐尺码，默认会选择推荐尺码，所以如果没有selectedSize 说明没有合适尺码
  // 如果没有合适尺码，但商品有推荐尺码，但是推荐尺码无库存，仍显示推荐尺码的

  const currentSize = selectedSize ? selectedSize.size : recommendedSize
  let selectedItem = null
  selectedItem = fitMessages.find(item => {
    return currentSize.id === item.size.id
  })
  if (!selectedItem) {
    objcet.fitMessage = ''
    return objcet
  }

  if (recommendedSize && currentSize.name === recommendedSize.name) {
    const sizeName = getDisplaySizeName(currentSize.abbreviation)

    objcet.size = sizeName
    if (selectedItem.realtime_fit_message) {
      objcet.fitMessage = '（' + selectedItem.realtime_fit_message + '）'
    } else {
      objcet.fitMessage = ''
    }
  } else {
    objcet.fitMessage = selectedItem.realtime_fit_message
  }
  return objcet
}

export {
  l10nForDetail,
  l10nForSize,
  l10nForSizeUI,
  l10nForRatingKey,
  l10nForRatingValue,
  isNewProduct,
  l10nChartSize,
  filterSameProducts,
  filterSameProductsSlug,
  getDisplaySizeName,
  getProductAbnormalStatus,
  getFitMessage
}
