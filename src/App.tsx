import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Hero } from './components/Hero';
import { DishCard } from './components/DishCard';
import { DishModal } from './components/DishModal';
import { CartDrawer } from './components/CartDrawer';
import { ReceiptModal } from './components/ReceiptModal';
import { CategoryFilter } from './components/CategoryFilter';
import { FloatingTrayBar } from './components/FloatingTrayBar';
import { DISHES_DATA, DISH_CATEGORIES } from './data/dishes';
import { Dish, DishCategory, DietaryTag, CartItem, OrderDetails } from './types';
import { 
  Sparkles, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  UtensilsCrossed, 
  ChefHat,
  Search
} from 'lucide-react';

export default function App() {
  // Scroll and Parallax state
  const [scrollY, setScrollY] = useState(0);

  // Filter and Search states
  const [activeCategory, setActiveCategory] = useState<DishCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<DietaryTag | 'all'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'calories_asc'>('default');

  // Cart / Tray state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sabr_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<OrderDetails | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const menuSectionRef = useRef<HTMLDivElement>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sabr_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Scroll listener for parallax & background transformation
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.pageYOffset || document.documentElement.scrollTop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart operations
  const handleAddToCart = (dish: Dish) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { dish, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (dishId: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.dish.id === dishId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((item) => item.dish.id !== dishId);
      }
      return prev.map((item) =>
        item.dish.id === dishId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOpenDishDetails = (dish: Dish) => {
    setSelectedDish(dish);
    setIsDishModalOpen(true);
  };

  const handleCheckout = (order: OrderDetails) => {
    setActiveOrder(order);
    setIsCartOpen(false);
    setIsReceiptOpen(true);
    setCartItems([]);
  };

  const handleScrollToMenu = () => {
    menuSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Category counts
  const categoriesWithCounts = useMemo(() => {
    return DISH_CATEGORIES.map((cat) => {
      if (cat.id === 'all') {
        return { ...cat, count: DISHES_DATA.length };
      }
      const count = DISHES_DATA.filter((d) => d.category === cat.id).length;
      return { ...cat, count };
    });
  }, []);

  // Filtered and sorted dishes
  const filteredDishes = useMemo(() => {
    return DISHES_DATA.filter((dish) => {
      // Category filter
      if (activeCategory !== 'all' && dish.category !== activeCategory) {
        return false;
      }

      // Dietary tag filter
      if (selectedTag !== 'all') {
        if (selectedTag === 'low-cal') {
          if (dish.nutrition.calories >= 250) return false;
        } else if (!dish.tags.includes(selectedTag)) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = dish.name.toLowerCase().includes(q);
        const matchesDesc = dish.description.toLowerCase().includes(q);
        const matchesIng = dish.ingredients.some((i) => i.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesIng) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'calories_asc') return a.nutrition.calories - b.nutrition.calories;
      return 0; // default order
    });
  }, [activeCategory, selectedTag, searchQuery, sortBy]);

  // Fast lookup for cart quantities
  const cartQuantityMap = useMemo(() => {
    const map = new Map<string, number>();
    cartItems.forEach((item) => {
      map.set(item.dish.id, item.quantity);
    });
    return map;
  }, [cartItems]);

  return (
    <div className="min-h-screen relative text-[#4a4a4a] overflow-x-hidden">
      {/* Dynamic abstract background rotating with scroll */}
      <div 
        className="abstract-bg"
        style={{
          transform: `rotate(${scrollY / 5}deg)`
        }}
      />

      {/* Hero Section (exact design and parallax transition) */}
      <Hero 
        onScrollToMenu={handleScrollToMenu} 
        scrollOffset={scrollY} 
      />

      {/* Main Content / Menu Section */}
      <main 
        ref={menuSectionRef} 
        id="menu-section"
        className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        {/* Section Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#9CAF88] neo-card-subtle mb-4">
            <ChefHat className="w-4 h-4 text-[#9CAF88]" />
            <span>Ежедневное меню</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#4a4a4a] tracking-tight">
            Наше Меню
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#737373] max-w-xl mx-auto leading-relaxed">
            50 свежих блюд из натуральных фермерских продуктов. Завтраки, сытные супы, горячее, свежая выпечка и витаминные напитки.
          </p>
        </div>

        {/* Categories, Search & Filters */}
        <CategoryFilter
          categories={categoriesWithCounts}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalFilteredCount={filteredDishes.length}
        />

        {/* Dishes Grid */}
        {filteredDishes.length === 0 ? (
          <div className="text-center py-20 card max-w-md mx-auto p-8">
            <div className="w-16 h-16 mx-auto rounded-full neo-card-inset flex items-center justify-center text-[#9CAF88] mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#4a4a4a]">Ничего не найдено</h3>
            <p className="text-xs sm:text-sm text-[#737373] mt-2">
              Попробуйте изменить категорию или сбросить поисковый фильтр
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedTag('all');
                setSearchQuery('');
              }}
              className="btn-3d text-xs mt-6 px-6 py-2.5 cursor-pointer"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 sm:gap-10">
            {filteredDishes.map((dish, idx) => (
              <DishCard
                key={dish.id}
                dish={dish}
                index={idx}
                cartQuantity={cartQuantityMap.get(dish.id) || 0}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onOpenDetails={handleOpenDishDetails}
              />
            ))}
          </div>
        )}

        {/* Modern Canteen Quality Pillars */}
        <section className="mt-28 pt-12 border-t border-[#d1d9e6]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 card">
              <div className="w-14 h-14 mx-auto rounded-2xl neo-card-inset flex items-center justify-center text-[#9CAF88] mb-4">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-[#4a4a4a]">Халяль и Чистый состав</h4>
              <p className="text-xs text-[#737373] mt-2 leading-relaxed">
                Только проверенные поставщики, 100% свежие фермерские ингредиенты без искусственных добавок и красителей.
              </p>
            </div>

            <div className="p-8 card">
              <div className="w-14 h-14 mx-auto rounded-2xl neo-card-inset flex items-center justify-center text-[#9CAF88] mb-4">
                <Clock className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-[#4a4a4a]">Быстрая выдача за 7–10 минут</h4>
              <p className="text-xs text-[#737373] mt-2 leading-relaxed">
                Современный конвейер выдачи и продуманная логистика позволяют получить ваш обед горячим без долгих очередей.
              </p>
            </div>

            <div className="p-8 card">
              <div className="w-14 h-14 mx-auto rounded-2xl neo-card-inset flex items-center justify-center text-[#9CAF88] mb-4">
                <Heart className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-[#4a4a4a]">Философия «Sabr»</h4>
              <p className="text-xs text-[#737373] mt-2 leading-relaxed">
                Пространство эстетики и умиротворения, где каждый прием пищи дарит баланс, насыщение и душевный комфорт.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12 text-center text-xs text-[#737373] border-t border-[#d1d9e6]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold tracking-widest text-[#4a4a4a] uppercase">
            <span className="font-black text-sm">SABR</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9CAF88]"></span>
            <span className="text-[11px] font-normal lowercase text-[#737373]">столовая нового поколения</span>
          </div>
          <div className="flex items-center gap-6 text-[#737373]">
            <span>Круглосуточно</span>
            <span>г. Караганда</span>
          </div>
          <p>© {new Date().getFullYear()} Sabr Dining</p>
        </div>
      </footer>

      {/* Floating Tray / Cart Navigation */}
      <FloatingTrayBar
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onScrollToTop={handleScrollToTop}
        showScrollTop={scrollY > 400}
        isVisible={scrollY > 120}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
      />

      {/* Dish Detailed Modal */}
      <DishModal
        dish={selectedDish}
        isOpen={isDishModalOpen}
        cartQuantity={selectedDish ? cartQuantityMap.get(selectedDish.id) || 0 : 0}
        onClose={() => setIsDishModalOpen(false)}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
      />

      {/* Order Receipt Modal */}
      <ReceiptModal
        order={activeOrder}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
}
