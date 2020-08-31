import './index.scss'

export default function RatingIncentive({ rating_incentive = {} }) {
  const { incentive_amount_text, main_text, secondary_text } = rating_incentive
  return (
    <div className="rating-shadow-box">
      <div className="rating-incentive-box">
        <img
          className="images"
          alt=""
          src={require('src/app/containers/ratings/images/rating_incentive.png')}
        />
        <span className="mount">{incentive_amount_text}</span>
        <div className="incentive-text">
          <h5 className="title">{main_text}</h5>
          <p className="text">{secondary_text}</p>
        </div>
      </div>
    </div>
  )
}
