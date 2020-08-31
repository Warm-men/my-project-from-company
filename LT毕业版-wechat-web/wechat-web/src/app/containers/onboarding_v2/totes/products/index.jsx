import { browserHistory } from 'react-router'

import Swiper from 'react-id-swiper'

import 'react-id-swiper/lib/styles/css/swiper.css'
import './index.scss'

const options = {
  slidesPerView: 'auto',
  freeMode: true,
  spaceBetween: 6,
  rebuildOnUpdate: true
}

export default function ToteTrackerProducts(props) {
  const { tote } = props

  const onClick = (id, photo) => () => {
    browserHistory.push({
      pathname: `/products/${id}`,
      state: {
        img_url: photo && photo.medium_url,
        column_name: 'CurrentTote'
      }
    })
  }

  const { tote_products } = tote
  if (_.isEmpty(tote_products)) return null

  return (
    <div className="onboarding-tote-products">
      <Swiper {...options}>
        {tote_products.map(item => {
          const { id, catalogue_photos } = item.product
          const photo = catalogue_photos && catalogue_photos[0]
          return (
            <div key={id} className="product" onClick={onClick(id, photo)}>
              <img className="image" src={photo && photo.medium_url} alt={id} />
            </div>
          )
        })}
      </Swiper>
    </div>
  )
}
