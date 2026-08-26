import React from 'react';
import { X, Flame, Plus, Minus, AlertCircle, Clock } from 'lucide-react';
import { Dish } from '../types';

interface DishModalProps {
  dish: Dish | null;
  isOpen: boolean;
  cartQuantity: number;
  onClose: () => void;
  onAddToCart: (dish: Dish) => void;
  onRemoveFromCart: (dishId: string) => void;
}

export const DishModal: React.FC<DishModalProps> = ({
  dish,
  isOpen,
  cartQuantity,
  onClose,
  onAddToCart,
  onRemoveFromCart,
}) => {
  if (!isOpen || !dish) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="dish-detail-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto card p-6 sm:p-8 text-[#4a4a4a] animate-scaleUp"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-[#F0F2F0] text-[#4a4a4a] hover:text-[#9CAF88] neo-card-subtle flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Image */}
        <div className="relative w-full h-64 sm:h-72 rounded-[32px] overflow-hidden neo-card-inset p-1.5 mt-2">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover rounded-[26px]"
          />
          {dish.badge && (
            <span className="absolute top-5 left-5 px-3.5 py-1.5 text-xs font-bold rounded-full bg-[#9CAF88] text-white shadow-md">
              {dish.badge}
            </span>
          )}
          {dish.cookTimeMinutes && (
            <span className="absolute bottom-5 right-5 px-3.5 py-1.5 text-xs font-medium rounded-full bg-[#F0F2F0]/95 backdrop-blur-xs text-[#4a4a4a] shadow-xs flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#9CAF88]" />
              {dish.cookTimeMinutes} мин
            </span>
          )}
        </div>

        {/* Title & Category info */}
        <div className="mt-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#4a4a4a] leading-tight">
              {dish.name}
            </h2>
            <span className="text-xl sm:text-2xl font-black text-[#4a4a4a] whitespace-nowrap">
              {dish.price.toLocaleString('ru-RU')} ₸
            </span>
          </div>

          <p className="mt-3 text-sm text-[#737373] leading-relaxed">
            {dish.description}
          </p>
        </div>

        {/* Nutrition Bar (КБЖУ) */}
        <div className="mt-6 p-4 rounded-2xl neo-card-inset">
          <span className="text-xs font-bold uppercase tracking-wider text-[#737373] block mb-3">
            Пищевая ценность (на порцию {dish.weight} {dish.unit})
          </span>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-[#F0F2F0]">
              <span className="text-xs text-[#737373] block">Калории</span>
              <span className="text-sm font-black text-[#9CAF88]">{dish.nutrition.calories} ккал</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F0F2F0]">
              <span className="text-xs text-[#737373] block">Белки</span>
              <span className="text-sm font-bold text-[#4a4a4a]">{dish.nutrition.protein} г</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F0F2F0]">
              <span className="text-xs text-[#737373] block">Жиры</span>
              <span className="text-sm font-bold text-[#4a4a4a]">{dish.nutrition.fats} г</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F0F2F0]">
              <span className="text-xs text-[#737373] block">Углеводы</span>
              <span className="text-sm font-bold text-[#4a4a4a]">{dish.nutrition.carbs} г</span>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="mt-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#737373] block mb-2">
            Состав блюда
          </span>
          <div className="flex flex-wrap gap-2">
            {dish.ingredients.map((ingredient, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl text-xs bg-[#F0F2F0] text-[#4a4a4a] neo-card-subtle font-medium"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>

        {/* Allergens warning if any */}
        {dish.allergens && dish.allergens.length > 0 && (
          <div className="mt-4 flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-500/10 text-amber-900 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
            <div>
              <strong className="font-bold">Аллергены:</strong> {dish.allergens.join(', ')}
            </div>
          </div>
        )}

        {/* Action Button footer */}
        <div className="mt-8 pt-5 border-t border-[#d1d9e6] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#737373]">Вес:</span>
            <span className="text-xs font-bold text-[#4a4a4a]">{dish.weight} {dish.unit}</span>
          </div>

          {cartQuantity === 0 ? (
            <button
              onClick={() => onAddToCart(dish)}
              className="btn-3d text-sm font-bold active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить на поднос</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 p-1.5 rounded-2xl neo-card-inset">
              <button
                onClick={() => onRemoveFromCart(dish.id)}
                className="w-9 h-9 rounded-xl bg-[#F0F2F0] hover:bg-white text-[#4a4a4a] flex items-center justify-center text-sm cursor-pointer"
                title="Уменьшить"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-black text-base text-[#4a4a4a]">
                {cartQuantity}
              </span>
              <button
                onClick={() => onAddToCart(dish)}
                className="w-9 h-9 rounded-xl bg-[#9CAF88] text-white flex items-center justify-center text-sm cursor-pointer shadow-xs"
                title="Добавить еще"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
