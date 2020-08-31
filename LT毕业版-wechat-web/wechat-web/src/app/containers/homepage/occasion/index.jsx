import Title from '../title'
import { useCallback } from 'react'
import { withRouter } from 'react-router'
import ProgressiveImage from 'src/app/components/ProgressiveImage'
import * as storage from 'src/app/lib/storage.js'
import Actions from 'src/app/actions/actions'
import { placeholder_335_190 } from 'src/assets/placeholder'
import { Column } from 'src/app/constants/column'
import './index.scss'
import { APPStatisticManager } from '../../../lib/statistics/app'

function Occasion(props) {
  if (_.isEmpty(props.occasion)) return null

  const onClick = pathname => async () => {
    storage.set('occasion_scroll_top', true)
    sessionStorage.setItem(pathname, 0)
    const { dispatch, router } = props
    await dispatch(Actions.allproducts.clearProducts(pathname))
    const column = Column.OccasionCollection
    router.push({ pathname, query: { column } })
  }

  const item = _.chunk(props.occasion, 3)
  return (
    <div className="homepage-products-list hp-occasion">
      <Title title="场景风格" title_content="OCCASION" />
      {_.map(item, (item, index) => (
        <SliderItem key={index} item={item} onClick={onClick} />
      ))}
    </div>
  )
}

export default withRouter(Occasion)

export function SliderItem({ item, onClick }) {
  const handleSensorts = useCallback(e => {
    APPStatisticManager.onClickElement(e.currentTarget)
  }, [])

  return (
    <div className="slider-item" onClick={handleSensorts}>
      {_.map(item, value => {
        const { image_url, title, link } = value
        return (
          <ProgressiveImage
            key={title}
            src={image_url}
            placeholder={placeholder_335_190}
          >
            {image => (
              <img
                alt={title}
                src={image}
                className="occasion-img"
                onClick={onClick(link)}
              />
            )}
          </ProgressiveImage>
        )
      })}
    </div>
  )
}
