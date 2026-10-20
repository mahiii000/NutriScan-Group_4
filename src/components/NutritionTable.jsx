import "./NutritionTable.css";

// Which nutrients to show, in order. `key` matches the API field name.
const ROWS = [
  { key: "energy-kcal_100g", label: "Energy", unit: "kcal" },
  { key: "sugars_100g", label: "Sugar", unit: "g" },
  { key: "fat_100g", label: "Fat", unit: "g" },
  { key: "saturated-fat_100g", label: "Saturated fat", unit: "g" },
  { key: "proteins_100g", label: "Protein", unit: "g" },
  { key: "fiber_100g", label: "Fibre", unit: "g" },
  { key: "salt_100g", label: "Salt", unit: "g" },
];

function NutritionTable({ nutriments = {} }) {
  return (
    <table className="nutrition-table">
      <caption className="nutrition-table__caption">Per 100g</caption>
      <tbody>
        {ROWS.map((row) => {
          const value = nutriments[row.key];
          // Real-world data is messy: some products are missing values
          const hasValue = value !== undefined && value !== null && value !== "";
          return (
            <tr key={row.key} className="nutrition-table__row">
              <th scope="row" className="nutrition-table__label">
                {row.label}
              </th>
              <td className="nutrition-table__value">
                {hasValue ? `${Math.round(Number(value) * 10) / 10} ${row.unit}` : "Not available"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default NutritionTable;