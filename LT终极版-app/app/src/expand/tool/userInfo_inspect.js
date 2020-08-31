/*
name 用户姓名
*/

const isValidCustomerName = name => {
  const nameReg = new RegExp(/^[\u4e00-\u9fa5 ]{2,6}$/)
  return (
    nameReg.test(name) &&
    name.indexOf('先生') === -1 &&
    name.indexOf('女士') === -1 &&
    name.indexOf('小姐') === -1 &&
    name.indexOf('男士') === -1
  )
}

const isValidCustomerID = id => {
  const numberReg = new RegExp(
    /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  )
  return numberReg.test(id)
}

const isValidCustomerTelephone = telephone => {
  const telephoneReg = new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/)
  return telephoneReg.test(telephone)
}

/* 过滤 Emoji 表情 */
const filterEmojiInNickname = (nickname, replaceStr = '*') => {
  const regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g

  return nickname ? nickname.replace(regex, replaceStr) : ''
}

const getCustomerName = (nickname, telephone) => {
  if (nickname) return nickname

  let title = ''
  if (telephone && telephone.length > 10) {
    let str = telephone.replace('+86', '')
    const a = str.slice(0, str.length - 8)
    const b = str.slice(str.length - 4)
    title = a + '****' + b
  }
  return title
}

export {
  isValidCustomerName,
  isValidCustomerID,
  isValidCustomerTelephone,
  filterEmojiInNickname,
  getCustomerName
}
