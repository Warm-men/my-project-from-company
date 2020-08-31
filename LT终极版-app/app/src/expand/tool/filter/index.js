import filtersTermsStore from '../../../stores/filter_terms'

/*
filterItems 当前数组
item 当前选择条件
defaultItem 没有数据时候，填充的默认值

return action 事件 增加还是删减 增加是 true
*/

const updatefilterItems = (filterItems, item) => {
  const index = filterItems.indexOf(item)
  if (index === -1) {
    //不在选种状态内
    filterItems.push(item)
    return true
  } else {
    //在选种状态内
    const index = filterItems.indexOf(item)
    if (index !== -1) {
      filterItems.splice(index, 1)
    }
    return false
  }
}
const getCurrentSeason = () => {
  const month = parseInt(new Date().getMonth() + 1)
  let season
  switch (month) {
    case 11:
    case 12:
    case 1:
    case 2:
      season = 'winter'
      break
    case 3:
    case 4:
    case 5:
      season = 'spring'
      break
    case 6:
    case 7:
    case 8:
      season = 'summer'
      break
    case 9:
    case 10:
      season = 'fall'
      break
  }
  return season
}

const translateTerms = array => {
  const filter_terms = [],
    product_search_slots = []
  array.forEach(term => {
    const isNewValue = filtersTermsStore.allFilterTerms.find(i => {
      return Object.keys(i)[0] === term
    })
    if (isNewValue) {
      product_search_slots.push({ id: parseInt(term), selected: true })
    } else {
      filter_terms.push(term)
    }
  })
  return { filter_terms, product_search_slots }
}

const filterNewFilterTerms = (filterItems, secondFilterTerms, occasions) => {
  if (!filterItems) return {}

  let filter_terms = []
  const product_search_sections = []

  const obj = translateTerms(filterItems.filter_terms)
  filter_terms = filter_terms.concat(obj.filter_terms)
  if (obj.product_search_slots.length) {
    product_search_sections.push({
      product_search_slots: obj.product_search_slots
    })
  }
  if (secondFilterTerms && secondFilterTerms.length) {
    filtersTermsStore.product_search_sections.forEach(section => {
      const data = section.product_search_slots.filter(terms => {
        return secondFilterTerms.includes(terms.id.toString())
      })
      const array = data.map(item => {
        return { id: item.id, selected: true }
      })
      if (array.length) {
        product_search_sections.push({ product_search_slots: array })
      }
    })
  }

  if (occasions && occasions.length) {
    const array = []
    occasions.forEach(term => {
      array.push({ id: parseInt(term), selected: true })
    })
    if (array.length) {
      product_search_sections.push({ product_search_slots: array })
    }
  }

  return {
    search_context: product_search_sections.length
      ? { product_search_sections }
      : null,
    filter_terms
  }
}

const getFilterSecondFilterTermsWithId = id => {
  const array = filtersTermsStore.product_search_sections.filter(section => {
    return section.parent_slot_id == id
  })
  const sections = []
  array.forEach(data => {
    const terms = []
    if (data.product_search_slots) {
      data.product_search_slots.forEach(item => {
        const obj = {}
        obj[item.id] = item.name
        terms.push(obj)
      })
    }
    if (terms.length) {
      sections.push({ title: data.name, data: terms })
    }
  })
  return sections
}

export {
  updatefilterItems,
  getCurrentSeason,
  filterNewFilterTerms,
  getFilterSecondFilterTermsWithId
}
