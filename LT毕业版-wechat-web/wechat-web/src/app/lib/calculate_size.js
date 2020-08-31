import {
  FULL_DRESS_SIZE,
  FULL_PANT_SIZE
} from 'src/app/containers/onboarding/size.js'
import { APPStatisticManager, BaiduStatisService } from './statistics/app'

const calSize = (height, weight, trackData, ci) => {
  //ci:3-6 女装
  let size
  let sarr = []
  if (!ci || (ci >= 3 && ci <= 6)) {
    sarr = [
      'Small',
      80,
      99,
      145,
      149,
      'Small',
      90,
      99,
      150,
      169,
      'Small',
      80,
      89,
      160,
      169,
      'Medium',
      80,
      99,
      170,
      172,
      'Medium',
      90,
      99,
      173,
      175,
      'Medium',
      100,
      109,
      145,
      149,
      'Medium',
      100,
      109,
      155,
      179,
      'Large',
      110,
      119,
      145,
      149,
      'Large',
      110,
      119,
      155,
      179,
      'Large',
      120,
      129,
      155,
      159,
      'Large',
      120,
      129,
      170,
      179,
      'X-Small',
      80,
      89,
      150,
      159,
      'X-Large',
      110,
      119,
      150,
      154,
      'X-Large',
      120,
      129,
      145,
      154,
      'X-Large',
      120,
      129,
      160,
      169,
      'X-Large',
      130,
      139,
      160,
      179,
      'X-Large',
      140,
      149,
      173,
      179,
      // NOTE：不存在XX-L尺码，改为XX-Large
      'X-Large',
      130,
      139,
      150,
      159,
      'X-Large',
      140,
      149,
      155,
      172
    ]
  }

  for (let i = 0; i < sarr.length / 5; i++) {
    if (
      weight >= sarr[5 * i + 1] &&
      weight <= sarr[5 * i + 2] &&
      height >= sarr[5 * i + 3] &&
      height <= sarr[5 * i + 4]
    ) {
      size = sarr[5 * i]
      break
    }
    if (i === sarr.length / 5 - 1) {
      size = null
    }
  }
  if (ci === 6) {
    //女装裤子
    switch (size) {
      case 'X-Small':
        size = '24/25'
        break
      case 'Small':
        size = '25/26'
        break
      case 'Medium':
        size = '27/28'
        break
      case 'Large':
        size = '29/30'
        break
      case 'X-Large':
        size = '31/32'
        break
      case 'XX-Large':
        size = '33/34'
        break
      default:
        size = null
    }
  }
  // NOTE：top和dress的处理，体重大于120斤为XL，否则XS
  if (!size) {
    if (weight >= 120) {
      size = 'X-Large'
      trackData &&
        APPStatisticManager.service(BaiduStatisService.id).track(
          'miss_size',
          trackData,
          'over_size'
        )
    } else {
      size = 'X-Small'
      trackData &&
        APPStatisticManager.service(BaiduStatisService.id).track(
          'miss_size',
          trackData,
          'under_size'
        )
    }
  }

  return size
}
/**
 *
 * @param {*} bra_size
 * @param {*} cup_size
 */
export const bustSizeComputed = (bra_size, cup_size) => {
  switch (cup_size) {
    case 'A':
      return bra_size + 10
    case 'B':
      return bra_size + 13
    case 'C':
      return bra_size + 15
    case 'D':
      return bra_size + 18
    case 'E':
      return bra_size + 20
    default:
      return bra_size + 10
  }
}

export function calJeanSizeFunc(pant_size) {
  let jeanSize = 24
  switch (pant_size) {
    case 0:
      return (jeanSize = 24)
    case 2:
      return (jeanSize = 25)
    case 4:
      return (jeanSize = 26)
    case 6:
      return (jeanSize = 27)
    case 8:
      return (jeanSize = 28)
    case 10:
      return (jeanSize = 29)
    case 12:
      return (jeanSize = 30)
    case 14:
      return (jeanSize = 31)
    case 16:
      return (jeanSize = 32)
    default:
      return jeanSize
  }
}

/**
 *
 *
 * @param {*} minSize
 * @param {*} maxSize
 * @param {*} size
 */
export const fixSizeRange = (minSize, maxSize, size) =>
  size >= maxSize ? maxSize : size <= minSize ? minSize : size

/**
 *
 *
 * @param {*string} height_inches
 * @param {*string} weight
 * @returns cal value
 */
export const calculateSize = (height_inches, weight) => {
  // NOTE:用户的KG体重转为斤
  const userWeight = weight * 2
  return calSize(height_inches, userWeight)
}

/**
 *
 *
 * @param {*} height_inches
 * @param {*} weight
 * @param {*} waist_size
 * @returns 计算出的jean size
 */
export const calJeanSize = (height_inches, weight, waist_size) => {
  let calJeanSizeValue
  const defaultCalulate = calculateSize(height_inches, weight)
  if (!!waist_size) {
    if (weight < 48) {
      let size = Math.ceil(waist_size / 2.54)
      calJeanSizeValue = fixSizeRange(25, 32, size)
    } else {
      let size = Math.floor(waist_size / 2.54)
      calJeanSizeValue = fixSizeRange(25, 32, size)
    }
  } else {
    if (FULL_PANT_SIZE[defaultCalulate]) {
      let size = calJeanSizeFunc(FULL_PANT_SIZE[defaultCalulate])
      calJeanSizeValue = fixSizeRange(25, 32, size)
    } else if (FULL_DRESS_SIZE[defaultCalulate]) {
      let size = calJeanSizeFunc(FULL_DRESS_SIZE[defaultCalulate])
      calJeanSizeValue = fixSizeRange(25, 32, size)
    }
  }
  return calJeanSizeValue
}

export default calSize
