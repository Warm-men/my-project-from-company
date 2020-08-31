import gql from 'graphql-tag'

const QUERY_RATINGS_FOR_TOTE = gql`
  query WebToteForRatings($id: Int) {
    tote(id: $id) {
      id
      rental
      state
      current_tote
      display_rating_progress_bar
      tote_rating {
        id
        rating
        max_rating
        calculated_rating
        tote_id
        arrived_slowly
        wrong_style
        didnt_fit
        wasnt_customized
        reason
        difficult_match
      }
      tote_products {
        id
        is_perfect
        tote_specific_price
        tote_specific_price_is_discounted
        tote_specific_price_percent_off
        product {
          activated_at
          id
          brand {
            id
            name
          }
          category {
            id
            name
            accessory
          }
          full_price
          catalogue_photos(limit: 1) {
            thumb_url
            medium_url
            full_url
          }
          title
          type
          member_price
        }
        service_question_sets {
          group_human_name
          group_name
          questions {
            display
            key
            options {
              display
              value
            }
            type
          }
        }
        service_feedback {
          quality_issues_human_names
          quality_photo_urls
        }
        transition_info {
          modified_price
        }
        transition_state
        rating {
          id
          fit
          bust
          waist
          oxidized
          quality_photo_urls
          rating_answers
          style_issue_design
          out_of_shape
          hips
          length
          shoulder
          inseam
          thigh
          times_worn
          size_rating
          style_rating
          quality_rating
          style
          style_issue_weight
          style_issue_color
          style_issue_print
          style_issue_material
          style_issue_small
          style_issue_big
          folded
          style_issue_fabric
          style_issue_pattern
          style_issue_silhouette
          quality
          smelled
          wrinkled
          damaged
          too_worn
          washed_out
          made_rough
          not_functional
          comment
        }
        product_size {
          id
          size_abbreviation
          bust_max_tolerance
          bust_min_tolerance
          hips_max_tolerance
          hips_min_tolerance
          waist_max_tolerance
          waist_min_tolerance
        }
      }
      rating_incentive {
        app_image_url
        has_incentived
        has_incentived_amount
        link
      }
    }
  }
`

const QUERY_RATINGS_FEEDBACK_RESULT = gql`
  query WebToteForRatings($tote_id: Int!, $resolve_tote_issue: Boolean) {
    feedback_result(
      tote_id: $tote_id
      resolve_tote_issue: $resolve_tote_issue
    ) {
      fit_issue_text
      main_text
      quality_issue_text
      style_issue_text
    }
  }
`

const QUERY_RATING_QUESTIONS = gql`
  query QueryRatingQuetions($tote_id: Int, $ids: [Int!]) {
    tote(id: $tote_id) {
      tote_products(ids: $ids) {
        id
        product {
          id
          category {
            id
            accessory
          }
          catalogue_photos(limit: 1) {
            id
            medium_url
          }
          title
        }
        product_size {
          id
          size_abbreviation
        }
        rating_loose_reason_display {
          allow_display
          question
          answers {
            display
            value
          }
        }
        rating_question_sets {
          group_human_name
          group_name
          questions {
            display
            key
            type
            options {
              display
              value
            }
          }
        }
      }
    }
  }
`

const QUERY_RATING_RESULTS = gql`
  query QueryRatingResults($id: ID!) {
    tote_product(id: $id) {
      id
      rating {
        style_rating
        style_score
        quality_rating
        quality_score
        worn_times_display
        size_rating
        comment
        expensiveness_score
        is_like_style
        is_like_quality
      }
    }
  }
`

const MUTATION_RATE_TOTE = gql`
  mutation WebRateTote($tote_rating: RateToteInput!) {
    RateTote(input: $tote_rating) {
      rating_incentive {
        incentive_amount
        incentive_amount_text
        main_text
        secondary_text
        offer_incentive
      }
    }
  }
`

const MUTATION_RATE_PRODUCTS = gql`
  mutation RatingProductsV2($input: RateProductsV2Input!) {
    RateProductsV2(input: $input) {
      errors
      rating_incentive {
        has_incentived
        has_incentived_amount
      }
    }
  }
`

const MUTATION_RATE_PRODUCT = gql`
  mutation WebRateProduct($rating: RateProductInput!) {
    RateProduct(input: $rating) {
      rating {
        id
        style
        bust
        comment
        waist
        hips
        length
        shoulder
        inseam
        thigh
        times_worn
        washed_out
        made_rough
        style_issue_weight
        style_issue_color
        style_issue_print
        style_issue_material
        style_issue_small
        style_issue_big
        folded
        style_issue_not_me
        style_issue_fabric
        style_issue_pattern
        style_issue_silhouette
        smelled
        wrinkled
        damaged
        too_worn
        not_functional
      }
    }
  }
`

const MUTATION_UPDATE_RATING_IMAGE = gql`
  mutation WebUpdateRatingImage($input: UploadCustomerPhotoInput!) {
    UploadCustomerPhoto(input: $input) {
      customer_photo {
        id
        thumb_url
        url
        mobile_url
      }
    }
  }
`

const MUTATION_SUBMIT_TOTE_SWAP_QUESTIONNAIRE = gql`
  mutation SubmitToteSwapQuestionnaire(
    $input: SubmitToteSwapQuestionnaireInput!
  ) {
    SubmitToteSwapQuestionnaire(input: $input) {
      success
      error
    }
  }
`

const MUTATION_UPLOAD_RATING_PHOTOS = gql`
  mutation UploadRatingPhotos($input: UploadRatingPhotosInput!) {
    UploadRatingPhotos(input: $input) {
      clientMutationId
      errors
      rating_photos {
        id
        mobile_url
        rating_id
        thumb_url
        url
      }
    }
  }
`

const MUTATION_ADD_PERFECT_CLOSETS = gql`
  mutation AddPerfectClosets($input: AddPerfectClosetsInput!) {
    AddPerfectClosets(input: $input) {
      clientMutationId
      perfect_closets {
        id
      }
    }
  }
`

const MUTATION_CREATE_SERVICE_FEEDBACK = gql`
  mutation CreateServiceFeedback($input: CreateServiceFeedbackInput!) {
    CreateServiceFeedback(input: $input) {
      clientMutationId
      show_free_service_question
    }
  }
`

export default {
  QUERY_RATINGS_FOR_TOTE,
  QUERY_RATINGS_FEEDBACK_RESULT,
  QUERY_RATING_QUESTIONS,
  QUERY_RATING_RESULTS,
  MUTATION_RATE_TOTE,
  MUTATION_RATE_PRODUCT,
  MUTATION_RATE_PRODUCTS,
  MUTATION_UPDATE_RATING_IMAGE,
  MUTATION_SUBMIT_TOTE_SWAP_QUESTIONNAIRE,
  MUTATION_UPLOAD_RATING_PHOTOS,
  MUTATION_ADD_PERFECT_CLOSETS,
  MUTATION_CREATE_SERVICE_FEEDBACK
}
