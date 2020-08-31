import { Suspense } from 'react'
import {
  Router,
  Route,
  Redirect,
  IndexRoute,
  browserHistory
} from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import Layout from '../containers/Layout'
import Store from 'src/app/store/store.js'
import { routes } from './routerConfig.jsx'
import LoadingViewContainer from '../components/LoadingViewContainer'
import { APPStatisticManager } from '../lib/statistics/app'

const history = syncHistoryWithStore(browserHistory, Store)

function RenderRouters(route, k) {
  return route.IndexRoute ? (
    <IndexRoute
      key={k}
      path={route.path}
      component={props => <route.component {...props} />}
    />
  ) : (
    <Route
      key={k}
      path={route.path}
      component={props => <route.component {...props} />}
    >
      {_.map(route.routers, (v, key) => RenderRouters(v, key))}
    </Route>
  )
}

export default function AppRouters() {
  const scrollPosition = (preState, nextState) => {
    //storage current scroll position
    const preStoragePos = !window.SCROLL_ELEMENT
      ? document.documentElement.scrollTop || document.body.scrollTop
      : document[window.SCROLL_ELEMENT].scrollTop
    if (!window.SCROLL_ELEMENT && preStoragePos) {
      const { scrollTop } = document.body
      window.SCROLL_ELEMENT =
        scrollTop && _.isNumber(scrollTop) ? 'body' : 'documentElement'
    }
    const { pathname, search } = preState.location
    sessionStorage.setItem(pathname + search, preStoragePos)
    //restore next page scroll position
    if (window.SCROLL_ELEMENT) {
      const { pathname, search } = nextState.location
      let nextStoragePos = sessionStorage.getItem(pathname + search)
      nextStoragePos = nextStoragePos ? parseInt(nextStoragePos, 10) : 0
      document[window.SCROLL_ELEMENT].scrollTop = nextStoragePos
    }
  }

  const onChangeHook = (preState, nextState) => {
    APPStatisticManager.onRouterLeaveBefore()
    scrollPosition(preState, nextState)
  }

  return (
    <Suspense fallback={<LoadingViewContainer />}>
      <Router history={history}>
        <Route path="/" onChange={onChangeHook} component={Layout}>
          {_.map(routes, (route, k) => RenderRouters(route, k))}
        </Route>
        <Redirect from="*" to="/home" />
      </Router>
    </Suspense>
  )
}
