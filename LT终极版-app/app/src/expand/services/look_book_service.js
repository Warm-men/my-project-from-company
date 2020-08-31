import gql from 'graphql-tag'

const QUERY_LOOKTHEMES = gql`
  query LookThemes($page: Int, $per_page: Int) {
    look_themes(page: $page, per_page: $per_page) {
      id
      description
      image_url
      name
    }
  }
`
const QUERY_LOOKTHEME = gql`
  query LookTheme($id: ID!) {
    look_theme(id: $id) {
      id
      description
      image_url
      name
      look_sub_themes {
        id
        description
        image_url
        image_height
        image_width
        name
        looks {
          id
          description
          image_url
          name
          primary_product {
            id
            title
            look_photo {
              url
            }
            look_main_photo_v2
            brand {
              id
              name
            }
          }
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
          }
        }
      }
    }
  }
`
const QUERY_LOOK = gql`
  query Look($id: ID!) {
    look(id: $id) {
      id
      description
      image_url
      name
      primary_product {
        activated_at
        id
        type
        title
        brand {
          id
          name
        }
        catalogue_photos(limit: 1) {
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
        look_photo {
          url
        }
      }
      first_binding_products {
        activated_at
        id
        type
        title
        brand {
          id
          name
        }
        catalogue_photos(limit: 1) {
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
        look_photo {
          url
        }
      }
      second_binding_products {
        activated_at
        id
        type
        title
        brand {
          id
          name
        }
        catalogue_photos(limit: 1) {
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
        look_photo {
          url
        }
      }
    }
  }
`

const LOOK_SUB_THEME_BY_LOOK = gql`
  query lookSubThemeByLook($id: ID!) {
    look_sub_theme_by_look(look_id: $id) {
      id
      description
      name
      looks {
        id
        description
        image_url
        name
        primary_product {
          activated_at
          id
          type
          title
          brand {
            id
            name
          }
          catalogue_photos(limit: 1) {
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
          look_photo {
            url
          }
          look_main_photo_v2
        }
        first_binding_products {
          activated_at
          id
          type
          title
          brand {
            id
            name
          }
          catalogue_photos(limit: 1) {
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
          look_photo {
            url
          }
        }
        second_binding_products {
          activated_at
          id
          type
          title
          brand {
            id
            name
          }
          catalogue_photos(limit: 1) {
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
          look_photo {
            url
          }
        }
      }
    }
  }
`

export default {
  QUERY_LOOKTHEMES,
  QUERY_LOOKTHEME,
  QUERY_LOOK,
  LOOK_SUB_THEME_BY_LOOK
}
