
function ProductCard({ product, isPinned, onTogglePin }) {
  const name = product.product_name || "Unknown product";
  const brand = product.brands || "Unknown brand";
  const score = product.nutriscore_grade?.toUpperCase() || "?";
  const image = product.image_front_url;

  return (
    <div className="product-card">
      <div className="product-image">
        {image ? (
          <img src={image} alt={name} />
        ) : (
          <span>No image available</span>
        )}
      </div>

      <div className="product-info">
        <p className="product-brand">{brand}</p>
        <h3>{name}</h3>

        <div className="product-bottom">
          <span
            className={`nutri-score score-${score.toLowerCase()}`}
          >
            {score}
          </span>

          <button
            className={`pin-button ${isPinned ? "pinned" : ""}`}
            onClick={() => onTogglePin(product.code)}
            aria-label={isPinned ? "Unpin product" : "Pin product"}
            title={isPinned ? "Unpin product" : "Pin product"}
          >
            {isPinned ? "📌" : "＋"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
