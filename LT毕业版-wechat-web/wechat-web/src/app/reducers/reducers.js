import app from './app_reducer'
import allproducts from './allproducts_reducer'
import brands from './brands_reducer'
import browseCollections from './browse_collections_reducer'
import closet from './closet_reducer'
import customer from './customer_reducer'
import customerPhotos from './customer_photos_reducer'
import errors from './errors_reducer'
import fullScreenCarousel from './full_screen_carousel_reducer.js'
import fullScreenCarouselInProduct from './full_screen_carousel_in_product_reducer'
import homepage from './homepage_reducer'
import onboarding from './onboarding_reducer'
import products from './products_reducer'
import promoCode from './promo_code_reducer'
import purchaseCheckout from './purchase_checkout_reducer'
import ratings from './ratings_reducer'
import subscriptionTypes from './subscription_types_reducer'
import totes from './totes_reducer'
import toteSwap from './tote_swap_reducer'
import orders from './orders_reducer'
import express from './express_reducer'
import PersistReducers from 'src/app/lib/persist_reducer'
import toteProduct from './tote_product'
import operation from './operation_reducer'
import collectionList from './collection_list_reducer'
import plans from './plans_reducer'
import migration from './migrations_reducer'
import common from './common_reducer'
import tote_cart from './tote_cart_reducer'
import share_list from './share_list_reducer'
import customerPhotosDetails from './customer_photos_details_list_reducer'
import relatedProducts from './related_product_reducer'
import shareListProduct from './share_list_product_reducer'
import homePageCustomerPhotos from './homepage_customer_photo_reducer'
import controlRouter from './router_reducer.js'
import my_customer_photos from './my_customer_photos'
import season from './season'
import myCloset from './mycloset_reducer'
/**
 * persist black list options
 */
const CUSTOMER = [
  'closet',
  'password',
  'classifyPromoCode',
  'shipping_address',
  'vacation_card'
]
const TOTES = [
  'past_totes_page',
  'loadedLatestTotes',
  'past_totes',
  'latest_rental_tote'
]

export default {
  app,
  allproducts,
  brands,
  browseCollections,
  closet,
  customer: PersistReducers({
    key: 'customer',
    name: customer,
    blacklist: CUSTOMER
  }),
  customerPhotos,
  errors,
  fullScreenCarousel,
  homepage,
  onboarding,
  products,
  promoCode,
  purchaseCheckout,
  ratings,
  subscriptionTypes,
  totes: PersistReducers({
    key: 'totes',
    name: totes,
    blacklist: TOTES
  }),
  toteSwap,
  orders,
  express,
  toteProduct,
  operation: PersistReducers({
    key: 'operation',
    name: operation,
    storageType: 'session'
  }),
  collectionList,
  plans,
  migration,
  common,
  tote_cart,
  share_list,
  customerPhotosDetails,
  relatedProducts,
  shareListProduct,
  fullScreenCarouselInProduct,
  homePageCustomerPhotos,
  controlRouter,
  my_customer_photos,
  season: PersistReducers({
    key: 'season',
    name: season
  }),
  myCloset
}
