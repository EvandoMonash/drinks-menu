"use client";

import { useMemo, useState } from "react";
import type { Drink } from "@/lib/loadDrinks";

type Props = {
  drinks: Drink[];
};

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // strip accents/diacritics

export default function DrinkGrid({ drinks }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query).trim();
    if (!q) return drinks;
    return drinks.filter((drink) => normalize(drink.name).includes(q));
  }, [drinks, query]);

  const resultLabel = filtered.length === 1 ? "drink" : "drinks";

  return (
    <>
      <div className="search-row">
        <div className="search-shell">
          <span className="search-icon" aria-hidden>
            🔍
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search drink name…"
            className="search"
            aria-label="Search drinks"
          />
          {query && (
            <button
              type="button"
              className="clear"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </div>
        <span className="count">
          {filtered.length.toLocaleString()} {resultLabel}
        </span>
      </div>
      <div className="grid">
        {filtered.map((drink, idx) => (
          <article key={`${drink.name}-${idx}`} className="card">
            <div className="card-top">
              <h2>{drink.name}</h2>
              <p className="method-inline">{drink.method_notes}</p>
            </div>
            <div className="chips">
              <span className="pill">
                <strong>Glass</strong> {drink.glass}
              </span>
              <span className="pill pill-muted">
                <strong>Garnish</strong> {drink.garnish}
              </span>
            </div>
            <div className="section">
              <p className="section-title">Ingredients</p>
              <ul className="ingredients">
                {drink.ingredients.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
        {!filtered.length && <p className="empty">No drinks match “{query}”.</p>}
      </div>
    </>
  );
}

