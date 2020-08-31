import { sortToteProducts } from '../totes'

describe('测试totes.js', () => {
  describe('测试sortToteProducts', () => {
    it('衣服在前的排序', () => {
      const toteProduct = [
        {
          id: 1,
          product: {
            category: {
              id: 1,
              accessory: true,
              clothing: false
            }
          }
        },
        {
          id: 2,
          product: {
            category: {
              id: 2,
              accessory: false,
              clothing: true
            }
          }
        },
        {
          id: 3,
          product: {
            category: {
              id: 3,
              accessory: false,
              clothing: true
            }
          }
        }
      ]
      const result = sortToteProducts(toteProduct)
      expect(result[0].product.category.clothing).toEqual(true)
    })

    it('首饰在前的排序', () => {
      const toteProduct = [
        {
          id: 1,
          product: {
            category: {
              id: 1,
              accessory: false,
              clothing: true
            }
          }
        },
        {
          id: 2,
          product: {
            category: {
              id: 2,
              accessory: false,
              clothing: true
            }
          }
        },
        {
          id: 3,
          product: {
            category: {
              id: 3,
              accessory: true,
              clothing: false
            }
          }
        }
      ]
      const result = sortToteProducts(toteProduct, true)
      expect(result[0].product.category.accessory).toEqual(true)
    })
  })
})
