const SECTIONS = [
  {
    title: '如何测量胸围？',
    content: [
      {
        description: [
          {
            title: '下胸围：',
            content: '用软尺水平测量胸底部一周\n胸罩尺寸=下胸围尺寸'
          }
        ],
        image: {
          url: require('../../../../assets/images/sizeTutorial/lowerBust.png'),
          width: 212,
          height: 168
        }
      },
      {
        description: [
          {
            title: '上胸围：',
            content: '用软尺紧贴着身体通过乳头的水平位置围上一圈'
          },
          {
            title: '罩杯尺寸=',
            content: '上胸围尺寸-下胸围尺寸'
          }
        ],
        image: {
          url: require('../../../../assets/images/sizeTutorial/upperBust.png'),
          width: 220,
          height: 180.5
        }
      }
    ],
    type: 'upperBust',
    rest: '例如：你的上胸围为85cm，下胸围为75cm，\n那么你的胸围尺码为75B'
  },
  {
    title: '如何测量肩宽？',
    content: {
      description:
        '从一边肩骨到另一边肩骨的直线距离，测量时\n软尺要拉直，不能贴着身体',
      image: {
        url: require('../../../../assets/images/sizeTutorial/shoulderWidth.png'),
        width: 200,
        height: 210
      }
    },
    type: 'shoulderWidth'
  },
  {
    title: '如何测量腰围？',
    content: {
      description:
        '测量腰围时，软尺贴着皮肤，在肚脐眼上方3cm\n的水平位置围上一圈',
      image: {
        url: require('../../../../assets/images/sizeTutorial/waistCircumference.png'),
        width: 220,
        height: 210
      }
    },
    type: 'waistCircumference'
  },
  {
    title: '如何测量臀围？',
    content: {
      description:
        '双腿靠拢站直，将软尺经过臀部最高点水平测量\n一圈。要确保尺子所在地都是水平的',
      image: {
        url: require('../../../../assets/images/sizeTutorial/hipCircumference.png'),
        width: 115,
        height: 234
      }
    },
    type: 'hipCircumference'
  },
  {
    title: '如何测量内腿长？',
    content: {
      description: '双腿靠拢站直，测量裤裆到脚底的长度',
      image: {
        url: require('../../../../assets/images/sizeTutorial/innerleglength.png'),
        width: 220,
        height: 316
      }
    },
    type: 'innerleglength'
  }
]
const MEASUREDATA = [
  {
    standard: [
      { title: '65', unit: 'cm' },
      { title: '70', unit: 'cm' },
      { title: '75', unit: 'cm' },
      { title: '80', unit: 'cm' },
      { title: '85', unit: 'cm' },
      { title: '90', unit: 'cm' }
    ],
    standardTitle: '尺\n码',
    range: [
      { value: '63~67' },
      { value: '68~72' },
      { value: '73~77' },
      { value: '78~82' },
      { value: '83~87' },
      { value: '88~89' }
    ],
    rangeTitle: '测\n量\n值'
  },
  {
    standard: [
      { title: 'A', unit: 'cm' },
      { title: 'B', unit: 'cm' },
      { title: 'C', unit: 'cm' },
      { title: 'D', unit: 'cm' },
      { title: 'E', unit: 'cm' },
      { title: 'F', unit: 'cm' }
    ],
    standardTitle: '罩\n杯',
    range: [
      { value: '<8' },
      { value: '8-10' },
      { value: '10-13' },
      { value: '14-16' },
      { value: '17-19' },
      { value: '20-24' }
    ],
    rangeTitle: '差\n值'
  }
]
export { SECTIONS, MEASUREDATA }
