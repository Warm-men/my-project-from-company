const getBytesLength = string => {
  let totalLength = 0
  let charCode
  for (var i = 0; i < string.length; i++) {
    charCode = string.charCodeAt(i)
    if (charCode < 0x007f) {
      totalLength++
    } else {
      totalLength += 2
    }
  }
  return totalLength
}
export default getBytesLength
