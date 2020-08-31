const FloatHover = ({ floatHover }) => {
  const onClick = () => {
    window.location.href = floatHover.url
  }
  if (!floatHover) return null
  return (
    <img
      src={require('../images/float_hover_test.gif')}
      alt="customer_photos_float_hover"
      className="float_hover"
      onClick={onClick}
    />
  )
}

export default FloatHover
