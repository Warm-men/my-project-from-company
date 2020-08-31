export const popups = `
{
    popups {
      complete_image
      customer_scope
      ends_on
      id
      image
      image_height
      image_width
      interval
      routes
      starts_on
      url
    }
}
`

export const markPopup = `
mutation MarkPopup($input: MarkPopupInput!) {
  MarkPopup(input: $input) {
    success
  }
}
`
