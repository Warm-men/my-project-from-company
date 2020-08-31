import PageHelmet from 'src/app/lib/pagehelmet'
import MeasureInfo from './measure_info'
import BreathMeasure from './breath_measure'
import './index.scss'
import Waist from './images/waist.png'
import Hip from './images/hip.png'
import Leg from './images/leg.png'
import Shoulder from './images/shoulder.png'

const detailList = [
  {
    title: '如何测量肩宽？',
    src: Shoulder,
    text: '从一边肩骨到另一边肩骨的直线距离，测量时软尺要拉直，不能贴着身体'
  },
  {
    title: '如何测量腰围？',
    src: Waist,
    text: '测量腰围时，软尺贴着皮肤，在肚脐眼上方3cm的水平位置围上一圈'
  },
  {
    title: '如何测量臀围？',
    src: Hip,
    text:
      '双腿靠拢站直，将软尺经过臀部最高点水平测量一圈。要确保尺子所在地都是水平的'
  },
  {
    title: '如何测量内腿长？',
    src: Leg,
    text: '双腿靠拢站直，测量裤裆到脚底的长度'
  }
]

const MeaSureDetail = () => {
  return (
    <div className="measure-detail-container">
      <PageHelmet title="测量尺码教程" link={`/measure_detail`} />
      <BreathMeasure canToggle={true} />
      {detailList.map((v, k) => (
        <MeasureInfo key={k} title={v.title} imgSrc={v.src} text={v.text} />
      ))}
    </div>
  )
}

export default MeaSureDetail
