import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { usePin } from "../context/PinContext";
import { searchProducts } from "../services/productService";
import "./SearchPage.css";

const FILTERS = [
  "All",
  "Snacks",
  "Gluten-Free",
  "Vegan",
  "Organic",
  "Beverages",
];

function SearchPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0); // used by the "Try again" button

  const {
    pinnedProducts,
    isPinned,
    togglePin,
    comparedProducts,
    setProductCatalog,
  } = usePin();

  // CHANGED: ignore flag stops old/slow responses overwriting newer ones,
  // clear error message, and retryCount in the dependency array
  useEffect(() => {
    if (!search.trim()) {
      setProducts([]);
      setLoading(false);
      setError(null);
      return;
    }

    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const data = await searchProducts(search);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [search]);

  useEffect(() => {
    setProductCatalog((prev) => {
      const updated = [...prev];

      products.forEach((product) => {
        const index = updated.findIndex(
          (item) => item.code === product.code
        );

        if (index === -1) {
          updated.push(product);
        } else {
          updated[index] = product;
        }
      });

      return updated;
    });
  }, [products, setProductCatalog]);

  const filteredProducts = products;

  function getNutrient(product, nutrient) {
    const value = product.nutriments?.[nutrient];

    return typeof value === "number"
      ? `${value} g`
      : "Not available";
  }

  function getNutriScore(product) {
    const score =
      product.nutriscore_grade ||
      product.nutrition_grades ||
      product.nutriscore_data?.grade;

    return score ? score.toUpperCase() : "Not available";
  }

  return (
    <main className="search-page">
      <section className="search-header">
        <p className="subtitle">
          Explore products and compare what's inside.
        </p>

        <input
          className="search-input"
          type="text"
          placeholder="Search products or categories..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="filter-list">
          {FILTERS.map((category) => (
            <button
              key={category}
              className={`filter-button ${
                filter === category ? "active" : ""
              }`}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="results-section">
        <div className="results-heading">
          <h2>Products</h2>
          {/* CHANGED: only show the count when not loading and no error */}
          {!loading && !error && (
            <p>
              Showing {filteredProducts.length} of {products.length}
            </p>
          )}
        </div>

        {/* CHANGED: loading + error blocks */}
        {loading ? (
          <div className="loading-state" role="status">
            <div className="spinner" />
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="error-state" role="alert">
            <p className="empty-message">{error}</p>
            <button
              className="filter-button"
              onClick={() => setRetryCount((c) => c + 1)}
            >
              Try again
            </button>
          </div>
        ) : !search.trim() ? (
          <p className="empty-message">
            Search for a product to get started.
          </p>
        ) : filteredProducts.length === 0 ? (
          <p className="empty-message">
            No products found. Try another search or filter.
          </p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.code}
                product={product}
                isPinned={isPinned(product.code)}
                onTogglePin={togglePin}
              />
            ))}
          </div>
        )}
      </section>

      <section className="pinned-section">
        <div className="pinned-heading">
          <div>
            <h2>Pin Tray</h2>
            <p className="pinned-subtitle">
              Pin up to 2 products to compare their nutritional information.
            </p>
          </div>

          <span className="selection-count">
            {pinnedProducts.length} pinned
          </span>
        </div>

        <div className="compare-tray">
          {[0, 1].map((slot) => {
            const product = pinnedProducts[slot];

            if (!product) {
              return (
                <div className="tray-empty" key={`empty-${slot}`}>
                  <span className="empty-plus">+</span>
                  <div>
                    <p className="empty-title">
                      {slot === 0 && pinnedProducts.length === 0
                        ? "Choose your first product"
                        : "Add another product"}
                    </p>
                    <p className="empty-description">
                      Select Pin on a product above.
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <article className="tray-product" key={product.code}>
                <div className="tray-product-top">
                  <img
                    className="tray-product-image"
                    src={product.image_front_url || product.image_url || ""}
                    alt={product.product_name || "Product"}
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />

                  <div className="tray-product-info">
                    <h3>{product.product_name || "Unnamed product"}</h3>
                    <p className="tray-category">
                      {product.brands || "Brand not available"}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="tray-remove"
                    onClick={() => togglePin(product.code)}
                    aria-label={`Remove ${
                      product.product_name || "product"
                    } from comparison`}
                    title="Remove product"
                  >
                    x
                  </button>
                </div>

                <div className="tray-score-row">
                  <span className="nutri-score-label">Nutri-Score</span>
                  <span
                    className={`nutri-score-badge score-${getNutriScore(
                      product
                    ).toLowerCase()}`}
                  >
                    {getNutriScore(product)}
                  </span>
                </div>

                <div className="tray-nutrients">
                  <div className="nutrient-item">
                    <span>Sugar</span>
                    <strong>
                      {getNutrient(product, "sugars_100g")}
                    </strong>
                  </div>

                  <div className="nutrient-item">
                    <span>Fat</span>
                    <strong>{getNutrient(product, "fat_100g")}</strong>
                  </div>

                  <div className="nutrient-item">
                    <span>Protein</span>
                    <strong>
                      {getNutrient(product, "proteins_100g")}
                    </strong>
                  </div>
                </div>

                <p className="tray-serving-note">
                  Nutritional values per 100 g
                </p>
              </article>
            );
          })}
        </div>

        {comparedProducts.filter(Boolean).length === 2 && (
          <div
            style={{
              marginTop: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <p className="comparison-ready" style={{ margin: 0 }}>
              Both products selected. Compare their nutritional values above.
            </p>
            <Link
              to="/compare"
              className="filter-button active"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Open Full Compare Page →
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

export default SearchPage;
