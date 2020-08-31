const TopCard = props => {
  const { perfect_closet_stats, goToPerfectCloset } = props
  return (
    <div className="TopCard">
      <div className="header">满分单品</div>
      <div className="card">
        <div className="col" onClick={() => goToPerfectCloset('all')}>
          <div className="number">{perfect_closet_stats.product_count}</div>
          <div className="text">全部</div>
        </div>
        <div className="divider" />
        <div className="col" onClick={() => goToPerfectCloset('clothing')}>
          <div className="number">{perfect_closet_stats.clothing_count}</div>
          <div className="text">衣服</div>
        </div>
        <div className="divider" />
        <div className="col" onClick={() => goToPerfectCloset('accessory')}>
          <div className="number">{perfect_closet_stats.accessory_count}</div>
          <div className="text">配饰</div>
        </div>
      </div>
    </div>
  )
}

export default TopCard
