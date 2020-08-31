const onScrollForAnimation = (value, componentRefsData) => {
  const { headerLength, averageCellLength, rowLength } = componentRefsData
  const slippedValue = (value - headerLength) % averageCellLength
  const slippedItemCount = parseInt((value - headerLength) / averageCellLength)
  let currentRowIndex
  //滑走了15%以上，关注到下一行
  if (slippedValue > averageCellLength * 0.15) {
    currentRowIndex = slippedItemCount + 1
  } else {
    currentRowIndex = slippedItemCount
  }
  let onFocusIndex
  if (
    (slippedValue >= averageCellLength * 0.15 &&
      slippedValue <= averageCellLength * 0.6) ||
    (currentRowIndex === 0 && slippedValue < averageCellLength * -0.15)
  ) {
    onFocusIndex = currentRowIndex * rowLength
  } else if (
    (slippedValue > averageCellLength * 0.6 &&
      slippedValue <= averageCellLength * 0.99) ||
    slippedValue < averageCellLength * 0.15
  ) {
    onFocusIndex = currentRowIndex * rowLength + 1
  }
  return onFocusIndex
}
export default onScrollForAnimation
