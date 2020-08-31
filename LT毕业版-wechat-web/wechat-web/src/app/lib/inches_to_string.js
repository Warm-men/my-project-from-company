export default integer => {
  const feet = parseInt(Math.floor(integer / 12), 10),
    inches = parseInt(Math.floor(integer % 12), 10)
  return `${feet}' ${inches}"`
}
