'use strict'

const wisdoms = {
  wisdomList: [
    { wisdom: 'Wear high heels, you changed', name: 'Manolo Blahnik' },
    {
      wisdom: 'Need not perfume women have no future',
      name: 'Manolo Blahnik'
    },
    { wisdom: 'Fashion, style forever', name: 'Coco Chanel' },
    { wisdom: 'If you have questions in red', name: 'Bill Blass' },
    { wisdom: 'Fashion will only cause a pandemic', name: '萧伯纳' },
    {
      wisdom: 'Jeans are a symbol of the popular democracy',
      name: 'Giorgio Armani'
    },
    { wisdom: 'Red is the ultimate antidote, sadly ', name: 'Bill Blass' },
    {
      wisdom: 'Style is a kind of instinct, intuition in the first place',
      name: 'Bill Blass'
    },
    {
      wisdom: 'The difference between style and popular lies in the quality',
      name: 'Giorgio Armani'
    },
    {
      wisdom: 'Fashion is architecture, it has to do with proportion',
      name: 'Coco Chanel'
    }
  ]
}

export default function wisdom() {
  return wisdoms.wisdomList[parseInt(Math.random() * 10)]
}
