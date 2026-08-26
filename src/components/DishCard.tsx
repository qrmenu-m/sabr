import React, { useState, useRef } from 'react';
import { Plus, Minus, Info, Flame, Sparkles } from 'lucide-react';
import { Dish } from '../types';

interface DishCardProps {
  dish: Dish;
  cartQuantity: number;
  onAddToCart: (dish: Dish) => void;
  onRemoveFromCart: (dishId: string) => void;
  onOpenDetails: (dish: Dish) => void;
  index?: number;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  cartQuantity,
  onAddToCart,
  onRemoveFromCart,
  onOpenDetails,
  index = 0,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // 3D Parallax Tilt Effect on mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Smooth tilt angles (-8 to +8 deg)
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Staggered floating animation delay based on index
  const floatDelay = `${(index % 5) * 0.7}s`;

  return (
    <div
      ref={cardRef}
      id={`dish-card-${dish.id}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="card group relative flex flex-col justify-between p-6 text-left select-none will-change-transform"
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-10px) translateZ(20px)`
          : `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`,
        transition: isHovered 
          ? 'transform 0.1s ease-out, box-shadow 0.3s ease' 
          : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease',
        animation: !isHovered ? `levitateFloating 5s ease-in-out infinite` : 'none',
        animationDelay: floatDelay,
      }}
    >
      {/* Subtle 3D floating aura highlight */}
      <div 
        className="absolute inset-0 rounded-[40px] pointer-events-none transition-opacity duration-300"
        style={{
          background: isHovered 
            ? 'radial-gradient(circle at 50% 0%, rgba(156, 175, 136, 0.15), transparent 70%)' 
            : 'none',
          opacity: isHovered ? 1 : 0
        }}
      />

      {/* Top Image & Badges */}
      <div>
        <div 
          className="relative w-full h-48 sm:h-52 rounded-[28px] overflow-hidden neo-card-inset p-1.5 mb-5 transition-transform duration-300"
          style={{
            transform: isHovered ? 'translateZ(30px) scale(1.02)' : 'translateZ(0px)',
          }}
        >
          {!imageLoaded && (
            <div className="w-full h-full rounded-[22px] bg-[#e0e5ec] animate-pulse flex items-center justify-center text-xs text-[#737373]">
              Загрузка...
            </div>
          )}

          <img
            src={dish.image}
            alt={dish.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover rounded-[22px] transition-transform duration-700 ${
              isHovered ? 'scale-110 rotate-0.5' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />

          {dish.badge && (
            <span className="absolute top-3.5 left-3.5 px-3.5 py-1 text-xs font-bold rounded-full bg-[#9CAF88] text-white shadow-md tracking-wide flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {dish.badge}
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(dish);
            }}
            title="Подробнее о блюде"
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs text-[#4a4a4a] hover:text-[#9CAF88] shadow-sm flex items-center justify-center transition-transform hover:scale-110 cursor-pointer active:scale-90"
          >
            <Info className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-medium text-[#4a4a4a]">
            <span className="px-2.5 py-1 rounded-full bg-[#F0F2F0]/90 backdrop-blur-xs border border-white/40 shadow-xs">
              {dish.weight} {dish.unit}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#F0F2F0]/90 backdrop-blur-xs border border-white/40 shadow-xs flex items-center gap-1 text-[#9CAF88] font-semibold">
              <Flame className="w-3 h-3" />
              {dish.nutrition.calories} ккал
            </span>
          </div>
        </div>

        {/* Dish Title & Description */}
        <div>
          <h3 
            onClick={() => onOpenDetails(dish)}
            className="text-lg font-bold text-[#4a4a4a] leading-snug tracking-tight hover:text-[#9CAF88] transition-colors cursor-pointer line-clamp-1"
          >
            {dish.name}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[#737373] line-clamp-2 leading-relaxed min-h-[2.5rem]">
            {dish.description}
          </p>
        </div>
      </div>

      {/* Price & 3D Action Button */}
      <div className="mt-6 pt-4 border-t border-[#d1d9e6]/50 flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-[#737373] block font-semibold uppercase tracking-wider">Цена</span>
          <span className="text-xl sm:text-2xl font-black text-[#4a4a4a] tracking-tight">
            {dish.price.toLocaleString('ru-RU')} ₸
          </span>
        </div>

        {cartQuantity === 0 ? (
          <button
            onClick={() => onAddToCart(dish)}
            className="btn-3d text-sm font-bold active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Выбрать</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 p-1 rounded-2xl neo-card-inset">
            <button
              onClick={() => onRemoveFromCart(dish.id)}
              className="w-8 h-8 rounded-xl bg-[#F0F2F0] hover:bg-white text-[#4a4a4a] flex items-center justify-center transition-all cursor-pointer active:scale-90"
              title="Уменьшить"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center font-bold text-sm text-[#4a4a4a]">
              {cartQuantity}
            </span>
            <button
              onClick={() => onAddToCart(dish)}
              className="w-8 h-8 rounded-xl bg-[#9CAF88] text-white flex items-center justify-center transition-all cursor-pointer active:scale-90 shadow-sm"
              title="Добавить еще"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
