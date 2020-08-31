import CollectionView from 'src/app/components/custom_components/collectionView'
import ProgressiveImage from 'src/app/components/ProgressiveImage'
import { placeholder_500_500, placeholder_98_98 } from 'src/assets/placeholder'
import { l10setSizeInfo } from 'src/app/lib/product_l10n.js'
import 'src/assets/stylesheets/components/desktop/customer_photos/customer_photos.scss'
import Avator from 'src/assets/images/avator.png'

import { browserHistory } from 'react-router'

import PageHelmet from 'src/app/lib/pagehelmet'

export default props => {
  const { customer_photos, onScrollToBottom, more, loading } = props

  return customer_photos ? (
    <CollectionView
      collectionName="collection"
      numberOfSections={1}
      numberOfItemsInSection={() => customer_photos.length}
      collectionCell={indexPath => {
        const {
          product_title,
          product_brand,
          product_id,
          mobile_url,
          product_photo,
          customer_city,
          customer_nickname,
          customer_avatar,
          customer_height_inches,
          product_size
        } = customer_photos[indexPath.row]

        return (
          <div className="customer-sharing-cell">
            <PageHelmet title={'最新晒单'} link={`/customer-photos`} />
            <ul className="sharing-user">
              <li>
                <ProgressiveImage
                  src={customer_avatar ? customer_avatar : Avator}
                  placeholder={placeholder_98_98}
                >
                  {image => <img src={image} alt={image} />}
                </ProgressiveImage>
              </li>
              <li>
                <span className="sharing-productname">{customer_nickname}</span>
                <span className="sharing-brand">{`${customer_city} ${
                  customer_height_inches ? `| ${customer_height_inches}CM` : ''
                } | ${
                  product_size !== '' && product_size === 'OS'
                    ? '均码'
                    : `${l10setSizeInfo(product_size)}码`
                }`}</span>
              </li>
            </ul>
            <div
              onClick={() =>
                props.handlePhotoClick(customer_photos[indexPath.row])
              }
            >
              <ProgressiveImage
                src={mobile_url}
                placeholder={placeholder_500_500}
              >
                {image => <img src={image} alt={image} />}
              </ProgressiveImage>
            </div>
            <ul
              className="sharing-product"
              onClick={() => {
                browserHistory.push({
                  pathname: `/products/${product_id}`,
                  state: {
                    column_name: 'LatestCustomerPhotos'
                  }
                })
              }}
            >
              <li>
                <ProgressiveImage
                  src={product_photo}
                  placeholder={placeholder_98_98}
                >
                  {image => <img src={image} alt={image} />}
                </ProgressiveImage>
              </li>
              <li>
                <span className="sharing-productname">{product_title}</span>
                <span className="sharing-brand">{product_brand}</span>
              </li>
            </ul>
          </div>
        )
      }}
      isMore={more}
      isLoading={loading}
      onScrollToBottom={onScrollToBottom}
      didSelected={() => {}}
    />
  ) : null
}
