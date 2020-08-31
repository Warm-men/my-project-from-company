// QUERIES
import { brands, productBrand } from 'src/app/queries/brands_query'
import browseCollection from 'src/app/queries/browse_collection_query'
import browseProduct from 'src/app/queries/browse_product_query'
import browseProductRecommendedSize from 'src/app/queries/browse_product_recommended_size_query'
import customerPhotos from 'src/app/queries/customer_photos_query'
import fullProduct from 'src/app/queries/full_product_query'
import {
  freeService,
  freeServiceCancel
} from 'src/app/queries/free_service_query'
import {
  singleCollection,
  homeCollections
} from 'src/app/queries/home_collection'
import latestTote, {
  queryIdentityAuth
} from 'src/app/queries/latest_tote_query'
import creditAccount from 'src/app/queries/credit_account'
import purchaseOverdraft from 'src/app/queries/credit_account_refund'
import productsWithFilters from 'src/app/queries/products_with_filters_query'
import ratingsTote from 'src/app/queries/ratings_tote_query'
import referrer from 'src/app/queries/referrer_query'
import subscriptionType from 'src/app/queries/subscription_type'
import subscriptionTypes from 'src/app/queries/subscription_types'
import totes from 'src/app/queries/totes_query'
import toteSwapCollection from 'src/app/queries/tote_swap_collection_query.js'
import toteSwapCollections from 'src/app/queries/tote_swap_collections_query.js'
import toteTrackerTotes from 'src/app/queries/tote_tracker_tote_query'
import toteSwapFilteredProducts from 'src/app/queries/tote_swap_filtered_products'
import subscriptionQuery from './subscription_query'
import myClosetQuery from './my_closet'
import promoCodeSelect, {
  fetchPromoCode,
  fetchMemberPromoCode
} from './promo_code_select'
import totesCheckoutpreview from './tote_checkout_preview'
import {
  onboardingQuestion,
  createOnboardingToteInput,
  createCustomerAttributes
} from './onboarding_v2'
import searchProductContext from './search_product_context'
import toteSwapCollectionProducts from './collections_products'
import toteCount from './tote_count'
import fetchExtendableSubscriptionTypes from './extendable_subscription_types'
import subscriptionMigrationPreview, {
  subscriptionMigration
} from './subscription_migration_preview'

