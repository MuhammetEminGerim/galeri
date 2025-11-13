import { useState } from 'react';

const FAVORITES_KEY = 'car-favorites';

function getStoredFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(getStoredFavorites);

  const addFavorite = (carId: string) => {
    const updated = [...favorites, carId];
    setFavorites(updated);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  };

  const removeFavorite = (carId: string) => {
    const updated = favorites.filter((id) => id !== carId);
    setFavorites(updated);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  };

  const toggleFavorite = (carId: string) => {
    if (favorites.includes(carId)) {
      removeFavorite(carId);
    } else {
      addFavorite(carId);
    }
  };

  const isFavorite = (carId: string) => favorites.includes(carId);

  return { favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite };
}
