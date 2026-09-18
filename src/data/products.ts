export type ProductCategory = 
  | "Sundaes"
  | "Scoops"
  | "Party Packs"
  | "Ice Cream Cakes"
  | "Ice Cream Tubs"
  | "Family Packs"
  | "Premium Collection";

export interface ProductNutrition {
  servingSize: string;
  calories: string;
  fat: string;
  sugars: string;
  protein: string;
  allergens: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  volume: string;
  price: number;
  originalPrice: number;
  image: string;
  badges: string[];
  description?: string;
  slug?: string;
  nutrition?: ProductNutrition;
}

export const mockProducts: Product[] = [
  // --- 5 PRODUCTS WITH VERIFIED NUTRITION DATA ---
  {
    id: "p-nutty-professor",
    name: "Nutty Professor",
    category: "Sundaes",
    volume: "252g",
    price: 260.00,
    originalPrice: 300.00,
    image: "/menu-items/nutty-professor.jpeg",
    badges: ["NUTS SPECIAL", "BEST SELLER"],
    description: "We made sure this treat is as nutty as its name. Crunchy californian almond ice cream paired generously with nuts, almonds, cashews, and raisins drowning in a delicious hot fudge sauce and topped off with whipped cream. Going nutty has never been this fun before.",
    nutrition: {
      servingSize: "Per 252g",
      calories: "769.8 kcal",
      fat: "40.4g",
      sugars: "70.3g",
      protein: "9.3g",
      allergens: "Milk, Nuts, Soy. May also contain cereals."
    }
  },
  {
    id: "p-alphonso-mango-fruit-cream",
    name: "Alphonso Mango Fruit Cream Sundae",
    category: "Sundaes",
    volume: "100g",
    price: 220.00,
    originalPrice: 260.00,
    image: "/menu-items/mango-cream-gelato.jpeg",
    badges: ["SUMMER SPECIAL", "FRESH FRUIT"],
    description: "Single scoop of alphonso mango ice cream layered with a blend of soft fruits, fruit toppings, whipped cream, and cherry on top. A pop of color and fruity flavor!.",
    nutrition: {
      servingSize: "Per 100g",
      calories: "237.59 kcal",
      fat: "10.75g",
      sugars: "30.44g",
      protein: "3.43g",
      allergens: "Milk, Nuts, Soy. May also contain cereals."
    }
  },
  {
    id: "p-choco-lava-cake-chocolate",
    name: "Choco Lava Cake Sundae (Chocolate)",
    category: "Sundaes",
    volume: "130g",
    price: 215.00,
    originalPrice: 250.00,
    image: "/menu-items/choco-lava-cake.jpeg",
    badges: ["BEST SELLER", "HOT & COLD"],
    description: "For the love of choco lava! soft chocolate sponge cake with a sinful scoop of dutch chocolate ice cream, drizzled with chocolate sauce and topped with chopped almonds. Oh, and did we mention that it comes with gooey chocolate sauce in the middle?.",
    nutrition: {
      servingSize: "Per 130g",
      calories: "420 kcal",
      fat: "22.8g",
      sugars: "33g",
      protein: "6g",
      allergens: "Milk, Nuts, Soy. May also contain cereals."
    }
  },
  {
    id: "p-choco-lava-cake-vanilla",
    name: "Choco Lava Cake Sundae (Vanilla)",
    category: "Sundaes",
    volume: "127g",
    price: 215.00,
    originalPrice: 250.00,
    image: "/menu-items/vanilla-sizzling-brownie.jpeg",
    badges: ["CLASSIC", "HOT & COLD"],
    description: "For the love of choco lava! soft chocolate sponge cake with a creamy scoop of vanilla ice cream, drizzled with a butterscotch topping and covered with chocolate sprinkles. Oh, and did we mention that it comes with gooey chocolate sauce in the middle?.",
    nutrition: {
      servingSize: "Per 127g",
      calories: "400.4 kcal",
      fat: "21.9g",
      sugars: "31.4g",
      protein: "5.5g",
      allergens: "Milk, Nuts, Soy. May also contain cereals."
    }
  },
  {
    id: "p-banana-n-strawberry-fruit-cream",
    name: "Banana N Strawberry Fruit Cream Sundae",
    category: "Sundaes",
    volume: "100g",
    price: 220.00,
    originalPrice: 270.00,
    image: "/menu-items/banana-strawberry-fruit-cream.jpeg",
    badges: ["FRESH FRUIT", "TRENDING"],
    description: "Single scoop of banana n strawberry ice cream layered with a blend of soft fruits, fruit toppings, whipped cream, and cherry on top. A pop of color and fruity flavor!.",
    nutrition: {
      servingSize: "Per 100g",
      calories: "243.96 kcal",
      fat: "10.49g",
      sugars: "32.58g",
      protein: "3.34g",
      allergens: "Milk, Nuts, Soy. May also contain cereals."
    }
  },

  // --- OTHER MENU DESSERTS & CREATIONS (NO NUTRITION DISPLAY) ---
  {
    id: "p-mississippi-mud-croissant",
    name: "Mississippi Mud - Croissant Cone Sundae",
    category: "Sundaes",
    volume: "250ml",
    price: 205.00,
    originalPrice: 250.00,
    image: "/menu-items/croissant-cone-sundae.jpeg",
    badges: ["1ST TIME IN INDIA", "BEST SELLER"],
    description: "Flaky, buttery Croissant with Mississippi Mud ice cream, topped with chocolate syrup & chocolate chips."
  },
  {
    id: "p-vanilla-affair-brownie",
    name: "Vanilla Affair - Brownie Dessert",
    category: "Sundaes",
    volume: "280ml",
    price: 195.00,
    originalPrice: 240.00,
    image: "/menu-items/vanilla-affair-brownie.jpeg",
    badges: ["CLASSIC"],
    description: "Brownie with Vanilla ice cream, topped with hot fudge or butterscotch sauce."
  },
  {
    id: "p-chocolate-lovers-waffle",
    name: "Chocolate Lovers - Waffle Sundae",
    category: "Sundaes",
    volume: "320ml",
    price: 325.00,
    originalPrice: 390.00,
    image: "/menu-items/chocolate-lovers-waffle.jpeg",
    badges: ["POPULAR"],
    description: "Toasty Waffle served with Dutch Chocolate ice cream, gooey brownie chunks, chocolate chips, butterscotch & chocolate sauce."
  },
  {
    id: "p-butterscotch-ribbon-cookie",
    name: "Butterscotch Ribbon - Hot Fudgy Cookie Dessert",
    category: "Sundaes",
    volume: "280ml",
    price: 220.00,
    originalPrice: 270.00,
    image: "/menu-items/butterscotch-ribbon-cookie.jpeg",
    badges: ["BEST SELLER"],
    description: "Warm, fudgy chocolate chip cookie topped with Butterscotch Ribbon ice cream, warm chocolate sauce and almond crunch."
  },
  {
    id: "p-lotus-biscoff-cheesecake",
    name: "Lotus Biscoff - Cheesecake Dessert",
    category: "Ice Cream Cakes",
    volume: "300ml",
    price: 300.00,
    originalPrice: 380.00,
    image: "/menu-items/biscoff-cheesecake.jpeg",
    badges: ["CHEF SPECIAL"],
    description: "Baked Cheesecake topped with Biscoff ice cream, caramel sauce & whipped cream."
  },
  {
    id: "p-iranian-pista-kulfi",
    name: "Iranian Pista Kulfi Sundae",
    category: "Sundaes",
    volume: "250ml",
    price: 200.00,
    originalPrice: 250.00,
    image: "/menu-items/iranian-pista-kulfi.jpeg",
    badges: ["ROYAL CLASSIC"],
    description: "Classic malai kulfi with a layer of vanilla ice cream and Iranian pistachio slivers, topped with rose drizzle and creamy condensed milk."
  },
  {
    id: "p-golden-ferrero-sundae",
    name: "Golden Ferrero Sundae",
    category: "Sundaes",
    volume: "280ml",
    price: 205.00,
    originalPrice: 260.00,
    image: "/menu-items/golden-ferrero.jpeg",
    badges: ["BEST SELLER"],
    description: "Irresistible Gold Medal Ribbon ice cream crowned with chocolate sauce, Ferrero Rocher crumble, whipped cream and a cherry on top."
  },
  {
    id: "p-tiramisu-cheesecake-sundae",
    name: "Tiramisu Cheesecake Sundae",
    category: "Ice Cream Cakes",
    volume: "300ml",
    price: 350.00,
    originalPrice: 420.00,
    image: "/menu-items/tiramisu-cheesecake-sundae.jpeg",
    badges: ["NEW", "PREMIUM"],
    description: "Velvety Tiramisu Cheesecake served with Biscoff ice cream topped with butterscotch sauce & biscuit crumble."
  },
  {
    id: "p-blueberry-muffin-sundae",
    name: "Blueberry Muffin Sundae",
    category: "Sundaes",
    volume: "320ml",
    price: 325.00,
    originalPrice: 390.00,
    image: "/menu-items/blueberry-muffin-sundae.jpeg",
    badges: ["NEW", "FRUITY"],
    description: "Centre-filled Blueberry Crumble Muffin paired with Blueberry Cheesecake Gelato topped with blueberry sauce & wheat crispies."
  },
  {
    id: "p-chocolate-muffin-sundae",
    name: "Chocolate Muffin Sundae",
    category: "Sundaes",
    volume: "340ml",
    price: 340.00,
    originalPrice: 420.00,
    image: "/menu-items/chocolate-muffin-sundae.jpeg",
    badges: ["NEW", "BEST SELLER"],
    description: "Decadent Double Chocolate Muffin served with the Iconic Mississippi Mud ice cream topped with hot fudge, almond bits & choco chips."
  },
  {
    id: "p-walnut-brownie-sundae",
    name: "Walnut Brownie Sundae",
    category: "Sundaes",
    volume: "300ml",
    price: 275.00,
    originalPrice: 340.00,
    image: "/menu-items/walnut-brownie-sundae.jpeg",
    badges: ["NEW", "BEST SELLER"],
    description: "Oh-so-fudgy Walnut Brownie paired with Cookies 'N Cream ice cream topped with hot fudge & cookie crumble."
  },
  {
    id: "p-dubai-chocolate-gelato",
    name: "Dubai Chocolate Gelato Sundae",
    category: "Sundaes",
    volume: "280ml",
    price: 295.00,
    originalPrice: 360.00,
    image: "/menu-items/dubai-chocolate-gelato.jpeg",
    badges: ["VIRAL TREND", "NEW"],
    description: "Dubai Chocolate Gelato topped with fudgy chocolate sauce, crispy kataifi and chocolate chips."
  },
  {
    id: "p-berry-me-cheesecake",
    name: "Berry Me In Cheesecake",
    category: "Sundaes",
    volume: "260ml",
    price: 205.00,
    originalPrice: 260.00,
    image: "/menu-items/berry-me-cheesecake.jpeg",
    badges: ["ITALIAN GELATO", "NEW"],
    description: "Blueberry Cheesecake Gelato, paired with a blueberry compote and NY style cheesecake cubes."
  },
  {
    id: "p-cotton-candy-wonderland",
    name: "Cotton Candy Wonderland",
    category: "Sundaes",
    volume: "260ml",
    price: 205.00,
    originalPrice: 260.00,
    image: "/menu-items/cotton-candy-wonderland.jpeg",
    badges: ["ITALIAN GELATO"],
    description: "Italian Cotton Candy Burst Gelato with strawberry compote, colourful Gems, wafer roll & more."
  },
  {
    id: "p-chocolate-roasted-hazelnut",
    name: "Chocolate & Roasted Hazelnut",
    category: "Sundaes",
    volume: "260ml",
    price: 205.00,
    originalPrice: 260.00,
    image: "/menu-items/chocolate-roasted-hazelnut.jpeg",
    badges: ["ITALIAN GELATO", "NUTELLA"],
    description: "Italian Chocolate & Roasted Hazelnut Gelato drizzled with Nutella and caramelised hazelnuts."
  },
  {
    id: "p-fairytale-sundae",
    name: "Fairytale Sundaes (Kids Special)",
    category: "Sundaes",
    volume: "200ml",
    price: 195.00,
    originalPrice: 230.00,
    image: "/menu-items/fairytale-sundae.jpeg",
    badges: ["KIDS SPECIAL"],
    description: "Your favourite scoop turned into a magical sundae with our fairytale toppers (Princess | Knight | Mermaid | Unicorn)."
  },
  {
    id: "p-lollipop-sundae",
    name: "Lollipop Sundaes (Kids Special)",
    category: "Sundaes",
    volume: "200ml",
    price: 155.00,
    originalPrice: 190.00,
    image: "/menu-items/lollipop-sundae.jpeg",
    badges: ["KIDS SPECIAL"],
    description: "More fun, more yum! Comes with your favourite ice cream, lollipop, crunchy wafer roll, and colourful sprinkles."
  },
  {
    id: "p-shooting-star-sundae",
    name: "Shooting Star Sundae (Kids Special)",
    category: "Sundaes",
    volume: "200ml",
    price: 195.00,
    originalPrice: 230.00,
    image: "/menu-items/shooting-star-sundae.jpeg",
    badges: ["KIDS SPECIAL"],
    description: "Special shooting star ice cream scoop with colourful toppings, stars, and sweet fruit syrup."
  },
  {
    id: "p-strawberry-splish-splash",
    name: "Very Berry Strawberry Gelato Sundae",
    category: "Sundaes",
    volume: "220ml",
    price: 155.00,
    originalPrice: 190.00,
    image: "/menu-items/strawberry-gelato-sundae.jpeg",
    badges: ["KIDS SPECIAL"],
    description: "Refreshing strawberry gelato paired with sweet berry coulis and fresh fruit toppings."
  }
];
