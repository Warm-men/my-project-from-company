export default `
query FetchLabelScan($tracking_code: String!) {
  label_scans(tracking_code: $tracking_code) {
    carrier_message
    carrier_updated_at
  }
}
`
