import React, { Component, PureComponent } from 'react'
import { Platform } from 'react-native'
import { inject, observer } from 'mobx-react'

import Container from './animation_images'
import Image from '../../../image'

@inject('viewableStore', 'currentCustomerStore', 'abTestStore')
@observer
export default class ImagesContainer extends Component {
  render() {
    const { data, style, id, abnormal, category, showToteSlot } = this.props
    const { viewableStore, currentCustomerStore, abTestStore } = this.props

    const { isSubscriber } = currentCustomerStore
    const { on_scroll_animated_list } = abTestStore
    const { isViewableImageAnimated } = this.props

    const isDisplay =
      isViewableImageAnimated &&
      !abnormal &&
      Platform.OS === 'ios' &&
      (isSubscriber || on_scroll_animated_list === 2)

    const isPlaying = isDisplay && viewableStore.onFocusIndex === id

    return (
      <ImagesComponent
        isPlaying={isPlaying}
        style={style}
        data={data}
        category={category}
        showToteSlot={showToteSlot}
      />
    )
  }
}

class ImagesComponent extends PureComponent {
  constructor(props) {
    super(props)
    this.image = props.data[0].full_url
  }

  render() {
    const { style, isPlaying, category, showToteSlot } = this.props
    if (!isPlaying || !category) {
      return <Image style={style} source={{ uri: this.image }} />
    }
    const { data } = this.props
    return (
      <Container
        data={data}
        showToteSlot={showToteSlot}
        style={style}
        category={category}
      />
    )
  }
}
