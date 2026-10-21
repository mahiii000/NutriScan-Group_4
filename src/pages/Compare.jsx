import { useState } from "react";
import { Link } from "react-router-dom";
import products from "../data/products";
import { usePin } from "../context/PinContext";
import NutriScoreBadge from "../components/NutriScoreBadge";
import {
  COMPARE_ROWS,
  compareMetric,
  generateVerdict,
} from "../utils/compareHelper";
import "./Compare.css";

function Compare() {
  const {
    pinnedProducts,
    comparedProducts,
    unpinProduct,
    swapComparedSlot,
    pinProduct,
  } = usePin();

  // Swap modal state
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [targetSlot, setTargetSlot] = useState(0); // 0 = Left / Slot 1, 1 = Right / Slot 2
  const [catalogSearch, setCatalogSearch] = useState("");

  const prodA = comparedProducts[0];
  const prodB = comparedProducts[1];

  const verdict = generateVerdict(prodA, prodB);

  function openSwapModal(slotIndex) {
    setTargetSlot(slotIndex);
    setCatalogSearch("");
    setIsSwapModalOpen(true);
  }

  function handleSelectProductToSwap(productCode) {
    swapComparedSlot(targetSlot, productCode);
    setIsSwapModalOpen(false);
  }

  // Quick swap from pinned list item directly into a slot
  function handleQuickSwap(slotIndex, productCode) {
    swapComparedSlot(slotIndex, productCode);
  }

  // Filter catalog products for the modal
  const filteredCatalog = products.filter((p) => {
    const q = catalogSearch.toLowerCase();
    const nameMatch = (p.product_name || "").toLowerCase().includes(q);
    const brandMatch = (p.brands || "").toLowerCase().includes(q);
    return nameMatch || brandMatch;
  });

  // Other pinned products that are not currently in the selected target slot
  const currentSlotProductCode = targetSlot === 0 ? prodA?.code : prodB?.code;
  const otherPinnedProducts = pinnedProducts.filter(
    (p) => p.code !== currentSlotProductCode
  );

  return (
    <main className="compare-page">
      <div className="compare-container">
        {/* Top bar with back link and eyebrow */}
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
          <h1 className="compare-title">Comparing 2 pinned products</h1>
          <p className="compare-subtitle">
            Side-by-side nutritional breakdown to help you make healthier choices.
          </p>
        </header>

        {/* Side-by-side comparison table card */}
        <section className="compare-card table-section">
          <div className="table-responsive-wrapper">
            <table className="side-by-side-table">
              <thead>
                <tr>
                  <th className="metric-header-cell">
                    <span className="metric-th-title">Nutrition</span>
                    <span className="serving-caption">Per 100g</span>
                  </th>

                  {/* Slot 1 Product Header */}
                  <th className="product-col-header">
                    {prodA ? (
                      <div className="product-header-card">
                        <div className="product-header-img-wrap">
                          {prodA.image_front_url ? (
                            <img
                              src={prodA.image_front_url}
                              alt={prodA.product_name}
                              className="product-header-img"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="header-img-placeholder">No image</div>
                          )}
                        </div>
                        <p className="product-header-brand">{prodA.brands || "Brand"}</p>
                        <Link to={`/product/${prodA.code}`} className="product-header-name">
                          {prodA.product_name}
                        </Link>
                        <div className="product-header-score">
                          <NutriScoreBadge grade={prodA.nutriscore_grade} size="md" />
                        </div>
                        <button
                          type="button"
                          className="swap-slot-btn"
                          onClick={() => openSwapModal(0)}
                          title="Swap this product with another pinned item"
                        >
                          ⇄ Swap product
                        </button>
                      </div>
                    ) : (
                      <div className="product-header-card empty-slot">
                        <div className="empty-slot-plus">+</div>
                        <p className="empty-slot-title">Slot 1 Empty</p>
                        <button
                          type="button"
                          className="swap-slot-btn"
                          onClick={() => openSwapModal(0)}
                        >
                          + Select product
                        </button>
                      </div>
                    )}
                  </th>

                  {/* Slot 2 Product Header */}
                  <th className="product-col-header">
                    {prodB ? (
                      <div className="product-header-card">
                        <div className="product-header-img-wrap">
                          {prodB.image_front_url ? (
                            <img
                              src={prodB.image_front_url}
                              alt={prodB.product_name}
                              className="product-header-img"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="header-img-placeholder">No image</div>
                          )}
                        </div>
                        <p className="product-header-brand">{prodB.brands || "Brand"}</p>
                        <Link to={`/product/${prodB.code}`} className="product-header-name">
                          {prodB.product_name}
                        </Link>
                        <div className="product-header-score">
                          <NutriScoreBadge grade={prodB.nutriscore_grade} size="md" />
                        </div>
                        <button
                          type="button"
                          className="swap-slot-btn"
                          onClick={() => openSwapModal(1)}
                          title="Swap this product with another pinned item"
                        >
                          ⇄ Swap product
                        </button>
                      </div>
                    ) : (
                      <div className="product-header-card empty-slot">
                        <div className="empty-slot-plus">+</div>
                        <p className="empty-slot-title">Slot 2 Empty</p>
                        <button
                          type="button"
                          className="swap-slot-btn"
                          onClick={() => openSwapModal(1)}
                        >
                          + Select product
                        </button>
                      </div>
                    )}
                  </th>
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
                      <NutriScoreBadge grade={prodA.nutriscore_grade} size="md" />
                    ) : (
                      "—"
                    );
                    displayB = prodB ? (
                      <NutriScoreBadge grade={prodB.nutriscore_grade} size="md" />
                    ) : (
                      "—"
                    );
                  } else {
                    const valA = prodA?.nutriments?.[row.key];
                    const valB = prodB?.nutriments?.[row.key];

                    if (valA !== undefined && valA !== null && valA !== "") {
                      displayA = `${Math.round(Number(valA) * 10) / 10} ${row.unit}`.trim();
                    }
                    if (valB !== undefined && valB !== null && valB !== "") {
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

                      {/* Product A Cell */}
                      <td className={`row-metric-value ${isWinnerA ? "cell--highlight-better" : ""}`}>
                        <div className="cell-inner">
                          <span className="cell-text">{displayA}</span>
                          {isWinnerA && prodA && prodB && (
                            <span className="auto-highlight-tag" title="Auto-highlighted better value">
                              {badgeText}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Product B Cell */}
                      <td className={`row-metric-value ${isWinnerB ? "cell--highlight-better" : ""}`}>
                        <div className="cell-inner">
                          <span className="cell-text">{displayB}</span>
                          {isWinnerB && prodA && prodB && (
                            <span className="auto-highlight-tag" title="Auto-highlighted better value">
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

        {/* Verdict Box matching the sketch */}
        <section className="verdict-container">
          <div className="verdict-label-row">
            <span className="verdict-title">Verdict</span>
            <span className="verdict-badge">Summary</span>
          </div>

          <div className="verdict-box">
            <p className="verdict-headline">{verdict.headline}</p>

            {verdict.highlights.length > 0 && (
              <div className="verdict-pills">
                {verdict.highlights.map((h, i) => (
                  <span key={i} className="verdict-pill">
                    ✓ {h.text}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Pinned List Section matching the sketch */}
        <section className="pinned-list-section">
          <div className="pinned-list-header">
            <div>
              <h2 className="pinned-list-title">Pinned List</h2>
              <p className="pinned-list-subtitle">
                Saved locally between visits so your pins aren't lost.
              </p>
            </div>
            <div className="pinned-storage-indicator">
              <span className="storage-dot"></span>
              <span>Saved locally ({pinnedProducts.length} items)</span>
            </div>
          </div>

          <div className="pinned-items-grid">
            {pinnedProducts.length === 0 ? (
              <div className="pinned-empty-state">
                <p>No products currently pinned.</p>
                <button
                  type="button"
                  className="btn-seed"
                  onClick={() => {
                    pinProduct("sample-4");
                    pinProduct("sample-5");
                  }}
                >
                  Pin Oat Bar &amp; Choco Bar to compare
                </button>
              </div>
            ) : (
              pinnedProducts.map((product) => {
                const isInSlot0 = prodA?.code === product.code;
                const isInSlot1 = prodB?.code === product.code;
                const isComparing = isInSlot0 || isInSlot1;

                return (
                  <article key={product.code} className="pinned-item-card">
                    <div className="pinned-item-left">
                      <div className="pinned-item-thumb">
                        {product.image_front_url ? (
                          <img
                            src={product.image_front_url}
                            alt={product.product_name}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="pinned-item-nothumb">img</span>
                        )}
                      </div>

                      <div className="pinned-item-details">
                        <Link
                          to={`/product/${product.code}`}
                          className="pinned-item-name"
                        >
                          {product.product_name}
                        </Link>
                        <p className="pinned-item-brand">
                          {product.brands || "Brand not available"}
                        </p>
                      </div>
                    </div>

                    <div className="pinned-item-actions">
                      <NutriScoreBadge grade={product.nutriscore_grade} size="sm" />

                      {isComparing ? (
                        <span className="pinned-status-badge">
                          {isInSlot0 ? "In Slot 1 (Left)" : "In Slot 2 (Right)"}
                        </span>
                      ) : (
                        <div className="pinned-swap-quick-btns">
                          <button
                            type="button"
                            className="btn-quick-swap"
                            onClick={() => handleQuickSwap(0, product.code)}
                            title="Compare this product on the Left side"
                          >
                            Put in Left
                          </button>
                          <button
                            type="button"
                            className="btn-quick-swap"
                            onClick={() => handleQuickSwap(1, product.code)}
                            title="Compare this product on the Right side"
                          >
                            Put in Right
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        className="pinned-unpin-btn"
                        onClick={() => unpinProduct(product.code)}
                        aria-label={`Unpin ${product.product_name}`}
                        title="Unpin product"
                      >
                        ✕
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* "+ Swap another item" button from sketch */}
          <div className="swap-button-row">
            <button
              type="button"
              className="btn-swap-another"
              onClick={() => openSwapModal(1)}
            >
              + Swap in another pinned item
            </button>
          </div>
        </section>
      </div>

      {/* Swap Modal */}
      {isSwapModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsSwapModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-header">
              <div>
                <h3 id="modal-title" className="modal-title">
                  Swap {targetSlot === 0 ? "Left Product (Slot 1)" : "Right Product (Slot 2)"}
                </h3>
                <p className="modal-subtitle">
                  Choose a product to swap in without restarting the comparison.
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsSwapModalOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Slot switcher inside modal */}
            <div className="slot-switch-tabs">
              <span className="slot-switch-label">Changing:</span>
              <button
                type="button"
                className={`slot-tab ${targetSlot === 0 ? "active" : ""}`}
                onClick={() => setTargetSlot(0)}
              >
                Slot 1 (Left): {prodA?.product_name || "Empty"}
              </button>
              <button
                type="button"
                className={`slot-tab ${targetSlot === 1 ? "active" : ""}`}
                onClick={() => setTargetSlot(1)}
              >
                Slot 2 (Right): {prodB?.product_name || "Empty"}
              </button>
            </div>

            {/* Pinned items section in modal */}
            {otherPinnedProducts.length > 0 && (
              <div className="modal-section">
                <h4 className="modal-section-title">From Pinned Items</h4>
                <div className="modal-product-list">
                  {otherPinnedProducts.map((item) => (
                    <div key={item.code} className="modal-product-row">
                      <div className="modal-product-info">
                        <NutriScoreBadge grade={item.nutriscore_grade} size="sm" />
                        <div>
                          <strong>{item.product_name}</strong>
                          <span className="modal-product-brand"> · {item.brands}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="modal-select-btn"
                        onClick={() => handleSelectProductToSwap(item.code)}
                      >
                        Swap In
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All products from catalog */}
            <div className="modal-section">
              <h4 className="modal-section-title">Or Choose from All Products</h4>
              <input
                type="text"
                placeholder="Search products..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="modal-search-input"
              />

              <div className="modal-product-list scrollable">
                {filteredCatalog.map((item) => {
                  const isCurrent =
                    targetSlot === 0 ? prodA?.code === item.code : prodB?.code === item.code;

                  return (
                    <div key={item.code} className="modal-product-row">
                      <div className="modal-product-info">
                        <NutriScoreBadge grade={item.nutriscore_grade} size="sm" />
                        <div>
                          <strong>{item.product_name}</strong>
                          <span className="modal-product-brand"> · {item.brands}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={isCurrent}
                        className={`modal-select-btn ${isCurrent ? "disabled" : ""}`}
                        onClick={() => handleSelectProductToSwap(item.code)}
                      >
                        {isCurrent ? "Currently Selected" : "Swap In"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Compare;