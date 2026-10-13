
import { useState } from "react";
import products from "../data/products";
import ProductCard from "../components/ProductCard";
import "./SearchPage.css";

function SearchPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [pinned, setPinned] = useState([]);

  function togglePin(productCode) {
    if (pinned.includes(productCode)) {
      setPinned(pinned.filter((code) => code !== productCode));
    } else if (pinned.length < 2) {
      setPinned([...pinned, productCode]);
    }
  }

  const filteredProducts = products.filter((product) => {
    const name = product.product_name || "";
    const categories = product.categories || "";

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      categories.toLowerCase().includes(search.toLowerCase());

    const sugar = product.nutriments?.sugars_100g;
    const matchesFilter =
      filter === "All" ||
      (filter === "Low Sugar" &&
        typeof sugar === "number" &&
        sugar <= 5) ||
      (filter === "Gluten-Free" &&
        product.labels_tags?.includes("en:gluten-free"));

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="search-page">
      <section className="search-header">
        <p className="eyebrow">Search Bar</p>
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
          {["All", "Low Sugar", "Gluten-Free"].map((category) => (
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
          <h2>Results</h2>
          <p>
            Showing {filteredProducts.length} of {products.length}
          </p>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.code}
              product={product}
              isPinned={pinned.includes(product.code)}
              onTogglePin={togglePin}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="empty-message">
            No products found. Try another search.
          </p>
        )}
      </section>

      

      {pinned.length > 0 && (
        <div>
        <h2>Pinned  Tray</h2>
        <div className="compare-tray">
          <span>{pinned.length} of 2 products selected</span>

          {pinned.map((code) => {
            const product = products.find(
              (item) => item.code === code
            );

            return (
              <span className="tray-item" key={code}>
                {product?.product_name}
              </span>
            );
          })}
        </div>
        </div>
      )}
    </main>
  );
}

export default SearchPage;
