import DrinkGrid from "@/components/DrinkGrid";
import { loadDrinks } from "@/lib/loadDrinks";

export default function Page() {
  const drinks = loadDrinks();

  return (
    <main className="page">
      <header className="header">
        <h1 className="title">Drinks Library</h1>
        <p className="subtitle">
          Jangan salah masukin lu, jangan bikin gw malu.
        </p>
      </header>
      <DrinkGrid drinks={drinks} />
    </main>
  );
}

