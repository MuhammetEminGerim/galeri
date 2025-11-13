import { useState } from 'react';

const COMPARE_KEY = 'car-compare';
const MAX_COMPARE = 3;

function getStoredCompareList(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(COMPARE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function useCompare() {
  const [compareList, setCompareList] = useState<string[]>(getStoredCompareList);

  const addToCompare = (carId: string): boolean => {
    if (compareList.includes(carId)) return false;
    if (compareList.length >= MAX_COMPARE) return false;
    
    const updated = [...compareList, carId];
    setCompareList(updated);
    localStorage.setItem(COMPARE_KEY, JSON.stringify(updated));
    return true;
  };

  const removeFromCompare = (carId: string) => {
    const updated = compareList.filter((id) => id !== carId);
    setCompareList(updated);
    localStorage.setItem(COMPARE_KEY, JSON.stringify(updated));
  };

  const toggleCompare = (carId: string): boolean => {
    if (compareList.includes(carId)) {
      removeFromCompare(carId);
      return false;
    } else {
      return addToCompare(carId);
    }
  };

  const clearCompare = () => {
    setCompareList([]);
    localStorage.removeItem(COMPARE_KEY);
  };

  const isInCompare = (carId: string) => compareList.includes(carId);

  return {
    compareList,
    addToCompare,
    removeFromCompare,
    toggleCompare,
    clearCompare,
    isInCompare,
    canAddMore: compareList.length < MAX_COMPARE,
  };
}
