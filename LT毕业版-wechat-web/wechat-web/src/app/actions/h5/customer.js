/**
 *
 * @param {obj} data: {customer : {telephone, verification_code}}
 */
const browserSignUp = ({ success, error, data, utmUrl }) => ({
  type: 'API:BROWSER:SIGN:UP',
  API: true,
  method: 'POST',
  url: utmUrl || '/profile',
  data,
  success,
  error
})

export default { browserSignUp }
