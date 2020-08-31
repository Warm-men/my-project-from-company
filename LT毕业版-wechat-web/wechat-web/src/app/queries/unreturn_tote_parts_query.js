export default `
  query UnreturnToteParts($tote_id: ID!) {
    unreturn_tote_parts {
      current(tote_id: $tote_id) {
        product_parts {
          product_title
          part_titles
        }
        bag_tips
      }
      history {
        product_parts {
          product_title
          part_titles
        }
        bag_tips
      }
    }
  }
`
