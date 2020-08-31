export default `
mutation WebUpdateRatingImage($input: UploadCustomerPhotoInput!) {
  UploadCustomerPhoto(input:$input) {
    customer_photo {
      id
      thumb_url,
      mobile_url
    }
  }
}

`
