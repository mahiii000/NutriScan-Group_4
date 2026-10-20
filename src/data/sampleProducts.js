// Hard-coded sample data. Field names mirror the Open Food Facts API
// can be replaced by real API data in Phase 3.
const sampleProducts = [
  {
    code: "1",
    product_name: "Sample Oat Cereal",
    brands: "Example Brand",
    image_url: "",
    nutriscore_grade: "a",
    allergens_tags: ["en:gluten", "en:milk"],
    ingredients_text:
      "Whole grain oats (62%), sugar, wheat flour, honey, milk powder, salt, natural flavour.",
    nutriments: {
      "energy-kcal_100g": 380,
      sugars_100g: 8,
      fat_100g: 6,
      "saturated-fat_100g": 1.2,
      proteins_100g: 10,
      fiber_100g: 9,
      salt_100g: 0.4,
    },
  },
  {
    code: "2",
    product_name: "Sample Chocolate Bar",
    brands: "Example Foods",
    image_url: "",
    nutriscore_grade: "e",
    allergens_tags: ["en:milk", "en:nuts", "en:soybeans"],
    ingredients_text:
      "Sugar, cocoa butter, whole milk powder, cocoa mass, hazelnuts, emulsifier (soy lecithin), vanilla.",
    nutriments: {
      "energy-kcal_100g": 540,
      sugars_100g: 52,
      fat_100g: 31,
      "saturated-fat_100g": 18,
      proteins_100g: 6,
      fiber_100g: 2.5,
      salt_100g: 0.2,
    },
  },
  {
    code: "3",
    product_name: "Sample Corn Crackers",
    brands: "Daily Foods",
    image_url: "",
    nutriscore_grade: "b",
    allergens_tags: [],
    ingredients_text: "Corn flour, sunflower oil, sea salt.",
    nutriments: {
      "energy-kcal_100g": 410,
      sugars_100g: 1.5,
      fat_100g: 12,
      "saturated-fat_100g": 1.1,
      proteins_100g: 7,
      salt_100g: 1.1,
    },
  },
];

export default sampleProducts;