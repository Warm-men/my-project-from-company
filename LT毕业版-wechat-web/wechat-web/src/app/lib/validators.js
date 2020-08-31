function isPresent(value) {
  return value.replace(/\W/g, '').length !== 0
}

function isValidAddress(value) {
  const regex = /\d+/
  return regex.test(value)
}

function isValidEmail(email) {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(email)
}

function isValidPassword(password) {
  return password.length > 7
}

function isValidStateAbbreviation(stateAbbreviation) {
  const regex = /^(?:A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])*$/
  return regex.test(stateAbbreviation)
}

function isValidZipcode(zipcode) {
  return zipcode.length === 5
}

function isValidTelephone(telephone) {
  return telephone.replace(/\D/g, '').length === 11
}

/**
 * valid chinese in card
 *
 * @param {*string} id
 * @returns boolean
 */
function isValidIdCard(id) {
  const format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
  //号码规则校验
  if (!format.test(id)) {
    return false
  }
  //区位码校验
  //出生年月日校验   前正则限制起始年份为1900;
  const year = id.substr(6, 4), //身份证年
    month = id.substr(10, 2), //身份证月
    date = id.substr(12, 2), //身份证日
    time = Date.parse(month + '-' + date + '-' + year), //身份证日期时间戳date
    now_time = Date.parse(new Date()), //当前时间戳
    dates = new Date(year, month, 0).getDate() //身份证当月天数
  if (time > now_time || date > dates) {
    return false
  }
  //校验码判断
  const c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] //系数
  const b = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'] //校验码对照表
  const id_array = id.split('')
  let sum = 0
  for (let k = 0; k < 17; k++) {
    sum += parseInt(id_array[k], 10) * parseInt(c[k], 10)
  }
  if (id_array[17].toUpperCase() !== b[sum % 11].toUpperCase()) {
    return false
  }
  return true
}

/**
 *
 * valid chinese name
 * @param {*string} name
 * @returns boolean
 */
function isValidChineseName(name) {
  return (
    typeof name === 'string' &&
    name.length > 1 &&
    name.length < 7 &&
    /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/.test(name) &&
    /(?!.*先生|.*小姐|.*女士)^.*$/.test(name)
  )
}

function isValidTelephoneNum(telephone) {
  return /^1[3456789]\d{9}$/.test(telephone)
}

export {
  isPresent,
  isValidAddress,
  isValidEmail,
  isValidPassword,
  isValidStateAbbreviation,
  isValidTelephone,
  isValidZipcode,
  isValidIdCard,
  isValidChineseName,
  isValidTelephoneNum
}
