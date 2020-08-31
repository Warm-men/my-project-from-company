import gql from 'graphql-tag'
import { Client } from './client'

const QUERY_CUSTOMER_PHOTOS = gql`
  query fetchCustomerPhotos($page: Int, $per_page: Int) {
    customer_photos(page: $page, per_page: $per_page) {
      customer_avatar
      customer_city
      customer_height_inches
      customer_name
      customer_nickname
      customer_state
      id
      mobile_url
      product_brand
      product_id
      product_photo
      product_size
      product_title
      product_type
      thumb_url
      url
    }
  }
`
const QUERY_MY_CUSTOMER_PHOTOS_WITH_TOTES = gql`
  query FetchMyCustomerPhotos(
    $page: Int
    $per_page: Int
    $exclude_tote_ids: [Int]
    $filter: TotesFilter
  ) {
    totes(
      page: $page
      per_page: $per_page
      exclude_tote_ids: $exclude_tote_ids
      filter: $filter
    ) {
      id
      tote_products {
        id
        customer_photos_v2 {
          id
          photos {
            url
            mobile_url
          }
          customer {
            id
            avatar
            nickname
            height_inches
            city
            roles {
              type
            }
          }
        }
        product_size {
          id
          size_abbreviation
        }
        product {
          id
          title
          disabled
          brand {
            id
            name
          }
          category {
            id
            accessory
          }
          catalogue_photos {
            medium_url
            full_url
          }
        }
      }
    }
  }
`

const QUERY_CUSTOMER_PHOTOS_IN_TOTE = gql`
  query CustomerPhotosForTheTote($id: Int) {
    tote(id: $id) {
      id
      tote_products {
        id
        customer_photos_v2 {
          id
          photos {
            url
            mobile_url
          }
          customer {
            id
            avatar
            nickname
            height_inches
            city
            roles {
              type
            }
          }
        }
        product_size {
          id
          size_abbreviation
        }
        product {
          id
          title
          disabled
          brand {
            id
            name
          }
          category {
            id
            accessory
          }
          catalogue_photos {
            medium_url
            full_url
          }
        }
      }
    }
  }
`

const QUERY_CUSTOMER_PHOTOS_IN_PRODUCT = gql`
  query CustomerPhotosInProduct($id: ID, $page: Int, $limit: Int!) {
    product(id: $id) {
      id
      customer_photos_pages(limit: $limit)
      customer_photos_v2(page: $page, limit: $limit) {
        id
        customer {
          id
          avatar
          nickname
          height_inches
          city
          roles {
            type
          }
        }
        liked
        likes_count
        photos {
          mobile_url
        }
        content
        share_topics {
          id
          title
        }
        products {
          product_size {
            id
            size_abbreviation
          }
        }
      }
    }
  }
`
const MUTATION_LIKE_CUSTOMER_PHOTO = gql`
  mutation LikeCustomerPhoto($input: LikeCustomerPhotoInput!) {
    LikeCustomerPhoto(input: $input) {
      customer_photo {
        id
        customer {
          id
        }
        liked
        likes_count
        like_customers {
          id
          avatar
        }
      }
    }
  }
`

const MUTATION_DISLIKE_CUSTOMER_PHOTO = gql`
  mutation DislikeCustomerPhoto($input: DislikeCustomerPhotoInput!) {
    DislikeCustomerPhoto(input: $input) {
      customer_photo {
        id
        customer {
          id
        }
        liked
        likes_count
        like_customers {
          id
          avatar
        }
      }
    }
  }
`

const QUERY_CUSTOMER_PHOTOS_SUMMARY = gql`
  query CustomerPhotosSummary($page: Int, $per_page: Int) {
    customer_photo_summary(page: $page, per_page: $per_page) {
      share_topics {
        id
        title
        url
        ended_at
        banner_img
      }
      customer_photos {
        id
        liked
        likes_count
        content
        customer {
          id
          avatar
          nickname
          height_inches
          city
          roles {
            type
          }
        }
        share_topics {
          id
          title
        }
        photos {
          mobile_url
          url
        }
      }
    }
  }
`

