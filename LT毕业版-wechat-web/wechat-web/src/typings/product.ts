export enum ProductType {
  clothing = 'Clothing',
  accessory = 'Accessory'
}

export type ProductSize = {
  id: number
  swappable?: boolean
  size_abbreviation: string
  recommended?: boolean
  size: { id: number; name: string }
}

export type Product = {
  id: number
  disabled?: boolean
  tote_slot: number
  swappable?: boolean
  type?: ProductType
  product_sizes: ProductSize[]
  category_rule: null | {
    slug: string
    error_msg?: string
    swap_ban_threshold: number
  }
}
