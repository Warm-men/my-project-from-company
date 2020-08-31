import 'src/assets/stylesheets/components/shared/add_to_closet_redux_button.scss'
import PropTypes from 'prop-types'
import ActionButton from 'src/app/components/shared/action_button/index'

const AddToClosetButton = ({ inCloset, toggleCloset, makeIntoButton }) => {
  if (makeIntoButton) {
    return (
      <ActionButton
        actionType="secondary"
        size="small"
        className="add-to-closet"
        onClick={toggleCloset}
        decoration={inCloset ? 'heart-filled' : 'heart-empty'}
      >
        {inCloset ? '已加入愿望衣橱' : '加入愿望衣橱'}
      </ActionButton>
    )
  }

  return (
    <div
      className={`add-to-closet-redux-button-heart ${
        inCloset ? ' active' : ''
      }`}
      onClick={toggleCloset}
    />
  )
}

AddToClosetButton.propTypes = {
  inCloset: PropTypes.bool,
  toggleCloset: PropTypes.func,
  makeIntoButton: PropTypes.bool
}

AddToClosetButton.defaultProps = {
  inCloset: false,
  toggleCloset: () => {},
  makeIntoButton: false
}

export default AddToClosetButton
