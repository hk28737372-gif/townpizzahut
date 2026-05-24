export type Category = string;

export interface CategoryItem {
  id: string;
  name: string;
  image: string;
}

export interface MenuItem {
  id: number;
  name: string;
  category: Category;
  price: number;
  image: string;
  description?: string;
}

export interface Deal {
  id: number;
  title: string;
  price: number;
  items: string[];
  image: string;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phones: string[];
  whatsappNumber: string;
  mapQuery: string;
}

export const categories: Category[] = [
  "Burgers",
  "Fried Chicken",
  "Shawarma & Rolls",
  "Pizza"
];

export const initialCategoriesData: CategoryItem[] = [
  { id: "Burgers", name: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=75&auto=format&fit=crop" },
  { id: "Fried Chicken", name: "Fried Chicken", image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&q=75&auto=format&fit=crop" },
  { id: "Shawarma & Rolls", name: "Shawarma & Rolls", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&q=75&auto=format&fit=crop" },
  { id: "Pizza", name: "Pizza", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=75&auto=format&fit=crop" }
];

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Zinger Burger",
    category: "Burgers",
    price: 350,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=75&auto=format&fit=crop",
    description: "Crispy spicy chicken patty with fresh lettuce and mayo in a sesame bun"
  },
  {
    id: 2,
    name: "Cheese Burger",
    category: "Burgers",
    price: 380,
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=75&auto=format&fit=crop",
    description: "Double cheese burger with melted cheddar dripping down the sides"
  },
  {
    id: 3,
    name: "Chicken Burger",
    category: "Burgers",
    price: 330,
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=75&auto=format&fit=crop",
    description: "Grilled chicken fillet with fresh lettuce and tomato"
  },
  {
    id: 4,
    name: "American Burger",
    category: "Burgers",
    price: 400,
    image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&q=75&auto=format&fit=crop",
    description: "Classic American style beef burger with all the toppings"
  },
  {
    id: 5,
    name: "Tikka Burger",
    category: "Burgers",
    price: 370,
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&q=75&auto=format&fit=crop",
    description: "Spicy tikka chicken burger with green chutney and herbs"
  },
  {
    id: 6,
    name: "Tower Burger",
    category: "Burgers",
    price: 550,
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&q=75&auto=format&fit=crop",
    description: "Tall tower burger stacked high with multiple chicken patties"
  },
  {
    id: 7,
    name: "Double Decker Burger",
    category: "Burgers",
    price: 480,
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&q=75&auto=format&fit=crop",
    description: "Double decker burger with two beef patties and double cheese"
  },
  {
    id: 8,
    name: "Town Special Pizza Burger",
    category: "Burgers",
    price: 520,
    image: "https://images.unsplash.com/photo-1603064752734-4c48eff53d05?w=400&q=75&auto=format&fit=crop",
    description: "Our signature creation — pizza sauce, mozzarella, pepperoni inside a premium burger bun"
  },

  {
    id: 9,
    name: "1 Piece Leg",
    category: "Fried Chicken",
    price: 180,
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=75&auto=format&fit=crop",
    description: "Crispy golden-brown fried chicken drumstick leg piece"
  },
  {
    id: 10,
    name: "1 Piece Thai",
    category: "Fried Chicken",
    price: 180,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=75&auto=format&fit=crop",
    description: "Crispy Thai-style fried chicken thigh with special seasoning"
  },
  {
    id: 11,
    name: "4 Piece Half Broast",
    category: "Fried Chicken",
    price: 680,
    image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&q=75&auto=format&fit=crop",
    description: "Four pieces of golden broast chicken — perfectly crispy outside, juicy inside"
  },
  {
    id: 12,
    name: "8 Piece Full Broast",
    category: "Fried Chicken",
    price: 1250,
    image: "https://images.unsplash.com/photo-1532636875304-0c89119d9b4d?w=400&q=75&auto=format&fit=crop",
    description: "Full family-sized broast chicken platter — eight golden crispy pieces"
  },
  {
    id: 13,
    name: "5 Piece Hot Wings",
    category: "Fried Chicken",
    price: 390,
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=75&auto=format&fit=crop",
    description: "Five fiery hot buffalo chicken wings tossed in spicy sauce"
  },
  {
    id: 14,
    name: "10 Piece Hot Wings",
    category: "Fried Chicken",
    price: 750,
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&q=75&auto=format&fit=crop",
    description: "Ten sizzling hot chicken wings in our signature buffalo sauce"
  },
  {
    id: 15,
    name: "10 Piece Nuggets",
    category: "Fried Chicken",
    price: 500,
    image: "https://images.unsplash.com/photo-1619881589316-3a89c2c07e0e?w=400&q=75&auto=format&fit=crop",
    description: "Ten crispy bite-sized chicken nuggets served with dipping sauce"
  },
  {
    id: 16,
    name: "10 Piece BBQ Wings",
    category: "Fried Chicken",
    price: 750,
    image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=75&auto=format&fit=crop",
    description: "Ten BBQ-glazed chicken wings with smoky sweet sauce"
  },
  {
    id: 17,
    name: "10 Piece Buffalo Wings",
    category: "Fried Chicken",
    price: 750,
    image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&q=75&auto=format&fit=crop",
    description: "Classic buffalo wings with tangy sauce — a crowd favorite"
  },

  {
    id: 18,
    name: "Chicken Shawarma",
    category: "Shawarma & Rolls",
    price: 220,
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=75&auto=format&fit=crop",
    description: "Classic chicken shawarma wrap with garlic sauce and fresh vegetables"
  },
  {
    id: 19,
    name: "Chicken Cheese Shawarma",
    category: "Shawarma & Rolls",
    price: 270,
    image: "https://images.unsplash.com/photo-1511358522-a658b1283523?w=400&q=75&auto=format&fit=crop",
    description: "Chicken shawarma elevated with melted cheese and special garlic sauce"
  },
  {
    id: 20,
    name: "Vegetarian Shawarma",
    category: "Shawarma & Rolls",
    price: 180,
    image: "https://images.unsplash.com/photo-1601050690117-94f5f7b8adbd?w=400&q=75&auto=format&fit=crop",
    description: "Fresh grilled vegetables with tahini sauce wrapped in soft pita"
  },
  {
    id: 21,
    name: "Zinger Shawarma",
    category: "Shawarma & Rolls",
    price: 280,
    image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=75&auto=format&fit=crop",
    description: "Spicy zinger chicken shawarma — a fiery twist on the classic"
  },
  {
    id: 22,
    name: "Pratha Roll",
    category: "Shawarma & Rolls",
    price: 150,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=75&auto=format&fit=crop",
    description: "Soft paratha roll filled with spiced chicken and chutney"
  },
  {
    id: 23,
    name: "Zinger Pratha Roll",
    category: "Shawarma & Rolls",
    price: 200,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=75&auto=format&fit=crop",
    description: "Crispy zinger chicken wrapped in a buttery paratha — the ultimate street food"
  },

  {
    id: 24,
    name: "Town Pizza — Small",
    category: "Pizza",
    price: 550,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=75&auto=format&fit=crop",
    description: "Personal size — perfect for one"
  },
  {
    id: 25,
    name: "Town Pizza — Medium",
    category: "Pizza",
    price: 850,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=75&auto=format&fit=crop",
    description: "Medium size — great for two"
  },
  {
    id: 26,
    name: "Town Pizza — Large",
    category: "Pizza",
    price: 1200,
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=75&auto=format&fit=crop",
    description: "Large size — ideal for a small family"
  },
  {
    id: 27,
    name: "Town Pizza — Family Size",
    category: "Pizza",
    price: 1600,
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&q=75&auto=format&fit=crop",
    description: "Family size — feeds the whole family!"
  }
];

export const deals: Deal[] = [
  {
    id: 1,
    title: "Deal 1",
    price: 1200,
    items: ["2 Zinger Burgers", "1 Medium Fries", "1 Cold Drink"],
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=75&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Deal 2",
    price: 1600,
    items: ["2 Chicken Burgers", "1 Medium Fries", "1 Cold Drink"],
    image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500&q=75&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Deal 3",
    price: 1900,
    items: ["3 Zinger Burgers", "1 Medium Fries", "1 Cold Drink"],
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&q=75&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Deal 4",
    price: 1740,
    items: ["2 Zinger Burgers", "2 Chicken Pieces", "1 Medium Fries", "1 Cold Drink"],
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500&q=75&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Deal 5",
    price: 2100,
    items: ["3 Zinger Burgers", "10 Hot Wings", "1 Medium Fries", "1 Cold Drink"],
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&q=75&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Deal 6",
    price: 2000,
    items: ["2 Double Decker Burgers", "1 Medium Fries", "1 Litre Drink"],
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=500&q=75&auto=format&fit=crop"
  },
  {
    id: 7,
    title: "Deal 7",
    price: 2760,
    items: ["8 Chicken Pieces", "1 Large Fries", "1.5 Litre Drink"],
    image: "https://images.unsplash.com/photo-1532636875304-0c89119d9b4d?w=500&q=75&auto=format&fit=crop"
  },
  {
    id: 8,
    title: "Deal 8",
    price: 5500,
    items: ["6 Zinger Burgers", "6 Chicken Pieces", "10 Hot Wings", "2 Large Fries", "2 Drinks"],
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500&q=75&auto=format&fit=crop"
  },
  {
    id: 9,
    title: "Deal 9",
    price: 5800,
    items: ["8 Chicken Burgers", "8 Chicken Pieces", "2 Large Fries", "2 Drinks"],
    image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=500&q=75&auto=format&fit=crop"
  }
];

export const branches: Branch[] = [
  {
    id: 1,
    name: "Branch 1",
    address: "Kabal Road Township Chowk Naimat Plaza, Swat",
    phones: ["0318-9659090", "0344-9659090", "0346-9659090"],
    whatsappNumber: "923189659090",
    mapQuery: "Kabal Road Township Chowk, Swat"
  },
  {
    id: 2,
    name: "Branch 2",
    address: "Khwaza Khela Bazar Near Secondary School Hashmat Plaza, Swat",
    phones: ["0314-9619090", "0346-9619090", "0946-744200"],
    whatsappNumber: "923149619090",
    mapQuery: "Khwaza Khela Bazar, Swat"
  },
  {
    id: 3,
    name: "Branch 3",
    address: "Main Sersanai Chowk 2nd Floor Deolai Road, Swat",
    phones: ["0319-9629090", "0346-9629090", "0347-9629090", "0314-3079593"],
    whatsappNumber: "923199629090",
    mapQuery: "Sersanai Chowk Deolai Road, Swat"
  },
  {
    id: 4,
    name: "Branch 4",
    address: "NINGOLAI CHOTA KALAM, Swat",
    phones: ["0328-9659090", "0341-9659090", "0342-9659090"],
    whatsappNumber: "923289659090",
    mapQuery: "Ningolai Chota Kalam, Swat"
  },
  {
    id: 5,
    name: "Branch 5",
    address: "Bagh Dherai Road, Khwaza Khela Chowk, Khirabad, Near Wakeel Shopping Center, Swat",
    phones: ["0340-9619090", "0341-9619090"],
    whatsappNumber: "923409619090",
    mapQuery: "Khwaza Khela Chowk Khirabad, Swat"
  }
];
