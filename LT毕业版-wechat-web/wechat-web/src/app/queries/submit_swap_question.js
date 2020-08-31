export default `
mutation WebSubmitToteSwapQuestionnaire($input: SubmitToteSwapQuestionnaireInput!) {
  SubmitToteSwapQuestionnaire(input: $input) {
    success
    error
  }
}
`
