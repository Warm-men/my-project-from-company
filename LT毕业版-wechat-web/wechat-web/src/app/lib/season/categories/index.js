const filterTermIconUrl = (category, pathname) => {
  const url =
    (process.env.ASSET_HOST || './images') + `/${pathname}/${category}.png`
  try {
    return require(`${url}`)
  } catch (error) {
    return ''
  }
}

const getCategoriesWithSeason = season => {
  let pathname = 'summer'
  if (season === 'winter') {
    pathname = 'winter'
  } else if (season === 'spring' || season === 'fall') {
    pathname = 'spring_fall'
  }

  return {
    连衣裙: {
      filterTerm: 'dresses',
      img: filterTermIconUrl('dresses', pathname)
    },
    上衣: {
      filterTerm: 'tops',
      img: filterTermIconUrl('tops', pathname)
    },
    裤子: {
      filterTerm: 'pants',
      img: filterTermIconUrl('pants', pathname)
    },
    半裙: {
      filterTerm: 'skirts',
      img: filterTermIconUrl('skirts', pathname)
    },
    短裤: {
      filterTerm: 'shorts',
      img: filterTermIconUrl('shorts', pathname)
    },
    外套: {
      filterTerm: 'jackets',
      img: filterTermIconUrl('jackets', pathname)
    },
    毛衫: {
      filterTerm: 'sweaters',
      img: filterTermIconUrl('sweaters', pathname)
    },
    套装: {
      filterTerm: 'suit',
      img: filterTermIconUrl('suit', pathname)
    },
    围巾: {
      filterTerm: 'scarves',
      img: filterTermIconUrl('scarves', pathname)
    },
    包包: {
      filterTerm: 'handbags',
      img: filterTermIconUrl('handbags', pathname)
    },
    耳环: {
      filterTerm: 'earrings',
      img: filterTermIconUrl('earrings', pathname)
    },
    戒指: {
      filterTerm: 'rings',
      img: filterTermIconUrl('rings', pathname)
    },
    手镯: {
      filterTerm: 'bracelets',
      img: filterTermIconUrl('bracelets', pathname)
    },
    项链: {
      filterTerm: 'necklaces',
      img: filterTermIconUrl('necklaces', pathname)
    },
    胸针: {
      filterTerm: 'brooch',
      img: filterTermIconUrl('brooch', pathname)
    },
    帽饰: {
      filterTerm: 'hats',
      img: filterTermIconUrl('hats', pathname)
    },
    腰带: {
      filterTerm: 'belts',
      img: filterTermIconUrl('belts', pathname)
    },
    眼镜: {
      filterTerm: 'glass',
      img: filterTermIconUrl('glass', pathname)
    },
    手套: {
      filterTerm: 'gloves',
      img: filterTermIconUrl('gloves', pathname)
    }
  }
}

export { getCategoriesWithSeason }
