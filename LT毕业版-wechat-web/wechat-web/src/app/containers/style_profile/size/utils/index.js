export const INPUT_LIST = [
  {
    title: '身高',
    unit: 'cm',
    type: 'height_inches',
    required: true
  },
  {
    title: '体重',
    unit: 'kg',
    type: 'weight',
    required: true
  },
  {
    title: '体型',
    unit: '',
    type: 'shape'
  },
  {
    title: '肩宽',
    unit: 'cm',
    type: 'shoulder_size'
  },
  {
    title: '上胸围',
    unit: 'cm',
    type: 'bust_size_number'
  },
  {
    title: '腰围',
    unit: 'cm',
    type: 'waist_size'
  },
  {
    title: '臀围',
    unit: 'cm',
    type: 'hip_size_inches'
  },
  {
    title: '内腿长',
    unit: 'cm',
    type: 'inseam'
  }
]

export const SELECT_SIZE_OPIONS = [
  {
    type: 'inseam',
    title: '内腿长',
    measurement: `双腿<span>靠拢站直</span>，测量<span>裤裆到脚底</span>的长度`,
    bg_img: require('../select_size/images/inseam.svg'),
    range: [55, 85],
    defaultValue: 70
  },
  {
    type: 'hip_size_inches',
    title: '臀围',
    measurement:
      '双腿<span>靠拢站直</span>，用卷尺经过<span>臀部最高点<br/>贴身</span>围上一圈，尽量<span>水平拉直</span>',
    bg_img: require('../select_size/images/hip_size_inches.svg'),
    range: [60, 110],
    defaultValue: 80
  },
  {
    type: 'waist_size',
    title: '腰围',
    measurement:
      '用卷尺在<span>肚脐眼上方3cm</span>位置贴身围上<br/>一圈，尽量<span>水平拉直</span>',
    bg_img: require('../select_size/images/waist_size.svg'),
    range: [55, 100],
    defaultValue: 70
  },
  {
    type: 'bust_size_number',
    title: '上胸围',
    measurement:
      '用卷尺经过<span>乳头</span>位置贴身围上一圈，尽量<span>水平拉直</span>',
    bg_img: require('../select_size/images/bust_size_number.svg'),
    range: [60, 130],
    defaultValue: 80
  },
  {
    type: 'shoulder_size',
    title: '肩宽',
    measurement:
      '从左边<span>肩骨</span>到右边肩骨，测量<span>直线<br/>距离</span>尽量<span>水平拉直</span>',
    bg_img: require('../select_size/images/shoulder_size.svg'),
    range: [30, 50],
    defaultValue: 40
  }
]

export const PICKER_OPTIONS = ['height_inches', 'weight']
