const withHandleTouch = WrappedComponent => {
  class WithHandleTouch extends React.Component {
    constructor(props) {
      super(props)
      this.picker = null
    }

    componentDidMount() {
      this.picker && this.picker.addEventListener('touchmove', this.handleTouch)
    }
    componentWillUnmount() {
      this.picker &&
        this.picker.removeEventListener('touchmove', this.handleTouch)
    }

    handleTouch = e => e.preventDefault()

    render() {
      return (
        <div ref={ref => (this.picker = ref)}>
          <WrappedComponent {...this.props} />
        </div>
      )
    }
  }

  return WithHandleTouch
}

export default withHandleTouch
