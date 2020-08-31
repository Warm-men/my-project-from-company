export default function isCompeleteSize(customerStyleInfo) {
  if (_.isEmpty(customerStyleInfo)) {
    return false
  }
  const {
    height_inches,
    weight,
    shape,
    shoulder_size,
    bust_size_number,
    waist_size,
    hip_size_inches,
    inseam
  } = customerStyleInfo
  return !!(
    height_inches &&
    weight &&
    shape &&
    shoulder_size &&
    bust_size_number &&
    waist_size &&
    hip_size_inches &&
    inseam
  )
}
