const API_URL = "https://world.openfoodfacts.net/cgi/search.pl";

export async function searchProducts(searchTerm) {
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

  // NEW: abort the request after 10 seconds so the spinner never hangs forever
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  let res;
  try {
    res = await fetch(`${API_URL}?${params}`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa("off:off"),
      },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

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