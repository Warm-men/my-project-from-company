const formatSpaceTel = tel => {
  if (tel) {
    const telephone = tel.replace('+86', '')
    return `${telephone.substring(0, 3)} ${telephone.substring(
      3,
      7
    )} ${telephone.substring(7)}`
  }
}

const splitAreaCode = tel => {
  if (tel && typeof tel === 'string' && tel.length >= 11) {
    return tel.substring(3, tel.length)
  }
  return null
}

export { formatSpaceTel, splitAreaCode }
