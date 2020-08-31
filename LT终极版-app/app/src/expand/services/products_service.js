import gql from 'graphql-tag'

const QUERY_PRODUCTS = gql`
  query fetchProducts(
    $filters: ProductFilters
    $filter_selections: [ProductFilterSelection]
    $search_context: ProductSearchContextInput
    $sorts: ProductEnhancedSorts
  ) {
    products(
      filters: $filters
      filter_selections: $filter_selections
      search_context: $search_context
      sorts: $sorts
    ) {
      activated_at
      id
      type
      title
      disabled
      season_sample
      brand {
        id
        name
      }
      catalogue_photos {
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
      feed {
        items {
          icon_url
          title
          type
        }
      }
    }
  }
`
const QUERY_PRODUCTS_HYBRID = gql`
  query fetchProductHybrid(
    $filters: ProductFilters
    $filter_selections: [ProductFilterSelection]
    $search_context: ProductSearchContextInput
    $sorts: ProductEnhancedSorts
  ) {
    product_hybrid(
      filters: $filters
      filter_selections: $filter_selections
      search_context: $search_context
      sorts: $sorts
    ) {
      products {
        activated_at
        id
        type
        title
        disabled
        brand {
          id
          name
        }
        catalogue_photos {
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
        feed {
          items {
            icon_url
            title
            type
          }
        }
      }
      browse_collections {
        id
        title
        count
        sub_title
        product_hybrid_photo_url
        banner_photo_wide_banner_url
        collection_type
        link
        website_render_actions
      }
      looks {
        id
        description
        name
        primary_product {
          id
          title
          look_photo {
            url
          }
          look_main_photo_v2
        }
        default_first_binding_product {
          id
          title
          look_photo {
            url
          }
        }
        default_second_binding_product {
          id
          title
          look_photo {
            url
          }
        }
      }
      customer_photos {
        id
        photos {
          mobile_url
          url
        }
        customer {
          id
          roles {
            type
          }
        }
        products {
          product {
            id
            title
            brand {
              id
              name
            }
          }
        }
      }
      indexes {
        browse_collection_indexes
        customer_photo_indexes
        look_indexes
      }
    }
  }
`
const QUERY_SEASONS_PRODUCTS = gql`
  query fetchProducts($filters: ProductFilters) {
    products(filters: $filters) {
      activated_at
      id
      type
      title
      brand {
        id
        name
      }
      tote_slot
      catalogue_photos(limit: 1) {
        medium_url
        full_url
      }
      category {
        id
        name
        accessory
      }
      feed {
        items {
          icon_url
          title
          type
        }
      }
      member_price
      sale_price
      full_price
      swappable
    }
  }
`

const QUERY_PRODUCTS_OCCASION = gql`
  query fetchOccasion($slug: String!, $filters: ProductFilters) {
    product_collection(slug: $slug) {
      slug
      title
      products(filters: $filters) {
        activated_at
        id
        type
        title
        tote_slot
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
        }
        member_price
        sale_price
        full_price
        swappable
        feed {
          items {
            icon_url
            title
            type
          }
        }
      }
    }
  }
`

const QUERY_PRODUCT_DETAIL = gql`
  query productDetail($id: ID) {
    product(id: $id) {
      id
      product_digests {
        text
        start
        stop
      }
      feed(
        favorite_stat_limit: 1
        perfect_stat_limit: 1
        favorite_action_limit: 30
        perfect_action_limit: 10
        feedback_summary_limit: 20
        description_summary_limit: 5
      ) {
        items {
          icon_url
          title
          type
        }
      }
      tote_slot
      ensemble {
        active_products_count
        browse_collection_id
      }
      type
      title
      disabled
      rent_warn
      tags {
        bg_color
        font_color
        title
      }
      primary_seasons {
        name_cn
      }
      brand {
        name
        image_url
        id
      }
      catalogue_photos {
        zoom_url
        full_url
      }
      category {
        name
        accessory
        id
      }
      categories {
        id
        name
      }
      category_rule {
        error_msg
        hint_msg
        slug
        swap_ban_threshold
        swap_hint_threshold
      }
      attributes {
        title
        options
        value
      }
      customer_photos(limit: 1) {
        id
        url
        mobile_url
        customer_name
        product_size
        customer_city
        customer_height_inches
        customer_nickname
        customer_avatar
      }
      description
      details
      full_price
      member_price
      sale_price
      closet_count
      primary_looks {
        id
        description
        image_url
        name
        default_first_binding_product {
          id
          title
          look_photo {
            url
          }
          brand {
            id
            name
          }
          category {
            id
            name
            accessory
          }
          catalogue_photos(limit: 1) {
            medium_url
            full_url
          }
        }
        primary_product {
          id
          title
          look_photo {
            url
          }
          brand {
            id
            name
          }
          category {
            id
            name
            accessory
          }
          catalogue_photos(limit: 1) {
            medium_url
            full_url
          }
        }
        default_second_binding_product {
          id
          title
          look_photo {
            url
          }
          brand {
            id
            name
          }
          category {
            id
            name
            accessory
          }
          catalogue_photos(limit: 1) {
            medium_url
            full_url
          }
        }
      }
      other_products_in_catalog_photos {
        activated_at
        id
        type
        title
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
        member_price
        sale_price
        full_price
      }
      product_sizes {
        id
        shoulder
        bust
        waist
        hip
        front_length
        back_length
        inseam
        size {
          id
          name
          abbreviation
        }
        size_abbreviation
        swappable
        bust_max_tolerance
        bust_min_tolerance
        hips_max_tolerance
        hips_min_tolerance
        waist_max_tolerance
        waist_min_tolerance
      }
      swappable
      parts {
        title
      }
    }
  }
`

