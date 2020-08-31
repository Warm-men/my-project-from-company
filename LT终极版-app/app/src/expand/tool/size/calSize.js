import Statistics from '../statistics'
const calSize = (height, weight, ci) => {
  //ci:3-6 女装  ci:7-10 男装  ci:11-14 童装 ci:15 文胸
  var size
  var sarr = new Array()
  if (ci >= 3 && ci <= 6) {
    //1-S,2-M,3-L,4-XS,5-XL,6-XXL
    sarr = [
      'S',
      80,
      99,
      145,
      149,
      'S',
      90,
      99,
      150,
      169,
      'S',
      80,
      89,
      160,
      169,
      'M',
      80,
      99,
      170,
      172,
      'M',
      90,
      99,
      173,
      175,
      'M',
      100,
      109,
      145,
      149,
      'M',
      100,
      109,
      155,
      179,
      'L',
      110,
      119,
      145,
      149,
      'L',
      110,
      119,
      155,
      179,
      'L',
      120,
      129,
      155,
      159,
      'L',
      120,
      129,
      170,
      179,
      'XS',
      80,
      89,
      150,
      159,
      'XL',
      110,
      119,
      150,
      154,
      'XL',
      120,
      129,
      145,
      154,
      'XL',
      120,
      129,
      160,
      169,
      'XL',
      130,
      139,
      160,
      179,
      'XL',
      140,
      149,
      173,
      179,
      'XL',
      130,
      139,
      150,
      159,
      'XL',
      140,
      149,
      155,
      172
    ]
  }
  for (var i = 0; i < sarr.length / 5; i++) {
    if (
      weight >= sarr[5 * i + 1] &&
      weight <= sarr[5 * i + 2] &&
      height >= sarr[5 * i + 3] &&
      height <= sarr[5 * i + 4]
    ) {
      size = sarr[5 * i]
      break
    }
    if (i == sarr.length / 5 - 1) {
      if (weight >= 120) {
        Statistics.onEvent({ id: 'over_size', label: 'over_size' })
        return 'XL'
      } else {
        Statistics.onEvent({ id: 'under_size', label: 'under_size' })
        return 'XS'
      }
    }
  }
  return size
}

const cupSizeCalculate = cup_size => {
  let restSize
  switch (cup_size) {
    case 'A':
      restSize = 10
      break
    case 'B':
      restSize = 13
      break
    case 'C':
      restSize = 15
      break
    case 'D':
      restSize = 18
      break
    case 'E':
      restSize = 20
      break
  }
  return restSize
}

const COUNT_BUST_SIZE = (bra_size, cup_size) => {
  let size
  let restSize = cupSizeCalculate(cup_size)
  size = bra_size + restSize
  return size
}

export { COUNT_BUST_SIZE, calSize }
