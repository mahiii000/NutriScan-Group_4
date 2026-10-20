import "./NutriScoreBadge.css";

// Small coloured badge for a Nutri-Score grade (A to E).
// Reusable on result cards, the detail page and the compare page.
function NutriScoreBadge({ grade, size = "md" }) {
  const g = (grade || "").toLowerCase();
  const isValid = ["a", "b", "c", "d", "e"].includes(g);
  const variant = isValid ? g : "unknown";

  return (
    <span
      className={`nsb nsb--${variant} nsb--${size}`}
      aria-label={isValid ? `Nutri-Score ${g.toUpperCase()}` : "Nutri-Score unavailable"}
    >
      {isValid ? g.toUpperCase() : "?"}
    </span>
  );
}

export default NutriScoreBadge;