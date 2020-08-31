import 'src/assets/stylesheets/components/desktop/product/product.scss'
import SimilarProducts from './similar_products'
import AddToToteCartHandlerHOC from './hoc/addto_totecart'
import CatalogPhotos from 'src/app/containers/carousel/product'
import ProductInfo from 'src/app/containers/product/product_info'
import DetailButtons from 'src/app/containers/product/detail_buttons'
import DescriptionAndSizing from 'src/app/containers/product/description_and_sizing'
import CustomerPhotosListInProductDetail from 'src/app/containers/customer_photos/customer_photos_list_in_product_detail'

function ProductWrapper(props) {
  if (_.isEmpty(props.product)) return null

  const { dispatch, isOnboardingSwap, toteCart, loadingToteCart } = props

  const isClothing = props.product && props.product.type === 'Clothing'

  const handleProductToggleInCloset = () => {
    const {
      productId,
      toggleCloset,
      location: { state, pathname }
    } = props
    toggleCloset(productId, {
      router: pathname,
      page_type: 'detail',
      filter_and_sort: `${productId}`,
      column_name: state && state.column_name
    })
  }

  const {
    app,
    product,
    pathname,
    inCloset,
    customer,
    productId,
    isVacation,
    linkToPlans,
    toggleCloset,
    authentication,
    setSelectedSize,
    selectSizeObject,
    similar_products,
    closetProductIds,
    linkToSelectSize,
    customer_photo_id,
    realtimeProductRecommended
  } = props
  const selectedSizeId = selectSizeObject ? selectSizeObject.size.id : null
  const selectedSizeName = selectSizeObject ? selectSizeObject.size.name : null
  return (
    <div id="product">
      <div className="product-modal-inner">
        <CatalogPhotos
          {...props}
          {...props.miniShare}
          inCloset={inCloset}
          updateProductPhotoHeight={props.updateProductPhotoHeight}
        />
        {!authentication.isSubscriber && <i className="is-membership" />}
        <ProductInfo product={product} />
        <DescriptionAndSizing
          app={app}
          product={product}
          style={props.style}
          customer={customer}
          isClothing={isClothing}
          authentication={authentication}
          setSelectedSize={setSelectedSize}
          selectedSizeName={selectedSizeName}
          linkToSelectSize={linkToSelectSize}
          recommended_size={product.recommended_size}
          realtimeProductRecommended={realtimeProductRecommended}
        />
        <span className="product-brand">
          <div className="brand-view">
            <img
              className="product-brand-logo"
              alt=""
              src={product.brand && product.brand.logo_url}
            />
            <span className="product-brand-name">
              {product.brand && product.brand.name}
            </span>
          </div>
          <span onClick={props.gotoBrandProducts} className="more-brand">
            进入品牌
          </span>
        </span>
        <CustomerPhotosListInProductDetail
          productId={productId}
          customer_photos_pages={product.customer_photos_pages}
          customer_photo_id={customer_photo_id}
        />
        {!_.isEmpty(similar_products) && (
          <SimilarProducts
            pathname={pathname}
            product={similar_products}
            toggleCloset={toggleCloset}
            closetProductIds={closetProductIds}
          />
        )}
      </div>
      <DetailButtons
        product={product}
        toteCart={toteCart}
        dispatch={dispatch}
        inCloset={inCloset}
        customer={customer}
        loading={loadingToteCart}
        isVacation={isVacation}
        isClothing={isClothing}
        location={props.location}
        linkToPlans={linkToPlans}
        authentication={authentication}
        isOnboardingSwap={isOnboardingSwap}
        selectSizeObject={selectSizeObject}
        toggleCloset={handleProductToggleInCloset}
        handleAddToCart={() =>
          props.handleAddToCart(selectedSizeId, product, toteCart)
        }
      />
    </div>
  )
}

export default AddToToteCartHandlerHOC(ProductWrapper)
