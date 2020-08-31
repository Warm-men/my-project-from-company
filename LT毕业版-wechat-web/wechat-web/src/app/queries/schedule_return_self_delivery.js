export default `
mutation ScheduleSelfDelivery($input: ScheduleSelfDeliveryInput!) {
  ScheduleSelfDelivery(input: $input) {
    errors {
      error_code
      message
    }
    success
  }
} 
`
