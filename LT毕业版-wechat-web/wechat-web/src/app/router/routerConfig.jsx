import { lazy } from 'react'

export const routes = [
  {
    IndexRoute: true,
    component: lazy(() => import('src/app/containers/homepage/container.jsx'))
  },
  {
    path: '/home',
    component: lazy(() => import('src/app/containers/homepage/container.jsx'))
  },
  {
    path: '/brands',
    component: lazy(() => import('src/app/containers/brands/brands'))
  },
  {
    path: '/filter_modal',
    component: lazy(() => import('src/app/containers/filter_modal'))
  },
  {
    path: '/new_clothes_free',
    component: lazy(() => import('src/app/containers/new_clothes_free'))
  },
  {
    path: '/plans_cancel',
    component: lazy(() => import('src/app/containers/plans/plans_cancel'))
  },
  {
    path: '/new_clothes_free_other',
    component: lazy(() => import('src/app/containers/new_clothes_free'))
  },
  {
    path: '/new_clothes_free_special',
    component: lazy(() => import('src/app/containers/new_clothes_free'))
  },
  {
    path: '/occasion/:slug',
    component: lazy(() => import('src/app/containers/products/occasion'))
  },
  {
    path: '/temp_vip',
    component: lazy(() =>
      import('src/app/containers/new_clothes_free/save_promo_code_wallet')
    )
  },
  {
    path: '/application_result',
    component: lazy(() =>
      import('src/app/containers/new_clothes_free/application_result')
    )
  },
  {
    path: '/customer-photos',
    component: lazy(() =>
      import('src/app/containers/customer_photos/customer_photos_container')
    )
  },
  {
    path: '/letote',
    component: lazy(() => import('src/app/containers/follow_wechat_account'))
  },

  {
    path: '/account',
    component: lazy(() => import('src/app/containers/account'))
  },
  {
    path: '/about_us',
    component: lazy(() => import('src/app/containers/account/about_us'))
  },

  {
    path: '/about_us/:about',
    component: lazy(() =>
      import('src/app/containers/account/about_us/about_detail')
    )
  },
  {
    path: '/referral',
    component: lazy(() => import('src/app/containers/referral'))
  },

  {
    path: '/address',
    component: lazy(() => import('src/app/containers/address'))
  },
  {
    path: '/card_exchange',
    component: lazy(() =>
      import('src/app/containers/account/membership_card_exchange')
    )
  },
  {
    path: '/exchange_result',
    component: lazy(() =>
      import(
        'src/app/containers/account/membership_card_exchange/exchange_results'
      )
    )
  },
  {
    path: '/open_free_service',
    component: lazy(() =>
      import('src/app/containers/free_service/open_free_service')
    )
  },
  {
    path: '/free_service_help',
    component: lazy(() =>
      import('src/app/containers/free_service/free_service_help')
    )
  },
  {
    path: '/free_service_active',
    component: lazy(() =>
      import('src/app/containers/free_service/free_service_active')
    )
  },
  {
    path: '/cancel_free_service',
    component: lazy(() =>
      import('src/app/containers/free_service/cancel_free_service')
    )
  },
  {
    path: '/refunding_free_service',
    component: lazy(() =>
      import('src/app/containers/free_service/refunding_free_service')
    )
  },
  {
    path: '/open_free_service_successful',
    component: lazy(() =>
      import('src/app/containers/free_service/open_free_service_successful')
    )
  },
  {
    path: '/unbind_jd_credit',
    component: lazy(() =>
      import('src/app/containers/account/unbind_jd_credit_success')
    )
  },
  {
    path: '/jd_credit_judge',
    component: lazy(() => import('src/app/containers/jd/jd_credit_judge'))
  },
  {
    path: '/referral_detail',
    component: lazy(() => import('src/app/containers/referral/referral_detail'))
  },
  {
    path: '/credit_account',
    component: lazy(() => import('src/app/containers/account/credit_account'))
  },
  {
    path: '/web-view',
    component: lazy(() => import('src/app/containers/web-view/index.jsx'))
  },
  {
    path: '/referral_progress',
    component: lazy(() =>
      import('src/app/containers/referral/invitation_progress')
    )
  },
  {
    path: '/referral_free_tote',
    component: lazy(() =>
      import('src/app/containers/new_clothes_free/referral_free_tote')
    )
  },
  {
    path: '/payment_pending',
    component: lazy(() => import('src/app/containers/account/payment_pending'))
  },
  {
    path: '/payment_success',
    component: lazy(() =>
      import('src/app/containers/account/payment_pending/payment_success')
    )
  },
  {
    path: '/style_profile',
    component: lazy(() => import('src/app/containers/style_profile')),
    routers: [
      {
        IndexRoute: true,
        component: lazy(() =>
          import('src/app/containers/style_profile/style_profile_main')
        )
      },
      {
        path: 'shape',
        component: lazy(() => import('src/app/containers/style_profile/shape'))
      },
      {
        path: 'workplace',
        component: lazy(() =>
          import('src/app/containers/style_profile/workplace')
        )
      },
      {
        path: 'Filters',
        component: lazy(() =>
          import('src/app/containers/style_profile/filters_quiz')
        )
      },
      {
        path: 'style',
        component: lazy(() => import('src/app/containers/style_profile/style'))
      },

      {
        path: 'figure_input',
        component: lazy(() =>
          import('src/app/containers/style_profile/size/figure_input.jsx')
        )
      },
      {
        path: 'size_input',
        component: lazy(() =>
          import('src/app/containers/style_profile/size/size_input.jsx')
        )
      }
    ]
  },
  {
    path: '/new_totes',
    component: lazy(() => import('src/app/containers/totes/new_totes'))
  },
  {
    path: '/select_size/:type',
    component: lazy(() =>
      import('src/app/containers/style_profile/size/select_size')
    )
  },
  {
    path: '/promo_code/:status',
    component: lazy(() => import('src/app/containers/account/promo_code'))
  },
  {
    path: '/plans_promo_code',
    component: lazy(() =>
      import('src/app/containers/plans/available_promo_list')
    )
  },
  {
    path: '/membership',
    component: lazy(() =>
      import('src/app/containers/profile/membership/membership_container')
    )
  },
  {
    path: '/free_password',
    component: lazy(() => import('src/app/containers/profile/free_password'))
  },
  {
    path: '/cancel_free_password',
    component: lazy(() =>
      import('src/app/containers/profile/free_password/cancel_free_password')
    )
  },
  {
    path: '/free_password_error',
    component: lazy(() =>
      import('src/app/containers/profile/free_password/free_password_error')
    )
  },
  {
    path: '/agreement_free_password',
    component: lazy(() =>
      import('src/app/containers/profile/free_password/agreement')
    )
  },
  {
    path: '/hold',
    component: lazy(() =>
      import('src/app/containers/profile/hold/hold_container')
    )
  },
  {
    path: '/hold_success',
    component: lazy(() =>
      import('src/app/containers/profile/hold/hold_success')
    )
  },
  {
    path: '/membershipexpired',
    component: lazy(() =>
      import('src/app/containers/profile/membership/membership_expired')
    )
  },
  {
    path: '/membershiponhold',
    component: lazy(() =>
      import('src/app/containers/profile/membership/membership_onhold')
    )
  },
  {
    path: '/wrongpage',
    component: lazy(() => import('src/app/containers/wrongpage/wrongpage'))
  },
  {
    path: '/sesamecredit',
    component: lazy(() => import('src/app/containers/sesamecredit'))
  },
  {
    path: '/confirm-totes',
    component: lazy(() => import('src/app/containers/totes/confirm_totes'))
  },
  {
    path: '/migration_details',
    component: lazy(() =>
      import('src/app/containers/totes/confirm_totes/migration')
    )
  },
  {
    path: '/migration_success',
    component: lazy(() =>
      import(
        'src/app/containers/totes/confirm_totes/migration/migration_success'
      )
    )
  },
  {
    path: '/confirm-totes-success',
    component: lazy(() =>
      import('src/app/containers/totes/confirm_totes/confirm_totes_success')
    )
  },
  {
    path: '/express',
    component: lazy(() => import('src/app/containers/express'))
  },
  {
    path: '/update_nickname',
    component: lazy(() =>
      import('src/app/containers/account/update_userinfo/update_nickname')
    )
  },
  {
    path: '/update_tel',
    component: lazy(() =>
      import('src/app/containers/account/update_userinfo/update_tel')
    )
  },
  {
    path: '/agreement',
    component: lazy(() => import('src/app/containers/agreement'))
  },

  {
    path: '/update_userinfo',
    component: lazy(() => import('src/app/containers/account/update_userinfo'))
  },

  {
    path: '/all_products',
    component: lazy(() => import('src/app/containers/products/products_all'))
  },
  {
    path: '/brands/:id',
    component: lazy(() => import('src/app/containers/products/products_brand'))
  },
  {
    path: '/closet',
    component: lazy(() => import('src/app/containers/products/products_closet'))
  },
  {
    path: '/perfect_closet',
    component: lazy(() =>
      import('src/app/containers/products/products_perfect_closet')
    )
  },
  {
    path: '/filterTerms/:type/filterTerm/:filterTerm',
    component: lazy(() =>
      import('src/app/containers/products/products_filter_terms')
    )
  },
  {
    path: '/new_product',
    component: lazy(() => import('src/app/containers/products/products_new'))
  },
  {
    path: '/collections/:id',
    component: lazy(() =>
      import('src/app/containers/browse_collection/browse_collection_container')
    ),
    routers: [
      {
        path: 'products/:product_id',
        component: lazy(() =>
          import('src/app/containers/product/product_container')
        )
      }
    ]
  },
  {
    path: '/collections_list',
    component: lazy(() =>
      import('src/app/containers/browse_collection/browse_collection_list.jsx')
    )
  },
  {
    path: 'products/:product_id',
    component: lazy(() =>
      import('src/app/containers/product/product_container')
    )
  },
  { path: 'plans', component: lazy(() => import('src/app/containers/plans/')) },
  {
    path: '/promo_plans',
    component: lazy(() => import('src/app/containers/plans/promo_plans'))
  },
  {
    path: '/referral_plans',
    component: lazy(() => import('src/app/containers/plans/referral_plans'))
  },
  {
    path: '/mplans',
    component: lazy(() => import('src/app/containers/plans/mplans'))
  },
  {
    path: '/plans_success',
    component: lazy(() => import('src/app/containers/plans/plans_success'))
  },
  {
    path: '/annual_card_loading',
    component: lazy(() => import('src/app/containers/plans/annual_card'))
  },
  {
    path: '/fullscreen',
    component: lazy(() => import('src/app/containers/product/full_screen_web'))
  },
  {
    path: 'totes',
    component: lazy(() => import('src/app/containers/totes'))
  },
  {
    path: 'ratings',
    component: lazy(() =>
      import('src/app/containers/ratings/ratings_container')
    )
  },
  {
    path: 'perfect_closets',
    component: lazy(() => import('src/app/containers/perfect_closets'))
  },
  {
    path: 'rating_product/:tote_product_id',
    component: lazy(() =>
      import('src/app/containers/ratings/rating_products/ratings_product')
    )
  },
  {
    path: 'rating_products',
    component: lazy(() => import('src/app/containers/ratings/rating_products'))
  },
  {
    path: '/totes_clothes_coupon',
    component: lazy(() =>
      import('src/app/containers/totes/new_totes/apply_coupon')
    )
  },
  {
    path: 'schedule_return',
    component: lazy(() => import('src/app/containers/schedule_return'))
  },
  {
    path: '/quiz_page',
    component: lazy(() => import('src/app/containers/quiz_page'))
  },
  {
    path: '/schedule_return_done',
    component: lazy(() =>
      import('src/app/containers/schedule_return/schedule_return_done')
    )
  },
  {
    path: '/hive_box',
    component: lazy(() => import('src/app/containers/schedule_return/hive_box'))
  },
  {
    path: '/hive_box_fill',
    component: lazy(() => import('src/app/containers/totes/hive_box_fill'))
  },
  {
    path: '/past_totes_list',
    component: lazy(() =>
      import('src/app/containers/totes/past_totes/past_totes_list.jsx')
    )
  },
  {
    path: '/purchase_product/:tote_product_id',
    component: lazy(() =>
      import('src/app/containers/totes/purchase_tote_products')
    )
  },
  {
    path: '/purchased_detail',
    component: lazy(() =>
      import(
        'src/app/containers/totes/purchase_tote_products/purchased_product'
      )
    )
  },
  {
    path: '/schedule_return_success',
    component: lazy(() =>
      import('src/app/containers/schedule_return/schedule_success')
    )
  },
  {
    path: '/modify_schedule_return',
    component: lazy(() =>
      import('src/app/containers/schedule_return/modify_schedule_return')
    )
  },
  {
    path: '/schedule_return_detail',
    component: lazy(() =>
      import('src/app/containers/schedule_return/schedule_return_detail')
    )
  },
  {
    path: '/check_rating_product',
    component: lazy(() =>
      import('src/app/containers/ratings/check_rating_product')
    )
  },
  {
    path: '/product_size_chart',
    component: lazy(() =>
      import('src/app/containers/product/product_size_chart')
    )
  },
  {
    path: '/measure_detail',
    component: lazy(() => import('src/app/containers/measure_detail'))
  },
  {
    path: '/measure_detail_input',
    component: lazy(() =>
      import('src/app/containers/measure_detail/measure_detail_input')
    )
  },
  {
    path: '/figure_detail_input',
    component: lazy(() =>
      import('src/app/containers/measure_detail/figure_detail_input')
    )
  },
  {
    path: '/breath_introduce',
    component: lazy(() =>
      import('src/app/containers/measure_detail/breath_measure')
    )
  },
  {
    path: '/schedule_fail',
    component: lazy(() =>
      import('src/app/containers/schedule_return/schedule_fail')
    )
  },
  {
    path: '/get-started',
    component: lazy(() =>
      import('src/app/containers/onboarding/onboarding_container')
    ),
    routers: [
      {
        IndexRoute: true,
        component: lazy(() => import('src/app/containers/onboarding/city'))
      },
      {
        path: 'start',
        component: lazy(() => import('src/app/containers/onboarding/start'))
      },
      {
        path: 'basic_data',
        component: lazy(() =>
          import('src/app/containers/onboarding/basic_data')
        )
      },
      {
        path: 'city',
        component: lazy(() => import('src/app/containers/onboarding/city'))
      },
      {
        path: 'shape',
        component: lazy(() => import('src/app/containers/onboarding/shape'))
      },
      {
        path: 'shape_waist',
        component: lazy(() =>
          import('src/app/containers/onboarding/shape/waist')
        )
      },
      {
        path: 'shape_belly',
        component: lazy(() =>
          import('src/app/containers/onboarding/shape/belly')
        )
      },
      {
        path: 'shape_shoulder',
        component: lazy(() =>
          import('src/app/containers/onboarding/shape/shoulder')
        )
      },
      {
        path: 'basic_size',
        component: lazy(() =>
          import('src/app/containers/onboarding/basic_size')
        )
      },
      {
        path: 'measurefile',
        component: lazy(() =>
          import('src/app/containers/onboarding/measurefile')
        )
      },
      {
        path: 'style',
        component: lazy(() => import('src/app/containers/onboarding/style'))
      },
      {
        path: 'finish',
        component: lazy(() => import('src/app/containers/onboarding/finish'))
      },
      {
        path: 'size',
        component: lazy(() =>
          import('src/app/containers/onboarding/size/index')
        )
      },
      {
        path: 'signin',
        component: lazy(() =>
          import('src/app/containers/authentication/mobile_authentication')
        )
      },
      {
        path: 'size_skirt',
        component: lazy(() =>
          import('src/app/containers/onboarding/size/skirt')
        )
      },
      {
        path: 'size_jean_fitting',
        component: lazy(() =>
          import('src/app/containers/onboarding/size/jean_fitting')
        )
      },
      {
        path: 'size_jean',
        component: lazy(() => import('src/app/containers/onboarding/size/jean'))
      }
    ]
  },
  {
    path: '/onboarding_v2',
    component: lazy(() => import('src/app/containers/onboarding_v2')),
    routers: [
      {
        path: 'my_fashion_wish',
        component: lazy(() =>
          import('src/app/containers/onboarding_v2/my_fashion_wish_step_one')
        )
      },
      {
        path: 'my_style',
        component: lazy(() =>
          import('src/app/containers/onboarding_v2/my_style_step_two')
        )
      },
      {
        path: 'color_of_skin',
        component: lazy(() =>
          import('src/app/containers/onboarding_v2/color_of_skin_step_three')
        )
      },
      {
        path: 'shape',
        component: lazy(() =>
          import('src/app/containers/onboarding_v2/shape_step_four')
        )
      },
      {
        path: 'basic_size',
        component: lazy(() =>
          import('src/app/containers/onboarding_v2/basic_size_step_five')
        )
      },
      {
        path: 'defects',
        component: lazy(() =>
          import('src/app/containers/onboarding_v2/defects_step_six')
        )
      },
      {
        path: 'scene_problem',
        component: lazy(() =>
          import('src/app/containers/onboarding_v2/scene_problem_step_seven')
        )
      },
      {
        path: 'basic_info',
        component: lazy(() =>
          import('src/app/containers/onboarding_v2/basic_infomation_step_eight')
        )
      }
    ]
  },
  {
    path: '/totes_v2',
    component: lazy(() => import('src/app/containers/onboarding_v2/totes'))
  },
  {
    path: '/loading_totes',
    component: lazy(() =>
      import('src/app/containers/onboarding_v2/loading-tote')
    )
  },
  {
    path: '/onboarding_loading',
    component: lazy(() =>
      import('src/app/containers/onboarding_v2/onboarding-loading')
    )
  },
  {
    path: '/confirm_personal_info',
    component: lazy(() =>
      import('src/app/containers/onboarding_v2/confirm_personal_info')
    )
  },
  {
    path: '/promo_code_list',
    component: lazy(() =>
      import('src/app/containers/totes/purchase_tote_products/promo_code_list')
    )
  },
  {
    path: '/real_name_auth',
    component: lazy(() => import('src/app/containers/real_name_auth'))
  },
  {
    path: '/customize',
    component: lazy(() => import('src/app/containers/tote_swap')),
    routers: [
      {
        IndexRoute: true,
        component: lazy(() =>
          import('src/app/containers/tote_swap/tote_swap_collections_container')
        )
      },
      {
        path: 'vacation',
        component: lazy(() =>
          import('src/app/containers/tote_swap/tote_swap_gallery_container')
        )
      },
      {
        path: 'collections',
        component: lazy(() =>
          import('src/app/containers/tote_swap/tote_swap_collections_container')
        )
      },
      {
        path: 'collection_products/:id',
        component: lazy(() =>
          import('src/app/containers/tote_swap/collections_products')
        )
      },
      {
        path: 'closet',
        component: lazy(() =>
          import('src/app/containers/products/products_closet')
        )
      },
      {
        path: 'product/:product_id',
        component: lazy(() =>
          import('src/app/containers/product/product_container')
        )
      }
    ]
  },
  {
    path: '/h5_login',
    component: lazy(() => import('src/app/containers/h5/login'))
  },
  {
    path: '/h5_plans_success',
    component: lazy(() => import('src/app/containers/h5/payment_success'))
  },
  {
    path: '/h5_follow_lt',
    component: lazy(() => import('src/app/containers/h5/follow_letote'))
  },
  {
    path: '/kol_success',
    component: lazy(() =>
      import('src/app/containers/activity/kol_h5/kol_success')
    )
  },
  {
    path: '/share_list',
    component: lazy(() => import('src/app/containers/share_list'))
  },
  {
    path: '/share_photo/:id/:product_id/:tote_id',
    component: lazy(() => import('src/app/containers/share_list/share_photo'))
  },
  {
    path: '/related_list',
    component: lazy(() =>
      import('src/app/components/customer_photos/share_photo/related_list')
    )
  },
  {
    path: '/open',
    routers: [
      {
        path: 'product_intro',
        component: lazy(() =>
          import('src/app/containers/homepage/components/product_introduce')
        )
      },
      {
        path: 'homepage_clean',
        component: lazy(() =>
          import('src/app/containers/homepage/components/homepage_clean')
        )
      }
    ]
  },
  {
    path: '/customer_photos',
    component: lazy(() =>
      import('src/app/containers/customer_photos/customer_photos_finish')
    )
  },
  {
    path: '/customer_photos_mycenter',
    component: lazy(() =>
      import('src/app/containers/customer_photos/customer_photos_mycenter')
    )
  },
  {
    path: '/customer_photo_details',
    component: lazy(() =>
      import('src/app/containers/customer_photos/customer_photos_details')
    )
  },
  {
    path: '/share_photos_finished/:id/:product_id/:tote_id',
    component: lazy(() =>
      import('src/app/components/customer_photos/share_photos_finished')
    )
  },
  {
    path: '/service_rating',
    component: lazy(() => import('src/app/containers/service_rating'))
  },
  {
    path: '/service_rating_success',
    component: lazy(() =>
      import('src/app/containers/service_rating/service_rating_success')
    )
  },
  {
    path: '/service_rating_review',
    component: lazy(() =>
      import('src/app/containers/service_rating/service_rating_review')
    )
  },
  {
    path: '/complete_size_success',
    component: lazy(() => import('src/app/containers/complete_size'))
  },
  {
    path: '/share_photo_incentive',
    component: lazy(() => import('src/app/containers/share_photo_incentive'))
  },
  {
    path: '/jd_exchange_mid_page',
    component: lazy(() =>
      import('src/app/containers/jd/exchange_page/middle_page')
    )
  },
  {
    path: '/jd_exchange_page',
    component: lazy(() => import('src/app/containers/jd/exchange_page'))
  },
  {
    path: '/jd_exchange_success',
    component: lazy(() =>
      import('src/app/containers/jd/exchange_page/success.jsx')
    )
  }
]
