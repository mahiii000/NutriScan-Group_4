
import { createContext, useContext, useState, useEffect } from "react";
import products from "../data/products";

const STORAGE_KEY_PINNED = "nutriscan_pinned_products";
const STORAGE_KEY_COMPARED = "nutriscan_compared_slots";
const STORAGE_KEY_CATALOG = "nutriscan_product_catalog";

const PinContext = createContext(null);

function readSavedArray(key) {
  try {
    const saved = localStorage.getItem(key);
    const parsed = saved ? JSON.parse(saved) : null;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadCatalog() {
  const savedProducts = readSavedArray(STORAGE_KEY_CATALOG);
  const catalog = [...products];

  savedProducts.forEach((product) => {
    if (!product?.code) return;

    const index = catalog.findIndex(
      (item) => item.code === product.code
    );

    if (index === -1) {
      catalog.push(product);
    } else {
      catalog[index] = product;
    }
  });

  return catalog;
}

function loadPinnedCodes() {
  const catalog = loadCatalog();
  const savedCodes = readSavedArray(STORAGE_KEY_PINNED);

  return [...new Set(savedCodes)]
    .filter((code) => catalog.some((product) => product.code === code))
    .slice(0, 2);
}

function loadComparedCodes() {
  const pinned = loadPinnedCodes();
  const saved = readSavedArray(STORAGE_KEY_COMPARED);

  if (saved.length !== 2) return [null, null];

  return saved.map((code) =>
    code && pinned.includes(code) ? code : null
  );
}

export function PinProvider({ children }) {
  const [productCatalog, setProductCatalog] = useState(loadCatalog);
  const [pinnedCodes, setPinnedCodes] = useState(loadPinnedCodes);
  const [comparedCodes, setComparedCodes] = useState(loadComparedCodes);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY_CATALOG,
      JSON.stringify(productCatalog)
    );
  }, [productCatalog]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY_PINNED,
      JSON.stringify(pinnedCodes)
    );
  }, [pinnedCodes]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY_COMPARED,
      JSON.stringify(comparedCodes)
    );
  }, [comparedCodes]);

  function isPinned(code) {
    return pinnedCodes.includes(code);
  }

  function pinProduct(product) {
    if (!product?.code) return;

    setProductCatalog((prev) => {
      const index = prev.findIndex(
        (item) => item.code === product.code
      );

      if (index === -1) return [...prev, product];

      return prev.map((item) =>
        item.code === product.code ? product : item
      );
    });

    setPinnedCodes((prev) => {
      if (prev.includes(product.code) || prev.length >= 2) {
        return prev;
      }

      return [...prev, product.code];
    });

    setComparedCodes((prev) => {
      if (prev.includes(product.code)) return prev;
      if (!prev[0]) return [product.code, prev[1]];
      if (!prev[1]) return [prev[0], product.code];
      return prev;
    });
  }

  function unpinProduct(code) {
    if (!code) return;

    setPinnedCodes((prev) =>
      prev.filter((item) => item !== code)
    );

    setComparedCodes((prev) =>
      prev.map((item) => (item === code ? null : item))
    );
  }

  function togglePin(product) {
    const code =
      typeof product === "string" ? product : product?.code;

    if (!code) return;

    if (isPinned(code)) {
      unpinProduct(code);
    } else if (typeof product === "object" && product !== null) {
      pinProduct(product);
    }
  }

  function swapComparedSlot(slotIndex, newCode) {
    if (slotIndex !== 0 && slotIndex !== 1) return;

    const newProduct = productCatalog.find(
      (product) => product.code === newCode
    );

    if (!newProduct) return;

    const oldCode = comparedCodes[slotIndex];

    setPinnedCodes((prev) => {
      if (prev.includes(newCode)) return prev;

      const updated = [...prev];
      const oldIndex = updated.indexOf(oldCode);

      if (oldIndex !== -1) {
        updated[oldIndex] = newCode;
      } else if (updated.length < 2) {
        updated.push(newCode);
      } else {
        updated[slotIndex] = newCode;
      }

      return [...new Set(updated)].slice(0, 2);
    });

    setComparedCodes((prev) => {
      const updated = [...prev];
      updated[slotIndex] = newCode;
      return updated;
    });
  }

  const pinnedProducts = pinnedCodes
    .map((code) =>
      productCatalog.find((product) => product.code === code)
    )
    .filter(Boolean);

  const comparedProducts = [0, 1].map((slot) => {
    const code = comparedCodes[slot];

    return code
      ? productCatalog.find((product) => product.code === code) || null
      : null;
  });

  return (
    <PinContext.Provider
      value={{
        pinnedCodes,
        pinnedProducts,
        comparedCodes,
        comparedProducts,
        productCatalog,
        setProductCatalog,
        isPinned,
        pinProduct,
        unpinProduct,
        togglePin,
        swapComparedSlot,
        setComparedCodes,
      }}
    >
      {children}
    </PinContext.Provider>
  );
}

export function usePin() {
  const context = useContext(PinContext);

  if (!context) {
    throw new Error("usePin must be used within a PinProvider");
  }

  return context;
}
