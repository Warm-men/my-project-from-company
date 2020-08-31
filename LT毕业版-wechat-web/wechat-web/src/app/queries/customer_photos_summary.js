const queryCustomerPhotoInput = `
  query QueryTheCustomerPhoto {
    customer_photo_summary {
        share_incentive {
            text
            time_cash_amount
        }
        share_topics {
            id
            title
            url
            banner_img
        }
        style_tags {
            id
            name
            position
        }
    }
  }
`

const queryHomeCustomerPhotos = `
    query CustomerPhotosSummary($page: Int, $per_page: Int) {
      customer_photo_summary(page: $page, per_page: $per_page) {
        share_topics {
          id
          title
          url
          banner_img
          ended_at
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

const mutationLikeCustomerPhotos = `
  mutation LikeCustomerPhoto($input: LikeCustomerPhotoInput!) {
    LikeCustomerPhoto(input: $input) {
      customer_photo {
        id
        liked
        likes_count
        like_customers {
          id
          avatar
        }
        customer {
          id
        }
      }
    }
  }
`

const mutationDislikeCustomerPhotos = `
  mutation DislikeCustomerPhoto($input: DislikeCustomerPhotoInput!) {
    DislikeCustomerPhoto(input: $input) {
      customer_photo {
        id
        liked
        likes_count
        like_customers {
          id
          avatar
        }
        customer {
          id
        }
      }
    }
  }
`
const queryCustomerPhotosDetailsFirst = `
query QueryTheCustomerPhoto($customer_photo_id: ID) {
  customer_photo_summary(customer_photo_id: $customer_photo_id) {
    customer_photos {
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
        stickers{
          anchor_x
          anchor_y
          degree
          product{
            title
            id
          }
        }
        width
        height
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
const queryTheRelatedCustomerPhotos = `
  query QueryTheRelatedCustomerPhotos(
    $page: Int
    $limit: Int
    $customer_photo_id: ID
  ) {
    customer_photo_summary(customer_photo_id: $customer_photo_id) {
      customer_photos {
        id
        likes_count
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
            stickers{
              anchor_x
              anchor_y
              degree
              product{
                title
                id
              }
            }
            width
            height
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

const queryCustomerPhotosInProduct = `
  query CustomerPhotosInProduct($id: ID, $page: Int, $limit: Int) {
    product(id: $id) {
      id
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
          url
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

const queryWebCustomerPhotosToteProduct = `
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

const queryMyCustomerPhotos = `
query myCustomerPhotos($filter: CustomerPhotoFilter,$page: Int,$per_page: Int){
  my_customer_photos (filter: $filter,page: $page,per_page: $per_page) {
    id
    featured
    created_at
    share_topics {
      title
      url
    }
    content
    photos {
      mobile_url
    }
    liked
    likes_count
    like_customers {
      avatar
    }
  }
}
`

const queryMyCustomerPhotoInfo = `{
  me {
    customer_photo {
      customer_photo_count
      liked_count
      featured_count
    }
  }
}`

export {
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
}
