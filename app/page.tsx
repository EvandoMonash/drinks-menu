import DrinkGrid from "@/components/DrinkGrid";
import { loadDrinks } from "@/lib/loadDrinks";

export default function Page() {
  const drinks = loadDrinks();

  return (
    <main className="page">
      <header className="header">
        <h1 className="title">Drinks Library</h1>
        <p className="subtitle">
          Browse every drink with glass, garnish, ingredients, and method notes.
          Use the search to filter by anything.
        </p>
      </header>
      <DrinkGrid drinks={drinks} />
    </main>
  );
}

