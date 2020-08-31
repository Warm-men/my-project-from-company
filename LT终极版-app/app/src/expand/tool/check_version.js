import React from 'react'
import { Platform } from 'react-native'
import Stories from '../../stores/stores'
import { GET, SERVICE_TYPES } from '../services/services'
import dateFns from 'date-fns'
import OccasionBanner from '../../../storybook/stories/alert/occasion_banner'

const getNewestVersionALert = () => {
  const { appStore } = Stories
  if (!appStore.versionData) {
    return
  }
  let data
  if (Platform.OS === 'ios') {
    data = appStore.versionData.ios
  } else {
    data = appStore.versionData.android
  }
  if (data) {
    const { version, min_version } = data
    if (version) {
      const isNewsetVersion = compareVersion(appStore.currentVersion, version)
      if (isNewsetVersion) {
        if (min_version) {
          const isLowest = compareVersion(appStore.currentVersion, min_version)
          if (isLowest) {
            showVersionAlert(data)
          }
        } else {
          showVersionAlert(data)
        }
      }
    }
  }
}

/* 比较版本
  return
  {
    true   有新版本
    false
  }
*/
const compareVersion = (currentVersion, newestVersion) => {
  // Major.Minor.Patch
  var currentFloat = parseFloat(currentVersion)
  var newestFloat = parseFloat(newestVersion)
  var currentPatchVersion = currentVersion.replace(currentFloat + '.', '')
  var newestPatchVersion = newestVersion.replace(newestFloat + '.', '')
  if (newestFloat > currentFloat) {
    // 线上版本的 Major版本 和 Minor 版本较高
    return true
  } else if (newestFloat < currentFloat) {
    // 线上版本的 Major版本 和 Minor 版本较低
    return false
  } else {
    // 线上版本的 Major版本 和 Minor 版本相等
    if (newestPatchVersion > currentPatchVersion) {
      // 线上版本的 增量版本 较高 有BUG 修复
      return true
    } else {
      return false
    }
  }
}

const fetchNewVersion = () => {
  GET(SERVICE_TYPES.common.FETCH_CHECK_VERSION, {}, success => {
    if (success) {
      const { appStore } = Stories
      appStore.versionData = success
    }
  })
}

const showVersionAlert = newVersion => {
  const { modalStore, appStore } = Stories
  let isShow = true
  if (appStore.latestCheckVersionTime) {
    let days = dateFns.differenceInDays(
      new Date(),
      appStore.latestCheckVersionTime
    )
    if (days < 2) {
      isShow = false
    }
  }
  if (isShow) {
    if (!modalStore.modalVisible) {
      modalStore.show(
        <OccasionBanner activityName={'VersionAlert'} extraData={newVersion} />
      )
      appStore.latestCheckVersionTime = new Date()
    }
  }
}

export { getNewestVersionALert, fetchNewVersion }
