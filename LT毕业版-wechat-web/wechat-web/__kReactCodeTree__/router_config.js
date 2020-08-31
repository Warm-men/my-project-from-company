// {
//   IndexRoute?: Boolean
//   disableLazy?: Boolean
//   componentRelativePath: string
// }

module.exports = [
  {
    IndexRoute: true,
    componentRelativePath: 'src/app/containers/homepage/container.jsx'
  },
  {
    path: '/home',
    componentRelativePath: 'src/app/containers/homepage/container.jsx'
  },
  {
    path: '/brands',
    componentRelativePath: 'src/app/containers/brands/brands'
  },
  {
    path: '/filter_modal',
    componentRelativePath: 'src/app/containers/filter_modal'
  },
  {
    path: '/new_clothes_free',
    componentRelativePath: 'src/app/containers/new_clothes_free'
  },
  {
    path: '/plans_cancel',
    componentRelativePath: 'src/app/containers/plans/plans_cancel'
  },
  {
    path: '/new_clothes_free_other',
    componentRelativePath: 'src/app/containers/new_clothes_free'
  },
  {
    path: '/new_clothes_free_special',
    componentRelativePath: 'src/app/containers/new_clothes_free'
  },
  {
    path: '/occasion/:slug',
    componentRelativePath: 'src/app/containers/products/occasion'
  },
  {
    path: '/temp_vip',
    componentRelativePath:
      'src/app/containers/new_clothes_free/save_promo_code_wallet'
  },
  {
    path: '/application_result',
    componentRelativePath:
      'src/app/containers/new_clothes_free/application_result'
  },
  {
    path: '/customer-photos',
    componentRelativePath:
      'src/app/containers/customer_photos/customer_photos_container'
  },
  {
    path: '/letote',
    componentRelativePath: 'src/app/containers/follow_wechat_account'
  },

  {
    path: '/account',
    componentRelativePath: 'src/app/containers/account'
  },
  {
    path: '/about_us',
    componentRelativePath: 'src/app/containers/account/about_us'
  },

  {
    path: '/about_us/:about',
    componentRelativePath: 'src/app/containers/account/about_us/about_detail'
  },
  {
    path: '/referral',
    componentRelativePath: 'src/app/containers/referral'
  },

  {
    path: '/address',
    componentRelativePath: 'src/app/containers/address'
  },
  {
    path: '/card_exchange',
    componentRelativePath: 'src/app/containers/account/membership_card_exchange'
  },
  {
    path: '/exchange_result',
    componentRelativePath:
      'src/app/containers/account/membership_card_exchange/exchange_results'
  },
  {
    path: '/open_free_service',
    componentRelativePath: 'src/app/containers/free_service/open_free_service'
  },
  {
    path: '/free_service_help',
    componentRelativePath: 'src/app/containers/free_service/free_service_help'
  },
  {
    path: '/free_service_active',
    componentRelativePath: 'src/app/containers/free_service/free_service_active'
  },
  {
    path: '/cancel_free_service',
    componentRelativePath: 'src/app/containers/free_service/cancel_free_service'
  },
  {
    path: '/refunding_free_service',
    componentRelativePath:
      'src/app/containers/free_service/refunding_free_service'
  },
  {
    path: '/open_free_service_successful',
    componentRelativePath:
      'src/app/containers/free_service/open_free_service_successful'
  },
  {
    path: '/unbind_jd_credit',
    componentRelativePath: 'src/app/containers/account/unbind_jd_credit_success'
  },
  {
    path: '/jd_credit_judge',
    componentRelativePath: 'src/app/containers/jd/jd_credit_judge'
  },
  {
    path: '/referral_detail',
    componentRelativePath: 'src/app/containers/referral/referral_detail'
  },
  {
    path: '/credit_account',
    componentRelativePath: 'src/app/containers/account/credit_account'
  },
  {
    path: '/web-view',
    componentRelativePath: 'src/app/containers/web-view/index.jsx'
  },
  {
    path: '/referral_progress',
    componentRelativePath: 'src/app/containers/referral/invitation_progress'
  },
  {
    path: '/referral_free_tote',
    componentRelativePath:
      'src/app/containers/new_clothes_free/referral_free_tote'
  },
  {
    path: '/payment_pending',
    componentRelativePath: 'src/app/containers/account/payment_pending'
  },
  {
    path: '/payment_success',
    componentRelativePath:
      'src/app/containers/account/payment_pending/payment_success'
  },
  {
    path: '/style_profile',
    componentRelativePath: 'src/app/containers/style_profile',
    routers: [
      {
        IndexRoute: true,
        componentRelativePath:
          'src/app/containers/style_profile/style_profile_main'
      },
      {
        path: 'shape',
        componentRelativePath: 'src/app/containers/style_profile/shape'
      },
      {
        path: 'workplace',
        componentRelativePath: 'src/app/containers/style_profile/workplace'
      },
      {
        path: 'Filters',
        componentRelativePath: 'src/app/containers/style_profile/filters_quiz'
      },
      {
        path: 'style',
        componentRelativePath: 'src/app/containers/style_profile/style'
      },

      {
        path: 'figure_input',
        componentRelativePath:
          'src/app/containers/style_profile/size/figure_input.jsx'
      },
      {
        path: 'size_input',
        componentRelativePath:
          'src/app/containers/style_profile/size/size_input.jsx'
      }
    ]
  },
  {
    path: '/new_totes',
    componentRelativePath: 'src/app/containers/totes/new_totes'
  },
  {
    path: '/select_size/:type',
    componentRelativePath: 'src/app/containers/style_profile/size/select_size'
  },
  {
    path: '/promo_code/:status',
    componentRelativePath: 'src/app/containers/account/promo_code'
  },
  {
    path: '/plans_promo_code',
    componentRelativePath: 'src/app/containers/plans/available_promo_list'
  },
  {
    path: '/membership',
    componentRelativePath:
      'src/app/containers/profile/membership/membership_container'
  },
  {
    path: '/free_password',
    componentRelativePath: 'src/app/containers/profile/free_password'
  },
  {
    path: '/cancel_free_password',
    componentRelativePath:
      'src/app/containers/profile/free_password/cancel_free_password'
  },
  {
    path: '/free_password_error',
    componentRelativePath:
      'src/app/containers/profile/free_password/free_password_error'
  },
  {
    path: '/agreement_free_password',
    componentRelativePath: 'src/app/containers/profile/free_password/agreement'
  },
  {
    path: '/hold',
    componentRelativePath: 'src/app/containers/profile/hold/hold_container'
  },
  {
    path: '/hold_success',
    componentRelativePath: 'src/app/containers/profile/hold/hold_success'
  },
  {
    path: '/membershipexpired',
    componentRelativePath:
      'src/app/containers/profile/membership/membership_expired'
  },
  {
    path: '/membershiponhold',
    componentRelativePath:
      'src/app/containers/profile/membership/membership_onhold'
  },
  {
    path: '/wrongpage',
    componentRelativePath: 'src/app/containers/wrongpage/wrongpage'
  },
  {
    path: '/sesamecredit',
    componentRelativePath: 'src/app/containers/sesamecredit'
  },
  {
    path: '/confirm-totes',
    componentRelativePath: 'src/app/containers/totes/confirm_totes'
  },
  {
    path: '/migration_details',
    componentRelativePath: 'src/app/containers/totes/confirm_totes/migration'
  },
  {
    path: '/migration_success',
    componentRelativePath:
      'src/app/containers/totes/confirm_totes/migration/migration_success'
  },
  {
    path: '/confirm-totes-success',
    componentRelativePath:
      'src/app/containers/totes/confirm_totes/confirm_totes_success'
  },
  {
    path: '/express',
    componentRelativePath: 'src/app/containers/express'
  },
  {
    path: '/update_nickname',
    componentRelativePath:
      'src/app/containers/account/update_userinfo/update_nickname'
  },
  {
    path: '/update_tel',
    componentRelativePath:
      'src/app/containers/account/update_userinfo/update_tel'
  },
  {
    path: '/agreement',
    componentRelativePath: 'src/app/containers/agreement'
  },

  {
    path: '/update_userinfo',
    componentRelativePath: 'src/app/containers/account/update_userinfo'
  },

  {
    path: '/all_products',
    componentRelativePath: 'src/app/containers/products/products_all'
  },
  {
    path: '/brands/:id',
    componentRelativePath: 'src/app/containers/products/products_brand'
  },
  {
    path: '/closet',
    componentRelativePath: 'src/app/containers/products/products_closet'
  },
  {
    path: '/perfect_closet',
    componentRelativePath: 'src/app/containers/products/products_perfect_closet'
  },
  {
    path: '/filterTerms/:type/filterTerm/:filterTerm',
    componentRelativePath: 'src/app/containers/products/products_filter_terms'
  },
  {
    path: '/new_product',
    componentRelativePath: 'src/app/containers/products/products_new'
  },
  {
    path: '/collections/:id',
    componentRelativePath:
      'src/app/containers/browse_collection/browse_collection_container',
    routers: [
      {
        path: 'products/:product_id',
        componentRelativePath: 'src/app/containers/product/product_container'
      }
    ]
  },
  {
    path: '/collections_list',
    componentRelativePath:
      'src/app/containers/browse_collection/browse_collection_list.jsx'
  },
  {
    path: 'products/:product_id',
    componentRelativePath: 'src/app/containers/product/product_container'
  },
  { path: 'plans', componentRelativePath: 'src/app/containers/plans' },
  {
    path: '/promo_plans',
    componentRelativePath: 'src/app/containers/plans/promo_plans'
  },
  {
    path: '/referral_plans',
    componentRelativePath: 'src/app/containers/plans/referral_plans'
  },
  {
    path: '/mplans',
    componentRelativePath: 'src/app/containers/plans/mplans'
  },
  {
    path: '/plans_success',
    componentRelativePath: 'src/app/containers/plans/plans_success'
  },
  {
    path: '/annual_card_loading',
    componentRelativePath: 'src/app/containers/plans/annual_card'
  },
  {
    path: '/fullscreen',
    componentRelativePath: 'src/app/containers/product/full_screen_web'
  },
  {
    path: 'totes',
    componentRelativePath: 'src/app/containers/totes'
  },
  {
    path: 'ratings',
    componentRelativePath: 'src/app/containers/ratings/ratings_container'
  },
  {
    path: 'perfect_closets',
    componentRelativePath: 'src/app/containers/perfect_closets'
  },
  {
    path: 'rating_product/:tote_product_id',
    componentRelativePath:
      'src/app/containers/ratings/rating_products/ratings_product'
  },
  {
    path: 'rating_products',
    componentRelativePath: 'src/app/containers/ratings/rating_products'
  },
  {
    path: '/totes_clothes_coupon',
    componentRelativePath: 'src/app/containers/totes/new_totes/apply_coupon'
  },
  {
    path: 'schedule_return',
    componentRelativePath: 'src/app/containers/schedule_return'
  },
  {
    path: '/quiz_page',
    componentRelativePath: 'src/app/containers/quiz_page'
  },
  {
    path: '/schedule_return_done',
    componentRelativePath:
      'src/app/containers/schedule_return/schedule_return_done'
  },
  {
    path: '/hive_box',
    componentRelativePath: 'src/app/containers/schedule_return/hive_box'
  },
  {
    path: '/hive_box_fill',
    componentRelativePath: 'src/app/containers/totes/hive_box_fill'
  },
  {
    path: '/past_totes_list',
    componentRelativePath:
      'src/app/containers/totes/past_totes/past_totes_list.jsx'
  },
  {
    path: '/purchase_product/:tote_product_id',
    componentRelativePath: 'src/app/containers/totes/purchase_tote_products'
  },
  {
    path: '/purchased_detail',
    componentRelativePath:
      'src/app/containers/totes/purchase_tote_products/purchased_product'
  },
  {
    path: '/schedule_return_success',
    componentRelativePath: 'src/app/containers/schedule_return/schedule_success'
  },
  {
    path: '/modify_schedule_return',
    componentRelativePath:
      'src/app/containers/schedule_return/modify_schedule_return'
  },
  {
    path: '/schedule_return_detail',
    componentRelativePath:
      'src/app/containers/schedule_return/schedule_return_detail'
  },
  {
    path: '/check_rating_product',
    componentRelativePath: 'src/app/containers/ratings/check_rating_product'
  },
  {
    path: '/product_size_chart',
    componentRelativePath: 'src/app/containers/product/product_size_chart'
  },
  {
    path: '/measure_detail',
    componentRelativePath: 'src/app/containers/measure_detail'
  },
  {
    path: '/measure_detail_input',
    componentRelativePath:
      'src/app/containers/measure_detail/measure_detail_input'
  },
  {
    path: '/figure_detail_input',
    componentRelativePath:
      'src/app/containers/measure_detail/figure_detail_input'
  },
  {
    path: '/breath_introduce',
    componentRelativePath: 'src/app/containers/measure_detail/breath_measure'
  },
  {
    path: '/schedule_fail',
    componentRelativePath: 'src/app/containers/schedule_return/schedule_fail'
  },
  {
    path: '/get-started',
    componentRelativePath: 'src/app/containers/onboarding/onboarding_container',
    routers: [
      {
        IndexRoute: true,
        componentRelativePath: 'src/app/containers/onboarding/city'
      },
      {
        path: 'start',
        componentRelativePath: 'src/app/containers/onboarding/start'
      },
      {
        path: 'basic_data',
        componentRelativePath: 'src/app/containers/onboarding/basic_data'
      },
      {
        path: 'city',
        componentRelativePath: 'src/app/containers/onboarding/city'
      },
      {
        path: 'shape',
        componentRelativePath: 'src/app/containers/onboarding/shape'
      },
      {
        path: 'shape_waist',
        componentRelativePath: 'src/app/containers/onboarding/shape/waist'
      },
      {
        path: 'shape_belly',
        componentRelativePath: 'src/app/containers/onboarding/shape/belly'
      },
      {
        path: 'shape_shoulder',
        componentRelativePath: 'src/app/containers/onboarding/shape/shoulder'
      },
      {
        path: 'basic_size',
        componentRelativePath: 'src/app/containers/onboarding/basic_size'
      },
      {
        path: 'measurefile',
        componentRelativePath: 'src/app/containers/onboarding/measurefile'
      },
      {
        path: 'style',
        componentRelativePath: 'src/app/containers/onboarding/style'
      },
      {
        path: 'finish',
        componentRelativePath: 'src/app/containers/onboarding/finish'
      },
      {
        path: 'size',
        componentRelativePath: 'src/app/containers/onboarding/size/index'
      },
      {
        path: 'signin',
        componentRelativePath:
          'src/app/containers/authentication/mobile_authentication'
      },
      {
        path: 'size_skirt',
        componentRelativePath: 'src/app/containers/onboarding/size/skirt'
      },
      {
        path: 'size_jean_fitting',
        componentRelativePath: 'src/app/containers/onboarding/size/jean_fitting'
      },
      {
        path: 'size_jean',
        componentRelativePath: 'src/app/containers/onboarding/size/jean'
      }
    ]
  },
  {
    path: '/onboarding_v2',
    componentRelativePath: 'src/app/containers/onboarding_v2',
    routers: [
      {
        path: 'my_fashion_wish',
        componentRelativePath:
          'src/app/containers/onboarding_v2/my_fashion_wish_step_one'
      },
      {
        path: 'my_style',
        componentRelativePath:
          'src/app/containers/onboarding_v2/my_style_step_two'
      },
      {
        path: 'color_of_skin',
        componentRelativePath:
          'src/app/containers/onboarding_v2/color_of_skin_step_three'
      },
      {
        path: 'shape',
        componentRelativePath:
          'src/app/containers/onboarding_v2/shape_step_four'
      },
      {
        path: 'basic_size',
        componentRelativePath:
          'src/app/containers/onboarding_v2/basic_size_step_five'
      },
      {
        path: 'defects',
        componentRelativePath:
          'src/app/containers/onboarding_v2/defects_step_six'
      },
      {
        path: 'scene_problem',
        componentRelativePath:
          'src/app/containers/onboarding_v2/scene_problem_step_seven'
      },
      {
        path: 'basic_info',
        componentRelativePath:
          'src/app/containers/onboarding_v2/basic_infomation_step_eight'
      }
    ]
  },
  {
    path: '/totes_v2',
    componentRelativePath: 'src/app/containers/onboarding_v2/totes'
  },
  {
    path: '/loading_totes',
    componentRelativePath: 'src/app/containers/onboarding_v2/loading-tote'
  },
  {
    path: '/onboarding_loading',
    componentRelativePath: 'src/app/containers/onboarding_v2/onboarding-loading'
  },
  {
    path: '/confirm_personal_info',
    componentRelativePath:
      'src/app/containers/onboarding_v2/confirm_personal_info'
  },
  {
    path: '/promo_code_list',
    componentRelativePath:
      'src/app/containers/totes/purchase_tote_products/promo_code_list'
  },
  {
    path: '/real_name_auth',
    componentRelativePath: 'src/app/containers/real_name_auth'
  },
  {
    path: '/customize',
    componentRelativePath: 'src/app/containers/tote_swap',
    routers: [
      {
        IndexRoute: true,
        componentRelativePath:
          'src/app/containers/tote_swap/tote_swap_collections_container'
      },
      {
        path: 'vacation',
        componentRelativePath:
          'src/app/containers/tote_swap/tote_swap_gallery_container'
      },
      {
        path: 'collections',
        componentRelativePath:
          'src/app/containers/tote_swap/tote_swap_collections_container'
      },
      {
        path: 'collection_products/:id',
        componentRelativePath:
          'src/app/containers/tote_swap/collections_products'
      },
      {
        path: 'closet',
        componentRelativePath: 'src/app/containers/products/products_closet'
      },
      {
        path: 'product/:product_id',
        componentRelativePath: 'src/app/containers/product/product_container'
      }
    ]
  },
  {
    path: '/h5_login',
    componentRelativePath: 'src/app/containers/h5/login'
  },
  {
    path: '/h5_plans_success',
    componentRelativePath: 'src/app/containers/h5/payment_success'
  },
  {
    path: '/h5_follow_lt',
    componentRelativePath: 'src/app/containers/h5/follow_letote'
  },
  {
    path: '/kol_success',
    componentRelativePath: 'src/app/containers/activity/kol_h5/kol_success'
  },
  {
    path: '/share_list',
    componentRelativePath: 'src/app/containers/share_list'
  },
  {
    path: '/share_photo/:id/:product_id/:tote_id',
    componentRelativePath: 'src/app/containers/share_list/share_photo'
  },
  {
    path: '/related_list',
    componentRelativePath:
      'src/app/components/customer_photos/share_photo/related_list'
  },
  {
    path: '/open',
    routers: [
      {
        path: 'product_intro',
        componentRelativePath:
          'src/app/containers/homepage/components/product_introduce'
      },
      {
        path: 'homepage_clean',
        componentRelativePath:
          'src/app/containers/homepage/components/homepage_clean'
      }
    ]
  },
  {
    path: '/customer_photos',
    componentRelativePath:
      'src/app/containers/customer_photos/customer_photos_finish'
  },
  {
    path: '/customer_photos_mycenter',
    componentRelativePath:
      'src/app/containers/customer_photos/customer_photos_mycenter'
  },
  {
    path: '/customer_photo_details',
    componentRelativePath:
      'src/app/containers/customer_photos/customer_photos_details'
  },
  {
    path: '/share_photos_finished/:id/:product_id/:tote_id',
    componentRelativePath:
      'src/app/components/customer_photos/share_photos_finished'
  },
  {
    path: '/service_rating',
    componentRelativePath: 'src/app/containers/service_rating'
  },
  {
    path: '/service_rating_success',
    componentRelativePath:
      'src/app/containers/service_rating/service_rating_success'
  },
  {
    path: '/service_rating_review',
    componentRelativePath:
      'src/app/containers/service_rating/service_rating_review'
  },
  {
    path: '/complete_size_success',
    componentRelativePath: 'src/app/containers/complete_size'
  },
  {
    path: '/share_photo_incentive',
    componentRelativePath: 'src/app/containers/share_photo_incentive'
  },
  {
    path: '/jd_exchange_mid_page',
    componentRelativePath: 'src/app/containers/jd/exchange_page/middle_page'
  },
  {
    path: '/jd_exchange_page',
    componentRelativePath: 'src/app/containers/jd/exchange_page'
  },
  {
    path: '/jd_exchange_success',
    componentRelativePath: 'src/app/containers/jd/exchange_page/success.jsx'
  }
]
