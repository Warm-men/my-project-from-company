export const HomepageBanner = `
query FetchBanner($name: String!, $per_page: Int) {
  banner_group(name: $name) {
    id
    name
    active
    description
    banners(per_page: $per_page) {
      id
      logo
      link
      visibility
      inner_logo
      call_to_action
      description
      title
      latest_call_to_actions
    }
  }
}
`
export const HomepageBannerGroup = `
  query FetchHomepageBannerGroup($display_position: String!) {
    banner_group(display_position: $display_position) {
      id
      banners {
        title
        link
        image_url
      }
    }
  }
`
