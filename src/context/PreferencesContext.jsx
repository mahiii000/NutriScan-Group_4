
import { createContext, useContext, useState, useEffect } from "react";

const PreferencesContext = createContext(null);

const STORAGE_KEY = "nutriscan_preferences";

const defaultPreferences = {
  goal: "",
  allergens: [],
};

export function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences;
    } catch {
      return defaultPreferences;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  function updatePreferences(newPreferences) {
    setPreferences(newPreferences);
  }

  return (
    <PreferencesContext.Provider
      value={{ preferences, updatePreferences }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }

  return context;
}
