import gql from 'graphql-tag'
const UPLOAD_IMAGE_TOKEN = gql`
  query {
    upload_token {
      bucket_url
      upload_host
      upload_token
    }
  }
`
export default { UPLOAD_IMAGE_TOKEN }
