import fs from "fs";
import path from "path";

export type Drink = {
  name: string;
  glass: string;
  garnish: string;
  ingredients: string[];
  method_notes: string;
};

const fallback: Drink[] = [
  {
    name: "“Fluffy” Paloma",
    glass: "Highball",
    garnish: "PG wedge on top of glass",
    ingredients: [
      "30 mls Tequila",
      "10 mls Agave",
      "Dash lime",
      "Top with fluffy pink grapefruit & with PG soda"
    ],
    method_notes: "Build"
  },
  {
    name: "20th Century",
    glass: "Coupet",
    garnish: "Lemon twist",
    ingredients: [
      "40 house dry gin",
      "20 white cacao",
      "15 Lillet Blanc",
      "10 lemon",
      "10 sugar"
    ],
    method_notes: "Shake / double strain"
  },
  {
    name: "Ace Of Hearts",
    glass: "Nick/Nora",
    garnish: "Ginger foam, Edible playing card",
    ingredients: [
      "40 mls Ester Dry Gin",
      "20 mls Chocolate Wine",
      "15 mls White Cacao",
      "10 mls fraise",
      "5 mls Ginger syrup",
      "60 mls Raspberry puree"
    ],
    method_notes: "Shake"
  },
  {
    name: "Affinity G&T",
    glass: "Highball",
    garnish: "Pome & orange paint/mint/fresh orange slice",
    ingredients: ["30 mls Karu affinity", "Top house tonic"],
    method_notes: "Build"
  }
];

export function loadDrinks(): Drink[] {
  const file = path.join(process.cwd(), "drinks_recipe.json");

  let text = "";
  try {
    text = fs.readFileSync(file, "utf8").trim();
  } catch (err) {
    console.warn("drinks_recipe.json not found, using fallback");
    return fallback;
  }

  if (!text) return fallback;

  const parsed = safeParse(text);
  const flattened = flatten(parsed);
  const drinks = flattened.filter(isDrink).map(normalizeDrink);

  return drinks.length ? drinks : fallback;
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    // Try to stitch together multiple top-level arrays/objects.
    const stitched = `[${text
      .replace(/\]\s*\[/g, "],")
      .replace(/\}\s*{/g, "},{")}]`;
    try {
      return JSON.parse(stitched);
    } catch {
      /* ignore and fall back to eval */
    }
    // Handle non-strict JSON by evaluating as JS (last resort).
    try {
      // eslint-disable-next-line no-new-func
      return Function(`\"use strict\"; return (${text});`)();
    } catch (err) {
      console.error("Failed to parse drinks_recipe.json", err);
      return [];
    }
  }
}

function flatten(value: unknown): Drink[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => flatten(item));
  }
  if (isDrink(value)) {
    return [value];
  }
  return [];
}

function isDrink(value: any): value is Drink {
  return (
    value &&
    typeof value === "object" &&
    typeof value.name === "string" &&
    typeof value.glass === "string" &&
    typeof value.garnish === "string" &&
    Array.isArray(value.ingredients) &&
    typeof value.method_notes === "string"
  );
}

function normalizeDrink(drink: Drink): Drink {
  return {
    name: drink.name.trim(),
    glass: drink.glass.trim(),
    garnish: drink.garnish.trim(),
    ingredients: drink.ingredients.map((item) => String(item).trim()),
    method_notes: drink.method_notes.trim()
  };
}

