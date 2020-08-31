import TitleDividerContentHeader from 'src/app/containers/layout/title_divider_content_header'
import { connect } from 'react-redux'
import { isValidEmail, isValidPassword } from 'src/app/lib/validators'
import './index.scss'

function EmailAuthenticationContainer(props) {
  let [email, password] = ['', '']

  const handleEmailInput = ({ target: { value }, type }) => {
    if (isValidEmail(value) || type === 'blur') {
      email = value
    }
  }

  const handlePasswordInput = ({ target: { value }, type }) => {
    if (isValidPassword(value) || type === 'blur') {
      password = value
    }
  }

  const submitEmailAndPassword = () => {
    const success = () => {
      window.location.href = window.location.origin + '/home'
    }
    const input = { email, password }
    const submitEmailAndPasswordAction = (input, success, error) => ({
      API: true,
      method: 'post',
      type: 'API:SESSION:SUBMIT_EMAIL_AND_PASSWORD',
      url: '/api/query',
      data: {
        query: `
        mutation SignIn($input: SignInCustomerInput!) {
          SignInCustomer(input: $input) { customer { id email } }
        }`,
        variables: { input }
      },
      success,
      error
    })
    props.dispatch(submitEmailAndPasswordAction(input, success))
  }

  return (
    <div className="mobile-authentication">
      <TitleDividerContentHeader
        title="Welcome back!"
        content="Are you ready to live #lifeunlimited? Let's get started!"
      />
      <div className="or-sign-up">or, sign in with email/password</div>
      <div id="email-authentication">
        <input
          name="email"
          type="email"
          className="form-control"
          placeholder="Email Address"
          defaultValue={email}
          onChange={handleEmailInput}
          onBlur={handleEmailInput}
        />
        <input
          name="password"
          type="password"
          className="form-control"
          placeholder="Password"
          onChange={handlePasswordInput}
          onBlur={handlePasswordInput}
        />
        <div className="auth-btn" onClick={submitEmailAndPassword}>
          SIGN IN
        </div>
      </div>
    </div>
  )
}

export default connect()(EmailAuthenticationContainer)
