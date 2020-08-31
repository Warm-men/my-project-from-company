import * as Redux from 'redux'
import Reducers from '../reducers/reducers'
import apiMiddleware from './api_middleware'
import thunkMiddleware from './thunk_middleware'
import eventMiddleware from './event_middleware'
import { routerReducer } from 'react-router-redux'
import { persistStore } from 'redux-persist'

const Store = (function(Redux, Reducers) {
  const preloadedState = window.__PRELOADED_STATE__,
    middleware = Redux.applyMiddleware(
      thunkMiddleware,
      apiMiddleware,
      eventMiddleware
    ),
    reducers = Redux.combineReducers({
      ...Reducers,
      routing: routerReducer
    })

  return Redux.createStore(
    reducers,
    preloadedState,
    Redux.compose(
      middleware,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        process.env.NODE_ENV === 'development'
        ? window.__REDUX_DEVTOOLS_EXTENSION__({
            trace: true,
            name: 'Le Tote'
          })
        : f => f
    )
  )
})(Redux, Reducers)

export const persistor = persistStore(Store)

export default Store
