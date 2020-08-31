import gql from 'graphql-tag'

const QUERY_CLOSET = gql`
  query FetchClosetProducts(
    $filters: ProductFilters
    $filter_selections: [ProductFilterSelection]
    $search_context: ProductSearchContextInput
  ) {
    products(
      filters: $filters
      filter_selections: $filter_selections
      search_context: $search_context
      in_closet: true
    ) {
      id
      type
      title
      activated_at
      tote_slot
      in_stock_count
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
      member_price
      sale_price
      full_price
      swappable
    }
  }
`

const QUERY_SATISFIED_CLOSET = gql`
  query FetchSatisfiedClosetProducts(
    $filters: ProductFilters
    $filter_selections: [ProductFilterSelection]
    $search_context: ProductSearchContextInput
  ) {
    products(
      filters: $filters
      filter_selections: $filter_selections
      search_context: $search_context
      in_perfect_closet: true
    ) {
      id
      type
      title
      activated_at
      tote_slot
      in_stock_count
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
      member_price
      sale_price
      full_price
      swappable
    }
  }
`

const MUTATION_ADD_TO_CLOSET = gql`
  mutation AddToCloset($input: AddToClosetInput!) {
    AddToCloset(input: $input) {
      products {
        id
      }
    }
  }
`

const MUTATION_REMOVE_FROM_CLOSET = gql`
  mutation RemoveFromCloset($input: RemoveFromClosetInput!) {
    RemoveFromCloset(input: $input) {
      products {
        id
      }
    }
  }
`

const QEURY_SATISFIED_COUNT = gql`
  query {
    me {
      id
      perfect_closet_stats {
        product_count
        clothing_count
        accessory_count
      }
    }
  }
`

export default {
  QUERY_CLOSET,
  QUERY_SATISFIED_CLOSET,
  QEURY_SATISFIED_COUNT,
  MUTATION_ADD_TO_CLOSET,
  MUTATION_REMOVE_FROM_CLOSET
}
