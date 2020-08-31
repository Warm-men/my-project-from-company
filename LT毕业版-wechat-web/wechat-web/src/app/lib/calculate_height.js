export default function(heightFeet, heightInches) {
  if (heightFeet && heightInches) {
    return heightFeet * 12 + heightInches
  } else if (heightFeet) {
    return heightFeet * 12
  } else if (heightInches) {
    return heightInches
  } else {
    return null
  }
}
