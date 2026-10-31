const API_URL = "https://world.openfoodfacts.net/cgi/search.pl";

function applyApiFilters(params, filter) {
  if (filter === "Snacks") {
    params.set("tagtype_0", "categories");
    params.set("tag_contains_0", "contains");
    params.set("tag_0", "en:snacks");
  }

  if (filter === "Gluten-Free") {
    params.set("tagtype_0", "labels");
    params.set("tag_contains_0", "contains");
    params.set("tag_0", "en:gluten-free");
  }

  if (filter === "Vegan") {
    params.set("tagtype_0", "labels");
    params.set("tag_contains_0", "contains");
    params.set("tag_0", "en:vegan");
  }

  if (filter === "Organic") {
    params.set("tagtype_0", "labels");
    params.set("tag_contains_0", "contains");
    params.set("tag_0", "en:organic");
  }

  if (filter === "Beverages") {
    params.set("tagtype_0", "categories");
    params.set("tag_contains_0", "contains");
    params.set("tag_0", "en:beverages");
  }

  return params;
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