import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Utensils, 
  ArrowRight
} from 'lucide-react';
import { CartItem, OrderDetails } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onAddToCart: (dish: CartItem['dish']) => void;
  onRemoveFromCart: (dishId: string) => void;
  onClearCart: () => void;
  onCheckout: (orderDetails: OrderDetails) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  onCheckout,
}) => {
  const [diningType, setDiningType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [tableNumber, setTableNumber] = useState('');
  const [cutleryNeeded, setCutleryNeeded] = useState(true);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.dish.price * item.quantity,
    0
  );

  const totalCalories = cartItems.reduce(
    (sum, item) => sum + item.dish.nutrition.calories * item.quantity,
    0
  );

  const totalItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleCreateOrder = () => {
    if (cartItems.length === 0) return;

    const order: OrderDetails = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      orderNumber: Math.floor(10 + Math.random() * 89),
      items: [...cartItems],
      totalPrice,
      diningType,
      tableNumber: diningType === 'dine_in' ? tableNumber : undefined,
      cutleryNeeded,
      notes: notes.trim() || undefined,
      createdAt: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      estimatedMinutes: Math.min(25, 7 + totalItemsCount * 2),
    };

    onCheckout(order);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md h-full bg-[#F0F2F0] p-6 flex flex-col justify-between overflow-y-auto border-l border-[#d1d9e6] shadow-2xl animate-slideLeft"
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-5 border-b border-[#d1d9e6]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl neo-card-inset flex items-center justify-center text-[#9CAF88]">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#4a4a4a]">Ваш поднос</h2>
                <span className="text-xs text-[#737373]">
                  {totalItemsCount} {totalItemsCount === 1 ? 'позиция' : 'позиций'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  onClick={onClearCart}
                  title="Очистить поднос"
                  className="p-2.5 rounded-xl bg-[#F0F2F0] text-[#737373] hover:text-red-600 neo-card-subtle active:scale-95 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                aria-label="Закрыть"
                className="p-2.5 rounded-xl bg-[#F0F2F0] text-[#4a4a4a] hover:text-[#9CAF88] neo-card-subtle active:scale-95 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dining Type selector (В зале / С собой) */}
          <div className="grid grid-cols-2 gap-2.5 my-5 p-1.5 rounded-2xl neo-card-inset">
            <button
              onClick={() => setDiningType('dine_in')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                diningType === 'dine_in'
                  ? 'bg-[#9CAF88] text-white shadow-md'
                  : 'text-[#737373] hover:text-[#4a4a4a]'
              }`}
            >
              В столовой (В зале)
            </button>
            <button
              onClick={() => setDiningType('takeaway')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                diningType === 'takeaway'
                  ? 'bg-[#9CAF88] text-white shadow-md'
                  : 'text-[#737373] hover:text-[#4a4a4a]'
              }`}
            >
              С собой (На вынос)
            </button>
          </div>

          {/* Items List */}
          {cartItems.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-20 h-20 mx-auto rounded-3xl neo-card-inset flex items-center justify-center text-[#9CAF88] mb-4">
                <ShoppingBag className="w-8 h-8 opacity-80" />
              </div>
              <h3 className="text-base font-bold text-[#4a4a4a]">Поднос пока пуст</h3>
              <p className="text-xs text-[#737373] mt-1 max-w-xs mx-auto">
                Выберите понравившиеся блюда из меню, чтобы сформировать вкусный и сбалансированный обед
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[38vh] overflow-y-auto pr-1 my-4">
              {cartItems.map((item) => (
                <div
                  key={item.dish.id}
                  className="p-3.5 rounded-2xl bg-[#F0F2F0] neo-card-subtle flex items-center justify-between gap-3"
                >
                  <img
                    src={item.dish.image}
                    alt={item.dish.name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#4a4a4a] truncate">
                      {item.dish.name}
                    </h4>
                    <span className="text-[11px] text-[#737373]">
                      {item.dish.weight} {item.dish.unit} • <strong className="text-[#4a4a4a] font-semibold">{item.dish.price.toLocaleString('ru-RU')} ₸</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1 p-1 rounded-xl neo-card-inset">
                    <button
                      onClick={() => onRemoveFromCart(item.dish.id)}
                      className="w-7 h-7 rounded-lg bg-[#F0F2F0] text-[#4a4a4a] hover:text-[#9CAF88] flex items-center justify-center text-xs cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-[#4a4a4a]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onAddToCart(item.dish)}
                      className="w-7 h-7 rounded-lg bg-[#9CAF88] text-white flex items-center justify-center text-xs cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Form details if items present */}
          {cartItems.length > 0 && (
            <div className="space-y-3 pt-2">
              {diningType === 'dine_in' && (
                <div>
                  <label className="block text-[11px] font-bold text-[#737373] uppercase tracking-wider mb-1">
                    Номер столика (необязательно)
                  </label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Например: Стол № 4"
                    className="w-full py-2.5 px-4 rounded-xl input-neo text-xs text-[#4a4a4a] placeholder:text-[#737373]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-[#737373] uppercase tracking-wider mb-1">
                  Пожелания к повару
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Без лука, соус отдельно и т.д."
                  className="w-full py-2.5 px-4 rounded-xl input-neo text-xs text-[#4a4a4a] placeholder:text-[#737373]"
                />
              </div>

              {/* Cutlery toggle */}
              <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={cutleryNeeded}
                  onChange={(e) => setCutleryNeeded(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#9CAF88] cursor-pointer"
                />
                <span className="text-xs text-[#4a4a4a]">Положить приборы и салфетки</span>
              </label>
            </div>
          )}
        </div>

        {/* Footer & Total */}
        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-[#d1d9e6]">
            <div className="space-y-1.5 mb-4 text-xs text-[#737373]">
              <div className="flex justify-between">
                <span>Калорийность заказа:</span>
                <span className="font-semibold text-[#9CAF88]">{totalCalories} ккал</span>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-sm font-bold text-[#4a4a4a]">Итого к оплате:</span>
                <span className="text-2xl font-black text-[#4a4a4a]">{totalPrice.toLocaleString('ru-RU')} ₸</span>
              </div>
            </div>

            <button
              id="checkout-btn"
              onClick={handleCreateOrder}
              className="btn-3d w-full py-3.5 text-base cursor-pointer justify-center"
            >
              <span>Оформить заказ</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
