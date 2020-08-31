export const onboardingQuestion = `
query Saber {
  onboarding_questions
}
`

export const createOnboardingToteInput = `
mutation CreateOnboardingTote($input: CreateOnboardingToteInput!) {
  CreateOnboardingTote(input: $input) {
    errors
  }
}
`

export const createCustomerAttributes = `
mutation CreateCustomerAttributes($input: CreateCustomerAttributesInput!) {
  CreateCustomerAttributes(input: $input) {
     success errors 
  }
}
`
