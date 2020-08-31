const Switch = props => {
  const { onChangeSwitchValue, productSort, perfectCloset } = props

  const handleClick = () => {
    let newSort
    if (perfectCloset) {
      if (productSort === 'perfect_closet_created_first') {
        newSort = 'perfect_stock_first'
      } else {
        newSort = 'perfect_closet_created_first'
      }
    } else {
      if (productSort === 'closet_created_first') {
        newSort = 'closet_stock_first'
      } else {
        newSort = 'closet_created_first'
      }
    }
    onChangeSwitchValue(newSort)
  }
  const renderSwitchClass = state => {
    const defaultClass = {
      switch: 'closet-switch',
      button: 'button'
    }
    const activeClass = {
      switch: 'closet-switch closet-switch-active',
      button: 'button active'
    }
    if (
      state === 'closet_created_first' ||
      state === 'perfect_closet_created_first'
    ) {
      return defaultClass
    }
    if (state === 'closet_stock_first' || state === 'perfect_stock_first') {
      return activeClass
    }
    return defaultClass
  }
  return (
    <div className={renderSwitchClass(productSort).switch}>
      <div
        className={renderSwitchClass(productSort).button}
        onClick={handleClick}
      />
    </div>
  )
}

export default Switch
