export const DRESS_SIZES = [
  { name: 'XS', type: 2 },
  { name: 'S', type: 4 },
  { name: 'M', type: 6 },
  { name: 'L', type: 10 },
  { name: 'XL', type: 14 },
  { name: 'XXL', type: 16 }
]

export const PANT_SIZES = [
  { name: 'XS', type: 2 },
  { name: 'S', type: 4 },
  { name: 'M', type: 8 },
  { name: 'L', type: 12 },
  { name: 'XL', type: 14 },
  { name: 'XXL', type: 16 }
]

export const SKIRT_SIZES = [
  { name: 'XS', type: 2 },
  { name: 'S', type: 4 },
  { name: 'M', type: 6 },
  { name: 'L', type: 10 },
  { name: 'XL', type: 14 },
  { name: 'XXL', type: 16 }
]

export const TOP_SIZES_ABBR = [
  { name: 'XS', type: 'X-Small' },
  { name: 'S', type: 'Small' },
  { name: 'M', type: 'Medium' },
  { name: 'L', type: 'Large' },
  { name: 'XL', type: 'X-Large' },
  { name: 'XXL', type: 'XX-Large' }
]

export const JEAN_SIZES = [
  { name: '23', type: 23 },
  { name: '24', type: 24 },
  { name: '25', type: 25 },
  { name: '26', type: 26 },
  { name: '27', type: 27 },
  { name: '28', type: 28 },
  { name: '29', type: 29 },
  { name: '30', type: 30 },
  { name: '31', type: 31 },
  { name: '32', type: 32 }
]

export const OCCUPATION = [
  '科技/互联网',
  '金融/投资',
  '广告/文化/传媒',
  '市场/营销/零售',
  '法律/教育/咨询',
  '政府/事业单位',
  '服务业',
  '学生',
  '全职宝妈',
  '其他'
]

export const SHAPE = [
  {
    type: 'Slender',
    image: require('../../../../assets/images/me_style/shape_rectangle.png'),
    title: '矩形'
  },
  {
    type: 'Heart',
    image: require('../../../../assets/images/me_style/shape_Inverted_triangle.png'),
    title: '倒三角型'
  },
  {
    type: 'Pear',
    image: require('../../../../assets/images/me_style/shape_pear.png'),
    title: '梨型'
  },
  {
    type: 'Hourglass',
    image: require('../../../../assets/images/me_style/shape_hourglass.png'),
    title: '沙漏型'
  },
  {
    type: 'Apple',
    image: require('../../../../assets/images/me_style/shape_apple.png'),
    title: '苹果型'
  }
]

export const SHAPEBIG = [
  {
    type: 'Slender',
    image: require('../../../../assets/images/me_style/shape_rectangle_big.png')
  },
  {
    type: 'Heart',
    image: require('../../../../assets/images/me_style/shape_Inverted_triangle_big.png')
  },
  {
    type: 'Pear',
    image: require('../../../../assets/images/me_style/shape_pear_big.png')
  },
  {
    type: 'Hourglass',
    image: require('../../../../assets/images/me_style/shape_hourglass_big.png')
  },
  {
    type: 'Apple',
    image: require('../../../../assets/images/me_style/shape_apple_big.png')
  }
]
export const SHAPELARGE = [
  {
    type: 'Hourglass',
    title: '沙漏型',
    image: require('../../../../assets/images/me_style/shape_hourglass_big.png')
  },
  {
    type: 'Heart',
    title: '倒三角',
    image: require('../../../../assets/images/me_style/shape_Inverted_triangle_big.png')
  },
  {
    type: 'Slender',
    title: '矩形',
    image: require('../../../../assets/images/me_style/shape_rectangle_big.png')
  },
  {
    type: 'Pear',
    title: '梨型',
    image: require('../../../../assets/images/me_style/shape_pear_big.png')
  },
  {
    type: 'Apple',
    title: '苹果型',
    image: require('../../../../assets/images/me_style/shape_apple_big.png')
  }
]

export const MARRIAGE = ['未婚', '已婚未育', '已婚已育']

