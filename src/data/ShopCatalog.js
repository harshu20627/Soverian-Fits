import shopProductData from '../Shop_product.json'

const collectionImages = Object.entries(import.meta.glob('../assets/collection-pro*.jpg', {
  eager: true,
  import: 'default',
}))
  .filter(([path]) => !path.endsWith('collection-pro24.jpg'))
  .sort(([firstPath], [secondPath]) => (
    Number(firstPath.match(/pro(\d+)\.jpg$/)?.[1])
      - Number(secondPath.match(/pro(\d+)\.jpg$/)?.[1])
  ))
  .map(([, image]) => image)

const womenProductImages = Object.fromEntries(
  Object.entries(import.meta.glob('../assets/women-pro*.png', {
    eager: true,
    import: 'default',
  }))
    .filter(([path]) => !path.endsWith('women-pro1.png'))
    .map(([path, image]) => [path.split('/').pop(), image]),
)

const collectionDetails = [
  { name: 'Brown Utility Zip Jacket', category: 'Outerwear', colors: ['Brown'] },
  { name: 'Charcoal Minimal Zip Jacket', category: 'Outerwear', colors: ['Grey', 'White'] },
  { name: 'Sherpa-Lined Heritage Jacket', category: 'Outerwear', colors: ['Brown', 'Black', 'Beige'] },
  { name: 'Olive Cargo Wide-Leg Pants', category: 'Trousers', colors: ['Olive Green'] },
  { name: 'Brown Relaxed Denim Jeans', category: 'Denim', colors: ['Brown'] },
  { name: 'White and Green Court Sneakers', category: 'Footwear', colors: ['White', 'Green'], sizes: [] },
  { name: 'Brown Suede Low-Top Sneakers', category: 'Footwear', colors: ['Brown', 'Black'], sizes: [] },
  { name: 'Grey and White Retro Sneakers', category: 'Footwear', colors: ['Grey', 'White'], sizes: [] },
  { name: 'Heritage Polo Outfit', category: 'Outfit Sets', colors: ['Brown', 'White', 'Beige'] },
  { name: 'Contrast-Collar Polo Outfit', category: 'Outfit Sets', colors: ['White', 'Brown'] },
  { name: 'Slim Metal-Frame Sunglasses', category: 'Accessories', colors: ['Gold', 'Black'], sizes: [] },
  { name: 'Classic Aviator Sunglasses', category: 'Accessories', colors: ['Gold', 'Brown'], sizes: [] },
  { name: 'Green Embroidered Baseball Cap', category: 'Accessories', colors: ['Green'], sizes: [] },
  { name: 'Green Analog Sports Watch', category: 'Accessories', colors: ['Green', 'Black'], sizes: [] },
  { name: 'Vintage Digital Watch', category: 'Accessories', colors: ['Black', 'Brown'], sizes: [] },
  { name: 'Graphic Patchwork Sweatshirt', category: 'Sweatshirts', colors: ['Grey', 'Black', 'White'] },
  { name: 'Floral Print Camp-Collar Shirt', category: 'Shirts', colors: ['Red', 'Green', 'Black'] },
  { name: 'Cream Quilted Puffer Jacket', category: 'Outerwear', colors: ['White', 'Beige'] },
  { name: 'Color-Block Retro Sneakers', category: 'Footwear', colors: ['Black', 'White', 'Brown'], sizes: [] },
  { name: 'Burgundy Utility Zip Jacket', category: 'Outerwear', colors: ['Burgundy', 'Black'] },
  { name: 'Navy Waffle-Knit Polo Sweatshirt', category: 'Sweatshirts', colors: ['Navy Blue'] },
  { name: 'Navy Corduroy Wide-Leg Trousers', category: 'Trousers', colors: ['Navy Blue'] },
  { name: 'Brown Plaid Overshirt', category: 'Shirts', colors: ['Brown', 'Beige'] },
  { name: 'Cream and Navy Striped Knit Polo', category: 'Knitwear', colors: ['Cream', 'Navy Blue'] },
  { name: 'Charcoal Color-Block Hoodie', category: 'Hoodies', colors: ['Grey', 'White'] },
  { name: 'Taupe Color-Block Hoodie', category: 'Hoodies', colors: ['Beige', 'Brown'] },
  { name: 'Forest Green Graphic Sweatshirt', category: 'Sweatshirts', colors: ['Green', 'Cream'] },
  { name: 'Vintage Patterned Hooded Sweatshirt', category: 'Hoodies', colors: ['Grey', 'Brown', 'Beige'] },
  { name: 'Patterned Fleece Zip Jacket', category: 'Outerwear', colors: ['Navy Blue', 'Brown', 'Orange'] },
  { name: 'Multicolor Patchwork Button-Up Shirt', category: 'Shirts', colors: ['Multicolor'] },
  { name: 'Geometric Sherpa Jacket Outfit', category: 'Outfit Sets', colors: ['Beige', 'Brown', 'Black'] },
  { name: 'Heritage Brown Layered Outfit', category: 'Outfit Sets', colors: ['Brown', 'Beige', 'White'] },
  { name: 'Distressed Burgundy Baseball Cap', category: 'Accessories', colors: ['Burgundy'], sizes: [] },
  { name: 'Red Embroidered Festive Kurta', category: 'Ethnicwear', colors: ['Red', 'Gold'] },
  { name: 'Green Court Sneakers', category: 'Footwear', colors: ['Green', 'White'], sizes: [] },
  { name: 'Sage and Cream On-Ear Headphones', category: 'Accessories', colors: ['Green', 'Cream', 'Orange'], sizes: [] },
  { name: 'Sage Flip-Top Lighter', category: 'Accessories', colors: ['Green', 'Cream'], sizes: [] },
  { name: 'Wood-Cup Over-Ear Headphones', category: 'Accessories', colors: ['Brown', 'Black'], sizes: [] },
]

