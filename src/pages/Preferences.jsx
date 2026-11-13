
import { useState } from "react";
import { usePreferences } from "../context/PreferencesContext";
import "./Preferences.css";

function Preferences() {
  const { preferences, updatePreferences } = usePreferences();

  const [goal, setGoal] = useState(preferences.goal);
  const [allergens, setAllergens] = useState(preferences.allergens);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const allergenOptions = [
    "Milk",
    "Peanuts",
    "Eggs",
    "Soybeans",
    "Nuts",
    "Wheat",
  ];

  function handleAllergenChange(allergen) {
    if (allergens.includes(allergen)) {
      setAllergens(allergens.filter((item) => item !== allergen));
    } else {
      setAllergens([...allergens, allergen]);
    }

    setError("");
    setSuccess("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!goal) {
      setError("Please select a dietary goal before saving.");
      setSuccess("");
      return;
    }

    updatePreferences({
      goal,
      allergens,
    });

    setError("");
    setSuccess("Your preferences have been saved!");
  }

  return (
    <main className="preferences-page">
      <div className="preferences-container">
        <div className="preferences-header">
          <h1>Dietary Preferences</h1>
          <p>
            Customize NutriScan based on your dietary needs
            and preferences.
          </p>
        </div>

        <form className="preferences-card" onSubmit={handleSubmit}>
          <section className="preferences-section">
            <h2>Dietary Goal</h2>
            <p>Choose your main nutrition preference.</p>

            <div className="preferences-options">
              <label>
                <input
                  type="radio"
                  name="goal"
                  value="low-sugar"
                  checked={goal === "low-sugar"}
                  onChange={(event) => {
                    setGoal(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                />
                Low Sugar
              </label>

              <label>
                <input
                  type="radio"
                  name="goal"
                  value="gluten-free"
                  checked={goal === "gluten-free"}
                  onChange={(event) => {
                    setGoal(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                />
                Gluten-Free
              </label>

              <label>
                <input
                  type="radio"
                  name="goal"
                  value="balanced"
                  checked={goal === "balanced"}
                  onChange={(event) => {
                    setGoal(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                />
                Balanced Nutrition
              </label>
            </div>
          </section>

          <section className="preferences-section">
            <h2>Allergens to Avoid</h2>
            <p>Select any allergens you want NutriScan to flag.</p>

            <div className="preferences-options">
              {allergenOptions.map((allergen) => (
                <label key={allergen}>
                  <input
                    type="checkbox"
                    checked={allergens.includes(allergen)}
                    onChange={() => handleAllergenChange(allergen)}
                  />
                  {allergen}
                </label>
              ))}
            </div>
          </section>

          {error && (
            <p className="preferences-message preferences-error">
              {error}
            </p>
          )}

          {success && (
            <p className="preferences-message preferences-success">
              {success}
            </p>
          )}

          <button type="submit" className="preferences-save">
            Save Preferences
          </button>
        </form>
      </div>
    </main>
  );
}

export default Preferences;
