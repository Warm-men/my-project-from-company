import React, { PureComponent } from 'react'
import 'src/assets/stylesheets/mobile/homepage.scss'
import Title from '../title'
import Actions from 'src/app/actions/actions'
import ProgressiveImage from 'src/app/components/ProgressiveImage'
import * as storage from 'src/app/lib/storage'
import { APPStatisticManager } from '../../../lib/statistics/app'

export default class HomeCollections extends PureComponent {
  gotoCollections = e => {
    return async collection => {
      const { dispatch, router } = this.props
      if (collection.collection_type === 'link' && collection.link) {
        window.location.href = collection.link
        return null
      }
      APPStatisticManager.onClickElement(e.currentTarget)
      const id = e.target.getAttribute('data-id')
      const url = `/collections/${id}`
      storage.set(url, 0)

      await dispatch(Actions.browseCollections.clearProducts(id))
      router.push(url)
    }
  }

  gotoColletionList = async () => {
    await Actions.collectionList.clearCollections()
    this.props.router.push('/collections_list')
  }

  render() {
    const { data, homepageTopics, maxCount } = this.props

    const hasMore = data.length > maxCount
    const newCollections = hasMore ? data.slice(0, maxCount) : data

    return (
      <div className="homepage-products-list">
        <Title title="时尚专题" title_content="FASHION THEME" />
        {newCollections.map((v, k) => {
          const collection = homepageTopics[v]
          const imageUrl = collection.banner_photo_url
          return (
            <div key={k} className="theme collection-container">
              <ProgressiveImage
                src={imageUrl}
                placeholder={require('../../../../assets/images/placeholder/placeholder_690_279.png')}
              >
                {image => (
                  <img
                    alt=""
                    src={image}
                    className={
                      k === newCollections.length - 1 ? '' : 'theme-banner'
                    }
                    data-id={v}
                    onClick={e => this.gotoCollections(e)(collection)}
                  />
                )}
              </ProgressiveImage>
            </div>
          )
        })}
        {hasMore && (
          <img
            onClick={this.gotoColletionList}
            className="share-more-img"
            src={require('../images/more.png')}
            alt="more"
          />
        )}
      </div>
    )
  }
}

HomeCollections.defaultProps = {
  maxCount: 2
}
