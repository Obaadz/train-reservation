import { useState, useMemo } from 'react';

type SortDirection = 'asc' | 'desc';

interface UseSortProps<T> {
  items: T[];
  initialSortKey?: keyof T;
  initialDirection?: SortDirection;
}

export const useSort = <T extends Record<string, any>>({
  items,
  initialSortKey,
  initialDirection = 'asc'
}: UseSortProps<T>) => {
  const [sortKey, setSortKey] = useState<keyof T | undefined>(initialSortKey);
  const [direction, setDirection] = useState<SortDirection>(initialDirection);

  const sortedItems = useMemo(() => {
    if (!sortKey) return items;

    return [...items].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [items, sortKey, direction]);

  const toggleSort = (key: keyof T) => {
    if (sortKey === key) {
      setDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setDirection('asc');
    }
  };

  return {
    sortedItems,
    sortKey,
    direction,
    toggleSort,
  };
};