/* @flow */
import React, { PureComponent } from 'react'
import SharePanel from '../../common/SharePanel'
import { abTrack } from '../../../components/ab_testing'

export default class ProductShare extends PureComponent {
  _trackGuideShareClick = () => {
    abTrack('guideShareClick', 1)
  }
  render() {
    const { navigation, product } = this.props
    const title =
      product.type === 'Clothing'
        ? '这件衣服你穿肯定超好看！快来看看！'
        : '这款太适合你了！快来看看！'
    return (
      <SharePanel
        route={navigation.state.routeName}
        product={product}
        id={product.id}
        description={'这件单品很适合你，快来看看吧 '}
        title={title}
        thumbImage={
          product.catalogue_photos[0].zoom_url
            ? product.catalogue_photos[0].zoom_url
            : product.catalogue_photos[0].full_url
        }
        onPress={this._trackGuideShareClick}
      />
    )
  }
}
