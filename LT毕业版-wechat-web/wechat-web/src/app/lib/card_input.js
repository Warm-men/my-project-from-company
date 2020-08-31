/*
 * Removes spaces from number for submitting to server
 */
const numberToSubmit = full_number => full_number.replace(/\W/g, '')

/*
 * Given the new value and the old value, format the expiration date by adding a slash
 */
const expirationToSubmit = (expiration, oldExpiration) => {
  const isDeleting = expiration.length < oldExpiration.length

  if (!isDeleting && expiration.length === 2) {
    expiration = `${expiration}/`
  }

  if (!isDeleting && oldExpiration.length === 2) {
    expiration = `/${expiration}`
  }

  return expiration.slice(0, 5)
}

/*
 * Given the new value and the old value, format the telephone by adding dashes
 */
const telephoneToSubmit = (telephone, oldTelephone) => {
  const isDeleting = telephone.length < oldTelephone.length

  if (!isDeleting && (telephone.length === 3 || telephone.length === 8)) {
    telephone += '-'
  }

  return telephone.slice(0, 13)
}

/**
 * format personal Id card
 *
 * @param {*string} value need format Id card
 * @returns formatNum
 * eg: 123456789123456789 => 123456 7891 2345 6789
 */
const formatIdCard = value => {
  let formatNum
  let str = value.toString().replace(/ /g, '')
  let len = str.length
  switch (true) {
    case len > 18:
      str =
        str.substr(0, 6) +
        ' ' +
        str.substr(6, 4) +
        ' ' +
        str.substr(10, 4) +
        ' ' +
        str.substr(14, 4)
      formatNum = str
      break
    case len > 14:
      str =
        str.substr(0, 6) +
        ' ' +
        str.substr(6, 4) +
        ' ' +
        str.substr(10, 4) +
        ' ' +
        str.substr(14)
      formatNum = str
      break
    case len > 10:
      str = str.substr(0, 6) + ' ' + str.substr(6, 4) + ' ' + str.substr(10)
      formatNum = str
      break
    case len > 6:
      str = str.substr(0, 6) + ' ' + str.substr(6)
      formatNum = str
      break
    default:
      formatNum = str
  }
  return formatNum
}

/**
 *
 *
 * @param {*string} value need format telephone number
 * @returns format number
 * eg: 13522228888 => 135 2222 8888
 */
const formatTelephoneNum = value => {
  let formatNum
  let str = value.toString().replace(/ /g, '')
  let len = str.length
  switch (true) {
    case len > 11:
      str = str.substr(0, 3) + ' ' + str.substr(3, 4) + ' ' + str.substr(7, 4)
      formatNum = str
      break
    case len > 7:
      str = str.substr(0, 3) + ' ' + str.substr(3, 4) + ' ' + str.substr(7)
      formatNum = str
      break
    case len > 3:
      str = str.substr(0, 3) + ' ' + str.substr(3)
      formatNum = str
      break
    default:
      formatNum = str
  }
  return formatNum
}

export {
  numberToSubmit,
  expirationToSubmit,
  telephoneToSubmit,
  formatIdCard,
  formatTelephoneNum
}
