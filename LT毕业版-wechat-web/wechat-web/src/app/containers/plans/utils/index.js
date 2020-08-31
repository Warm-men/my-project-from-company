export const initDefaultCombo = data => {
  if (_.isEmpty(data)) return null
  const { default_select_subscription_type_id, subscription_groups } = data
  let defautCombo = null,
    defautSubType = null
  const firstComo = subscription_groups[0],
    firstSubType = firstComo && subscription_groups[0].subscription_types[0]
  if (!default_select_subscription_type_id) {
    return {
      defautCombo: firstComo,
      defautSubType: firstSubType
    }
  }

  if (!_.isEmpty(subscription_groups)) {
    subscription_groups.forEach(item => {
      item.subscription_types.forEach(types => {
        if (types.id === default_select_subscription_type_id + '') {
          defautCombo = item
          defautSubType = types
        }
      })
    })
    // NOTE: 当default_select_subscription_type_id给的默认找不到时还是，默认选第一个
    if (!defautCombo) {
      return {
        defautCombo: firstComo,
        defautSubType: firstSubType
      }
    }
  }
  return {
    defautCombo,
    defautSubType
  }
}
