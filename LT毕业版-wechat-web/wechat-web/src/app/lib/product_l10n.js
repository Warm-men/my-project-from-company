import { differenceInDays } from 'date-fns'

function l10nForDetail(productDetail) {
  const index = productDetail.indexOf(':')
  let localDescription, localValue
  if (productDetail && index > -1) {
    const descriptionStr = productDetail.slice(0, index),
      valueStr = productDetail.slice(index)

    //获取详情的描述名称和对应内容
    localDescription = PRODUCT_DESCRIPTIONS[descriptionStr.toLowerCase()]
    localValue = valueStr
    //本地化颜色描述
    if (descriptionStr === 'Color') {
      const colorArray = valueStr.replace(': ', '').split(', ')
      let localColor = ': '
      colorArray.map((item, key) => {
        //不在本地记录的颜色，默认原数据返回
        localColor =
          localColor +
          (PRODUCT_COLORS[item.toLowerCase()] !== undefined
            ? PRODUCT_COLORS[item.toLowerCase()]
            : item)
        if (key + 1 !== colorArray.length) {
          localColor = localColor + ', '
        }
        return null
      })
      localValue = localColor
    }

    //替换中文冒号
    localValue = localValue.replace(': ', '')
    localValue = localValue.replace(':', '')
  }
  return {
    localDescription,
    localValue
  }
}

function l10nForSize(sizeName, toString) {
  if (!sizeName) return null
  const sizeNameStr = sizeName + ''
  const localSizeName =
    PRODUCT_SIZES[sizeNameStr.toLowerCase()] !== undefined
      ? PRODUCT_SIZES[sizeNameStr.toLowerCase()]
      : sizeNameStr

  if (toString) {
    let string = ''
    if (localSizeName.length === 1) {
      string = localSizeName[0]
    } else {
      string = localSizeName[0] + localSizeName[1]
    }
    return string
  } else {
    return localSizeName
  }
}

function l10setSizeInfo(name) {
  const exchangeName = l10nForSize(name)
  return _.isArray(exchangeName)
    ? exchangeName.length === 2
      ? `${exchangeName[0]}-${exchangeName[1]}`
      : exchangeName
    : exchangeName
}

function l10nForRatingKey(ratingKey) {
  const localRatingKey =
    RATING_KEY[ratingKey.toLowerCase()] !== undefined
      ? RATING_KEY[ratingKey.toLowerCase()]
      : ratingKey
  return localRatingKey
}

function isNewProduct(activated_at) {
  const currentTime = new Date()
  return differenceInDays(currentTime, activated_at) <= 7
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

// 筛选重复商品
function filterSameProductsSlug(array, categoryRule, product) {
  //当前的衣服是普通款式，或者替换相同类型的商品，默认可换
  if (
    !categoryRule ||
    (product.category_rule && categoryRule.slug === product.category_rule.slug)
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

const PRODUCT_DESCRIPTIONS = {
  color: '颜色',
  fabric: '面料成分',
  fit: '商品版型',
  metal: '商品材质',
  closure: '闭合方式',
  opacity: '透明指数',
  thickness: '厚薄指数',
  stretch: '弹力指数'
}

const PRODUCT_COLORS = {
  red: '红色',
  burgundy: '酒红',
  maroon: '砖红色',
  pink: '粉色',
  magenta: '品红色',
  'light pink': '亮粉红色',
  'hot pink': '热粉色',
  orange: '橙色',
  copper: '铜色',
  'burnt orange': '鲜橙',
  coral: '珊瑚色',
  yellow: '黄色',
  green: '绿色',
  'green blue': '蓝绿色',
  'lime green': '石灰绿',
  'kelly green': '黄绿色',
  'hunter green': '森林绿',
  'olive green': '橄榄绿',
  blue: '蓝色',
  'light blue': '浅蓝',
  mint: '薄荷色',
  turquoise: '绿松石',
  aqua: '海蓝',
  peacock: '孔雀蓝',
  'royal blue': '皇家蓝',
  navy: '海军蓝',
  purple: '紫色',
  lavender: '薰衣紫',
  eggplant: '深紫色',
  violet: '蓝紫色',
  black: '黑色',
  'faded black': '黯黑色',
  gray: '灰色',
  'light heather gray': '浅灰色',
  charcoal: '深灰色',
  white: '白色',
  cream: '米色',
  pearl: '珍珠色',
  beige: '米黄色',
  brown: '棕色',
  tan: '棕褐色',
  cognac: '干邑色',
  gold: '金色',
  'rose gold': '玫瑰金',
  silver: '银色',
  crystal: '透明'
}

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

const RATING_KEY = {
  bust: '胸部',
  waist: '腰部',
  shoulder: '肩部',
  length: '衣长',
  inseam: '内腿长',
  thigh: '大腿',
  hips: '臀部'
}

const RATING_VALUE = {
  fit: '合适',
  loose: '偏松',
  loved: '喜欢',
  hated: '不喜欢',
  short: '偏短',
  long: '偏长',
  tight: '偏紧'
}

function l10nForRatingValue(ratingValue) {
  const localRATING_VALUE =
    RATING_VALUE[ratingValue.toLowerCase()] !== undefined
      ? RATING_VALUE[ratingValue.toLowerCase()]
      : ratingValue
  return localRATING_VALUE
}

function getDisplaySizeName(sizeAbbreviation) {
  const abbreviation = l10nForSize(sizeAbbreviation)
    .toString()
    .replace(',', '')
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

export {
  l10nForDetail,
  l10nForSize,
  l10setSizeInfo,
  l10nForRatingKey,
  isNewProduct,
  l10nForRatingValue,
  l10nChartSize,
  getDisplaySizeName,
  filterSameProductsSlug,
  getProductAbnormalStatus
}
