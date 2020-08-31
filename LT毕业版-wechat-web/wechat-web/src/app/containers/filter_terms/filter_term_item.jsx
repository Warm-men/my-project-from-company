import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

const FilterTermItem = React.memo(({ className, icon, name, handleClick }) => (
  <li className={className || 'types-item'}>
    <Link onClick={handleClick}>
      <div className="types-cell">
        <img alt="" src={icon} />
        <p>{name}</p>
      </div>
    </Link>
  </li>
))

export default FilterTermItem

FilterTermItem.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string,
  className: PropTypes.string
}
