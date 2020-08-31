export default function StarRating({
  className,
  toteRatingNum,
  changeStar = () => {},
  activeKey
}) {
  const toteRatingNumber = toteRatingNum || 0
  const handleClick = ratingNumber => () => changeStar(ratingNumber, activeKey)

  return (
    <div className={className + ' star-container'}>
      {_.map(_.range(1, toteRatingNumber + 1), i => {
        let ratingNumber = i
        return (
          <div
            className={'star filled ' + ratingNumber}
            key={ratingNumber}
            onClick={handleClick(ratingNumber)}
          />
        )
      })}
      {_.map(_.range(5 - toteRatingNumber), i => {
        let ratingNumber = toteRatingNumber + i + 1
        return (
          <div
            className={'star ' + ratingNumber}
            key={ratingNumber}
            onClick={handleClick(ratingNumber)}
          />
        )
      })}
    </div>
  )
}
