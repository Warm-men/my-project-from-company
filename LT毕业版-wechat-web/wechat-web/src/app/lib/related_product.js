function sortProducts(products, accessoryFirst = false) {
  if (!products || products.length === 0) {
    return products
  }
  let newProductArr = []
  const clothingArr = products.filter(function(item) {
    return item.product.type === 'Clothing'
  })
  const accessoryArr = products.filter(function(item) {
    return item.product.type !== 'Clothing'
  })
  if (accessoryFirst) {
    newProductArr = [...accessoryArr, ...clothingArr]
  } else {
    newProductArr = [...clothingArr, ...accessoryArr]
  }
  return newProductArr
}

export { sortProducts }
