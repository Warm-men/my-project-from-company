import PropTypes from 'prop-types'
class ResponsiveInfiniteScroll extends React.Component {
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = _.debounce(
    () => {
      // document.documentElement works in Firefox
      // document.body works in Chrome + Safari
      const scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop
      const scrollHeight = document.body.scrollHeight
      const viewHeight = window.innerHeight
      const { isLoading, isMore, onScrollToBottom } = this.props
      if ((scrollTop + viewHeight) * 1.67 >= scrollHeight) {
        if (!isLoading && isMore) {
          onScrollToBottom()
        }
      }
    },
    250,
    {
      leading: true
    }
  )

  render() {
    return <div className={this.props.className}>{this.props.children}</div>
  }
}

ResponsiveInfiniteScroll.propTypes = {
  onScrollToBottom: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isMore: PropTypes.bool.isRequired
}

export default ResponsiveInfiniteScroll
