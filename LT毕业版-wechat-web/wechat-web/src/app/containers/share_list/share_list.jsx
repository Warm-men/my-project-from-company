import ProductItem from './product_item'
import ResponsiveInfiniteScroll from 'src/app/components/shared/responsive_infinite_scroll.jsx'
import ProductsNomore from 'src/app/containers/products/products_nomore'
import ProductsLoading from 'src/app/containers/products/products_loading'
import { l10setSizeInfo } from 'src/app/lib/product_l10n.js'
import './index.scss'

const TotesList = React.memo(
  ({
    totes,
    title,
    className,
    goToShareProduct,
    linkToProducts,
    hadScrollFetch,
    isLoading,
    additional_past_totes_available,
    inCurrentTote
  }) => {
    return _.isEmpty(totes) ? null : (
      <div className={className}>
        <p>{title}</p>
        {_.map(totes, v => {
          return _.map(
            v.tote_products,
            ({ id, product, product_size, customer_photos }) => (
              <ProductItem
                key={id}
                id={id}
                tote_id={v.id}
                product_id={product.id}
                brand={product.brand && product.brand.name}
                title={product.title}
                disabled={product.disabled}
                size={
                  product_size &&
                  product_size.size &&
                  l10setSizeInfo(product_size.size.name)
                }
                goToShareProduct={goToShareProduct}
                column_name={'CurrentTote'}
                medium_url={product.catalogue_photos[0].medium_url}
                customer_photos={customer_photos}
                linkToProducts={linkToProducts}
                inCurrentTote={inCurrentTote}
              />
            )
          )
        })}
        {hadScrollFetch && (
          <div className="loading">
            {!additional_past_totes_available && <ProductsNomore />}
            {isLoading && <ProductsLoading />}
          </div>
        )}
      </div>
    )
  }
)

export default class ShareList extends React.Component {
  render() {
    const {
      past_totes,
      additional_past_totes_available,
      isLoading,
      current_totes,
      onScrollToBottom,
      goToShareProduct,
      linkToProducts
    } = this.props
    return (
      <ResponsiveInfiniteScroll
        isLoading={Boolean(isLoading)}
        isMore={Boolean(additional_past_totes_available)}
        onScrollToBottom={onScrollToBottom}
      >
        <div className="share-list">
          <TotesList
            className="newest-totes-list"
            title="最近正在穿"
            totes={current_totes}
            linkToProducts={linkToProducts}
            goToShareProduct={goToShareProduct}
            column_name={'CurrentTote'}
            inCurrentTote={true}
          />
          <TotesList
            className="past-tote-list"
            title="曾经穿过"
            totes={past_totes}
            linkToProducts={linkToProducts}
            goToShareProduct={goToShareProduct}
            column_name={'PastTote'}
            hadScrollFetch={true}
            additional_past_totes_available={additional_past_totes_available}
            isLoading={isLoading}
            inCurrentTote={false}
          />
        </div>
      </ResponsiveInfiniteScroll>
    )
  }
}
