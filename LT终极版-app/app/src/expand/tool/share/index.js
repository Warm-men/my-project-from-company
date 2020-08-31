import React from 'react'
import Stores from '../../../stores/stores'
import { Client } from '../../services/client'
import SharePanel from '../../../containers/common/SharePanel'

const shareCustomerPhoto = (id, image, oneself) => {
  Stores.panelStore.show(
    <SharePanel
      url={Client.ORIGIN + '/customer_photo_details?customer_photo_id=' + id}
      thumbImage={image}
      title={
        oneself
          ? '我在托特衣箱上发了一篇晒单，快来帮我点赞吧'
          : '这篇晒单很好看，快来点赞吧'
      }
      description={'高品质品牌服饰随心换穿你也可以！'}
      route={'CustomerPhotoDetail'}
    />
  )
}

export { shareCustomerPhoto }
