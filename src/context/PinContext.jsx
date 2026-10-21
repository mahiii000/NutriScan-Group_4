import { createContext, useContext, useState, useEffect } from "react";
import products from "../data/products";

const STORAGE_KEY_PINNED = "nutriscan_pinned_products";
const STORAGE_KEY_COMPARED = "nutriscan_compared_slots";
const DEFAULT_PINNED = []; // Oat Bar & Choco Bar matching the sketch

const PinContext = createContext(null);

export function PinProvider({ children }) {
  const [pinnedCodes, setPinnedCodes] = useState(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PINNED);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Ignore JSON parse errors
  }

  return [];
});

  const [comparedCodes, setComparedCodes] = useState(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_COMPARED);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === 2) {
        return parsed;
      }
    }
  } catch {
    // Ignore JSON parse errors
  }

  return [null, null];
});

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PINNED, JSON.stringify(pinnedCodes));
    } catch (err) {
      console.error("Failed to save pinned products to localStorage", err);
    }
  }, [pinnedCodes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPARED, JSON.stringify(comparedCodes));
    } catch (err) {
      console.error("Failed to save compared slots to localStorage", err);
    }
  }, [comparedCodes]);

  // Listen to window storage events for cross-tab sync
  useEffect(() => {
    function handleStorageChange(event) {
      if (event.key === STORAGE_KEY_PINNED && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (Array.isArray(parsed)) setPinnedCodes(parsed);
        } catch {
          // ignore
        }
      }
      if (event.key === STORAGE_KEY_COMPARED && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (Array.isArray(parsed) && parsed.length === 2) setComparedCodes(parsed);
        } catch {
          // ignore
        }
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  function isPinned(code) {
    return pinnedCodes.includes(code);
  }

  function pinProduct(code) {
  if (!code) return;

  setPinnedCodes((prev) => {
    // Don't add the same product twice
    if (prev.includes(code)) return prev;

    // Maximum of 2 pinned products
    if (prev.length >= 2) return prev;

    return [...prev, code];
  });

  // Add the product to an empty comparison slot
  setComparedCodes((prev) => {
    if (prev.includes(code)) return prev;

    if (!prev[0]) return [code, prev[1]];
    if (!prev[1]) return [prev[0], code];

    return prev;
  });
}

  

  function unpinProduct(code) {
    if (!code) return;
    const remaining = pinnedCodes.filter((c) => c !== code);
    setPinnedCodes(remaining);

    // Update compared slots if this product was being compared
    setComparedCodes((prev) => {
      let [slot0, slot1] = prev;
      if (slot0 === code) {
        // Find alternative from remaining that isn't slot1
        const alt = remaining.find((c) => c !== slot1) || null;
        slot0 = alt;
      }
      if (slot1 === code) {
        // Find alternative from remaining that isn't slot0
        const alt = remaining.find((c) => c !== slot0) || null;
        slot1 = alt;
      }
      return [slot0, slot1];
    });
  }

  function togglePin(code) {
    if (isPinned(code)) {
      unpinProduct(code);
    } else {
      pinProduct(code);
    }
  }

  /**
   * Swap a single slot (0 or 1) with another product without restarting
   */
 function swapComparedSlot(slotIndex, newCode) {
  if (!newCode || (slotIndex !== 0 && slotIndex !== 1)) return;

  // Only allow products that are already pinned
  if (!pinnedCodes.includes(newCode)) return;

  setComparedCodes((prev) => {
    const next = [...prev];
    next[slotIndex] = newCode;
    return next;
  });
}

  // Map codes to full product objects
  const pinnedProducts = pinnedCodes
    .map((code) => products.find((p) => p.code === code))
    .filter(Boolean);

  const comparedProducts = [
    comparedCodes[0] ? products.find((p) => p.code === comparedCodes[0]) || null : null,
    comparedCodes[1] ? products.find((p) => p.code === comparedCodes[1]) || null : null,
  ];

  return (
    <PinContext.Provider
      value={{
        pinnedCodes,
        pinnedProducts,
        comparedCodes,
        comparedProducts,
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


