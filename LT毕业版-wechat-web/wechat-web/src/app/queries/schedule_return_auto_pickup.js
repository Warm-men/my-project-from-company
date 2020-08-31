export default `
mutation ScheduleAutoPickup($input: ScheduleAutoPickupInput!) {
  ScheduleAutoPickup(input: $input) {
    errors {
      error_code
      message
    }
    success
  }
}
`
