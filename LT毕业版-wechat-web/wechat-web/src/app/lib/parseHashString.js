export const parseHashString = url => {
  let obj = {}
  const paraString = url.substring(url.indexOf('#') + 1, url.length).split('&')
  for (let i in paraString) {
    const keyvalue = paraString[i].split('=')
    obj[keyvalue[0]] = decodeURIComponent(keyvalue[1])
  }
  return obj
}
