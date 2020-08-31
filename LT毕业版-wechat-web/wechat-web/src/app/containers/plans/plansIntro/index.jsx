import { connect } from 'react-redux'
import { placeholder_500_750 } from 'src/assets/placeholder'
import ProgressiveImage from 'src/app/components/ProgressiveImage'
import '../index.scss'
import intro1 from 'src/assets/images/plans/intro1.png'
import intro2 from 'src/assets/images/plans/intro2.png'
import intro3 from 'src/assets/images/plans/intro3.png'

function PlansIntro() {
  const imageArr = [intro1, intro2, intro3]
  return (
    <div>
      <div className="top-boby">
        {imageArr.map((image, index) => {
          return (
            <ProgressiveImage
              src={image}
              placeholder={placeholder_500_750}
              key={index}
            >
              {image => <img src={image} alt="" />}
            </ProgressiveImage>
          )
        })}
      </div>
      <div className="bottom-body">
        <p>
          价格：<font>¥499</font> /月
        </p>
        <button onClick={this.props.clickButton}>立即加入</button>
      </div>
    </div>
  )
}

export default connect()(PlansIntro)
