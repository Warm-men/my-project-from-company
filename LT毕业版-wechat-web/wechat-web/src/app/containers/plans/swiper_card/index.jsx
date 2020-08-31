import React, { Component } from 'react'
import Carousel from 'nuka-carousel'
import deviceType from 'src/app/lib/device_type'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import './index.scss'

class SwpiperCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeSlide: props.activeSlide
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.activeSlide !== nextProps.activeSlide) {
      this.setState({
        activeSlide: nextProps.activeSlide
      })
    }
  }

  handleAfterSlide = index => {
    const { subscription_groups, selectCardType } = this.props
    selectCardType(subscription_groups[index])
    this.setState({
      activeSlide: index
    })
  }

  get debounceWait() {
    return deviceType.isAndroid ? 250 : 100
  }

  render() {
    const { subscription_groups } = this.props
    return (
      <div className="swiper-card">
        <Carousel
          slidesToShow={1}
          dragging={false}
          speed={100}
          swiping={true}
          slideWidth={0.7}
          cellSpacing={1}
          decorators={[]}
          withoutControls={true}
          slideIndex={this.state.activeSlide}
          afterSlide={_.debounce(this.handleAfterSlide, this.debounceWait, {
            leading: false,
            trailing: true
          })}
          easing="easeLinear"
          edgeEasing="easeCubicOut"
        >
          {_.map(subscription_groups, (item, index) => (
            <div
              key={item.title}
              className={classnames('swiper-card-item', {
                active: index === this.state.activeSlide
              })}
            >
              <img src={item.image} alt="" />
            </div>
          ))}
        </Carousel>
      </div>
    )
  }
}

SwpiperCard.propTypes = {
  activeSlide: PropTypes.number,
  selectCardType: PropTypes.func.isRequired
}

export default SwpiperCard
