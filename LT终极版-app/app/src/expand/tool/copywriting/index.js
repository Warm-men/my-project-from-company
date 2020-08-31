import { SERVICE_TYPES, QNetwork } from '../../services/services'
import Stores from '../../../stores/stores'

const updateCopyWritingData = () => {
  QNetwork(SERVICE_TYPES.common.QUERY_COPYWRITING_ADJUSTMENTS, {}, response => {
    const { copywriting_adjustments } = response.data
    if (copywriting_adjustments) {
      Stores.copyWritingStore.setCopywriting(copywriting_adjustments)
    } else {
      Stores.copyWritingStore.setCopywriting(null)
    }
  })
}

export default { updateCopyWritingData }
