export const DRESS_SIZES = [
  {
    name: 'XS',
    type: 2
  },
  {
    name: 'S',
    type: 4
  },
  {
    name: 'M',
    type: 6
  },
  {
    name: 'L',
    type: 10
  },
  {
    name: 'XL',
    type: 14
  },
  { name: 'XXL', type: 16 }
]

export const FULL_DRESS_SIZE = {
  'X-Small': 2,
  Small: 4,
  Medium: 6,
  Large: 10,
  'X-Large': 14,
  'XX-Large': 16
}

export const FULL_PANT_SIZE = {
  'X-Small': 2,
  Small: 4,
  Medium: 8,
  Large: 12,
  'X-Large': 14,
  'XX-Large': 16
}

export const PANT_SIZES = [
  {
    name: 'XS',
    type: 2
  },
  {
    name: 'S',
    type: 4
  },
  {
    name: 'M',
    type: 8
  },
  {
    name: 'L',
    type: 12
  },
  {
    name: 'XL',
    type: 14
  },
  { name: 'XXL', type: 16 }
]

export const SKIRT_SIZES = [
  {
    name: 'XS',
    type: 2
  },
  {
    name: 'S',
    type: 4
  },
  {
    name: 'M',
    type: 6
  },
  {
    name: 'L',
    type: 10
  },
  {
    name: 'XL',
    type: 14
  },
  { name: 'XXL', type: 16 }
]

export const TOP_SIZES_ABBR = [
  {
    name: 'XS',
    type: 'X-Small'
  },
  {
    name: 'S',
    type: 'Small'
  },
  {
    name: 'M',
    type: 'Medium'
  },
  {
    name: 'L',
    type: 'Large'
  },
  {
    name: 'XL',
    type: 'X-Large'
  },
  { name: 'XXL', type: 'XX-Large' }
]

export const JEAN_SIZES = [
  {
    name: '23',
    type: 23,
    value: 'X-Small'
  },
  {
    name: '24',
    type: 24,
    value: 'X-Small'
  },
  {
    name: '25',
    type: 25,
    value: 'X-Small'
  },
  {
    name: '26',
    type: 26,
    value: 'Small'
  },
  {
    name: '27',
    type: 27,
    value: 'Medium'
  },
  {
    name: '28',
    type: 28
  },
  {
    name: '29',
    type: 29,
    value: 'Large'
  },
  {
    name: '30',
    type: 30
  },
  {
    name: '31',
    type: 31,
    value: 'X-Large'
  },
  {
    name: '32',
    type: 32
  }
]

export const BRA_SIZES = [70, 75, 80, 85, 90]

export const CUP_SIZES = ['A', 'B', 'C', 'D', 'E']

export const HEIGHT_OPTIONS = (() => {
  let arr = []
  for (let i = 150; i < 191; i++) {
    arr.push(i)
  }
  return arr
})()

export const WEIGHT_OPTIONS = (() => {
  let arr = []
  for (let i = 40; i <= 80; i++) {
    arr.push(i)
  }
  return arr
})()

export const SHAPE_UTILS = {
  Slender: '矩型',
  Heart: '倒三角型',
  Pear: '梨型',
  Hourglass: '沙漏型',
  Apple: '苹果型'
}

export const SHAPE_SHOW = ['Slender', 'Heart', 'Pear', 'Hourglass', 'Apple']

export const NAME_MAPPING = {
  上衣: 'top_size',
  裤子: 'pant_size',
  牛仔裤: 'jean_size',
  连衣裙: 'dress_size',
  半裙: 'skirt_size'
}
