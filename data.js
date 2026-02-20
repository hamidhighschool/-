const PLACEHOLDER_IMG = "assets/img/placeholder.png";

window.DB = {
  categories: [
    "Electronics",
    "Fashion",
    "Groceries",
    "Home & Kitchen",
    "Books & Stationery",
    "Beauty & Health",
    "Sports & Outdoors"
  ],

  products: [
    {
      id: "p2001",
      name: "Wireless Earbuds Pro",
      category: "Electronics",
      price: 1499,
      discount: 10,
      description: "High quality sound, noise cancellation.",
      featured: true,
      image: PLACEHOLDER_IMG
    },
    {
      id: "p2002",
      name: "Smart Watch X",
      category: "Electronics",
      price: 2999,
      description: "Fitness tracking watch.",
      featured: false,
      image: PLACEHOLDER_IMG
    },
    {
      id: "p2101",
      name: "Men's Casual Shirt",
      category: "Fashion",
      price: 799,
      discount: 15,
      description: "Comfortable cotton fabric.",
      featured: true,
      image: PLACEHOLDER_IMG
    },
    {
      id: "p2201",
      name: "Premium Basmati Rice 5kg",
      category: "Groceries",
      price: 650,
      description: "High quality rice.",
      featured: false,
      image: PLACEHOLDER_IMG
    },
    {
      id: "p2301",
      name: "Non-Stick Frying Pan",
      category: "Home & Kitchen",
      price: 1150,
      description: "Durable pan.",
      featured: true,
      image: PLACEHOLDER_IMG
    },
    {
      id: "p2401",
      name: "JavaScript for Beginners",
      category: "Books & Stationery",
      price: 450,
      description: "Learn JS step by step.",
      featured: true,
      image: PLACEHOLDER_IMG
    },
    {
      id: "p2501",
      name: "Vitamin C Serum",
      category: "Beauty & Health",
      price: 780,
      description: "Brightening skin care.",
      featured: false,
      image: PLACEHOLDER_IMG
    },
    {
      id: "p2601",
      name: "Yoga Mat Premium",
      category: "Sports & Outdoors",
      price: 690,
      description: "Non-slip yoga mat.",
      featured: true,
      image: PLACEHOLDER_IMG
    }
  ]
};
