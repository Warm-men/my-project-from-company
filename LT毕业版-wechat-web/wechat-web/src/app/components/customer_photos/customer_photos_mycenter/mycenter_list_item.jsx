import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import CarouselScroll from 'src/app/components/customer_photos/customer_photos_in_product_detail/carousel_srcoll'
import LikeButton from 'src/app/containers/customer_photos/like_button'
import Follower from './followers'
import './index.scss'

const MyCenterListItem = props => {
  const {
    id,
    created_at,
    content,
    featured,
    like_customers,
    liked,
    likes_count,
    photos,
    share_topics
  } = props.item

  const { dispatch, platform } = props

  const [likeCustomers, setLikeCustomers] = useState(like_customers)

  const linkTitle = url => {
    if (platform !== 'jd') {
      window.location.href = url
    }
  }

  const updateLikeCustomers = data => {
    setLikeCustomers(data)
  }

  useEffect(() => {
    setLikeCustomers(like_customers)
  }, [like_customers])

  return (
    <div className="mycenter-list-item-card">
      <div className="content">
        <div className="time">{format(created_at, 'YYYY-MM-DD')}</div>
        <div className="header">
          {featured && (
            <div className="tag-wrapper ">
              <div className="featured">
                <span className="tag-text">精选</span>
              </div>
            </div>
          )}
          {share_topics.map(e => (
            <div className="share-topics" onClick={() => linkTitle(e.url)}>
              {e.title}
            </div>
          ))}
          <div className="text">{content}</div>
        </div>
        <div className="photos">
          <CarouselScroll dispatch={dispatch} photos={photos} id={id} />
        </div>
        <div className="footer">
          <div className="followers">
            <Follower like_customers={likeCustomers} />
          </div>
          <div className="like">
            <LikeButton
              item={{ id: id, liked: liked, likes_count: likes_count }}
              updateLikeCustomers={updateLikeCustomers}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyCenterListItem
