const singleCollection = `
   query FetchHomePageCollections($parms:ProductFilters,$id:ID){
    browse_collection(id:$id) {
      id
      count
      banner_photo_banner_url
      banner_photo_thumb_url
      products(filters:$parms) {
        activated_at
        id
        catalogue_photos {
          id
          full_url
        }
      }
    }
  }
`

const homeCollections = `
query fetchCollections($page: Int, $per_page: Int, $filter: BrowseCollectionsFilter) {
  browse_collections(page: $page, per_page: $per_page, filter: $filter) {
    id
    count
    banner_photo_url
    banner_photo_banner_url
    banner_photo_wide_banner_url
    collection_type
    link
  }
}
`
export { singleCollection, homeCollections }
