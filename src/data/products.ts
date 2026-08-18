export type ProductCategory = 
  | "Ice Cream Tubs"
  | "Family Packs"
  | "Ice Cream Cakes"
  | "Scoops"
  | "Sundaes"
  | "Party Packs"
  | "Premium Collection";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  volume: string;
  price: number;
  originalPrice: number;
  image: string;
  badges: string[];
}

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Black currant",
    category: "Ice Cream Tubs",
    volume: "500ml • 4.5 Scoops Servings",
    price: 299.00,
    originalPrice: 399.00,
    image: "/images/image 5.png",
    badges: ["BEST SELLER", "14% OFF"]
  },
  {
    id: "p2",
    name: "Very Berry Strawberry",
    category: "Ice Cream Tubs",
    volume: "500ml • 4.5 Scoops Servings",
    price: 299.00,
    originalPrice: 349.00,
    image: "/images/image 3 (2).png",
    badges: ["BEST SELLER", "14% OFF"]
  },
  {
    id: "p3",
    name: "Cotton Candy",
    category: "Ice Cream Tubs",
    volume: "500ml • 4.5 Scoops Servings",
    price: 299.00,
    originalPrice: 349.00,
    image: "/images/CottonCandy--450ml---1043sq_414x.png.png",
    badges: ["BEST SELLER", "14% OFF"]
  },
  {
    id: "p4",
    name: "Tiramisu",
    category: "Ice Cream Cakes",
    volume: "500ml",
    price: 199.00,
    originalPrice: 249.00,
    image: "/images/Tiramisu_Cheesecake_414x.png (1).png",
    badges: ["BEST SELLER", "14% OFF"]
  },
  {
    id: "p5",
    name: "Classic with Mango Sauce",
    category: "Ice Cream Cakes",
    volume: "500ml",
    price: 199.00,
    originalPrice: 249.00,
    image: "/images/image 3 (3).png",
    badges: ["BEST SELLER", "14% OFF"]
  },
  {
    id: "p6",
    name: "Blueberry Crumble",
    category: "Ice Cream Cakes",
    volume: "500ml",
    price: 169.00,
    originalPrice: 199.00,
    image: "/images/Blueberry_Crumble_Muffin_414x.png.png",
    badges: ["BEST SELLER", "14% OFF"]
  },
  {
    id: "p7",
    name: "Strawberry Paleta",
    category: "Premium Collection",
    volume: "100 ml",
    price: 59.00,
    originalPrice: 99.00,
    image: "/images/paleta-strawberry.png",
    badges: ["NEW", "15% OFF"]
  },
  {
    id: "p8",
    name: "Mango Yogurt Paleta",
    category: "Premium Collection",
    volume: "100 ml",
    price: 59.00,
    originalPrice: 99.00,
    image: "/images/paleta-mango.png",
    badges: ["BEST SELLER", "15% OFF"]
  },
  {
    id: "p9",
    name: "Blueberry Paleta",
    category: "Premium Collection",
    volume: "100 ml",
    price: 59.00,
    originalPrice: 99.00,
    image: "/images/paleta-blueberry.png",
    badges: ["NEW", "15% OFF"]
  },
  {
    id: "p10",
    name: "Deliciousness Sundae",
    category: "Sundaes",
    volume: "200ml",
    price: 159.00,
    originalPrice: 259.00,
    image: "/images/sundae-deliciousness.png",
    badges: ["BEST SELLER", "15% OFF"]
  },
  {
    id: "p11",
    name: "Caramel Macchiato",
    category: "Scoops",
    volume: "120ml • 1 Scoop",
    price: 89.00,
    originalPrice: 120.00,
    image: "/images/SCOOPS_d9897fbb-eccc.png",
    badges: ["TRENDING"]
  },
  {
    id: "p12",
    name: "Party Pack Supreme",
    category: "Party Packs",
    volume: "4000ml • 35 Scoops",
    price: 1299.00,
    originalPrice: 1599.00,
    image: "/images/BEVERAGE_95b0dcd1-b1.png",
    badges: ["BULK", "20% OFF"]
  }
];
