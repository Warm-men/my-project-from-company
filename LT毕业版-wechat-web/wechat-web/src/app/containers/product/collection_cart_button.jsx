import PropTypes from 'prop-types'

const CollectionAndCartButton = React.memo(
  ({ isShow, inCloset, onToggleInCloset }) => {
    if (!isShow) return null
    return (
      <div className="collection-change-btn">
        <div className="left-btn-box" onClick={onToggleInCloset}>
          <div className="left-btn">
            <img
              src={require(`src/app/containers/product/images/${
                inCloset ? 'closeted' : 'closet'
              }.svg`)}
              alt=""
              className="add-collect"
            />
            <span className="closet-btn-text">
              {inCloset ? '已加入愿望衣橱' : '加入愿望衣橱'}
            </span>
          </div>
        </div>
      </div>
    )
  }
)

CollectionAndCartButton.propTypes = {
  isShow: PropTypes.bool.isRequired,
  onToggleInCloset: PropTypes.func.isRequired
}

export default CollectionAndCartButton
