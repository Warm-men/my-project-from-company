import AsyncSesameCredit from 'src/app/containers/sesamecredit'
// import ZhiMaCredit from 'src/app/containers/zhima_credit'
// import authentication from 'src/app/lib/authentication'

export default WrappedComponent =>
  class extends React.Component {
    render() {
      if (!this.props.customer.id) {
        return null
      } else {
        return this.props.customer.telephone ? (
          <WrappedComponent {...this.props} />
        ) : (
          <AsyncSesameCredit />
        )
      }
    }
  }
