
import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'roles-sp-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const item = window.localStorage.getItem(FAVORITES_KEY);
      return item ? new Set(JSON.parse(item)) : new Set();
    } catch (error) {
      console.error('Error reading favorites from localStorage', error);
      return new Set();
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
    } catch (error) {
      console.error('Error saving favorites to localStorage', error);
    }
  }, [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((id: string) => {
    return favorites.has(id);
  }, [favorites]);

  return { favorites: Array.from(favorites), toggleFavorite, isFavorite };
};
