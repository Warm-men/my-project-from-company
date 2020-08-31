import app from './app_actions'
import allproducts from './allproducts_action'
import brands from './brands_actions'
import browseCollections from './browse_collections'
import collectionList from './collection_list_action'
import closet from './closet_actions'
import common from './common_actions'
import customer from './customer_actions'
import customerStyleInfo from './customer_style_info_actions'
import customerPhotos from './customer_photos_actions'
import creditAccount from './credit_account'
import fullscreencarousel from './full_screen_carousel_action.js'
import fullScreenCarouselPhotos from './full_screen_carousel_photos_action'
import homepage from './homepage_actions.js'
import navigation from './navigation_actions'
import onboarding from './onboarding_actions'
import products from './products_actions'
import promoCode from './promo_code_actions'
import purchaseCheckout from './purchase_checkout_actions'
import ratings from './rating_actions'
import referral from './referral_actions'
import subscription from './subscription_actions'
import subscriptionTypes from './subscription_types_actions'
import totes from './totes_actions'
import toteSwap from './tote_swap_actions'
import currentCustomer from './current_customer'
import sesameCredit from './sesamecredit_actions'
import updateShippingAddress from './update_shipping_address'
import tips from './tips_actions'
import activeQueueProduct from './queue_product_sizer'
import orders from './orders_action'
import retryPayment from './retry_payment_action'
import freePassword from './free_password_action'
import freeService from './free_service_action'
import * as operation from './operation'
import activities from './activities'
import plans from './plans_action'
import authentication from './authentication'
import searchProductContext from './search_product_context'
import collectionsProducts from './tote_swap_collections_products'
import floatHover from './float_hover_action'
import searchSuccessReferrals from './success_referrals_action'
import errorAction from './error_action'
import migrations from './migration_actions'
import toteCart from './tote_cart_actions'
import updateProductFilters from './customer_productfilters'
import relatedProduct from './related_product_action'
import customerPhotosSummary from './customer_photos_v2_actions'
import addPerfectClosets from './add_perfect_closets'
import sizePredict from './size_predict_action'
import mycloset from './mycloset_action'
//h5
import browserCustomer from './h5/customer'
import copywritingAdjustments from './copywriting_adjustments_action'

const Actions = {
  app,
  allproducts,
  brands,
  browseCollections,
  closet,
  customer,
  customerStyleInfo,
  customerPhotos,
  creditAccount,
  fullscreencarousel,
  fullScreenCarouselPhotos,
  homepage,
  navigation,
  onboarding,
  products,
  promoCode,
  purchaseCheckout,
  ratings,
  referral,
  subscription,
  subscriptionTypes,
  totes,
  toteSwap,
  currentCustomer,
  sesameCredit,
  tips,
  updateShippingAddress,
  activeQueueProduct,
  orders,
  retryPayment,
  browserCustomer,
  operation,
  freePassword,
  freeService,
  collectionList,
  activities,
  plans,
  authentication,
  searchProductContext,
  collectionsProducts,
  searchSuccessReferrals,
  floatHover,
  errorAction,
  migrations,
  common,
  toteCart,
  updateProductFilters,
  relatedProduct,
  customerPhotosSummary,
  addPerfectClosets,
  copywritingAdjustments,
  sizePredict,
  mycloset
}

export default Actions