const QUERY_SIMILAR_PRODUCTS = gql`
  query similarProducts($id: ID) {
    product(id: $id) {
      id
      similar_products {
        activated_at
        id
        type
        title
        tote_slot
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
        member_price
        sale_price
        full_price
        swappable
      }
    }
  }
`
const QUERY_LOOKBOOK_PRODUCTS = gql`
  query lookbookProducts($id: ID) {
    product(id: $id) {
      id
      primary_looks {
        id
        description
        image_url
        name
        first_binding_products {
          id
          title
          look_photo {
            url
          }
          brand {
            id
            name
          }
          category {
            id
            name
            accessory
          }
          catalogue_photos(limit: 1) {
            medium_url
            full_url
          }
        }
        primary_product {
          id
          title
          look_photo {
            url
          }
          brand {
            id
            name
          }
          category {
            id
            name
            accessory
          }
          catalogue_photos(limit: 1) {
            medium_url
            full_url
          }
        }
        second_binding_products {
          id
          title
          look_photo {
            url
          }
          brand {
            id
            name
          }
          category {
            id
            name
            accessory
          }
          catalogue_photos(limit: 1) {
            medium_url
            full_url
          }
        }
      }
    }
  }
`
const QUERY_PRODUCT_DETAIL_CUSTOMER_PHOTO = gql`
  query productDetail($id: ID) {
    product(id: $id) {
      id
      customer_photos(limit: 10) {
        id
        url
        mobile_url
        customer_name
        product_size
        customer_city
        customer_height_inches
        customer_nickname
        customer_avatar
      }
    }
  }
`

const QUERY_REALTIME_RECOMMENDED_SIZE = gql`
  query RealtimeRecommendedSize($id: ID!) {
    realtime_product_recommended_size(product_id: $id) {
      id
      abbreviation
      name
    }
  }
`

const QUERY_REALTIME_RECOMMENDED_SIZE_AND_PRODUCT_SIZES = gql`
  query RealtimeRecommendedSize($id: ID!) {
    realtime_product_recommended_size_and_product_sizes(product_id: $id) {
      product_sizes {
        realtime_fit_message
        id
        size {
          id
        }
      }
      recommended_message
      recommended_size {
        id
        abbreviation
        name
      }
    }
  }
`

const CREATE_CUSTOMER_PRODUCTS_SIZE_FILTER = gql`
  mutation CreateCustomerProductsSizeFilter(
    $input: CreateCustomerProductsSizeFilterInput!
  ) {
    CreateCustomerProductsSizeFilter(input: $input) {
      errors
      products_size_filter
      is_reminded_with_size_filter
    }
  }
`

const QUERY_PRODUCT_SEARCH_SECTIONS = gql`
  {
    product_search_context(context: "app_20191016") {
      product_search_sections {
        name
        parent_slot_id
        product_search_slots {
          id
          name
          clothing
        }
      }
    }
  }
`

const QUERY_PANEL_PRODUCT_SIZES = gql`
  query GetPanelProductSizes($id: ID!) {
    product(id: $id) {
      id
      category_rule {
        slug
        swap_ban_threshold
        error_msg
      }
      product_sizes {
        id
        shoulder
        bust
        waist
        hip
        front_length
        back_length
        inseam
        size {
          id
          name
          abbreviation
        }
        size_abbreviation
        swappable
        bust_max_tolerance
        bust_min_tolerance
        hips_max_tolerance
        hips_min_tolerance
        waist_max_tolerance
        waist_min_tolerance
      }
    }
    realtime_product_recommended_size_and_product_sizes(product_id: $id) {
      product_sizes {
        realtime_fit_message
        id
        size {
          id
        }
      }
      recommended_message
      recommended_size {
        id
        abbreviation
        name
      }
    }
  }
`

const QUERY_NEW_ARRIVAL_COLLECTION = gql`
  {
    new_arrival_collection {
      id
      activated_at
      type
      title
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
`

export default {
  QUERY_PRODUCTS,
  QUERY_PRODUCTS_HYBRID,
  QUERY_PRODUCT_DETAIL,
  QUERY_SIMILAR_PRODUCTS,
  QUERY_PRODUCT_DETAIL_CUSTOMER_PHOTO,
  QUERY_REALTIME_RECOMMENDED_SIZE,
  QUERY_REALTIME_RECOMMENDED_SIZE_AND_PRODUCT_SIZES,
  QUERY_PRODUCTS_OCCASION,
  QUERY_SEASONS_PRODUCTS,
  QUERY_LOOKBOOK_PRODUCTS,
  CREATE_CUSTOMER_PRODUCTS_SIZE_FILTER,
  QUERY_PRODUCT_SEARCH_SECTIONS,
  QUERY_PANEL_PRODUCT_SIZES,
  QUERY_NEW_ARRIVAL_COLLECTION
}
