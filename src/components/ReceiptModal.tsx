import React from 'react';
import { CheckCircle2, Clock, MapPin, X, Utensils } from 'lucide-react';
import { OrderDetails } from '../types';

interface ReceiptModalProps {
  order: OrderDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="receipt-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg card p-6 sm:p-8 text-[#4a4a4a] animate-scaleUp"
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Закрыть чек"
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#F0F2F0] text-[#4a4a4a] hover:text-[#9CAF88] neo-card-subtle flex items-center justify-center cursor-pointer transition-all active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Icon & Header */}
        <div className="text-center pt-2">
          <div className="w-16 h-16 mx-auto rounded-full neo-card-inset flex items-center justify-center text-[#9CAF88] mb-4">
            <CheckCircle2 className="w-8 h-8 text-[#9CAF88]" />
          </div>

          <span className="text-xs uppercase font-bold tracking-widest text-[#9CAF88]">
            Заказ успешно принят кухней
          </span>
          <h2 className="text-3xl font-black text-[#4a4a4a] mt-1">
            Номер талона: #{order.orderNumber}
          </h2>
          <p className="text-xs text-[#737373] mt-1">
            ID: {order.id} • Время: {order.createdAt}
          </p>
        </div>

        {/* Status bar */}
        <div className="my-6 grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl neo-card-inset text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#737373] font-medium">
              <Clock className="w-4 h-4 text-[#9CAF88]" />
              <span>Ожидание</span>
            </div>
            <span className="text-sm font-bold text-[#4a4a4a] block mt-1">
              ~{order.estimatedMinutes} минут
            </span>
          </div>

          <div className="p-3.5 rounded-2xl neo-card-inset text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#737373] font-medium">
              <MapPin className="w-4 h-4 text-[#9CAF88]" />
              <span>Формат</span>
            </div>
            <span className="text-sm font-bold text-[#4a4a4a] block mt-1">
              {order.diningType === 'dine_in' 
                ? (order.tableNumber ? `Зал (${order.tableNumber})` : 'В зале столовой') 
                : 'С собой (На вынос)'}
            </span>
          </div>
        </div>

        {/* Ordered items list */}
        <div className="p-4 rounded-2xl neo-card-inset">
          <span className="text-xs font-bold uppercase tracking-wider text-[#737373] block mb-3">
            Состав заказа
          </span>
          <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
            {order.items.map((item) => (
              <div key={item.dish.id} className="flex items-center justify-between text-xs py-1 border-b border-[#d1d9e6]/40 last:border-none">
                <span className="text-[#4a4a4a]">
                  {item.dish.name} <strong className="text-[#9CAF88]">×{item.quantity}</strong>
                </span>
                <span className="font-bold text-[#4a4a4a]">
                  {(item.dish.price * item.quantity).toLocaleString('ru-RU')} ₸
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#d1d9e6] flex items-center justify-between">
            <span className="text-sm font-bold text-[#4a4a4a]">Оплачено:</span>
            <span className="text-xl font-black text-[#4a4a4a]">{order.totalPrice.toLocaleString('ru-RU')} ₸</span>
          </div>
        </div>

        {/* Bottom instructions */}
        <div className="mt-5 text-center text-xs text-[#737373] space-y-1">
          <p>Пожалуйста, покажите экран с талоном или назовите номер на стойке выдачи.</p>
        </div>

        {/* Done button */}
        <button
          onClick={onClose}
          className="btn-3d w-full mt-6 py-3 text-sm cursor-pointer justify-center"
        >
          <Utensils className="w-4 h-4" />
          <span>Готово, закрыть чек</span>
        </button>
      </div>
    </div>
  );
};
