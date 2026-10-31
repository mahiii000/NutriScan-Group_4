const API_URL = "https://world.openfoodfacts.net/cgi/search.pl";

const FILTER_TAGS = {
  Snacks: ["categories", "en:snacks"],
  "Gluten-Free": ["labels", "en:gluten-free"],
  Vegan: ["labels", "en:vegan"],
  "Dairy-Free": ["labels", "en:dairy-free"],
  Organic: ["labels", "en:organic"],
  Beverages: ["categories", "en:beverages"],
  Desserts: ["categories", "en:desserts"],
};

function applyApiFilters(params, filter) {
  const filterTag = FILTER_TAGS[filter];

  if (filterTag) {
    params.set("tagtype_0", filterTag[0]);
    params.set("tag_contains_0", "contains");
    params.set("tag_0", filterTag[1]);
  }
}

export async function searchProducts(searchTerm, filter = "All", { signal } = {}) {
  const params = new URLSearchParams({
    search_terms: searchTerm,
    search_simple: "1",
    action: "process",
    json: "1",
    page_size: "24",
    fields: [
      "code",
      "product_name",
      "brands",
      "nutriscore_grade",
      "nutrition_grades",
      "nutriscore_data",
      "image_front_url",
      "categories",
      "labels_tags",
      "allergens_tags",
      "ingredients_text",
      "nutriments",
    ].join(","),
  });

  applyApiFilters(params, filter);

  const res = await fetch(`${API_URL}?${params}`, {
    method: "GET",
    signal,
    headers: {
      Authorization: "Basic " + btoa("off:off"),
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  const data = await res.json();

  if (!Array.isArray(data.products)) {
    throw new Error("The API returned an unexpected response.");
  }

  return data.products.filter(
    (product) => product.code && product.product_name
  );
}