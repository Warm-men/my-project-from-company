/*
  对衣箱里的商品进行排序

  默认：服装在前，饰品在后，
      饰品内包包在前，其它首饰在后
*/
function sortToteProducts(totesProducts, accessoryFirst = false) {
  if (
    !totesProducts ||
    totesProducts.length === 0 ||
    !totesProducts[0].product.category
  ) {
    return totesProducts
  }

  let newProductArr = []
  const clothingArr = totesProducts.filter(function(item) {
    return item.product.category.accessory === false
  })
  const accessoryArr = totesProducts.filter(function(item) {
    return item.product.category.accessory === true
  })
  const handbagsIndex = accessoryArr.findIndex(function(item) {
    return item.product.category.name === 'handbags'
  })
  if (handbagsIndex !== -1) {
    const handbags = accessoryArr[handbagsIndex]
    accessoryArr.splice(handbagsIndex, 1)
    accessoryArr.unshift(handbags)
  }
  if (accessoryFirst) {
    newProductArr = [...accessoryArr, ...clothingArr]
  } else {
    newProductArr = [...clothingArr, ...accessoryArr]
  }
  return newProductArr
}

export { sortToteProducts }
