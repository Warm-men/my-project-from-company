/* @flow */

import React from 'react'
import { Dimensions } from 'react-native'
import {
  createMaterialTopTabNavigator,
  createDrawerNavigator
} from 'react-navigation'
import { Collections, Occasion, Closet, Satisfied } from './controllers'
import TabBarComponent from './tab_bar'
import { FiltersContainer } from '../'

const getCurrentController = (screens, name) => {
  const SwapController = createMaterialTopTabNavigator(screens, {
    tabBarComponent: data => {
      return <TabBarComponent {...data} name={name} />
    },
    tabBarPosition: 'top',
    lazy: true,
    animationEnabled: true,
    swipeEnabled: true
  })
  SwapController.navigationOptions = ({ navigation }) => {
    let drawerLockMode = 'locked-closed'
    let activeRoute = navigation.state.routes[navigation.state.index]
    if (activeRoute.routes && activeRoute.index > 0) {
      drawerLockMode = 'locked-closed'
    }
    return {
      drawerLockMode
    }
  }

  return SwapController
}

const ScreensIncludeOccasion = {
  SwapOccasion: { screen: Occasion },
  SwapCollection: { screen: Collections }
}
const Screens = {
  SwapCollection: { screen: Collections }
}
const ScreensCloset = {
  SwapCloset: { screen: Closet }
}
const ScreensOnboarding = {
  SwapCollection: { screen: Collections },
  SwapCloset: { screen: Closet }
}
const SwapSatisfiedCloset = {
  SwapSatisfiedCloset: { screen: Satisfied }
}
const SatisfiedCloset = {
  SatisfiedCloset: { screen: Satisfied }
}

const width = Dimensions.get('window').width * 0.8

getCurrentDrawerController = (tabController, name) => {
  const SwapDrawerController = createDrawerNavigator(
    {
      SwapCollection: {
        screen: tabController
      }
    },
    {
      drawerWidth: width,
      drawerPosition: 'right',
      navigationOptions: {
        drawerLockMode: 'locked-closed'
      },
      contentComponent: props => {
        return (
          <FiltersContainer
            navigation={props.navigation}
            name={name || 'swap'}
          />
        )
      }
    }
  )

  return SwapDrawerController
}
//帮我推荐
const SwapController = getCurrentDrawerController(
  getCurrentController(Screens, 'default')
)
//度假套餐帮我推荐
const SwapOccasionController = getCurrentDrawerController(
  getCurrentController(ScreensIncludeOccasion, 'occasion')
)
//Onboarding 换装
const SwapOnboardingController = getCurrentDrawerController(
  getCurrentController(ScreensOnboarding, 'onboarding')
)
//新衣箱空衣位选衣
const SwapClosetController = getCurrentDrawerController(
  getCurrentController(ScreensCloset, 'closet')
)

const SwapSatisfiedClosetController = getCurrentDrawerController(
  getCurrentController(SwapSatisfiedCloset, 'satisfied'),
  'satisfied'
)

const SatisfiedClosetController = getCurrentDrawerController(
  getCurrentController(SatisfiedCloset, 'satisfied'),
  'satisfied'
)
export {
  SwapController,
  SwapOccasionController,
  SwapOnboardingController,
  SwapClosetController,
  SwapSatisfiedClosetController,
  SatisfiedClosetController
}
