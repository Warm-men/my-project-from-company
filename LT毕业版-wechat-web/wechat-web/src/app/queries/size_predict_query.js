const bustPredict = `
query bustPredict($input: StyleInput) {
    bust_predict(style_input: $input) {
        available
        max_value
        min_value
        type
    }
  }
`
const waistPredict = `
query waistPredict($input: StyleInput) {
    waist_predict(style_input: $input) {
        available
        max_value
        min_value
        type
    }
  }
`

const hipsPredict = `
query hipsPredict($input: StyleInput) {
    hips_predict(style_input: $input) {
        available
        max_value
        min_value
        type
    }
  }
`

export { bustPredict, waistPredict, hipsPredict }
