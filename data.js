const IMG_PRODUCT = "./assets/img/product.svg";

window.DB = {
  categories: [
    "Clothing",
    "Electronics",
    "Health & Beauty",
    "Watches",
    "Jewellery",
    "Shoes",
    "Kids & Babies",
    "Sports",
    "Home & Garden"
  ],
  products: [
    { id:"p3001", name:"Classic Tee", category:"Clothing", price:45.99, discount:0, rating:4.5, featured:true, image:IMG_PRODUCT },
    { id:"p3002", name:"Urban Watch", category:"Watches", price:59.00, discount:34, rating:4.7, featured:true, image:IMG_PRODUCT },
    { id:"p3003", name:"Smart Earbuds", category:"Electronics", price:39.99, discount:10, rating:4.2, featured:true, image:IMG_PRODUCT },
    { id:"p3004", name:"Minimal Bag", category:"Clothing", price:49.99, discount:20, rating:4.6, featured:true, image:IMG_PRODUCT },
    { id:"p3005", name:"Running Shoes", category:"Shoes", price:64.50, discount:0, rating:4.3, featured:false, image:IMG_PRODUCT },
    { id:"p3006", name:"Skin Serum", category:"Health & Beauty", price:18.25, discount:15, rating:4.1, featured:false, image:IMG_PRODUCT },
    { id:"p3007", name:"Kids Backpack", category:"Kids & Babies", price:22.10, discount:0, rating:4.4, featured:false, image:IMG_PRODUCT },
    { id:"p3008", name:"Fitness Bottle", category:"Sports", price:12.90, discount:5, rating:4.0, featured:false, image:IMG_PRODUCT },
    { id:"p3009", name:"Home Lamp", category:"Home & Garden", price:27.60, discount:0, rating:4.2, featured:false, image:IMG_PRODUCT },
    { id:"p3010", name:"Silver Pendant", category:"Jewellery", price:32.40, discount:8, rating:4.5, featured:false, image:IMG_PRODUCT }
  ]
};
