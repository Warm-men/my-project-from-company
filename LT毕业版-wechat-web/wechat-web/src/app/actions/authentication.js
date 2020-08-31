import identityAuthentication from 'src/app/queries/identity_authentication.js'

const identityAuth = ({
  name,
  telephone,
  id_number,
  success = () => {},
  error = () => {}
}) => ({
  type: 'API:IDENTITY:AUTHENTICATION',
  API: true,
  method: 'POST',
  url: '/api/query',
  success,
  error,
  data: {
    query: identityAuthentication,
    variables: {
      input: {
        name,
        telephone,
        id_number
      }
    }
  }
})

export default {
  identityAuth
}
