
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const PreferencesContext = createContext(null);

const defaultPreferences = {
  goal: "",
  allergens: [],
};

function getStorageKey(email) {
  if (!email) return "nutriscan_preferences";
  const normalizedEmail = String(email).trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
  return `nutriscan_preferences_${normalizedEmail}`;
}

function loadPreferences(email) {
  try {
    const key = getStorageKey(email);
    const saved = localStorage.getItem(key);
    return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences;
  } catch {
    return defaultPreferences;
  }
}

export function PreferencesProvider({ children }) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState(() => loadPreferences(user?.email));

  useEffect(() => {
    setPreferences(loadPreferences(user?.email));
  }, [user?.email]);

  useEffect(() => {
    const key = getStorageKey(user?.email);
    localStorage.setItem(key, JSON.stringify(preferences));
  }, [preferences, user?.email]);

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
