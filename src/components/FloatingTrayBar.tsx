import React from 'react';
import { ArrowUp, Utensils } from 'lucide-react';
import { CartItem } from '../types';

interface FloatingTrayBarProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  onScrollToTop: () => void;
  showScrollTop: boolean;
  isVisible: boolean;
}

export const FloatingTrayBar: React.FC<FloatingTrayBarProps> = ({
  cartItems,
  onOpenCart,
  onScrollToTop,
  showScrollTop,
  isVisible,
}) => {
  if (!isVisible) return null;

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.dish.price * item.quantity, 0);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 transition-all duration-300 animate-fadeIn">
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={onScrollToTop}
          title="Наверх"
          aria-label="Наверх"
          className="p-3.5 rounded-full bg-[#F0F2F0] text-[#4a4a4a] hover:text-[#9CAF88] neo-card-subtle active:scale-95 transition-all cursor-pointer shadow-md hover:-translate-y-1"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Floating Tray Button */}
      <button
        id="floating-tray-btn"
        onClick={onOpenCart}
        className={`group relative flex items-center gap-3 py-3.5 px-5 sm:px-6 rounded-full transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
          totalCount > 0
            ? 'btn-3d text-white'
            : 'bg-[#F0F2F0] text-[#4a4a4a] neo-card-subtle hover:text-[#9CAF88]'
        }`}
      >
        <div className="relative">
          <Utensils className="w-5 h-5" />
          {totalCount > 0 && (
            <span className="absolute -top-2 -right-2.5 w-5 h-5 rounded-full bg-white text-[#9CAF88] font-black text-[11px] flex items-center justify-center shadow-xs">
              {totalCount}
            </span>
          )}
        </div>

        <div className="text-left hidden sm:block">
          <span className="text-xs uppercase tracking-wider block font-bold opacity-95">
            {totalCount > 0 ? 'Ваш поднос' : 'Поднос'}
          </span>
          {totalCount > 0 ? (
            <span className="text-sm font-black tracking-tight">{totalPrice.toLocaleString('ru-RU')} ₸</span>
          ) : (
            <span className="text-xs opacity-75">0 блюд</span>
          )}
        </div>

        {totalCount > 0 && (
          <span className="sm:hidden font-black text-sm">{totalPrice.toLocaleString('ru-RU')} ₸</span>
        )}
      </button>
    </div>
  );
};