const QUERY_THE_CUSTOMER_PHOTO = gql`
  query QueryTheCustomerPhoto($customer_photo_id: ID) {
    customer_photo_summary(customer_photo_id: $customer_photo_id) {
      customer_photos {
        id
        share_image_url
        share_topics {
          id
          title
          url
        }
        mini_program_code_url
        customer {
          id
          avatar
          nickname
          height_inches
          city
          roles {
            type
          }
        }
        liked
        likes_count
        like_customers {
          id
          avatar
        }
        content
        photos {
          mobile_url
          url
          width
          height
          stickers {
            anchor_x
            anchor_y
            degree
            product {
              activated_at
              id
              disabled
              type
              title
              disabled
              brand {
                id
                name
              }
              catalogue_photos(limit: 1) {
                medium_url
                full_url
              }
              category {
                id
                name
                accessory
              }
              tote_slot
              member_price
              sale_price
              full_price
              swappable
            }
          }
        }
        review {
          id
          content
        }
        featured
        incentives {
          text
          time_cash_amount
        }
        products {
          product {
            activated_at
            id
            disabled
            type
            title
            disabled
            brand {
              id
              name
            }
            catalogue_photos(limit: 1) {
              medium_url
              full_url
            }
            category {
              id
              name
              accessory
            }
            tote_slot
            member_price
            sale_price
            full_price
            swappable
          }
          product_size {
            id
            size_abbreviation
          }
        }
      }
    }
  }
`

const QUERY_THE_CUSTOMER_PHOTO_DETAILS = gql`
  query QueryTheCustomerPhoto($customer_photo_id: ID) {
    customer_photo_summary(customer_photo_id: $customer_photo_id) {
      customer_photos {
        id
        share_image_url
        mini_program_code_url
        customer {
          id
          avatar
          nickname
          height_inches
          city
          roles {
            type
          }
        }
        liked
        likes_count
        like_customers {
          id
          avatar
        }
        content
        share_topics {
          id
          title
          url
        }
        photos {
          mobile_url
          url
          width
          height
          stickers {
            anchor_x
            anchor_y
            degree
            product {
              activated_at
              id
              disabled
              type
              title
              disabled
              brand {
                id
                name
              }
              catalogue_photos(limit: 1) {
                medium_url
                full_url
              }
              category {
                id
                name
                accessory
              }
              tote_slot
              member_price
              sale_price
              full_price
              swappable
            }
          }
        }
        review {
          id
          content
        }
        featured
        incentives {
          text
          time_cash_amount
        }
        products {
          product {
            activated_at
            id
            disabled
            type
            title
            disabled
            brand {
              id
              name
            }
            catalogue_photos(limit: 1) {
              medium_url
              full_url
            }
            category {
              id
              name
              accessory
            }
            tote_slot
            member_price
            sale_price
            full_price
            swappable
          }
          product_size {
            id
            size_abbreviation
          }
        }
      }
    }
  }
`

const QUERY_THE_RELATED_CUSTOMER_PHOTOS = gql`
  query QueryTheRelatedCustomerPhotos(
    $page: Int
    $limit: Int
    $customer_photo_id: ID
  ) {
    customer_photo_summary(customer_photo_id: $customer_photo_id) {
      customer_photos {
        id
        related_customer_photos(page: $page, limit: $limit) {
          id
          customer {
            id
            avatar
            nickname
            height_inches
            city
            roles {
              type
            }
          }
          liked
          likes_count
          like_customers {
            id
            avatar
          }
          content
          share_topics {
            id
            title
            url
          }
          photos {
            mobile_url
            url
            width
            height
            stickers {
              anchor_x
              anchor_y
              degree
              product {
                activated_at
                id
                disabled
                type
                title
                disabled
                brand {
                  id
                  name
                }
                catalogue_photos(limit: 1) {
                  medium_url
                  full_url
                }
                category {
                  id
                  name
                  accessory
                }
                tote_slot
                member_price
                sale_price
                full_price
                swappable
              }
            }
          }
          review {
            id
            content
          }
          featured
          incentives {
            text
            time_cash_amount
          }
          products {
            product {
              activated_at
              id
              disabled
              type
              title
              disabled
              brand {
                id
                name
              }
              catalogue_photos(limit: 1) {
                medium_url
                full_url
              }
              category {
                id
                name
                accessory
              }
              tote_slot
              member_price
              sale_price
              full_price
              swappable
            }
            product_size {
              id
              size_abbreviation
            }
          }
        }
      }
    }
  }
`
const QUERY_CUSTOMER_PHOTO_TOTE_PRODUCT = gql`
  query CustomerPhotoInToteProduct($id: ID!) {
    tote_product(id: $id) {
      id
      customer_photos_v2 {
        id
        content
        share_topics {
          id
          title
        }
        photos {
          mobile_url
          url
        }
        style_tags {
          id
          name
        }
        products {
          product {
            activated_at
            id
            disabled
            type
            title
            disabled
            brand {
              id
              name
            }
            catalogue_photos(limit: 1) {
              medium_url
              full_url
            }
            category {
              id
              name
              accessory
            }
            tote_slot
            member_price
            sale_price
            full_price
            swappable
          }
        }
      }
    }
  }
`

