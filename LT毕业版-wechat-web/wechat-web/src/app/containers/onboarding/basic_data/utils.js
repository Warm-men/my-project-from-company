export const INDUSTRY = [
  '科技/互联网',
  '金融/投资',
  '广告/文化/传媒',
  '市场/营销/零售',
  '法律/教育/咨询',
  '政府/事业单位',
  '服务业',
  '学生',
  '全职宝妈',
  '其他'
]

export const MARRIAGE = [
  {
    display: '未婚',
    value: {
      mom: false,
      marital_status: 'unmarried'
    }
  },
  {
    display: '已婚未育',
    value: {
      mom: false,
      marital_status: 'married'
    }
  },
  {
    display: '已婚已育',
    value: {
      mom: true,
      marital_status: 'married'
    }
  }
]
