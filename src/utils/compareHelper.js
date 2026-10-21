// Helper utilities for product nutrition comparison and verdict generation

export const GRADE_SCORES = {
  a: 5,
  b: 4,
  c: 3,
  d: 2,
  e: 1,
};

export const COMPARE_ROWS = [
  { key: "nutriscore_grade", label: "Score", unit: "", isGrade: true, lowerIsBetter: false },
  { key: "energy-kcal_100g", label: "Energy", unit: "kcal", lowerIsBetter: true },
  { key: "sugars_100g", label: "Sugar", unit: "g", lowerIsBetter: true },
  { key: "fat_100g", label: "Fat", unit: "g", lowerIsBetter: true },
  { key: "saturated-fat_100g", label: "Saturated Fat", unit: "g", lowerIsBetter: true },
  { key: "proteins_100g", label: "Protein", unit: "g", lowerIsBetter: false },
  { key: "fiber_100g", label: "Fibre", unit: "g", lowerIsBetter: false },
  { key: "salt_100g", label: "Salt", unit: "g", lowerIsBetter: true },
];

/**
 * Returns which product has the better value for a given metric: 'A', 'B', 'TIE', or null
 */
export function compareMetric(row, prodA, prodB) {
  if (!prodA || !prodB) return null;

  if (row.isGrade) {
    const scoreA = GRADE_SCORES[prodA.nutriscore_grade?.toLowerCase()] || 0;
    const scoreB = GRADE_SCORES[prodB.nutriscore_grade?.toLowerCase()] || 0;
    if (!scoreA && !scoreB) return null;
    if (scoreA > scoreB) return "A";
    if (scoreB > scoreA) return "B";
    return "TIE";
  }

  const valA = prodA.nutriments?.[row.key];
  const valB = prodB.nutriments?.[row.key];

  if (valA === undefined || valA === null || valB === undefined || valB === null) {
    return null;
  }

  const numA = Number(valA);
  const numB = Number(valB);

  if (isNaN(numA) || isNaN(numB)) return null;
  if (numA === numB) return "TIE";

  if (row.lowerIsBetter) {
    return numA < numB ? "A" : "B";
  } else {
    return numA > numB ? "A" : "B";
  }
}

/**
 * Generates a concise verdict line and key highlight pills
 */
export function generateVerdict(prodA, prodB) {
  if (!prodA || !prodB) {
    return {
      headline: "Select two products to see a verdict.",
      highlights: [],
    };
  }

  const nameA = prodA.product_name || "Product 1";
  const nameB = prodB.product_name || "Product 2";

  const sugarA = Number(prodA.nutriments?.sugars_100g);
  const sugarB = Number(prodB.nutriments?.sugars_100g);
  const fatA = Number(prodA.nutriments?.fat_100g);
  const fatB = Number(prodB.nutriments?.fat_100g);
  const protA = Number(prodA.nutriments?.proteins_100g);
  const protB = Number(prodB.nutriments?.proteins_100g);
  const energyA = Number(prodA.nutriments?.["energy-kcal_100g"]);
  const energyB = Number(prodB.nutriments?.["energy-kcal_100g"]);

  const scoreA = GRADE_SCORES[prodA.nutriscore_grade?.toLowerCase()] || 0;
  const scoreB = GRADE_SCORES[prodB.nutriscore_grade?.toLowerCase()] || 0;

  const aWinsSugar = !isNaN(sugarA) && !isNaN(sugarB) && sugarA < sugarB;
  const bWinsSugar = !isNaN(sugarA) && !isNaN(sugarB) && sugarB < sugarA;
  const aWinsFat = !isNaN(fatA) && !isNaN(fatB) && fatA < fatB;
  const bWinsFat = !isNaN(fatA) && !isNaN(fatB) && fatB < fatA;
  const aWinsProt = !isNaN(protA) && !isNaN(protB) && protA > protB;
  const bWinsProt = !isNaN(protA) && !isNaN(protB) && protB > protA;
  const aWinsGrade = scoreA > scoreB;
  const bWinsGrade = scoreB > scoreA;

  const highlights = [];

  // Build highlights
  if (aWinsSugar) {
    const diff = Math.round(((sugarB - sugarA) / (sugarB || 1)) * 100);
    highlights.push({
      text: `${nameA}: ${diff > 0 ? `${diff}%` : ""} lower sugar (${sugarA}g vs ${sugarB}g)`,
      winner: "A",
    });
  } else if (bWinsSugar) {
    const diff = Math.round(((sugarA - sugarB) / (sugarA || 1)) * 100);
    highlights.push({
      text: `${nameB}: ${diff > 0 ? `${diff}%` : ""} lower sugar (${sugarB}g vs ${sugarA}g)`,
      winner: "B",
    });
  }

  if (aWinsFat) {
    highlights.push({
      text: `${nameA}: lower fat (${fatA}g vs ${fatB}g)`,
      winner: "A",
    });
  } else if (bWinsFat) {
    highlights.push({
      text: `${nameB}: lower fat (${fatB}g vs ${fatA}g)`,
      winner: "B",
    });
  }

  if (aWinsProt) {
    highlights.push({
      text: `${nameA}: higher protein (+${Math.round((protA - protB) * 10) / 10}g)`,
      winner: "A",
    });
  } else if (bWinsProt) {
    highlights.push({
      text: `${nameB}: higher protein (+${Math.round((protB - protA) * 10) / 10}g)`,
      winner: "B",
    });
  }

  if (aWinsGrade) {
    highlights.push({
      text: `${nameA}: better Nutri-Score (${prodA.nutriscore_grade?.toUpperCase()} vs ${prodB.nutriscore_grade?.toUpperCase()})`,
      winner: "A",
    });
  } else if (bWinsGrade) {
    highlights.push({
      text: `${nameB}: better Nutri-Score (${prodB.nutriscore_grade?.toUpperCase()} vs ${prodA.nutriscore_grade?.toUpperCase()})`,
      winner: "B",
    });
  }

  if (!isNaN(energyA) && !isNaN(energyB)) {
    if (energyA < energyB) {
      highlights.push({
        text: `${nameA}: lower energy (${energyA} kcal vs ${energyB} kcal)`,
        winner: "A",
      });
    } else if (energyB < energyA) {
      highlights.push({
        text: `${nameB}: lower energy (${energyB} kcal vs ${energyA} kcal)`,
        winner: "B",
      });
    }
  }

  // Construct short headline summarizing the verdict
  let headline = "";

  if (aWinsSugar && aWinsFat) {
    headline = `${nameA} - low in sugar & fat`;
  } else if (bWinsSugar && bWinsFat) {
    headline = `${nameB} - low in sugar & fat`;
  } else if (aWinsSugar && aWinsProt) {
    headline = `${nameA} - lower sugar with higher protein`;
  } else if (bWinsSugar && bWinsProt) {
    headline = `${nameB} - lower sugar with higher protein`;
  } else if (aWinsGrade) {
    headline = `${nameA} - better Nutri-Score and overall profile`;
  } else if (bWinsGrade) {
    headline = `${nameB} - better Nutri-Score and overall profile`;
  } else if (aWinsSugar) {
    headline = `${nameA} - significantly lower in sugar`;
  } else if (bWinsSugar) {
    headline = `${nameB} - significantly lower in sugar`;
  } else {
    headline = `${nameA} and ${nameB} have comparable nutritional profiles`;
  }

  return { headline, highlights };
}
