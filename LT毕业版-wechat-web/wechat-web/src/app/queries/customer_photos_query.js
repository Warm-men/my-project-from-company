export default `
query fetchCustomerPhotos($per_page:Int, $page:Int) {
	customer_photos(per_page: $per_page, page: $page) {
	  id
    customer_city
    customer_name
    customer_nickname
    customer_nickname
    customer_avatar
    customer_height_inches
    product_brand
    product_photo
    product_title
    product_id
    product_size
    product_type
    thumb_url
    mobile_url
    lightbox_url
    url
	}
}
`