const collectionProducts = collectionDetails.map((details, index) => {
  const sourceProduct = Object.fromEntries(
    Object.entries(shopProductData.products[index % shopProductData.products.length])
      .filter(([key]) => key !== 'rating' && key !== 'reviews'),
  )
  return {
    ...sourceProduct,
    ...details,
    id: index + 1,
    source: 'collection',
    category: details.category === 'Footwear'
      ? 'Shoes'
      : details.name.includes('Watch') ? 'Watches' : details.category,
    sizes: details.sizes ?? ['S', 'M', 'L', 'XL'],
    image: collectionImages[index],
  }
})

const womenProducts = [
  { name: 'Striped Tee & Denim Edit', category: 'Western Wear', price: 2299, oldPrice: 2899, tag: 'NEW', image: 'women-pro4.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Blue' },
  { name: 'Everyday Navy Shirt', category: 'Tops & Tees', price: 1899, oldPrice: 2499, tag: 'NEW', image: 'women-pro5.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Blue' },
  { name: 'Embroidered Blouse & Skirt Set', category: 'Ethnic Wear', price: 3299, oldPrice: 3999, tag: 'NEW', image: 'women-pro7.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Ivory' },
  { name: 'Olive Tailored Blazer', category: 'Outerwear', price: 3599, oldPrice: 4499, tag: 'NEW', image: 'women-pro8.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Emerald' },
  { name: 'Burgundy Ribbed Knit Top', category: 'Tops & Tees', price: 1699, oldPrice: 2199, tag: 'NEW', image: 'women-pro9.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Wine' },
  { name: 'Relaxed Wide-Leg Trousers', category: 'Western Wear', price: 1799, oldPrice: 2299, tag: '', image: 'women-pro10.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Brown' },
  { name: 'Tiered Everyday Maxi Skirt', category: 'Western Wear', price: 1999, oldPrice: 2599, tag: '', image: 'women-pro11.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Brown' },
  { name: 'Wine Bow Heels', category: 'Footwear', price: 2499, oldPrice: 3199, tag: 'NEW', image: 'women-pro12.png', sizes: [], color: 'Wine' },
  { name: 'Polished Ankle Boots', category: 'Footwear', price: 3299, oldPrice: 3999, tag: 'NEW', image: 'women-pro13.png', sizes: [], color: 'Wine' },
  { name: 'Cherry Mini Shoulder Bag', category: 'Accessories', price: 2199, oldPrice: 2799, tag: 'NEW', image: 'women-pro14.png', sizes: [], color: 'Wine' },
  { name: 'Classic Court Sneakers', category: 'Footwear', price: 2799, oldPrice: 3499, tag: '', image: 'women-pro15.png', sizes: [], color: 'Ivory' },
  { name: 'Burgundy Dial Bracelet Watch', category: 'Accessories', price: 2899, oldPrice: 3599, tag: 'NEW', image: 'women-pro16.png', sizes: [], color: 'Wine' },
  { name: 'Rose Dial Link Watch', category: 'Accessories', price: 3199, oldPrice: 3899, tag: '', image: 'women-pro17.png', sizes: [], color: 'Pink' },
  { name: 'Floral Ombre Knit Sweater', category: 'Tops & Tees', price: 2599, oldPrice: 3299, tag: 'NEW', image: 'women-pro18.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Wine' },
  { name: 'Color-Block Cozy Sweater', category: 'Tops & Tees', price: 2399, oldPrice: 2999, tag: '', image: 'women-pro19.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Brown' },
  { name: 'Blue Floral Knit Pullover', category: 'Tops & Tees', price: 2699, oldPrice: 3399, tag: 'NEW', image: 'women-pro20.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Blue' },
  { name: 'Embroidered Blouse & Skirt Co-ord', category: 'Ethnic Wear', price: 3499, oldPrice: 4299, tag: '', image: 'women-pro21.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Ivory' },
  { name: 'Longline Belted Coat', category: 'Outerwear', price: 4299, oldPrice: 5299, tag: 'NEW', image: 'women-pro22.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Brown' },
  { name: 'Burgundy Shirt & Denim Outfit', category: 'Western Wear', price: 2899, oldPrice: 3599, tag: '', image: 'women-pro67.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Wine' },
  { name: 'Embroidered Festive Set', category: 'Ethnic Wear', price: 2999, oldPrice: 3699, tag: '', image: 'women-pro2.png', sizes: ['S', 'M', 'L', 'XL'], color: 'Gold' },
  { name: 'Floral Print Everyday Top', category: 'Tops & Tees', price: 1399, oldPrice: 1899, tag: '', image: 'women-pro3.png', sizes: ['S', 'M', 'L'], color: 'Pink' },
].map((product, index) => ({
  ...product,
  id: index + 1,
  source: 'women',
  category: product.category === 'Footwear'
    ? 'Shoes'
    : product.name.includes('Watch') ? 'Watches' : product.category,
  colors: [product.color],
  image: womenProductImages[product.image],
}))

export const mergeShopProducts = (apiProducts = [], localProducts = []) => {
  const productsById = new Map(apiProducts.map((product) => [String(product.id), { ...product, source: 'shop' }]))

  localProducts.forEach((product) => {
    if (!productsById.has(String(product.id))) {
      productsById.set(String(product.id), { ...product, source: 'shop' })
    }
  })

  return [...productsById.values(), ...collectionProducts, ...womenProducts]
    .filter((product) => product.image)
}

export const additionalShopProducts = [...collectionProducts, ...womenProducts]
