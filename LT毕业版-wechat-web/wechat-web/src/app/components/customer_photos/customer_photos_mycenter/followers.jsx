import Headportrait from 'src/assets/images/account/mine_headportrait.svg'

const Follower = props => {
  const MAXLENGTH = 6
  const { like_customers } = props
  const likes_count = like_customers.length
  return (
    <div className="followers-contents">
      {likes_count > 0 ? (
        <div className="follower-img-view">
          {like_customers.map((item, index) => {
            if (index > MAXLENGTH) return null
            if (index + 1 > MAXLENGTH)
              return (
                <span key={index} className="more-follower">
                  ...
                </span>
              )
            const avatarImg = item.avatar || Headportrait
            return (
              <div
                key={index}
                className="follower-img"
                style={{ backgroundImage: `url(${avatarImg})` }}
              />
            )
          })}
        </div>
      ) : (
        <div className="follower-tips-text">
          你的穿搭真好看，快来给自己点个赞吧
        </div>
      )}
    </div>
  )
}

export default Follower
