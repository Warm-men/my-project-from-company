import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions.js'
import MyCenterListItem from 'src/app/components/customer_photos/customer_photos_mycenter/mycenter_list_item'
import ShareButton from 'src/app/components/customer_photos/customer_photos_mycenter/share_button'
import ResponsiveInfiniteScroll from 'src/app/components/shared/responsive_infinite_scroll'
import ProductsLoading from 'src/app/containers/products/products_loading/index'
import PageHelmet from 'src/app/lib/pagehelmet'
import BackGround from './images/mycenter_background.png'
import EmptyList from './images/empty_mycenter_list.png'
import VipIcon from 'src/app/containers/customer_photos/images/vip_icon.png'
import './index.scss'

function mapStateToProps(state) {
  const { customer, app, my_customer_photos } = state
  return { customer, my_customer_photos, app }
}

const MyCenter = props => {
  const [isLoading, setIsLoading] = useState(false)
  const [isStylist, setIsStylist] = useState(false)
  const { dispatch, my_customer_photos, app, customer } = props
  const { more, page, list, limit, isEmpty } = my_customer_photos
  const { avatar_url, nickname, customer_photo, roles } = customer
  if (!customer_photo) {
    return <></>
  }
  const { customer_photo_count, featured_count, liked_count } = customer_photo

  useEffect(() => {
    getMyCustomerPhotoInfo()
    firstGetMyCustomerPhotos()
    setStylistSate()
  }, [])

  const getMyCustomerPhotoInfo = () => {
    dispatch(Actions.customerPhotosSummary.fetchMyCustomerPhotosInfo())
  }

  const scrollToGetMyCustomerPhotos = () => {
    if (isLoading) return null
    getMyCustomerPhotos()
  }

  const firstGetMyCustomerPhotos = () => {
    const variables = { page: 1, per_page: limit }
    setIsLoading(true)
    dispatch(
      Actions.customerPhotosSummary.fetchMyCustomerPhotosInit(
        variables,
        () => setIsLoading(false),
        () => setIsLoading(false)
      )
    )
  }

  const getMyCustomerPhotos = () => {
    const variables = { page, per_page: limit }
    setIsLoading(true)
    dispatch(
      Actions.customerPhotosSummary.fetchMyCustomerPhotos(
        variables,
        () => setIsLoading(false),
        () => setIsLoading(false)
      )
    )
  }

  const setStylistSate = () => {
    if (_.find(roles, { type: 'stylist' })) {
      setIsStylist(true)
    }
  }

  const renderInfo = () => {
    const { shipping_address, style } = customer
    const { height_inches } = style

    if (shipping_address && shipping_address.city) {
      return height_inches
        ? `${shipping_address.city} | ${height_inches}cm`
        : `${shipping_address.city}`
    } else {
      return height_inches ? `${height_inches}cm` : ''
    }
  }

  const renderNumber = number => {
    if (!_.isNumber(number)) return 0
    let result = number || 0
    if (_.gte(number, 1000)) {
      result = Math.round(number / 100) / 10 + 'k'
    }
    if (_.gte(number, 10000)) {
      result = Math.round(number / 1000) / 10 + 'w'
    }
    return result
  }

  const handleShareClick = () => browserHistory.push('/share_list')

  const onEndReached = () => scrollToGetMyCustomerPhotos()

  return (
    <div className="customer-photos-mycenter">
      <PageHelmet
        title={nickname || '个人主页'}
        link="/customer_photos_mycenter"
      />
      <div className="header">
        <img src={BackGround} alt="" className="background" />
        <div className="user-info-card">
          <div className="content">
            <div className="avatar-wrapper">
              <img src={avatar_url} alt="" className="avatar" />
              {isStylist && <img src={VipIcon} alt="" className="vip-icon" />}
            </div>
            <div className={isStylist ? 'nickname golden' : 'nickname'}>
              {nickname}
            </div>
            <div className="customer-info">{renderInfo()}</div>
            <div className="customer-photos">
              <div className="box">
                <div className="number">
                  {renderNumber(customer_photo_count || 0)}
                </div>
                <div className="title">晒单</div>
              </div>
              <div className="box">
                <div className="number">
                  {renderNumber(featured_count || 0)}
                </div>
                <div className="title">精选</div>
              </div>
              <div className="box">
                <div className="number">{renderNumber(liked_count || 0)}</div>
                <div className="title">获赞</div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-holder"></div>
      </div>
      {isEmpty ? (
        <div className="empty-wrapper">
          <img src={EmptyList} alt="" className="empty-list" />
          <div className="message top">分享你的穿搭感受,会对</div>
          <div className="message">他人有很大的帮助哦,快来晒单吧!</div>
          <div className="share-button" onClick={handleShareClick}>
            <span className="text">立即晒单</span>
          </div>
        </div>
      ) : (
        <>
          <ResponsiveInfiniteScroll
            onScrollToBottom={onEndReached}
            isLoading={isLoading}
            isMore={more}
          >
            <div className="share-list-wrapper">
              <div className="blank-holder" />
              {list.map((e, index) => {
                return (
                  <MyCenterListItem
                    dispatch={dispatch}
                    item={e}
                    key={index}
                    platform={app.platform}
                  />
                )
              })}
              {isLoading && <ProductsLoading />}
            </div>
          </ResponsiveInfiniteScroll>
          <ShareButton />
        </>
      )}
    </div>
  )
}

export default connect(mapStateToProps)(MyCenter)
