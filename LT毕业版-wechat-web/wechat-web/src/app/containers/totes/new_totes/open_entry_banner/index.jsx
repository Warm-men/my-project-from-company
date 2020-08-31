import { browserHistory } from 'react-router'
import { useState, useEffect } from 'react'

const queryFreeServiceBanner = (group, success) => ({
  type: 'API:QUERY_FREE_SERVICE_BANNER',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: `query queryToteCart{
      me {
        tote_cart {
          banner(group: "${group}") { url }
        }
      }
    }`
  },
  success
})

const gotoOpenFreeServicer = () => {
  try {
    window.adhoc('track', 'freeService_banner', 1)
  } catch (error) {}
  browserHistory.push({ pathname: '/open_free_service', state: 'new_totes' })
}

export default function OpenEntryBanner(props) {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    window.adhoc('getFlags', flag => {
      const abtestVar = flag.get('D190730_NEW_TOTES_BANNER')
      const group = abtestVar === 2 ? 'abtest_08_05' : ''
      props.dispatch(
        queryFreeServiceBanner(group, (dispatch, res) => {
          setUrl(res.data.me.tote_cart.banner.url)
        })
      )
    })
  }, [])

  if (url) {
    return (
      <img
        onClick={gotoOpenFreeServicer}
        className="open-entry-banner"
        alt=""
        src={url}
      />
    )
  } else {
    return null
  }
}
