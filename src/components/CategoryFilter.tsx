import React from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  UtensilsCrossed, 
  Sun, 
  Soup, 
  Flame, 
  Wheat, 
  Salad, 
  Cake, 
  Coffee,
  Leaf,
  Award,
  ShieldCheck
} from 'lucide-react';
import { DishCategory, DietaryTag } from '../types';

interface CategoryFilterProps {
  categories: { id: DishCategory; name: string; iconName: string; count?: number }[];
  activeCategory: DishCategory;
  onSelectCategory: (category: DishCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTag: DietaryTag | 'all';
  onSelectTag: (tag: DietaryTag | 'all') => void;
  sortBy: 'default' | 'price_asc' | 'price_desc' | 'calories_asc';
  onSortChange: (sort: 'default' | 'price_asc' | 'price_desc' | 'calories_asc') => void;
  totalFilteredCount: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedTag,
  onSelectTag,
  sortBy,
  onSortChange,
  totalFilteredCount,
}) => {
  const getCategoryIcon = (id: DishCategory) => {
    switch (id) {
      case 'all': return <UtensilsCrossed className="w-4 h-4" />;
      case 'breakfast': return <Sun className="w-4 h-4" />;
      case 'soups': return <Soup className="w-4 h-4" />;
      case 'mains': return <Flame className="w-4 h-4" />;
      case 'sides': return <Wheat className="w-4 h-4" />;
      case 'salads': return <Salad className="w-4 h-4" />;
      case 'bakery': return <Cake className="w-4 h-4" />;
      case 'drinks': return <Coffee className="w-4 h-4" />;
      default: return <UtensilsCrossed className="w-4 h-4" />;
    }
  };

  const dietaryTags: { id: DietaryTag | 'all'; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'Все блюда' },
    { id: 'hit', label: 'Хиты', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'halal', label: 'Халяль', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'vegetarian', label: 'Вегетарианское', icon: <Leaf className="w-3.5 h-3.5" /> },
    { id: 'chef', label: 'Шеф-выбор', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'low-cal', label: 'Легкие (<250 ккал)' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mb-10">
      {/* Search Bar & Dietary Tags row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <input
            id="dish-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск блюд и ингредиентов..."
            className="w-full py-3.5 pl-12 pr-10 rounded-2xl input-neo text-sm placeholder:text-[#737373] text-[#4a4a4a] transition-all"
          />
          <Search className="w-4 h-4 text-[#737373] absolute left-4 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#737373] hover:text-[#4a4a4a]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dietary Filters & Sort */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
          {dietaryTags.map((tag) => {
            const isActive = selectedTag === tag.id;
            return (
              <button
                key={tag.id}
                onClick={() => onSelectTag(tag.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#9CAF88] text-white shadow-md'
                    : 'bg-[#F0F2F0] text-[#737373] hover:text-[#4a4a4a] neo-card-subtle'
                }`}
              >
                {tag.icon}
                <span>{tag.label}</span>
              </button>
            );
          })}

          {/* Sort Selection */}
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#F0F2F0] text-[#737373] outline-none cursor-pointer hover:text-[#4a4a4a] neo-card-subtle transition-colors"
          >
            <option value="default">Сортировка: По умолчанию</option>
            <option value="price_asc">Цена: по возрастанию</option>
            <option value="price_desc">Цена: по убыванию</option>
            <option value="calories_asc">Калории: сначала легкие</option>
          </select>
        </div>
      </div>

      {/* Main Categories Navigation Tabs */}
      <div className="relative overflow-x-auto pb-4 pt-1 no-scrollbar">
        <div className="flex items-center gap-3 min-w-max">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`group flex items-center gap-2.5 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#9CAF88] text-white shadow-md -translate-y-0.5'
                    : 'bg-[#F0F2F0] text-[#737373] hover:text-[#4a4a4a] neo-card-subtle'
                }`}
              >
                <span className={`transition-colors ${isActive ? 'text-white' : 'text-[#737373] group-hover:text-[#9CAF88]'}`}>
                  {getCategoryIcon(cat.id)}
                </span>
                <span>{cat.name}</span>
                {cat.count !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-[#e0e5ec] text-[#4a4a4a]'
                  }`}>
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results counter bar */}
      <div className="flex items-center justify-between text-xs text-[#737373] font-medium pt-2 px-1">
        <span>Показано блюд: <strong className="text-[#4a4a4a] font-bold">{totalFilteredCount}</strong> из 50</span>
        {searchQuery && (
          <span>Результаты по запросу: «{searchQuery}»</span>
        )}
      </div>
    </div>
  );
};
