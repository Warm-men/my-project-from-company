/*
  对关联单品里的商品进行排序

  默认：跟随主商品类型排序

*/
function sortRelatedProducts(data) {
  if (_.isEmpty(data) || !data[0].product || !data[0].product.category) return

  const clothingArr = data.filter(function(item) {
    return item.product.category.accessory === false
  })
  const accessoryArr = data.filter(function(item) {
    return item.product.category.accessory === true
  })

  const accessoryFirst = data[0].product.category.accessory

  let array = []
  if (accessoryFirst) {
    array = [...accessoryArr, ...clothingArr]
  } else {
    array = [...clothingArr, ...accessoryArr]
  }

  return array
}

export { sortRelatedProducts }
