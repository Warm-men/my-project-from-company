import upload from './upload_core/index.js'
import { SERVICE_TYPES, QNetwork } from '../../../expand/services/services'

/**
 *
 * @param {Array} image  image obj list
 * @param {fuction} success param 上传后的图片地址
 * @param {fuction} fail
 */
const uploadFile = (imageArray, success, fail) => {
  QNetwork(
    SERVICE_TYPES.uploadImageToken.UPLOAD_IMAGE_TOKEN,
    {},
    response => {
      let imageList = []
      let uploadedCount = 0
      const {
        upload_host,
        upload_token,
        bucket_url
      } = response.data.upload_token
      for (i = 0; i < imageArray.length; i++) {
        upload(imageArray[i], upload_host, upload_token, {})
          .then(xhr => {
            uploadedCount++
            imageList.push(bucket_url + '/' + xhr.key)
            if (uploadedCount === imageArray.length) {
              success(imageList)
            }
          })
          .catch(xhr => {
            fail(xhr)
          })
      }
    },
    error => {
      fail(error)
    }
  )
}

export default uploadFile