export const MARRIAGESTATUS = [
  {
    display: '未婚',
    value: {
      mom: false,
      marital_status: 'unmarried'
    }
  },
  {
    display: '已婚未育',
    value: {
      mom: false,
      marital_status: 'married'
    }
  },
  {
    display: '已婚已育',
    value: {
      mom: true,
      marital_status: 'married'
    }
  }
]

export const PERSONALITY = [
  {
    type: 'Sheath Dresses (dresses)',
    image: require('../../../../assets/images/me_style/dresses.png'),
    title: '修身裙'
  },
  {
    type: 'Shirt Dresses (dresses)',
    image: require('../../../../assets/images/me_style/shirt_dress.png'),
    title: '衬衫裙'
  },
  {
    type: 'Fit and Flare (dresses)',
    image: require('../../../../assets/images/me_style/princess_dress.png'),
    title: '公主裙'
  },
  {
    type: 'Shifts (dresses)',
    image: require('../../../../assets/images/me_style/straight_skirt.png'),
    title: '直筒裙'
  },
  {
    type: 'Wrap Dresses (dresses)',
    image: require('../../../../assets/images/me_style/wrap_dress.png'),
    title: '裹身裙'
  },
  {
    type: 'Skirts (pants)',
    image: require('../../../../assets/images/me_style/skirt.png'),
    title: '半身裙'
  },
  {
    type: 'Shorts (pants)',
    image: require('../../../../assets/images/me_style/shorts.png'),
    title: '短裤'
  },
  {
    type: 'Tees (tops)',
    image: require('../../../../assets/images/me_style/T_shirt.png'),
    title: 'T恤'
  },
  {
    type: 'Sleeveless (tops)',
    image: require('../../../../assets/images/me_style/sleeveless_coat.png'),
    title: '无袖上衣'
  },
  {
    type: 'Sweatshirts (tops)',
    image: require('../../../../assets/images/me_style/sweater.png'),
    title: '卫衣'
  },
  {
    type: 'Cardigans (sweaters)',
    image: require('../../../../assets/images/me_style/cardigan.png'),
    title: '开衫针织'
  },
  {
    type: 'Utility (jackets)',
    image: require('../../../../assets/images/me_style/windbreaker.png'),
    title: '风衣'
  },
  {
    type: 'Bombers (jackets)',
    image: require('../../../../assets/images/me_style/motorcycle_jacket.png'),
    title: '机车夹克'
  },
  {
    type: 'Vests (jackets)',
    image: require('../../../../assets/images/me_style/vest.png'),
    title: '马甲'
  },
  {
    type: 'Blazers (jackets)',
    image: require('../../../../assets/images/me_style/leisure_suit.png'),
    title: '休闲西装'
  },
  {
    type: 'Denim (jackets)',
    image: require('../../../../assets/images/me_style/denim_jacket.png'),
    title: '牛仔夹克'
  },
  {
    type: 'Trousers (pants)',
    image: require('../../../../assets/images/me_style/trousers.png'),
    title: '长裤'
  },
  {
    type: 'Denim (pants)',
    image: require('../../../../assets/images/me_style/jeans.png'),
    title: '牛仔裤'
  }
]

export function calJeanSize(pant_size) {
  switch (pant_size) {
    case 0:
      return '24'
      break
    case 2:
      return '25'
      break
    case 4:
      return '26'
      break
    case 6:
      return '27'
      break
    case 8:
      return '28'
      break
    case 10:
      return '29'
      break
    case 12:
      return '30'
      break
    case 14:
      return '31'
      break
    case 16:
      return '32'
      break
  }
}

export function CREATEDATEDATA() {
  const endYear = new Date().getFullYear()
  let date = []
  for (let i = 1950; i < endYear; i++) {
    let month = []
    for (let j = 1; j < 13; j++) {
      let day = []
      if (j === 2) {
        for (let k = 1; k < 29; k++) {
          day.push(k + '日')
        }
        if (i % 4 === 0) {
          day.push(29 + '日')
        }
      } else if (j in { 1: 1, 3: 1, 5: 1, 7: 1, 8: 1, 10: 1, 12: 1 }) {
        for (let k = 1; k < 32; k++) {
          day.push(k + '日')
        }
      } else {
        for (let k = 1; k < 31; k++) {
          day.push(k + '日')
        }
      }
      let _month = {}
      _month[j + '月'] = day
      month.push(_month)
    }
    let _date = {}
    _date[i + '年'] = month
    date.push(_date)
  }
  return date
}

