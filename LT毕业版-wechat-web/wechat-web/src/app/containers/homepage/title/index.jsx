export default React.memo(({ title, title_content }) => (
  <div className="title-box">
    <div className="title">
      <span className="title-border" />
      <span className="title-text">{title}</span>
      <span className="title-border" />
    </div>
    <div className="title-img">{title_content}</div>
  </div>
))