const QUERY_STYLE_TAGS = gql`
  {
    customer_photo_summary {
      style_tags {
        id
        name
      }
      share_incentive {
        text
        time_cash_amount
      }
      share_topics {
        id
        title
      }
    }
  }
`

const QUERY_SEARCHING_PRODUCTS = gql`
  query Searching_products($keyword: String!, $page: Int, $per_page: Int) {
    searching_products(keyword: $keyword, page: $page, per_page: $per_page) {
      id
      title
      disabled
      brand {
        id
        name
      }
      category {
        id
        accessory
      }
      catalogue_photos {
        id
        full_url
        medium_url
      }
    }
  }
`

const QUERY_MY_CUSTOMER_CENTER = gql`
  query {
    me {
      id
      customer_photo {
        customer_photo_count
        featured_count
        liked_count
      }
    }
  }
`

const QUERY_MY_CUSTOMER_PHOTOS = gql`
  query QueryMyCustomerPhotos(
    $filter: CustomerPhotoFilter
    $page: Int
    $per_page: Int
  ) {
    my_customer_photos(filter: $filter, page: $page, per_page: $per_page) {
      id
      created_at
      customer {
        id
        avatar
        nickname
        height_inches
        city
        roles {
          type
        }
      }
      liked
      likes_count
      like_customers {
        id
        avatar
      }
      content
      share_topics {
        id
        title
        url
      }
      photos {
        mobile_url
        url
        width
        height
        stickers {
          anchor_x
          anchor_y
          degree
          product {
            activated_at
            id
            disabled
            type
            title
            disabled
            brand {
              id
              name
            }
            catalogue_photos(limit: 1) {
              medium_url
              full_url
            }
            category {
              id
              name
              accessory
            }
            tote_slot
            member_price
            sale_price
            full_price
            swappable
          }
        }
      }
      review {
        id
        content
      }
      featured
      incentives {
        text
        time_cash_amount
      }
      products {
        product {
          activated_at
          id
          disabled
          type
          title
          disabled
          brand {
            id
            name
          }
          catalogue_photos(limit: 1) {
            medium_url
            full_url
          }
          category {
            id
            name
            accessory
          }
          tote_slot
          member_price
          sale_price
          full_price
          swappable
        }
        product_size {
          id
          size_abbreviation
        }
      }
    }
  }
`

const MUTATION_CREATE_CUSTOMER_PHOTO = gql`
  mutation CreateCustomerPhoto($input: CreateCustomerPhotoInput!) {
    CreateCustomerPhoto(input: $input) {
      incentive {
        success_url
        time_cash_amount
      }
      customer_photo {
        id
        share_image_url
        mini_program_code_url
        photos {
          mobile_url
          url
        }
      }
      errors
    }
  }
`

const MUTATION_READ_CUSTOMER_PHOTO_REVIEW = gql`
  mutation ReadCustomerPhotoReview($input: ReadCustomerPhotoReviewInput!) {
    ReadCustomerPhotoReview(input: $input) {
      has_unread_review
      errors
    }
  }
`

export default {
  QUERY_CUSTOMER_PHOTOS,
  QUERY_MY_CUSTOMER_CENTER,
  QUERY_MY_CUSTOMER_PHOTOS_WITH_TOTES,
  QUERY_CUSTOMER_PHOTOS_IN_TOTE,
  QUERY_CUSTOMER_PHOTOS_IN_PRODUCT,
  QUERY_CUSTOMER_PHOTOS_SUMMARY,
  QUERY_THE_CUSTOMER_PHOTO,
  QUERY_THE_CUSTOMER_PHOTO_DETAILS,
  QUERY_THE_RELATED_CUSTOMER_PHOTOS,
  QUERY_CUSTOMER_PHOTO_TOTE_PRODUCT,
  QUERY_STYLE_TAGS,
  QUERY_SEARCHING_PRODUCTS,
  QUERY_MY_CUSTOMER_PHOTOS,
  MUTATION_LIKE_CUSTOMER_PHOTO,
  MUTATION_DISLIKE_CUSTOMER_PHOTO,
  MUTATION_CREATE_CUSTOMER_PHOTO,
  MUTATION_READ_CUSTOMER_PHOTO_REVIEW
}
