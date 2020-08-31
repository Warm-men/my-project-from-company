import version20190604 from './20190604'
import version20190417 from './20190417'
import version20190316 from './20190316'
import version20180425 from './20180425'

const getAgreementUtils = (platform = 'wechat_web', id) => {
  if (id === '20190417') {
    return version20190417(platform)
  } else if (id === '20190316') {
    return version20190316(platform)
  } else if (id === '20180425') {
    return version20180425(platform)
  } else {
    return version20190604(platform)
  }
}

export default getAgreementUtils
