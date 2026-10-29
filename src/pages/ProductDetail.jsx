
import { Link, useParams } from "react-router-dom";
import NutriScoreBadge from "../components/NutriScoreBadge";
import AllergenBanner from "../components/AllergenBanner";
import NutritionTable from "../components/NutritionTable";
import { usePin } from "../context/PinContext";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();

  const {
    isPinned,
    togglePin,
    productCatalog,
  } = usePin();

  const productCode = decodeURIComponent(id || "");

  const product = productCatalog.find(
    (p) => String(p.code) === productCode
  );

  if (!product) {
    return (
      <main className="pd-page">
        <div className="pd-container">
          <Link to="/" className="pd-back">
            ← Back to products
          </Link>

          <div className="pd-card pd-notfound">
            <h1 className="pd-notfound__title">
              Product not found
            </h1>
            <p className="pd-muted">
              We couldn't find this product. Return to the Search page
              and try opening it again.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const productGrade =
    product.nutriscore_grade ||
    product.nutrition_grades ||
    product.nutriscore_data?.grade;

  return (
    <main className="pd-page">
      <div className="pd-container">
        <Link to="/" className="pd-back">
          ← Back to products
        </Link>

        <section className="pd-hero">
          <div className="pd-card pd-image-card">
            {product.image_front_url || product.image_url ? (
              <img
                className="pd-image"
                src={product.image_front_url || product.image_url}
                alt={product.product_name || "Product"}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="pd-image-placeholder">
                No image available
              </div>
            )}
          </div>

          <div className="pd-card pd-summary">
            <p className="pd-brand">
              {product.brands || "Brand not available"}
            </p>

            <h1 className="pd-title">
              {product.product_name || "Unnamed product"}
            </h1>

            <div className="pd-score">
              <NutriScoreBadge grade={productGrade} size="lg" />
              <span className="pd-muted">Nutri-Score</span>
            </div>

            <button
              type="button"
              className={`pd-pin-btn ${
                isPinned(product.code) ? "pd-pin-btn--active" : ""
              }`}
              onClick={() => togglePin(product)}
              aria-pressed={isPinned(product.code)}
            >
              {isPinned(product.code)
                ? "Pinned ✓"
                : "+ Pin for comparison"}
            </button>
          </div>
        </section>

        <AllergenBanner allergens={product.allergens_tags || []} />

        <section className="pd-card pd-section">
          <h2 className="pd-section-title">Ingredients</h2>
          <p className="pd-ingredients">
            {product.ingredients_text ||
              "Ingredients not listed for this product."}
          </p>
        </section>

        <section className="pd-card pd-section">
          <h2 className="pd-section-title">Nutrition</h2>
          <NutritionTable nutriments={product.nutriments || {}} />
        </section>
      </div>
    </main>
  );
}

export default ProductDetail;
