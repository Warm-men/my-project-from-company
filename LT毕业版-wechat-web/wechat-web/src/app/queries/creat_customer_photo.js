export default `
  mutation CreateCustomerPhoto($input: CreateCustomerPhotoInput!) {
    CreateCustomerPhoto(input: $input) {
      customer_photo {
        id
        photos {
          mobile_url
          url
        }
      }
      incentive{
        text
        time_cash_amount
      }
      errors
    }
  }
`
