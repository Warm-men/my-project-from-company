export default `
  query WebToteForRatings($id: Int) {
    tote (id: $id) {
      id
      purchasable
      rental
      state
      current_tote
      other_product_feedback
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
      }
      rating_incentive {
        has_incentived
        has_incentived_amount
        image_url
        link
      }
      tote_products {
        id
        tote_specific_price
        tote_specific_price_is_discounted
        tote_specific_price_percent_off
        product_item {
          state
        }
        product {
          full_price
          activated_at
          id
          brand {
            name
          }
          category{
            name
          }
          full_price
          catalogue_photos(limit: 1) {
            thumb_url
            medium_url
            full_url
          }
          title
          type
        }
        rating {
          id
          worn_times
          fit
          bust
          waist
          hips
          length
          shoulder
          inseam
          style_score
          quality_score
          comment
          rating_answers
          quality_photo_urls
        }
        service_feedback{
          quality_issues_human_names
          quality_photo_urls
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
        product_size {
          bust_max_tolerance
          bust_min_tolerance
          hips_max_tolerance
          hips_min_tolerance
          waist_max_tolerance
          waist_min_tolerance
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
        rating_question_sets{
          group_human_name
          group_name
          questions{
            display
            key
            options{
              display
              value
            }
            type
          }
        }
        issue_rating_questions {
          ...ratingQuestionFields
          follow_ups {
            ...ratingQuestionFields
          }
        }
      }
    }
  }
  fragment ratingQuestionFields on RatingQuestion {
    question_text
    rating_key
    is_collapsible
    is_multi_select
    possible_answers {
      display
      value
    }
  }
`
