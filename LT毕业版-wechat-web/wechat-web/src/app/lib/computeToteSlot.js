const computeToteSlot = products => {
  let slot = 0
  _.map(products, v => {
    slot += v.slot
  })
  return slot
}

export default computeToteSlot
