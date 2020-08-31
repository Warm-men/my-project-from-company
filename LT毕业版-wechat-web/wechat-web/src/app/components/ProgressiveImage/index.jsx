import React from 'react'
import PropTypes from 'prop-types'
import QImage from 'src/app/lib/image'

class ProgressiveImage extends React.Component {
  static TIMEOUT = 100
  constructor(props) {
    super(props)
    this.state = {
      image: props.src || props.placeholder,
      loading: true
    }
  }

  componentWillMount() {
    const { src } = this.props
    this.loadImage(src)
  }

  componentWillReceiveProps(nextProps) {
    const { src, placeholder } = nextProps
    // We only invalidate the current image if the src has changed.
    if (src !== this.props.src) {
      this.setState({ image: placeholder, loading: true }, () => {
        this.loadImage(src)
      })
    }
  }

  componentWillUnmount() {
    if (this.image) {
      this.image.onload = null
      this.image.onerror = null
    }
    this.showPlaceholderTimer && clearTimeout(this.showPlaceholderTimer)
  }

  loadImage = src => {
    // If there is already an image we nullify the onload
    // and onerror props so it does not incorrectly set state
    // when it resolves
    if (this.image) {
      this.image.onload = null
      this.image.onerror = null
    }
    const image = new Image()
    image.onload = this.onLoad
    image.onerror = this.onError
    image.src = src
    this.image = image

    this.showPlaceholderTimer = setTimeout(
      () =>
        this.setState({
          image: this.props.placeholder,
          loading: true
        }),
      ProgressiveImage.TIMEOUT
    )
  }

  onLoad = () => {
    // use this.image.src instead of this.props.src to
    // avoid the possibility of props being updated and the
    // new image loading before the new props are available as
    // this.props.
    if (this.showPlaceholderTimer) {
      clearTimeout(this.showPlaceholderTimer)
      this.showPlaceholderTimer = null
    }
    this.image.src !== this.state.image &&
      this.setState({
        image: this.image.src,
        loading: false
      })
  }

  onError = errorEvent => {
    const { onError } = this.props
    if (onError) {
      onError(errorEvent)
      this.setState({
        image: this.props.placeholder
      })
    }
  }

  render() {
    const { image, loading } = this.state
    const { children } = this.props
    if (!children || typeof children !== 'function') {
      throw new Error(`ProgressiveImage requires a function as its only child`)
    }
    return children(QImage(image), loading)
  }
}

ProgressiveImage.propTypes = {
  src: PropTypes.string,
  placeholder: PropTypes.string,
  children: PropTypes.func.isRequired
}

ProgressiveImage.defaultProps = {
  children: () => {}
}

export default ProgressiveImage
