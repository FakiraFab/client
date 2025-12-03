import type { FilterState } from '../components/FilterDrawer';

/**
 * Available colors for filtering products
 */
export const AVAILABLE_COLORS = [
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Black',
  'White',
  'Pink',
  'Purple',
  'Orange',
  'Brown',
];

/**
 * Calculate the number of active filters
 * @param filters - Current filter state
 * @returns Number of active filters
 */
export const getActiveFilterCount = (filters: FilterState): number => {
  let count = 0;
  
  if (filters.subcategory) count++;
  if (filters.minPrice !== undefined) count++;
  if (filters.maxPrice !== undefined) count++;
  if (filters.colors && filters.colors.length > 0) count += filters.colors.length;
  if (filters.attributes) {
    Object.values(filters.attributes).forEach(values => {
      count += values.length;
    });
  }
  
  return count;
};
