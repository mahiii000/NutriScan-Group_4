
import { Link } from "react-router-dom";

function ProductCard({ product, isPinned, onTogglePin, preferences }) {
  const name = product.product_name || "Unknown product";
  const brand = product.brands || "Unknown brand";

  const score =
    product.nutriscore_grade ||
    product.nutrition_grades ||
    product.nutriscore_data?.grade ||
    "?";

  const image = product.image_front_url || product.image_url;

  // Check whether the product matches the saved dietary goal.
 
function getGoalStatus() {
  if (!preferences?.goal) return null;

  if (preferences.goal === "low-sugar") {
    const sugar = product.nutriments?.sugars_100g;

    if (typeof sugar !== "number") {
      return {
        text: "Sugar information unavailable",
        type: "unknown",
      };
    }

    return sugar <= 5
      ? { text: "✓ Low sugar match", type: "match" }
      : { text: "Above low-sugar target", type: "warning" };
  }

  if (preferences.goal === "gluten-free") {
    const labels = product.labels_tags || [];

    const isGlutenFree = labels.some((label) =>
      label.toLowerCase().includes("gluten-free")
    );

    return isGlutenFree
      ? { text: "✓ Gluten-free label found", type: "match" }
      : { text: "Gluten-free status unverified", type: "unknown" };
  }

  if (preferences.goal === "balanced") {
    const grade = score.toLowerCase();

    if (grade === "a" || grade === "b") {
      return { text: "✓ Better Nutri-Score", type: "match" };
    }

    if (grade === "?") {
      return {
        text: "Nutri-Score unavailable",
        type: "unknown",
      };
    }

    return { text: "Review Nutri-Score", type: "warning" };
  }

  return null;
}

  // Check declared allergens and traces against user preferences.
  function getAllergenWarnings() {
    const selectedAllergens = preferences?.allergens || [];

    if (selectedAllergens.length === 0) return [];

    const allergenTags = [
      ...(product.allergens_tags || []),
      ...(product.traces_tags || []),
    ];

    if (allergenTags.length === 0) {
      return ["Allergen information unavailable"];
    }

    return selectedAllergens.filter((allergen) =>
      allergenTags.some((tag) => {
        const normalizedTag = tag
          .toLowerCase()
          .replace(/^en:/, "")
          .replace(/-/g, " ");

        return normalizedTag.includes(allergen.toLowerCase());
      })
    );
  }

  const goalStatus = getGoalStatus();
  const allergenWarnings = getAllergenWarnings();

  return (
    <div className="product-card">
      <Link to={`/product/${product.code}`} className="product-card__link">
        <div className="product-image">
          {image ? (
            <img
              src={image}
              alt={name}
              width="200"
              height="200"
              loading="lazy"
            />
          ) : (
            <span>No image available</span>
          )}
        </div>

        <div className="product-info">
          <p className="product-brand">{brand}</p>
          <h3>{name}</h3>
        </div>
      </Link>

      <div className="product-bottom">
        <span className={`nutri-score score-${score.toLowerCase()}`}>
          {score.toUpperCase()}
        </span>

        <button
          type="button"
          className={`pin-button ${isPinned ? "pinned" : ""}`}
          onClick={() => onTogglePin(product)}
          aria-label={isPinned ? "Unpin product" : "Pin product"}
          title={isPinned ? "Unpin product" : "Pin product"}
        >
          {isPinned ? "📌" : "＋"}
        </button>
      </div>

      {goalStatus && (
        <div className={`product-preference-status status-${goalStatus.type}`}>
          {goalStatus.text}
        </div>
      )}

      {allergenWarnings.length > 0 && (
        <div className="product-allergen-warning">
          {allergenWarnings.includes("Allergen information unavailable") ? (
            <p>⚠️ Allergen information unavailable. Cannot verify this product.</p>
          ) : (
            <>
              <strong>⚠️ Allergen warning</strong>
              {allergenWarnings.map((allergen) => (
                <p key={allergen}>
                  May contain or have traces of {allergen}.
                </p>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductCard;
