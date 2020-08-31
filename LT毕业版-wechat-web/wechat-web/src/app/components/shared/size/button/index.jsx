import 'src/assets/stylesheets/components/shared/size/button.scss'

import PropTypes from 'prop-types'

const SizeButton = ({ active, children, onClick }) => (
  <div
    className={`btn btn-selectable ${active ? 'active' : ''}`}
    onClick={onClick}
  >
    {children}
  </div>
)

SizeButton.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func
}

SizeButton.defaultProps = {
  active: false,
  onClick: () => null
}

export default SizeButton
