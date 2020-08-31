import {
  getSizeName,
  isAllSizeNotSwap,
  getButtonProps
} from 'src/app/containers/product/detail_buttons/utils/product_detail_bottom_btn_util.js'

describe('测试加入尺码按钮文字与状态', () => {
  let product, selectSizeObject, toteCart
  it('数据为空', () => {
    product = null
    selectSizeObject = null
    toteCart = null
    expect(getButtonProps(product, selectSizeObject, toteCart)).toEqual({
      text: '加入衣箱',
      disabled: false
    })
    product = null
    selectSizeObject = {
      id: 1
    }
    toteCart = {
      clothing_items: []
    }
    expect(getButtonProps(product, selectSizeObject, toteCart)).toEqual({
      text: '加入衣箱',
      disabled: false
    })
    product = {
      id: 1
    }
    selectSizeObject = null
    toteCart = {
      id: 1
    }
    expect(getButtonProps(product, selectSizeObject, toteCart)).toEqual({
      text: '加入衣箱',
      disabled: false
    })
    product = {
      id: 1
    }
    selectSizeObject = {
      id: 1
    }
    toteCart = null
    expect(getButtonProps(product, selectSizeObject, toteCart)).toEqual({
      text: '加入衣箱',
      disabled: false
    })
  })
  describe('all size not swap', () => {
    it('should be true if all are not swappable', () => {
      const nextItProduct = {
        id: 1,
        product_sizes: [
          {
            id: 1,
            swappable: false
          },
          {
            id: 2,
            swappable: false
          }
        ]
      }
      const result = isAllSizeNotSwap(nextItProduct)
      expect(result).toBe(true)
    })

    it('should be false if one is swappble', () => {
      const nextItProduct = {
        id: 1,
        product_sizes: [
          {
            id: 1,
            swappable: true
          },
          {
            id: 2,
            swappable: false
          }
        ]
      }

      const result = isAllSizeNotSwap(nextItProduct)
      expect(result).toBe(false)
    })

    it('should be true if only one size and swappable false', () => {
      const nextItProduct = {
        id: 1,
        product_sizes: [
          {
            id: 2,
            swappable: false
          }
        ]
      }

      const result = isAllSizeNotSwap(nextItProduct)
      expect(result).toBe(true)
    })

    it('should be false if only one size and swappable true', () => {
      const nextItProduct = {
        id: 1,
        product_sizes: [
          {
            id: 2,
            swappable: true
          }
        ]
      }

      const result = isAllSizeNotSwap(nextItProduct)
      expect(result).toBe(false)
    })
  })

  describe('get selected size name', () => {
    it('should return S when Small', () => {
      const result = getSizeName('Small')
      expect(result).toEqual('S')
    })

    it('should return US-S when US-S', () => {
      const result = getSizeName('US-S')
      expect(result).toEqual('美码S')
    })

    it('should return EU-32 when EU-32', () => {
      const result = getSizeName('EU-32')
      expect(result).toEqual('欧码32')
    })

    it('should return UK-6 when UK-6', () => {
      const result = getSizeName('UK-6')
      expect(result).toEqual('英码6')
    })

    it('should return cn-150 when CN-150', () => {
      const result = getSizeName('CN-150')
      expect(result).toEqual('150')
    })

    it('should return os when OS', () => {
      const result = getSizeName('OS')
      expect(result).toEqual('均码')
    })

    it('should return 0 when 0', () => {
      const result = getSizeName('0')
      expect(result).toEqual('美码0')
    })

    it('should return 2 when 2', () => {
      const result = getSizeName('2')
      expect(result).toEqual('美码2')
    })

    it('should return 24 when 24', () => {
      const result = getSizeName('24')
      expect(result).toEqual('24')
    })
  })
  describe('get button props', () => {
    it('should show add to tote when accessory and swappable, not in cart', () => {
      const product = {
        type: 'Accessory'
      }
      const toteCart = {
        accessory_items: []
      }
      const selectSizeObject = {
        swappable: true,
        name: 'Small'
      }
      const { text, disabled } = getButtonProps(
        product,
        selectSizeObject,
        toteCart
      )
      expect(text).toEqual('加入衣箱')
      expect(disabled).toEqual(false)
    })

    it('should show no ones left when accessory and not swappable, not in cart', () => {
      const product = {
        type: 'Accessory'
      }
      const toteCart = {}
      const selectSizeObject = {
        swappable: false
      }
      const selectedSizeName = 'OS'
      const { text, disabled } = getButtonProps(
        product,
        selectSizeObject,
        selectedSizeName,
        toteCart
      )

      expect(text).toEqual('暂无库存')
      expect(disabled).toEqual(true)
    })

    it('should show already in totes when accessory, swappable and in cart', () => {
      const product = {
        id: 1,
        type: 'Accessory'
      }
      const toteCart = {
        accessory_items: [
          {
            product_size: {
              id: 1
            }
          }
        ]
      }
      const selectSizeObject = {
        id: 1,
        swappable: true,
        name: 'OS'
      }
      const { text, disabled } = getButtonProps(
        product,
        selectSizeObject,
        toteCart
      )

      expect(text).toEqual('已在衣箱')
      expect(disabled).toEqual(true)
    })

    it('should show already in totes when accessory, not swappable and in cart', () => {
      const product = {
        type: 'Accessory'
      }
      const toteCart = {
        accessory_items: [
          {
            product_size: {
              id: 1
            }
          }
        ]
      }
      const selectSizeObject = {
        swappable: false,
        id: 1,
        name: 'OS'
      }
      const { text, disabled } = getButtonProps(
        product,
        selectSizeObject,
        toteCart
      )

      expect(text).toEqual('已在衣箱')
      expect(disabled).toEqual(true)
    })

    it('should show add to tote when clothing, swappable and not in cart', () => {
      const product = {
        type: 'Clothing'
      }
      const toteCart = {}
      const selectSizeObject = {
        swappable: true,
        name: 'Small'
      }
      const { text, disabled } = getButtonProps(
        product,
        selectSizeObject,
        toteCart
      )

      expect(text).toEqual('加入S码')
      expect(disabled).toEqual(false)
    })

    it('should show not ones left when clothing, not swappable and not in cart', () => {
      const product = {
        type: 'Clothing',
        product_sizes: [
          {
            id: 1,
            swappable: false
          }
        ]
      }
      const toteCart = {}
      const selectSizeObject = {
        swappable: false,
        id: 1
      }
      const selectedSizeName = 'Small'
      const { text, disabled } = getButtonProps(
        product,
        selectSizeObject,
        selectedSizeName,
        toteCart
      )

      expect(text).toEqual('暂无库存')
      expect(disabled).toEqual(true)
    })

    it('should show not ones left when clothing, not swappable and in cart', () => {
      const product = {
        type: 'Clothing',
        product_sizes: [
          {
            id: 1,
            swappable: false
          }
        ]
      }
      const toteCart = {
        clothing_items: [
          {
            product_size: {
              id: 1
            }
          }
        ]
      }
      const selectSizeObject = {
        swappable: false,
        id: 1,
        name: 'Small'
      }
      const { text, disabled } = getButtonProps(
        product,
        selectSizeObject,
        toteCart
      )

      expect(text).toEqual('暂无库存')
      expect(disabled).toEqual(true)
    })

    it('should show not ones left when clothing, swappable and in cart', () => {
      const product = {
        type: 'Clothing',
        product_sizes: [
          {
            id: 1,
            swappable: true
          }
        ]
      }
      const toteCart = {
        clothing_items: [
          {
            product_size: {
              id: 1
            }
          }
        ]
      }
      const selectSizeObject = {
        swappable: true,
        id: 1,
        name: 'Small'
      }
      const { text, disabled } = getButtonProps(
        product,
        selectSizeObject,
        toteCart
      )

      expect(text).toEqual('S码已在衣箱')
      expect(disabled).toEqual(true)
    })
  })
})
