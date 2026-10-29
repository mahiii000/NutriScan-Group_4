
import { Link } from "react-router-dom";
import { usePin } from "../context/PinContext";
import NutriScoreBadge from "../components/NutriScoreBadge";
import {
  COMPARE_ROWS,
  compareMetric,
  generateVerdict,
} from "../utils/compareHelper";
import "./Compare.css";

function Compare() {
  const { comparedProducts } = usePin();

  const prodA = comparedProducts[0];
  const prodB = comparedProducts[1];

  const verdict = generateVerdict(prodA, prodB);

  return (
    <main className="compare-page">
      <div className="compare-container">
        <div className="compare-topbar">
          <Link to="/" className="compare-back">
            ← Back to products
          </Link>

          <div className="compare-eyebrow">
            <span className="step-tag">③ COMPARE</span>
            <span className="highlight-pill">
              ✨ Higher / Lower values auto-highlighted
            </span>
          </div>
        </div>

        <header className="compare-header">
          <h1 className="compare-title">Compare Your Products</h1>
          <p className="compare-subtitle">
            Compare nutritional values side by side to help you make
            informed food choices.
          </p>
        </header>

        <section className="compare-card table-section">
          <div className="table-responsive-wrapper">
            <table className="side-by-side-table">
              <thead>
                <tr>
                  <th className="metric-header-cell">
                    <span className="metric-th-title">Nutrition</span>
                    <span className="serving-caption">Per 100g</span>
                  </th>

                  {[prodA, prodB].map((product, index) => (
                    <th className="product-col-header" key={index}>
                      {product ? (
                        <div className="product-header-card">
                          <div className="product-header-img-wrap">
                            {product.image_front_url || product.image_url ? (
                              <img
                                src={
                                  product.image_front_url ||
                                  product.image_url
                                }
                                alt={product.product_name || "Product"}
                                className="product-header-img"
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="header-img-placeholder">
                                No image
                              </div>
                            )}
                          </div>

                          <p className="product-header-brand">
                            {product.brands || "Brand not available"}
                          </p>

                          <Link
                            to={`/product/${product.code}`}
                            className="product-header-name"
                          >
                            {product.product_name || "Unnamed product"}
                          </Link>

                          <div className="product-header-score">
                            <NutriScoreBadge
                              grade={
                                product.nutriscore_grade ||
                                product.nutrition_grades ||
                                product.nutriscore_data?.grade
                              }
                              size="md"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="product-header-card empty-slot">
                          <div className="empty-slot-plus">+</div>
                          <p className="empty-slot-title">
                            Slot {index + 1} Empty
                          </p>
                          <p>Pin a product from the Search page.</p>
                          <Link to="/" className="filter-button active">
                            Find products
                          </Link>
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {COMPARE_ROWS.map((row) => {
                  const winner = compareMetric(row, prodA, prodB);
                  const isWinnerA = winner === "A";
                  const isWinnerB = winner === "B";

                  let displayA = "Not available";
                  let displayB = "Not available";

                  if (row.isGrade) {
                    displayA = prodA ? (
                      <NutriScoreBadge
                        grade={
                          prodA.nutriscore_grade ||
                          prodA.nutrition_grades ||
                          prodA.nutriscore_data?.grade
                        }
                        size="md"
                      />
                    ) : (
                      "—"
                    );

                    displayB = prodB ? (
                      <NutriScoreBadge
                        grade={
                          prodB.nutriscore_grade ||
                          prodB.nutrition_grades ||
                          prodB.nutriscore_data?.grade
                        }
                        size="md"
                      />
                    ) : (
                      "—"
                    );
                  } else {
                    const valA = prodA?.nutriments?.[row.key];
                    const valB = prodB?.nutriments?.[row.key];

                    if (
                      valA !== undefined &&
                      valA !== null &&
                      valA !== "" &&
                      Number.isFinite(Number(valA))
                    ) {
                      displayA = `${Math.round(Number(valA) * 10) / 10} ${row.unit}`.trim();
                    }

                    if (
                      valB !== undefined &&
                      valB !== null &&
                      valB !== "" &&
                      Number.isFinite(Number(valB))
                    ) {
                      displayB = `${Math.round(Number(valB) * 10) / 10} ${row.unit}`.trim();
                    }
                  }

                  const badgeText = row.isGrade
                    ? "Better ✓"
                    : row.lowerIsBetter
                    ? "Lower ✓"
                    : "Higher ✓";

                  return (
                    <tr key={row.key} className="table-data-row">
                      <th scope="row" className="row-metric-label">
                        {row.label}
                      </th>

                      <td
                        className={`row-metric-value ${
                          isWinnerA ? "cell--highlight-better" : ""
                        }`}
                      >
                        <div className="cell-inner">
                          <span className="cell-text">{displayA}</span>
                          {isWinnerA && prodA && prodB && (
                            <span className="auto-highlight-tag">
                              {badgeText}
                            </span>
                          )}
                        </div>
                      </td>

                      <td
                        className={`row-metric-value ${
                          isWinnerB ? "cell--highlight-better" : ""
                        }`}
                      >
                        <div className="cell-inner">
                          <span className="cell-text">{displayB}</span>
                          {isWinnerB && prodA && prodB && (
                            <span className="auto-highlight-tag">
                              {badgeText}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {prodA && prodB ? (
          <section className="verdict-container">
            <div className="verdict-label-row">
              <span className="verdict-title">Verdict</span>
              <span className="verdict-badge">Summary</span>
            </div>

            <div className="verdict-box">
              <p className="verdict-headline">{verdict.headline}</p>

              {verdict.highlights.length > 0 && (
                <div className="verdict-pills">
                  {verdict.highlights.map((highlight, index) => (
                    <span key={index} className="verdict-pill">
                      ✓ {highlight.text}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : (
          <p className="compare-subtitle">
            Select two products to see your full nutritional comparison and
            verdict.
          </p>
        )}

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <Link to="/" className="filter-button active">
            Find or change products
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Compare;
