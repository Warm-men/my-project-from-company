const hasCompleteSizes = style => {
  if (!style) {
    return true
  }
  let styleObject = {
    height_inches: style.height_inches,
    weight: style.weight,
    bust_size_number: style.bust_size_number,
    shoulder_size: style.shoulder_size,
    waist_size: style.waist_size,
    hip_size_inches: style.hip_size_inches,
    inseam: style.inseam
  }
  let empty = true
  for (var key in styleObject) {
    if (empty && styleObject.hasOwnProperty(key) && !styleObject[key]) {
      empty = false
    }
  }
  return empty
}

export default hasCompleteSizes
