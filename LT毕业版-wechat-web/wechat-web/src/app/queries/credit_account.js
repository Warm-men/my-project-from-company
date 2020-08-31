export default `
  query creditAccount($page: Int, $per_page: Int) {
    me {
      id
      credit_account(page: $page, per_page: $per_page) {
        balance
        referral_amount
        transactions {
          amount
          created_at
          income
          transaction_type
        }
      }
    }
  }
`
