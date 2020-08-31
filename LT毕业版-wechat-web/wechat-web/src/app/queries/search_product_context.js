export default `
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
        clothing
        sign
        slug
        selected
      }
    }
  }
}
`
