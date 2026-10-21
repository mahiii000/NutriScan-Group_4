import { Link, useParams } from "react-router-dom";
import products from "../data/products";
import NutriScoreBadge from "../components/NutriScoreBadge";
import AllergenBanner from "../components/AllergenBanner";
import NutritionTable from "../components/NutritionTable";
import { usePin } from "../context/PinContext";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const { isPinned, togglePin } = usePin();

  const product = products.find((p) => p.code === id);

  if (!product) {
    return (
      <main className="pd-page">
        <div className="pd-container">
          <Link to="/" className="pd-back">← Back to products</Link>
          <div className="pd-card pd-notfound">
            <h1 className="pd-notfound__title">Product not found</h1>
            <p className="pd-muted">We couldn't find a product with that code.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pd-page">
      <div className="pd-container">
        <Link to="/" className="pd-back">← Back to products</Link>

        <section className="pd-hero">
          <div className="pd-card pd-image-card">
            {product.image_front_url ? (
              <img
                className="pd-image"
                src={product.image_front_url}
                alt={product.product_name}
              />
            ) : (
              <div className="pd-image-placeholder">No image available</div>
            )}
          </div>

          <div className="pd-card pd-summary">
            <p className="pd-brand">{product.brands}</p>
            <h1 className="pd-title">{product.product_name}</h1>

            <div className="pd-score">
              <NutriScoreBadge grade={product.nutriscore_grade} size="lg" />
              <span className="pd-muted">Nutri-Score</span>
            </div>

            <button
              type="button"
              className={`pd-pin-btn ${isPinned(product.code) ? "pd-pin-btn--active" : ""}`}
              onClick={() => togglePin(product.code)}
              aria-pressed={isPinned(product.code)}
            >
              {isPinned(product.code) ? "Pinned ✓" : "+ Pin for comparison"}
            </button>
          </div>
        </section>

        <AllergenBanner allergens={product.allergens_tags} />

        <section className="pd-card pd-section">
          <h2 className="pd-section-title">Ingredients</h2>
          <p className="pd-ingredients">
            {product.ingredients_text || "Ingredients not listed for this product."}
          </p>
        </section>

        <section className="pd-card pd-section">
          <h2 className="pd-section-title">Nutrition</h2>
          <NutritionTable nutriments={product.nutriments} />
        </section>
      </div>
    </main>
  );
}

export default ProductDetail;