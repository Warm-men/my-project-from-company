export default `
	mutation getPhoneCode($input: SendVerificationCodeInput!) {
	    SendVerificationCode(input: $input) {
	      telephone
	      salt
	      hashed_code
	    }
	}
`
