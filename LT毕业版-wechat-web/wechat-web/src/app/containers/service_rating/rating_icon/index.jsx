export default React.memo(
  ({ isRated, handleClick = () => {} }) => {
    return isRated ? (
      <div className="icon-container" onClick={handleClick}>
        <div className="icon-box">
          <span className="icon-text">已投诉</span>
        </div>
      </div>
    ) : null
  },
  (prevProps, nextProps) => prevProps.isRated === nextProps.isRated
)
