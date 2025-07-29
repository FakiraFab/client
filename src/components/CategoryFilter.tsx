import type { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  onSelect: (categoryId: string) => void;
}

const CategoryFilter = ({ categories, onSelect }: CategoryFilterProps) => {
  return (
    <select
      className="w-full p-2 border rounded-md"
      onChange={(e) => onSelect(e.target.value)}
      defaultValue=""
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat._id} value={cat._id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
};

export default CategoryFilter;