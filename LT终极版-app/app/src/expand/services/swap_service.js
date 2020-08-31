import gql from 'graphql-tag'

const QUERY_SWAP_FILTERED_PRODUCTS = gql`
  query WebToteSwapFilteredProducts(
    $filters: ProductFilters
    $filter_selections: [ProductFilterSelection]
    $search_context: ProductSearchContextInput
  ) {
    products(
      filters: $filters
      filter_selections: $filter_selections
      search_context: $search_context
      in_stock: true
    ) {
      activated_at
      id
      type
      title
      in_stock_count
      full_price
      tote_slot
      brand {
        id
        name
      }
      recommended_size
      recommended_size_abbr
      catalogue_photos(limit: 1) {
        medium_url
        full_url
      }
      category {
        id
        name
      }
      swappable
    }
  }
`

const QUERY_SWAP_COLLECTIONS = gql`
  query WebToteSwapCollections {
    tote_swap_collections {
      title
      products {
        activated_at
        id
        type
        title
        tote_slot
        brand {
          id
          name
        }
        recommended_size
        recommended_size_abbr
        catalogue_photos(limit: 1) {
          medium_url
          full_url
        }
        category {
          id
          name
        }
        swappable
      }
    }
  }
`
const QUERY_SWAP_COLLECTION = gql`
  query WebToteSwapCollection($slug: CustomCollectionSlug!) {
    tote_swap_collection(slug: $slug) {
      products {
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
        swappable
        member_price
        sale_price
        full_price
      }
    }
  }
`
const QUERY_SWAP_PRODUCT_SEARCH_CONTEXT = gql`
  query ProductSearchContext($context: String!) {
    product_search_context(context: $context) {
      id
      context
      product_search_sections {
        id
        name
        parent_slot_id
        product_search_slots {
          id
          name
          sign
          selected
          slug
        }
      }
    }
  }
`
const QUERY_SWAP_SELECTED_PRODUCTS = gql`
  query products($id: Int!) {
    products(
      search_context: {
        product_search_sections: [
          { product_search_slots: [{ id: $id, selected: true }] }
        ]
      }
      per_page: 20
      page: 1
    ) {
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
      member_price
      sale_price
      full_price
      swappable
    }
  }
`

export default {
  QUERY_SWAP_COLLECTIONS,
  QUERY_SWAP_FILTERED_PRODUCTS,
  QUERY_SWAP_COLLECTION,
  QUERY_SWAP_PRODUCT_SEARCH_CONTEXT,
  QUERY_SWAP_SELECTED_PRODUCTS
}
