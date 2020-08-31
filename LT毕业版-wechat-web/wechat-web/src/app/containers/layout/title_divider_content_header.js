import 'src/assets/stylesheets/mobile/title_divider_content_header.scss'

import PropTypes from 'prop-types'

function TitleDividerContentHeader(props) {
  let headerTitleClass = 'header-title'
  if (props.isHeaderFixed) {
    headerTitleClass += ' fixed'
    if (!document.querySelector('#nav-bar').length) {
      headerTitleClass += ' nav-bar-hidden'
    }
  }
  return (
    <div className="header-wrapper title-divider-content-header">
      <div className="header-title-placeholder">
        <div className={headerTitleClass}>{props.title}</div>
      </div>
      <div className="header-divider" />
      <div className="header-subtitle-placeholder">{props.subtitle}</div>
      <div className="header-body">
        <p>{props.content}</p>
        <p>{props.contentTwo}</p>
      </div>
    </div>
  )
}

TitleDividerContentHeader.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  isHeaderFixed: PropTypes.bool
}

export default TitleDividerContentHeader
