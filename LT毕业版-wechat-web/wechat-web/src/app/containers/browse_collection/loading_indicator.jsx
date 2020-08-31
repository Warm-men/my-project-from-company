import { placeholder_500_750 } from 'src/assets/placeholder'
import './loading_indicator.scss'

export default React.memo(() => (
  <div className="browse-collection-row">
    {_.times(2, i => (
      <div key={i} className="browse-collection-placeholder">
        <img src={placeholder_500_750} alt="" />
        <div className="title" />
        <div className="brand" />
      </div>
    ))}
  </div>
))
