import Authentication from 'src/app/lib/authentication.js'

const hadShareQualification = customer => {
  const authentication = Authentication(customer)
  return !authentication.isSpecialUser && authentication.isSubscriber
}

export const getReferralUrl = (customer, utmData) => {
  if (_.isEmpty(customer) || _.isEmpty(customer.referral_url)) {
    return ''
  }
  const url_arr = customer.referral_url.split('/')
  const referral_code = encodeURIComponent(url_arr[url_arr.length - 1])
  return `https://${window.location.host}/referral_free_tote?referral_code=${referral_code}${utmData}`
}

export const shareReferralUrl = (customer, newUrl, utmData = '') => {
  let url = (newUrl || window.location.href) + utmData
  if (hadShareQualification(customer)) {
    const referral_url = encodeURIComponent(getReferralUrl(customer, utmData))
    if (!_.isEmpty(referral_url)) {
      const url_arr = customer.referral_url.split('/')
      const referral_code = encodeURIComponent(url_arr[url_arr.length - 1])
      url += `${
        _.includes(url, '?') ? '&' : '?'
      }referral_code=${referral_code}&referral_url=${referral_url}`
    }
  }
  return url
}
