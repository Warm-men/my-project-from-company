const shippingAddressFilter = localShippingAddresses => {
  let isSelectedAddressIndex = localShippingAddresses.findIndex(item => {
    return (
      item.isSelected &&
      item.address_1 &&
      item.state &&
      item.city &&
      item.district &&
      item.telephone &&
      item.full_name &&
      item.zip_code
    )
  })
  let validAddressIndex = localShippingAddresses.findIndex(item => {
    return (
      item.address_1 &&
      item.state &&
      item.city &&
      item.district &&
      item.telephone &&
      item.full_name &&
      item.zip_code
    )
  })
  return { isSelectedAddressIndex, validAddressIndex }
}

export { shippingAddressFilter }
