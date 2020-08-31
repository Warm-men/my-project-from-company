const cupSize = {
  A: 10,
  B: 12.5,
  C: 15,
  D: 17.5,
  E: 20
}

// const DRESS_SIZES = [
//   { name: 'XS', type: 2 },
//   { name: 'S', type: 4 },
//   { name: 'M', type: 8 },
//   { name: 'L', type: 12 },
//   { name: 'XL', type: 14 }
// ]
// const TOP_SIZES_ABBR = [
//   { name: 'XS', type: 'X-Small' },
//   { name: 'S', type: 'Small' },
//   { name: 'M', type: 'Medium' },
//   { name: 'L', type: 'Large' },
//   { name: 'XL', type: 'X-Large' }
// ]

const calculateSize = (bra_size, cup_size) => {
  const size = parseInt(bra_size + cupSize[cup_size], 10)
  if (size < 93) {
    return {
      top_size: 'Small',
      dress_size: 4
    }
  } else if (size <= 97) {
    return {
      top_size: 'Medium',
      dress_size: 8
    }
  } else if (size <= 105) {
    return {
      top_size: 'Large',
      dress_size: 12
    }
  } else {
    return {
      top_size: 'X-Large',
      dress_size: 14
    }
  }
}

export default calculateSize
