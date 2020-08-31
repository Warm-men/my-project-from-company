var Geolocation = require('Geolocation')

//获取位置
const getLocation = (success, failure) => {
  Geolocation.getCurrentPosition(
    location => {
      // var result =
      //   '速度：' +
      //   location.coords.speed +
      //   '\n经度：' +
      //   location.coords.longitude +
      //   '\n纬度：' +
      //   location.coords.latitude +
      //   '\n准确度：' +
      //   location.coords.accuracy +
      //   '\n行进方向：' +
      //   location.coords.heading +
      //   '\n海拔：' +
      //   location.coords.altitude +
      //   '\n海拔准确度：' +
      //   location.coords.altitudeAccuracy +
      //   '\n时间戳：' +
      //   location.timestamp
      success(location)
    },
    error => {
      failure(error)
    }
  )
}
fetchLocation = (url, variables, success, failure) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-REQUESTED_WITH': 'XMLHttpRequest'
  }
  let requsetUrl = url
  for (var key in variables) {
    requsetUrl = requsetUrl + key + '=' + variables[key] + '&'
  }
  fetch(requsetUrl, {
    headers,
    method: 'GET'
  })
    .then(response => {
      if (response.status === 200) {
        response.json().then(jsonData => {
          success && success(jsonData)
        })
      } else {
        failure && failure(response)
      }
    })
    .catch(error => {
      failure && failure(error)
    })
}

export default { getLocation, fetchLocation }
