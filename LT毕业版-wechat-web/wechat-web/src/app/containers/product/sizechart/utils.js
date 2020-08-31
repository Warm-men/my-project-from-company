export const UserSizeTitle = [
  {
    name: '身高',
    unit: 'cm',
    type: 'height_inches'
  },
  {
    name: '体重',
    unit: 'kg',
    type: 'weight'
  },
  {
    name: '上胸围',
    unit: 'cm',
    type: 'bust_size_number'
  },
  {
    name: '肩宽',
    unit: 'cm',
    type: 'shoulder_size'
  },
  {
    name: '腰围',
    unit: 'cm',
    type: 'waist_size'
  },
  {
    name: '臀围',
    unit: 'cm',
    type: 'hip_size_inches'
  },
  {
    name: '内腿长',
    unit: 'cm',
    type: 'inseam'
  }
]

// 裤子
export const PantsSizeTitle = [
  {
    name: '尺码',
    type: 'abbreviation'
  },
  {
    name: '腰围',
    unit: 'cm',
    type: 'waist'
  },
  {
    name: '臀围',
    unit: 'cm',
    type: 'hips'
  },
  {
    name: '内腿长',
    unit: 'cm',
    type: 'inseam'
  },
  {
    name: '前衣长',
    unit: 'cm',
    type: 'front_length'
  },
  {
    name: '后衣长',
    unit: 'cm',
    type: 'back_length'
  }
]

// 半裙
export const SkirtsSizeTitle = [
  {
    name: '尺码',
    type: 'abbreviation'
  },
  {
    name: '腰围',
    unit: 'cm',
    type: 'waist'
  },
  {
    name: '臀围',
    unit: 'cm',
    type: 'hips'
  },
  {
    name: '前衣长',
    unit: 'cm',
    type: 'front_length'
  },
  {
    name: '后衣长',
    unit: 'cm',
    type: 'back_length'
  }
]

// 连衣裙
export const DressesSizeTitle = [
  {
    name: '尺码',
    type: 'abbreviation'
  },
  {
    name: '肩宽',
    unit: 'cm',
    type: 'shoulder'
  },
  {
    name: '胸围',
    unit: 'cm',
    type: 'bust'
  },
  {
    name: '腰围',
    unit: 'cm',
    type: 'waist'
  },
  {
    name: '臀围',
    unit: 'cm',
    type: 'hips'
  },
  {
    name: '前衣长',
    unit: 'cm',
    type: 'front_length'
  },
  {
    name: '后衣长',
    unit: 'cm',
    type: 'back_length'
  }
]

// 上衣及其他
export const TopsSizeTitle = [
  {
    name: '尺码',
    type: 'abbreviation'
  },
  {
    name: '肩宽',
    unit: 'cm',
    type: 'shoulder'
  },
  {
    name: '胸围',
    unit: 'cm',
    type: 'bust'
  },
  {
    name: '腰围',
    unit: 'cm',
    type: 'waist'
  },
  {
    name: '前衣长',
    unit: 'cm',
    type: 'front_length'
  },
  {
    name: '后衣长',
    unit: 'cm',
    type: 'back_length'
  }
]

// 短裤
export const ShortsSizeTitle = [
  {
    name: '尺码',
    type: 'abbreviation'
  },
  {
    name: '腰围',
    unit: 'cm',
    type: 'waist'
  },
  {
    name: '臀围',
    unit: 'cm',
    type: 'hips'
  },
  {
    name: '前衣长',
    unit: 'cm',
    type: 'front_length'
  },
  {
    name: '后衣长',
    unit: 'cm',
    type: 'back_length'
  }
]

export const SIZE_LIMIT = {
  height_inches: {
    min: 150,
    max: 190
  },
  weight: {
    min: 40,
    max: 80
  },
  bracup: {
    min: null,
    max: null
  },
  shape: {
    min: null,
    max: null
  },
  shoulder_size: {
    max: 50,
    min: 30
  },
  waist_size: {
    min: 55,
    max: 100
  },
  hip_size_inches: {
    min: 60,
    max: 110
  },
  inseam: {
    min: 55,
    max: 85
  }
}

export const RANGE_TYPE = ['bust', 'hips', 'waist']
