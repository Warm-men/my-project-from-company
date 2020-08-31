import React, { useEffect } from 'react'
import CollectionView from 'src/app/components/custom_components/collectionView'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions'
import { withRouter } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import ProgressiveImage from 'src/app/components/ProgressiveImage'
import { placeholder_98_98 } from 'src/assets/placeholder'
import urlTimestamp from 'src/app/lib/url_timestamp'
import { useCallback } from 'react'
import { Column } from 'src/app/constants/column'
import 'src/assets/stylesheets/components/desktop/brands/brands.scss'

function Brands(props) {
  const fetchBrands = useCallback(() => {
    props.dispatch(
      Actions.brands.fetchBrands(
        null,
        () => {},
        data => {
          if (!_.isEmpty(data.errors)) {
            props.dispatch(
              Actions.tips.changeTips({
                isShow: true,
                content: data.errors[0].message
              })
            )
          }
        }
      )
    )
  }, [])
  const pushToDetail = useCallback(
    id => async () => {
      const { router, dispatch } = props
      const link = `/brands/${parseInt(id, 10)}`
      await dispatch(Actions.allproducts.clearProducts(link))
      const column = Column.Brand
      router.push({ pathname: urlTimestamp(link), query: { column } })
    },
    []
  )

  useEffect(() => {
    fetchBrands()
    props.dispatch(Actions.allproducts.resetFilters())
  }, [])

  const { brands, isMore, isLoading } = props
  return (
    <div className="Brands-list">
      <PageHelmet title={`全部品牌`} link="/brands" />
      <CollectionView
        numberOfSections={1}
        numberOfItemsInSection={() => props.brands.length}
        itemSize={() => ({ x: '23vw', y: '23vw' })}
        collectionCell={indexPath => {
          const { logo_url, name, id } = brands[indexPath.row]
          return (
            <div className="Brands-collection-cell">
              <ProgressiveImage src={logo_url} placeholder={placeholder_98_98}>
                {image => (
                  <img src={image} alt={name} onClick={pushToDetail(id)} />
                )}
              </ProgressiveImage>
            </div>
          )
        }}
        didSelected={() => {}}
        isMore={isMore}
        isLoading={isLoading}
        onScrollToBottom={fetchBrands}
      />
    </div>
  )
}

function mapStateToProps(state) {
  return { ...state.brands }
}

export default connect(mapStateToProps)(withRouter(Brands))
