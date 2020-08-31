import { isSubscriber } from 'src/app/lib/authentication'
import { browserHistory } from 'react-router'
import { useEffect } from 'react'

export default function GotoPagesHoc(WrapperComponent) {
  return function(props) {
    const { customer, location } = props
    const isNotSubscriber = !isSubscriber(customer)
    const isGotoPlans = location.query.isActivity && isNotSubscriber

    useEffect(() => {
      isGotoPlans && browserHistory.replace('/plans')
    })

    // NOTE：ME或者非会员时不render，防止闪烁
    if (_.isEmpty(customer) || !customer.id || isGotoPlans) {
      return null
    }
    return <WrapperComponent {...props} />
  }
}