// MUTATIONS
import {
  applyTryOnPromoCode,
  applyRentalPromoCode
} from 'src/app/queries/apply_promo_code'
import createCustomerAttributePreferences from 'src/app/queries/create_customer_attribute_preferences'
import createInstantTransaction from 'src/app/queries/create_instant_transaction'
import createPurchaseTote from 'src/app/queries/create_purchase_tote'
import markToteDelivered from 'src/app/queries/deliver_tote_query'
import rateProductQuery from 'src/app/queries/rate_product_query'
import {
  rateProductsQuery,
  rateProductsV2Query
} from 'src/app/queries/rate_products_query'
import rateToteQuery from 'src/app/queries/rate_tote_query'
import {
  HomepageBanner,
  HomepageBannerGroup
} from 'src/app/queries/homepage_banner'
import { PURCHASE_FREE_SERVICE } from 'src/app/queries/purchase_free_service'
import updateCustomer from 'src/app/queries/update_customer'
import updateStyle from 'src/app/queries/update_style'
import {
  currentCustomer,
  linkedService,
  newestSubscription
} from './current_customer'
import sesameCredit from './sesameCredit'
import updateShippingAddressApi from './update_shipping_address'
import queueProductSizer from './queue_product_sizer'
import createSubscription from './create_subscription'
import updateRatingImage from './update_rating_image'
import updateCustomerProductFilters from './update_customer_productfilters'
import { addToCloset, removeFromCloset } from './update_closet'
import scheduleAutoPickup from './schedule_return_auto_pickup'
import paymentOrders from './orders_query'
import retryPayment from './retry_payment'
import savePromoCodeToWallet from './save_promo_code_wallet'
import remommandSize from './recommand_size'
import saveReferralCode from './save_referral_code'
import HoldSubscription from 'src/app/queries/hold_subscription'
import { fetchOccasion } from './product_collection'
import { toteProduct } from './tote_product'
import * as operation from './operation'
import enableCustomerContract from './enable_customer_contract'
import disableCustomerContract from './disable_customer_contract'
import fastShipping from './fast_shipping'
import ApplyCouponToTote from './apply_coupon_to_tote'
import RemoveCouponFromTote from './remove_coupon_from_tote'
import SwapToteProduct from './swap_tote_product'
import similarProducts from './similar_product'
import SubmitSwapQuestion from './submit_swap_question'
import { popups, markPopup } from './popups'
import unbindJdCredit from './unbind_jd_credit'
import reactivateSubscription from './reactivate_subscription'
import checkoutToteProducts from './checkout_tote_products'
import order from './order_query'
import createCustomerProductsSizeFilter from './create_customer_products_size_filter'
import scheduleSelfDelivery from './schedule_return_self_delivery'
import successReferrals from './success_referrals'
import deliveredToteQuery from './delivered_tote_query'
import {
  MUTATION_REMOVE_FROM_TOTE_CART,
  MUTATION_ADD_TO_TOTE_CART,
  MUTATION_REPLACE_FOR_TOTE_CART,
  QUERY_TOTE_CART
} from './tote_cart'
import {
  MUTATION_APPLY_COUPON_TO_TOTE,
  MUTATION_REMOVE_COUPON_FROM_TOTE
} from './tote_cart_coupon'
import {
  queryCustomerPhotoInput,
  queryHomeCustomerPhotos,
  mutationLikeCustomerPhotos,
  mutationDislikeCustomerPhotos,
  queryCustomerPhotosDetailsFirst,
  queryTheRelatedCustomerPhotos,
  queryCustomerPhotosInProduct,
  queryWebCustomerPhotosToteProduct,
  queryMyCustomerPhotos,
  queryMyCustomerPhotoInfo
} from './customer_photos_summary'
import creatCustomerPhotoQuery from './creat_customer_photo'
import { MUTATION_TOTE_CART_PLACE_ORDER } from './tote_cart_place_order'
import { queryFloathover, mutationFloathover, quiz } from './float_hover_query'
import addPerfectClosets from './add_perfect_closets'
import unreturnToteParts from './unreturn_tote_parts_query'
import checkExpressStatus from './check_express_status_query'
import queryCopywritingAdjustments from './copywriting_adjustments'
import { bustPredict, waistPredict, hipsPredict } from './size_predict_query'
export {
  applyRentalPromoCode,
  applyTryOnPromoCode,
  productBrand,
  brands,
  browseCollection,
  browseProduct,
  browseProductRecommendedSize,
  creditAccount,
  purchaseOverdraft,
  createCustomerAttributePreferences,
  createInstantTransaction,
  createPurchaseTote,
  customerPhotos,
  fullProduct,
  freeService,
  freeServiceCancel,
  singleCollection,
  homeCollections,
  latestTote,
  markToteDelivered,
  productsWithFilters,
  rateProductQuery,
  rateToteQuery,
  ratingsTote,
  referrer,
  subscriptionType,
  totes,
  toteSwapCollections,
  toteTrackerTotes,
  toteSwapFilteredProducts,
  updateCustomer,
  updateStyle,
  currentCustomer,
  linkedService,
  sesameCredit,
  updateShippingAddressApi,
  queueProductSizer,
  createSubscription,
  addToCloset,
  removeFromCloset,
  subscriptionQuery,
  scheduleAutoPickup,
  paymentOrders,
  retryPayment,
  myClosetQuery,
  updateRatingImage,
  savePromoCodeToWallet,
  remommandSize,
  HomepageBanner,
  HomepageBannerGroup,
  subscriptionTypes,
  toteSwapCollection,
  saveReferralCode,
  HoldSubscription,
  fetchOccasion,
  toteProduct,
  rateProductsQuery,
  rateProductsV2Query,
  updateCustomerProductFilters,
  operation,
  enableCustomerContract,
  disableCustomerContract,
  fastShipping,
  promoCodeSelect,
  ApplyCouponToTote,
  RemoveCouponFromTote,
  newestSubscription,
  SwapToteProduct,
  similarProducts,
  SubmitSwapQuestion,
  popups,
  markPopup,
  unbindJdCredit,
  reactivateSubscription,
  checkoutToteProducts,
  order,
  totesCheckoutpreview,
  fetchPromoCode,
  fetchMemberPromoCode,
  createCustomerProductsSizeFilter,
  queryIdentityAuth,
  scheduleSelfDelivery,
  onboardingQuestion,
  createOnboardingToteInput,
  searchProductContext,
  toteSwapCollectionProducts,
  createCustomerAttributes,
  toteCount,
  successReferrals,
  fetchExtendableSubscriptionTypes,
  queryFloathover,
  mutationFloathover,
  quiz,
  subscriptionMigrationPreview,
  subscriptionMigration,
  MUTATION_REMOVE_FROM_TOTE_CART,
  MUTATION_ADD_TO_TOTE_CART,
  MUTATION_REPLACE_FOR_TOTE_CART,
  PURCHASE_FREE_SERVICE,
  MUTATION_TOTE_CART_PLACE_ORDER,
  QUERY_TOTE_CART,
  MUTATION_APPLY_COUPON_TO_TOTE,
  MUTATION_REMOVE_COUPON_FROM_TOTE,
  deliveredToteQuery,
  queryCustomerPhotoInput,
  queryHomeCustomerPhotos,
  mutationLikeCustomerPhotos,
  mutationDislikeCustomerPhotos,
  queryCustomerPhotosDetailsFirst,
  queryTheRelatedCustomerPhotos,
  creatCustomerPhotoQuery,
  queryCustomerPhotosInProduct,
  queryWebCustomerPhotosToteProduct,
  queryMyCustomerPhotos,
  queryMyCustomerPhotoInfo,
  addPerfectClosets,
  unreturnToteParts,
  checkExpressStatus,
  queryCopywritingAdjustments,
  bustPredict,
  waistPredict,
  hipsPredict
}
