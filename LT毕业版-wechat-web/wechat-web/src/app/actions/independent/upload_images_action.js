const queryUploadImagesToken = (success, error) => ({
  type: 'API:UPLOAD_IMAGES:UPDATE',
  API: true,
  method: 'POST',
  url: '/api/query',
  success: success,
  error: error,
  data: {
    query: `
      query WebUploadImagesToken{
        upload_token {
          bucket_url
          upload_host
          upload_token
        }
      }
    `
  }
})

export default queryUploadImagesToken
