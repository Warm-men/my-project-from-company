export default `
  mutation WebUpdateStyle($style: UpdateStyleInput!) {
    UpdateStyle(input: $style) {
      incentive_granted
      incentive_url
      style {
        constellation
        age_range
        bust_size_number
        shoulder_size
        birthday
        bra_size
        brand
        cup_size
        dress_size
        earring
        from
        height_inches
        hip_size
        hip_size_inches
        id
        inseam
        instagram_url
        jean_size
        mom
        marital_status
        occupation
        pant_size
        pinterest_url
        shape
        skirt_size
        thigh_size
        top_fit
        top_size
        waist_size
        weight
        work
        workwear
        subscription {
          summer_plan
        }
        waist_shape
        belly_shape
        shoulder_shape
        skirt_habit
        jean_prefer
        jean_waist_fit
        jean_size_unknow
      }
    }
  }
`
