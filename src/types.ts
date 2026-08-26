export type DishCategory = 
  | 'all'
  | 'breakfast'
  | 'soups'
  | 'mains'
  | 'sides'
  | 'salads'
  | 'bakery'
  | 'drinks';

export type DietaryTag = 
  | 'vegan'
  | 'vegetarian'
  | 'halal'
  | 'hit'
  | 'chef'
  | 'gluten-free'
  | 'low-cal';

export interface NutritionInfo {
  calories: number; // ккал
  proteins: number; // г
  fats: number;     // г
  carbs: number;    // г
}

export interface Dish {
  id: string;
  name: string;
  category: Exclude<DishCategory, 'all'>;
  description: string;
  price: number;
  weight: number; // in grams or ml
  unit: 'г' | 'мл' | 'шт';
  image: string;
  nutrition: NutritionInfo;
  ingredients: string[];
  allergens?: string[];
  tags: DietaryTag[];
  badge?: string;
  cookTimeMinutes?: number;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  specialInstructions?: string;
}

export interface OrderDetails {
  id: string;
  orderNumber: number;
  items: CartItem[];
  totalPrice: number;
  diningType: 'dine_in' | 'takeaway';
  tableNumber?: string;
  cutleryNeeded: boolean;
  notes?: string;
  createdAt: string;
  estimatedMinutes: number;
}
