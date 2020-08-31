import classname from 'classnames'
import { l10nForSize } from 'src/app/lib/product_l10n.js'
import PropTypes from 'prop-types'

export default function SizingButton(props) {
  const {
    swappable,
    selectedSizeId,
    currentSizeId,
    currentSizeName,
    isLastClothingPreviewTote = false,
    initSelectedSize,
    recommended_size,
    handleSizeChange
  } = props

  const handleClick = () => {
    if (isLastClothingPreviewTote || swappable) {
      handleSizeChange(currentSizeId, currentSizeName)
    }
  }

  const productSizeName = l10nForSize(currentSizeName)
  const className = classname('btn-selectable', {
    active:
      (swappable && selectedSizeId === currentSizeId) ||
      (isLastClothingPreviewTote && currentSizeId === selectedSizeId),
    inactive:
      isLastClothingPreviewTote && initSelectedSize === currentSizeName
        ? false
        : !swappable,
    isRecommendedSize: productSizeName[0] === recommended_size
  })

  return (
    <div className={className} onClick={handleClick}>
      {productSizeName}
    </div>
  )
}

SizingButton.propTypes = {
  isActive: PropTypes.bool,
  swappable: PropTypes.bool.isRequired,
  selectedSizeId: PropTypes.number.isRequired,
  currentSizeId: PropTypes.number.isRequired,
  currentSizeName: PropTypes.string,
  handleSizeChange: PropTypes.func.isRequired,
  isLastClothingPreviewTote: PropTypes.bool
}
