import { Product, ProductSize } from "./product"



export type ToteCartItemType = {
  id: number
  slot: number
  product: Product
  product_size: ProductSize
}


export type ToteCart = {
  clothingSlot: number // 当前衣位数量
  accessorySlot: number
  max_clothing_count: number
  max_accessory_count: number
  clothing_items: ToteCartItemType[]
  accessory_items: ToteCartItemType[]
}