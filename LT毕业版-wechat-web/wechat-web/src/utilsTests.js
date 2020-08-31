import React from 'react'
import { shallow as enzymeShallow, mount as enzymeMount } from 'enzyme'
import configureStore from 'redux-mock-store'
import reducer from 'src/app/reducers/reducers'
import { routerReducer } from 'react-router-redux'
import apiMiddleware from './app/store/api_middleware'
import thunkMiddleware from './app/store/thunk_middleware'
import eventMiddleware from './app/store/event_middleware'

const middleware = [thunkMiddleware, apiMiddleware, eventMiddleware]
const mockStore = configureStore(middleware)
const allReducer = {
  ...reducer,
  routerReducer
}
/**
 *
 * @param {*} Component test component
 * @param {object} props you test component need props
 * @param {object} state redux store state
 */
export const shallow = (Component, props, state) => {
  return enzymeShallow(
    <Component
      store={mockStore({
        ...allReducer,
        ...state
      })}
      {...props}
    />
  )
}

export const mount = (Component, props, state) => {
  return enzymeMount(
    <Component
      store={mockStore({ ...allReducer, ...state })}
      {...props}
      dispatch={jest.fn()}
    />
  )
}
