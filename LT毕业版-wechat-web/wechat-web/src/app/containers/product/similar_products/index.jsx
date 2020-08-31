import './index.scss'
import React from 'react'
import Row from 'src/app/components/bootstrap/row.jsx'
import Col from 'src/app/components/bootstrap/col.jsx'
import ProductsNomore from 'src/app/containers/products/products_nomore'
import ProductThumbnail from 'src/app/containers/product/product_in_list'

export default function SimilarProducts({
  product,
  pathname,
  toggleCloset,
  closetProductIds
}) {
  return (
    <div className="similar-products">
      <div className="similar-title">相似单品</div>
      <div className="similar-list">
        {_.map(_.chunk(product, 2), (row, index) => (
          <Row key={index}>
            {_.map(row, (product, product_index) => {
              if (index > 3) return null
              return (
                <Col className="col-sm-3 col-6" key={product_index}>
                  <ProductThumbnail
                    showCloset
                    isHideCart
                    isShowStock
                    product={product}
                    pathname={pathname}
                    toggleCloset={toggleCloset}
                    closetProductIds={closetProductIds}
                    isCloset={_.includes(closetProductIds, product.id)}
                    getReportData={{
                      filter_and_sort: product.id + '',
                      router: pathname,
                      column_name: 'SimilarProducts',
                      page_type: 'detail',
                      index: product_index
                        ? (index + 1) * 2
                        : (index + 1) * 2 - 1
                    }}
                  />
                </Col>
              )
            })}
          </Row>
        ))}
      </div>
      <ProductsNomore />
    </div>
  )
}
