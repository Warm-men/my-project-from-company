import Stores from '../../../stores/stores'
import Statistics from '../statistics'
import { abTrack } from '../../../components/ab_testing'

const onClickJoinMember = (navigation, isWebView) => {
  const { isSubscriber } = Stores.currentCustomerStore
  if (isSubscriber) {
    return
  }
  if (isWebView) {
    abTrack('h5_visit_member', 1)
  } else {
    abTrack('app_visit_member', 1)
  }
  abTrack('visit_member', 1)
  if (navigation) {
    const { routeName, params } = navigation.state
    const attributes = { screen_name: routeName }
    if (isWebView && params) {
      attributes.remind = params.uri
    }
    Statistics.onEvent({
      id: 'member_join_click',
      label: '点击开通会员按钮',
      attributes
    })
  }
}

export { onClickJoinMember }
