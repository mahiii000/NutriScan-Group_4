import "./AllergenBanner.css";

// Turns an Open Food Facts tag like "en:gluten" into "Gluten"
function formatTag(tag) {
  const name = tag.includes(":") ? tag.split(":")[1] : tag;
  const spaced = name.replace(/-/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function AllergenBanner({ allergens = [] }) {
  if (allergens.length === 0) {
    return (
      <div className="allergen-banner allergen-banner--clear" role="status">
        No allergens listed for this product.
      </div>
    );
  }

  return (
    <div className="allergen-banner allergen-banner--warning" role="alert">
      <span className="allergen-banner__icon" aria-hidden="true">!</span>
      <div>
        <p className="allergen-banner__title">Contains allergens</p>
        <ul className="allergen-banner__list">
          {allergens.map((tag) => (
            <li key={tag} className="allergen-banner__item">
              {formatTag(tag)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AllergenBanner;