export function HEIGHTARRAY() {
  let data = []
  for (i = 150; i < 191; i++) {
    let height = i
    data.push(height)
  }
  return data
}

export function WEIGHTARRAY() {
  let data = []
  for (i = 40; i < 81; i++) {
    let weight = i
    data.push(weight)
  }
  return data
}

export function SHOULDERSIZE() {
  let data = []
  for (i = 30; i < 51; i++) {
    data.push(i)
  }
  return data
}

export function WAISTSIZE() {
  let data = []
  for (i = 55; i < 101; i++) {
    data.push(i)
  }
  return data
}

export function HIPSIZEINCHES() {
  let data = []
  for (i = 60; i < 111; i++) {
    data.push(i)
  }
  return data
}

export function INSEAM() {
  let data = []
  for (i = 55; i < 86; i++) {
    data.push(i)
  }
  return data
}

export function BUST_SIZE_NUMBER() {
  let data = []
  for (i = 60; i < 131; i++) {
    data.push(i)
  }
  return data
}

export const BUST_SIZE = [
  {
    '70': ['A', 'B', 'C', 'D', 'E']
  },
  {
    '75': ['A', 'B', 'C', 'D', 'E']
  },
  {
    '80': ['A', 'B', 'C', 'D', 'E']
  },
  {
    '85': ['A', 'B', 'C', 'D', 'E']
  },
  {
    '90': ['A', 'B', 'C', 'D', 'E']
  }
]

export const BODY_SIZE = {
  shoulder_size: {
    title: '肩宽',
    imageUrl: require('../../../../assets/images/me_style/shoulderWidth.png'),
    description:
      '衣服肩线过宽会产生慵懒的视错，过窄则不得体，所以了解自己的肩宽非常重要'
  },
  waist_size: {
    title: '腰围',
    imageUrl: require('../../../../assets/images/me_style/waistCircumference.png'),
    description:
      '选择下装及连体衣服时都需参考腰围尺寸，合身的穿搭可以为你的形象加分',
    tutorial: '测量腰围时，软尺贴着皮肤，在肚脐眼上方3cm的水平位置围上一圈'
  },
  hip_size_inches: {
    title: '臀围',
    imageUrl: require('../../../../assets/images/me_style/hipCircumference.png'),
    description: '合身的衣服也更时尚，了解自己，才能扬长避短',
    tutorial:
      '双腿靠拢站直，将软尺经过臀部最高点水平测量一圈。要确保尺子所在地都是水平的'
  },
  inseam: {
    title: '内腿长',
    imageUrl: require('../../../../assets/images/me_style/innerleglength.png'),
    description: '只有提供准确的尺码，才能获得完美合身体验',
    tutorial: '双腿靠拢站直，测量裤裆到脚底的长度'
  },
  bust_size_number: {
    title: '上胸围',
    imageUrl: require('../../../../assets/images/me_style/bust_size_number.png'),
    description: '正确测量上胸围，挑衣服再也不用跟着感觉走',
    tutorial: '用软尺紧贴着身体通过乳头的水平位置围上一圈'
  }
}
export const SHAPE_WAIST = [
  {
    type: 'SMALL',
    title: '小蛮腰',
    description: '偏瘦，腰特别细',
    image: require('../../../../assets/images/me_style/small_waist.png')
  },
  {
    type: 'NORMAL',
    title: '有腰线',
    description: '微胖，腰相对较细',
    image: require('../../../../assets/images/me_style/normal_waist.png')
  },
  {
    type: 'H',
    title: '无腰线',
    description: '腰线不明显',
    image: require('../../../../assets/images/me_style/h_waist.png')
  },
  {
    type: 'FAT',
    title: '腰部胖',
    description: '腰部粗，显肚子',
    image: require('../../../../assets/images/me_style/fat_waist.png')
  }
]
export const SHAPE_BELLY = [
  {
    type: 'WAISTCOAT',
    title: '有马甲线',
    image: require('../../../../assets/images/me_style/waist_coat.png')
  },
  {
    type: 'FLAT',
    title: '平坦无小肚腩',
    image: require('../../../../assets/images/me_style/flat.png')
  },
  {
    type: 'SLIGHT',
    title: '有轻微小肚腩',
    image: require('../../../../assets/images/me_style/slight.png')
  },
  {
    type: 'OBVIOUS',
    title: '有明显小肚腩',
    image: require('../../../../assets/images/me_style/obvious.png')
  },
  {
    type: 'POT',
    title: '有大肚腩',
    image: require('../../../../assets/images/me_style/pot.png')
  }
]

