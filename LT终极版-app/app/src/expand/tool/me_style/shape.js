import React from 'react'
import Stores from '../../../stores/stores'
import {
  DRESS_SIZES,
  PANT_SIZES,
  TOP_SIZES_ABBR,
  SKIRT_SIZES,
  JEAN_SIZES,
  calJeanSize
} from '../size/size'
import { calSize } from '../size/calSize'

export const getGuessShape = () => {
  const { style } = Stores.currentCustomerStore
  if (style.shoulder_shape === 'WIDE') return 'Heart'
  switch (style.waist_shape) {
    case 'SMALL':
      return 'Hourglass'
    case 'NORMAL':
      return 'Pear'
    case 'H':
      return 'Slender'
    case 'FAT':
      return 'Apple'
    default:
      return ''
  }
}

export const getLetterSize = () => {
  const { style } = Stores.currentCustomerStore
  const { top_size, pant_size, dress_size, jean_size, skirt_size } = style
  let dressSize, pantSize, topSize, skirtSize, jeanSize
  DRESS_SIZES.map(item => {
    if (item.type === dress_size) {
      dressSize = item.name
    }
  })
  PANT_SIZES.map(item => {
    if (item.type === pant_size) {
      pantSize = item.name
    }
  })
  TOP_SIZES_ABBR.map(item => {
    if (item.type === top_size) {
      topSize = item.name
    }
  })
  SKIRT_SIZES.map(item => {
    if (item.type === skirt_size) {
      skirtSize = item.name
    }
  })
  JEAN_SIZES.map(item => {
    if (item.type === jean_size) {
      jeanSize = item.name
    }
  })
  return { dressSize, pantSize, topSize, skirtSize, jeanSize }
}

export const getNumberSize = styles => {
  const { style } = Stores.currentCustomerStore
  let {
    top_size,
    pant_size,
    dress_size,
    skirt_size,
    jean_size,
    waist_size,
    height_inches,
    weight
  } = style
  let topSize = top_size,
    pantSize = pant_size,
    dressSize = dress_size,
    skirtSize = skirt_size,
    jeanSize = jean_size
  if (styles) {
    height_inches = styles.height_inches
    weight = styles.weight
  }
  if (height_inches && weight) {
    let size = calSize(height_inches, weight * 2, 3)
    if (size) {
      !dress_size &&
        DRESS_SIZES.map(item => {
          if (item.name === size) {
            dressSize = item.type
          }
        })
      !pant_size &&
        PANT_SIZES.map(item => {
          if (item.name === size) {
            pantSize = item.type
          }
        })
      !top_size &&
        TOP_SIZES_ABBR.map(item => {
          if (item.name === size) {
            topSize = item.type
          }
        })
      !skirt_size &&
        SKIRT_SIZES.map(item => {
          if (item.name === size) {
            skirtSize = item.type
          }
        })
    }
    if (!jean_size) {
      if (!!waist_size) {
        if (weight < 48) {
          let size = Math.ceil(waist_size / 2.54)
          jeanSize = fixSizeRange(25, 32, size)
        } else {
          let size = Math.floor(waist_size / 2.54)
          jeanSize = fixSizeRange(25, 32, size)
        }
      } else {
        if (pantSize) {
          let size = calJeanSize(pantSize)
          jeanSize = fixSizeRange(25, 32, size)
        } else if (dressSize) {
          let size = calJeanSize(dressSize)
          jeanSize = fixSizeRange(25, 32, size)
        }
      }
    }
  }
  jeanSize = parseInt(jeanSize)

  return { dressSize, pantSize, topSize, skirtSize, jeanSize }
}

export const fixSizeRange = (minSize, maxSize, size) => {
  return size >= maxSize ? maxSize : size <= minSize ? minSize : size
}
