import { SERVICE_TYPES, QNetwork, GET } from '../../services/services'
import Stores from '../../../stores/stores'
import { AsyncStorage } from 'react-native'
import { create } from 'mobx-persist'

const getFaqData = callback => {
  const hydrate = create({ storage: AsyncStorage })
  hydrate('faq', Stores.faqStore)
    .rehydrate()
    .then(() => {
      let questionsJson
      if (Stores.faqStore.faqData) {
        questionsJson = Stores.faqStore.faqData
      } else {
        questionsJson = require('./questions')
      }
      callback && callback(questionsJson)
    })
  updateFaqData()
}

const updateFaqData = callback => {
  QNetwork(
    SERVICE_TYPES.common.QUERY_FAQ,
    {},
    response => {
      const { faq_version } = response.data
      if (faq_version) {
        //有远端FAQ内容
        if (faq_version.version > Stores.faqStore.faqVersion) {
          //如果有新版本FAQ
          GET(
            faq_version.url,
            {},
            data => {
              Stores.faqStore.setFaqData(data, faq_version.version)
              callback && callback()
            },
            () => {
              // 获取更新内容失败
              callback && callback()
            }
          )
        } else {
          // 没有更新
          callback && callback()
        }
      } else {
        //没有远端FAQ内容
        callback && callback()
      }
    },
    () => {
      // 获取版本更新失败
      callback && callback()
    }
  )
}

export { getFaqData }
