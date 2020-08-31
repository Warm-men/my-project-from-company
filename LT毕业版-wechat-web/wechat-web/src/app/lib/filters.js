const SHARED_FAMILIES = [
  'black',
  'white',
  'gray',
  'cream',
  'pink',
  'yellow',
  'orange',
  'red',
  'purple',
  'brown',
  'blue',
  'green'
]

const ACCESSORY_FAMILIES = ['gold', 'silver', 'rose_gold']

const ALL_FAMILIES = [...SHARED_FAMILIES, ...ACCESSORY_FAMILIES]

const ALL_FAMILIES_LABELS = {
  black: '黑色',
  gray: '灰色系',
  white: '白色',
  cream: '米色系',
  brown: '棕色系',
  yellow: '黄色系',
  orange: '橙色系',
  red: '红色系',
  pink: '粉色系',
  purple: '紫色系',
  blue: '蓝色系',
  green: '绿色系',
  gold: '金色系',
  silver: '银色系',
  rose_gold: '玫瑰金'
}

const WEATHER = ['cold', 'mild', 'warm']

const WEATHER_LABELS = {
  cold: '寒冷',
  mild: '舒适',
  warm: '炎热'
}

const NEW_TERMS_LABELS = {
  dresses: '连衣裙',
  jackets: '外套',
  tops: '上衣',
  sweaters: '毛衫',
  pants: '裤子',
  skirts: '半裙',
  shorts: '短裤',
  scarves: '围巾',
  handbags: '包包',
  earrings: '耳环',
  rings: '戒指',
  bracelets: '手镯',
  necklaces: '项链',
  brooch: '胸针',
  hats: '帽饰',
  belts: '腰带',
  gloves: '手套',
  glass: '眼镜'
}

const NEW_SWAP_TERMS = [
  {
    filter_term: 'dresses',
    type: 'clothing'
  },
  {
    filter_term: 'tops',
    type: 'clothing'
  },
  {
    filter_term: 'skirts',
    type: 'clothing'
  },
  {
    filter_term: 'shorts',
    type: 'clothing'
  },
  {
    filter_term: 'pants',
    type: 'clothing'
  },
  {
    filter_term: 'sweaters',
    type: 'clothing'
  },
  {
    filter_term: 'jackets',
    type: 'clothing'
  },
  {
    filter_term: 'handbags',
    type: 'accessory'
  },
  {
    filter_term: 'earrings',
    type: 'accessory'
  },
  {
    filter_term: 'rings',
    type: 'accessory'
  },
  {
    filter_term: 'bracelets',
    type: 'accessory'
  },
  {
    filter_term: 'necklaces',
    type: 'accessory'
  },
  {
    filter_term: 'scarves',
    type: 'accessory'
  },
  {
    filter_term: 'hats',
    type: 'accessory'
  },
  {
    filter_term: 'gloves',
    type: 'accessory'
  },
  {
    filter_term: 'brooch',
    type: 'accessory'
  },
  {
    filter_term: 'belts',
    type: 'accessory'
  },
  {
    filter_term: 'glass',
    type: 'accessory'
  }
]

const THE_SECOND_LEVEL = [
  {
    name: '裙型',
    type: 'dresses',
    parent_slot_id: 26,
    product_search_slots: [
      {
        id: 56,
        name: 'A字裙'
      },
      {
        id: 57,
        name: '紧身裙'
      },
      {
        id: 58,
        name: '直筒裙'
      },
      {
        id: 59,
        name: '修身裙'
      }
    ]
  },
  {
    name: '衣型',
    type: 'jackets',
    parent_slot_id: 27,
    product_search_slots: [
      {
        id: 60,
        name: '风衣'
      },
      {
        id: 61,
        name: '大衣'
      },
      {
        id: 62,
        name: '夹克'
      },
      {
        id: 63,
        name: '马甲'
      },
      {
        id: 64,
        name: '羽绒服'
      },
      {
        id: 65,
        name: '棉衣'
      },
      {
        id: 66,
        name: '西装外套'
      },
      {
        id: 67,
        name: '牛仔外套'
      }
    ]
  },
  {
    name: '衣型',
    type: 'tops',
    parent_slot_id: 28,
    product_search_slots: [
      {
        id: 68,
        name: '衬衣'
      },
      {
        id: 69,
        name: '卫衣'
      },
      {
        id: 70,
        name: 'T恤'
      },
      {
        id: 71,
        name: '背心'
      }
    ]
  },
  {
    name: '衣型',
    type: 'sweaters',
    parent_slot_id: 29,
    product_search_slots: [
      {
        id: 72,
        name: '套头'
      },
      {
        id: 73,
        name: '开衫'
      }
    ]
  },
  {
    name: '裤型',
    type: 'pants',
    parent_slot_id: 30,
    product_search_slots: [
      {
        id: 74,
        name: '七/九分裤'
      },
      {
        id: 75,
        name: '长裤'
      },
      {
        id: 76,
        name: '牛仔裤'
      },
      {
        id: 77,
        name: '连身裤'
      }
    ]
  },
  {
    name: '裙长',
    type: 'skirts',
    parent_slot_id: 31,
    product_search_slots: [
      {
        id: 78,
        name: '长裙'
      },
      {
        id: 79,
        name: '中长裙'
      },
      {
        id: 80,
        name: '短裙'
      }
    ]
  }
]

function nothingFilterItemIsSelected(filters, filters_occasion) {
  const { filter_terms, color_families, temperature } = filters
  if (
    filter_terms.length === 0 &&
    color_families.length === 0 &&
    temperature.length === 0 &&
    _.isEmpty(filters_occasion)
  ) {
    return true
  } else {
    return false
  }
}

function mapFilters(filters, the_second_level, filters_occasion) {
  const filter_terms = filters['filter_terms']
  // NOTE: 换装中衣服和首饰需处理
  const isClothingAccessory = filters.sort === 'closet'
  let search_context = {
    product_search_sections: []
  }
  if (!_.isEmpty(filter_terms)) {
    const product_search_slots = _.map(filter_terms, item => ({
      id: Number(item),
      selected: true
    }))
    search_context.product_search_sections.push({ product_search_slots })
  }
  if (!_.isEmpty(the_second_level)) {
    search_context.product_search_sections.push({
      product_search_slots: the_second_level.map(id => ({ id, selected: true }))
    })
  }
  if (!_.isEmpty(filters_occasion)) {
    search_context.product_search_sections.push({
      product_search_slots: filters_occasion.map(id => ({ id, selected: true }))
    })
  }
  const filter = _.omit(filters, ['filter_terms'])
  if (_.isEmpty(search_context.product_search_sections)) {
    search_context = null
  }
  return {
    search_context,
    filter,
    isClothingAccessory
  }
}

export {
  SHARED_FAMILIES,
  ACCESSORY_FAMILIES,
  ALL_FAMILIES,
  WEATHER,
  WEATHER_LABELS,
  ALL_FAMILIES_LABELS,
  nothingFilterItemIsSelected,
  mapFilters,
  NEW_TERMS_LABELS,
  NEW_SWAP_TERMS,
  THE_SECOND_LEVEL
}
