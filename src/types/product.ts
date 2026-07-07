export type Product = {
  id: string
  title: string
  description: string | null
  category: string | null
  original_price: number
  discounted_price: number
  discount_rate: number
  brand_id: string
  affiliate_link: string
  image_url: string | null
  is_featured: boolean
  size: number
  gender: 'unisex' | 'erkek' | 'kadin' | 'cocuk'
}

export type Brand = {
  id: string
  name: string
  logo_url: string | null
}