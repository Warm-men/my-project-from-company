/**
 * 直传文件
 * formInput对象如何配置请参考七牛官方文档“直传文件”一节
 */

export default (uri, host, token, formInput) => {
  return new Promise((resolve, reject) => {
    if (typeof uri != 'string' || uri == '') {
      reject && reject(null)
      return
    }
    if (uri[0] == '/') {
      uri = 'file://' + uri
    }
    const data = createFormData(uri, token, formInput)
    POST(
      host,
      data,
      success => {
        resolve(success)
      },
      fail => {
        reject(fail)
      }
    )
  })
}

const POST = (url, variables, success, failure) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
    'X-REQUESTED_WITH': 'XMLHttpRequest'
  }
  fetch(url, {
    headers,
    body: variables,
    method: 'POST',
    credentials: 'include'
  })
    .then(response => {
      if (response.status === 200) {
        response.text().then(function(text) {
          success && success(text ? JSON.parse(text) : {})
        })
      } else {
        failure && failure(response)
      }
    })
    .catch(error => {
      failure && failure(error)
    })
}
const createFormData = (uri, token, formInput) => {
  var formdata = new FormData()
  formdata.append('token', token)
  if (typeof formInput.type == 'undefined')
    formInput.type = 'application/octet-stream'
  if (typeof formInput.name == 'undefined') {
    var filePath = uri.split('/')
    if (filePath.length > 0) formInput.name = filePath[filePath.length - 1]
    else formInput.name = ''
  }
  formdata.append('file', {
    uri: uri,
    type: formInput.type,
    name: formInput.name
  })

  return formdata
}
