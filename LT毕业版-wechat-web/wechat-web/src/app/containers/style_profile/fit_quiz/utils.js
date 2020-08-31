import Apple from './images/Apple.png'
import Slender from './images/Slender.png'
import Pear from './images/Pear.png'
import Heart from './images/Heart.png'
import Hourglass from './images/Hourglass.png'

import Waist from 'src/assets/images/style/tinified/measurewaist.png'
import Inseam from 'src/assets/images/style/tinified/measureInseam.png'
import Group from 'src/assets/images/style/tinified/measureHips.png'

export const Shape = [
  ['Apple', Apple, '苹果型'],
  ['Heart', Heart, '心型'],
  ['Pear', Pear, '梨型'],
  ['Slender', Slender, 'H型'],
  ['Hourglass', Hourglass, '沙漏型']
]

export const TipsType = {
  waist: {
    title: `如何测量腰围`,
    description: `肚脐上方2cm，将软尺贴身测量一圈`,
    src: Waist
  },
  hips: {
    title: `如何测量臀围`,
    description: `双腿靠拢站直，将软尺经臀部最高点水平测量一圈。要确保尺子在所有的地方都是水平的`,
    src: Group
  },
  inseam: {
    title: `如何测量内腿长`,
    description: `为了找到你完美的裤子长度，请拿出你合身的裤子，然后测量裤裆到裤脚的长度`,
    src: Inseam
  }
}