export const SHAPE_SHOULDER = [
  {
    type: 'LITTLE_NARROW',
    title: '较窄'
  },
  {
    type: 'NORMAL',
    title: '正常'
  },
  {
    type: 'LITTLE_WIDE',
    title: '较宽'
  },
  {
    type: 'WIDE',
    title: '很宽'
  }
]

export const SHAPESMALL = [
  {
    type: 'Slender',
    title: '矩形',
    description: '腰线不明显',
    image: require('../../../../assets/images/me_style/shape_rectangle_small.png')
  },
  {
    type: 'Heart',
    title: '倒三角',
    description: '肩宽胯窄',
    image: require('../../../../assets/images/me_style/shape_Inverted_triangle_small.png')
  },
  {
    type: 'Pear',
    title: '梨型',
    description: '大腿粗臀部大',
    image: require('../../../../assets/images/me_style/shape_pear_small.png')
  },
  {
    type: 'Hourglass',
    title: '沙漏型',
    description: '腰细翘臀有胸',
    image: require('../../../../assets/images/me_style/shape_hourglass_small.png')
  },
  {
    type: 'Apple',
    title: '苹果型',
    description: '腰粗臀部大',
    image: require('../../../../assets/images/me_style/shape_apple_small.png')
  }
]

export const SIZE_SKIRT = [
  {
    type: 'LOOSE',
    title: '有点松'
  },
  {
    type: 'FIT',
    title: '刚好合身'
  },
  {
    type: 'TIGHT',
    title: '有点紧'
  },
  {
    type: 'NOTSURE',
    title: '我不确定'
  }
]

export const SIZE_JEAN = [
  {
    type: 'OFTEN',
    title: '经常穿'
  },
  {
    type: 'SOMETIMES',
    title: '很少穿'
  },
  {
    type: 'NEVER',
    title: '不穿'
  }
]

export const JEAN_SIZES_WITH_UNKNOW = [
  {
    name: '23',
    type: 23,
    size: 'XS',
    waist: '57',
    hip: '80'
  },
  {
    name: '24',
    type: 24,
    size: 'XS',
    waist: '60',
    hip: '83'
  },
  {
    name: '25',
    type: 25,
    size: 'S',
    waist: '62',
    hip: '85',
    standard: '155/62A'
  },
  {
    name: '26',
    type: 26,
    size: 'S',
    waist: '65',
    hip: '88',
    standard: '159/64A'
  },
  {
    name: '27',
    type: 27,
    size: 'M',
    waist: '67',
    hip: '90',
    standard: '160/66A'
  },
  {
    name: '28',
    type: 28,
    size: 'M',
    waist: '70',
    hip: '93',
    standard: '164/68A'
  },
  {
    name: '29',
    type: 29,
    size: 'L',
    waist: '72',
    hip: '95',
    standard: '165/70A'
  },
  {
    name: '30',
    type: 30,
    size: 'L',
    waist: '75',
    hip: '98',
    standard: '169/72A'
  },
  {
    name: '31',
    type: 31,
    size: 'XL',
    waist: '77',
    hip: '100',
    standard: '170/74A'
  },
  {
    name: '32',
    type: 32,
    size: 'XL',
    waist: '80',
    hip: '103',
    standard: '170/76A'
  },
  { name: '不知道', type: 'Unknow' }
]

export const JEAN_WAIST_FIT = [
  { name: '有点松', type: 'LOOSE' },
  { name: '刚好合身', type: 'FIT' },
  { name: '有点紧', type: 'TIGHT' }
]
