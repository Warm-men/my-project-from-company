'use strict'

import { Dimensions } from 'react-native'

//设备的宽度，单位:pd
const deviceWidthDp = Dimensions.get('window').width

//设计稿宽度,单位：px
const uiWidthPx = 375
const dp_px_ratio = deviceWidthDp / uiWidthPx

/**
 * 将px转换到pd
 * @param uiElementPx 设计稿的尺寸
 * @returns {number} 实际屏幕的尺寸
 */
export default function p2d(uiElementPx, params) {
  if (params) {
    const { maxLock, minLock } = params

    //限制最大值为 uiElementPx
    if (maxLock) {
      if (uiElementPx * dp_px_ratio > uiElementPx) {
        return uiElementPx
      }
    }
    //限制最小值为 uiElementPx
    else if (minLock) {
      if (uiElementPx * dp_px_ratio < uiElementPx) {
        return uiElementPx
      }
    }
    return uiElementPx * dp_px_ratio
  } else {
    return uiElementPx * dp_px_ratio
  }
}
