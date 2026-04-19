// Curated meal library for the planner. Nutrition and prices are rough averages
// — useful for planning + budgeting, not clinical/financial accuracy.
// Prices in USD for a single serving. Ingredients use consistent units per name
// so they aggregate cleanly in the shopping list.

export const MEAL_CATEGORIES = ['breakfast', 'lunch', 'dinner', 'snack'];

export const MEAL_LIBRARY = [
  // ── breakfast ─────────────────────────────────────
  {
    id: 'oat-berries', name: 'Oat bowl with berries', category: 'breakfast',
    calories: 340, protein: 12, carbs: 55, fat: 8, serving: '1 bowl', price: 2.20,
    ingredients: [
      { name: 'Rolled oats', qty: 0.5, unit: 'cup' },
      { name: 'Milk', qty: 1, unit: 'cup' },
      { name: 'Mixed berries', qty: 0.5, unit: 'cup' },
      { name: 'Honey', qty: 1, unit: 'tsp' },
    ],
  },
  {
    id: 'avo-toast', name: 'Avocado toast', category: 'breakfast',
    calories: 280, protein: 8, carbs: 32, fat: 14, serving: '2 slices', price: 2.80,
    ingredients: [
      { name: 'Bread', qty: 2, unit: 'slice' },
      { name: 'Avocado', qty: 0.5, unit: 'piece' },
      { name: 'Lemon juice', qty: 1, unit: 'tsp' },
    ],
  },
  {
    id: 'greek-yogurt-granola', name: 'Greek yogurt + granola', category: 'breakfast',
    calories: 320, protein: 18, carbs: 42, fat: 8, serving: '1 cup', price: 2.50,
    ingredients: [
      { name: 'Greek yogurt', qty: 1, unit: 'cup' },
      { name: 'Granola', qty: 0.25, unit: 'cup' },
      { name: 'Honey', qty: 1, unit: 'tsp' },
    ],
  },
  {
    id: 'scrambled-eggs', name: 'Scrambled eggs + spinach', category: 'breakfast',
    calories: 260, protein: 18, carbs: 4, fat: 18, serving: '3 eggs', price: 2.00,
    ingredients: [
      { name: 'Eggs', qty: 3, unit: 'piece' },
      { name: 'Spinach', qty: 1, unit: 'cup' },
      { name: 'Butter', qty: 1, unit: 'tsp' },
    ],
  },
  {
    id: 'smoothie-bowl', name: 'Berry smoothie bowl', category: 'breakfast',
    calories: 310, protein: 14, carbs: 52, fat: 6, serving: '1 bowl', price: 3.40,
    ingredients: [
      { name: 'Banana', qty: 1, unit: 'piece' },
      { name: 'Mixed berries', qty: 0.5, unit: 'cup' },
      { name: 'Greek yogurt', qty: 0.5, unit: 'cup' },
      { name: 'Granola', qty: 2, unit: 'tbsp' },
    ],
  },

  // ── lunch ─────────────────────────────────────────
  {
    id: 'chicken-salad', name: 'Grilled chicken salad', category: 'lunch',
    calories: 420, protein: 38, carbs: 16, fat: 22, serving: '1 plate', price: 5.20,
    ingredients: [
      { name: 'Chicken breast', qty: 150, unit: 'g' },
      { name: 'Mixed greens', qty: 2, unit: 'cup' },
      { name: 'Cherry tomatoes', qty: 0.5, unit: 'cup' },
      { name: 'Olive oil', qty: 1, unit: 'tbsp' },
    ],
  },
  {
    id: 'quinoa-bowl', name: 'Quinoa veggie bowl', category: 'lunch',
    calories: 480, protein: 18, carbs: 68, fat: 14, serving: '1 bowl', price: 4.60,
    ingredients: [
      { name: 'Quinoa', qty: 0.5, unit: 'cup' },
      { name: 'Black beans', qty: 0.5, unit: 'cup' },
      { name: 'Corn', qty: 0.25, unit: 'cup' },
      { name: 'Avocado', qty: 0.5, unit: 'piece' },
      { name: 'Lime', qty: 0.5, unit: 'piece' },
    ],
  },
  {
    id: 'turkey-wrap', name: 'Turkey + hummus wrap', category: 'lunch',
    calories: 450, protein: 28, carbs: 44, fat: 18, serving: '1 wrap', price: 4.80,
    ingredients: [
      { name: 'Tortilla', qty: 1, unit: 'piece' },
      { name: 'Turkey slices', qty: 100, unit: 'g' },
      { name: 'Hummus', qty: 2, unit: 'tbsp' },
      { name: 'Mixed greens', qty: 1, unit: 'cup' },
    ],
  },
  {
    id: 'tuna-rice', name: 'Tuna + brown rice', category: 'lunch',
    calories: 510, protein: 34, carbs: 62, fat: 10, serving: '1 plate', price: 3.80,
    ingredients: [
      { name: 'Tuna (can)', qty: 1, unit: 'can' },
      { name: 'Brown rice', qty: 1, unit: 'cup' },
      { name: 'Olive oil', qty: 1, unit: 'tsp' },
    ],
  },
  {
    id: 'lentil-soup', name: 'Lentil soup + bread', category: 'lunch',
    calories: 380, protein: 18, carbs: 58, fat: 6, serving: '1 bowl', price: 2.90,
    ingredients: [
      { name: 'Lentils', qty: 0.5, unit: 'cup' },
      { name: 'Carrot', qty: 1, unit: 'piece' },
      { name: 'Onion', qty: 0.5, unit: 'piece' },
      { name: 'Bread', qty: 1, unit: 'slice' },
    ],
  },

  // ── dinner ────────────────────────────────────────
  {
    id: 'salmon-veg', name: 'Salmon + roasted veg', category: 'dinner',
    calories: 540, protein: 38, carbs: 24, fat: 28, serving: '1 plate', price: 8.50,
    ingredients: [
      { name: 'Salmon fillet', qty: 150, unit: 'g' },
      { name: 'Broccoli', qty: 1, unit: 'cup' },
      { name: 'Bell pepper', qty: 0.5, unit: 'piece' },
      { name: 'Olive oil', qty: 1, unit: 'tbsp' },
    ],
  },
  {
    id: 'pasta-primavera', name: 'Pasta primavera', category: 'dinner',
    calories: 520, protein: 16, carbs: 82, fat: 14, serving: '1 plate', price: 3.60,
    ingredients: [
      { name: 'Pasta', qty: 100, unit: 'g' },
      { name: 'Cherry tomatoes', qty: 0.5, unit: 'cup' },
      { name: 'Zucchini', qty: 0.5, unit: 'piece' },
      { name: 'Olive oil', qty: 1, unit: 'tbsp' },
      { name: 'Parmesan', qty: 2, unit: 'tbsp' },
    ],
  },
  {
    id: 'steak-potato', name: 'Steak + sweet potato', category: 'dinner',
    calories: 620, protein: 44, carbs: 38, fat: 28, serving: '1 plate', price: 9.80,
    ingredients: [
      { name: 'Steak', qty: 170, unit: 'g' },
      { name: 'Sweet potato', qty: 1, unit: 'piece' },
      { name: 'Butter', qty: 1, unit: 'tbsp' },
    ],
  },
  {
    id: 'veggie-stirfry', name: 'Tofu veggie stir-fry', category: 'dinner',
    calories: 440, protein: 24, carbs: 42, fat: 18, serving: '1 plate', price: 4.40,
    ingredients: [
      { name: 'Tofu', qty: 150, unit: 'g' },
      { name: 'Broccoli', qty: 1, unit: 'cup' },
      { name: 'Bell pepper', qty: 0.5, unit: 'piece' },
      { name: 'Soy sauce', qty: 1, unit: 'tbsp' },
      { name: 'Brown rice', qty: 0.5, unit: 'cup' },
    ],
  },
  {
    id: 'chicken-rice-bowl', name: 'Chicken rice bowl', category: 'dinner',
    calories: 560, protein: 40, carbs: 58, fat: 16, serving: '1 bowl', price: 6.20,
    ingredients: [
      { name: 'Chicken breast', qty: 150, unit: 'g' },
      { name: 'Brown rice', qty: 1, unit: 'cup' },
      { name: 'Avocado', qty: 0.25, unit: 'piece' },
      { name: 'Lime', qty: 0.5, unit: 'piece' },
    ],
  },
  {
    id: 'shrimp-pasta', name: 'Shrimp linguine', category: 'dinner',
    calories: 590, protein: 32, carbs: 72, fat: 16, serving: '1 plate', price: 7.80,
    ingredients: [
      { name: 'Shrimp', qty: 150, unit: 'g' },
      { name: 'Pasta', qty: 100, unit: 'g' },
      { name: 'Olive oil', qty: 1, unit: 'tbsp' },
      { name: 'Lemon', qty: 0.5, unit: 'piece' },
    ],
  },

  // ── snack ─────────────────────────────────────────
  {
    id: 'apple-pb', name: 'Apple + peanut butter', category: 'snack',
    calories: 210, protein: 6, carbs: 28, fat: 10, serving: '1 apple + 1 tbsp', price: 1.20,
    ingredients: [
      { name: 'Apple', qty: 1, unit: 'piece' },
      { name: 'Peanut butter', qty: 1, unit: 'tbsp' },
    ],
  },
  {
    id: 'hummus-carrots', name: 'Carrots + hummus', category: 'snack',
    calories: 180, protein: 6, carbs: 18, fat: 10, serving: '1 serving', price: 1.80,
    ingredients: [
      { name: 'Carrot', qty: 2, unit: 'piece' },
      { name: 'Hummus', qty: 3, unit: 'tbsp' },
    ],
  },
  {
    id: 'trail-mix', name: 'Trail mix', category: 'snack',
    calories: 240, protein: 7, carbs: 22, fat: 14, serving: '1/4 cup', price: 1.50,
    ingredients: [{ name: 'Trail mix', qty: 0.25, unit: 'cup' }],
  },
  {
    id: 'protein-shake', name: 'Protein shake', category: 'snack',
    calories: 180, protein: 25, carbs: 12, fat: 3, serving: '1 scoop + milk', price: 1.90,
    ingredients: [
      { name: 'Whey protein', qty: 1, unit: 'scoop' },
      { name: 'Milk', qty: 1, unit: 'cup' },
    ],
  },
  {
    id: 'cottage-cheese', name: 'Cottage cheese + berries', category: 'snack',
    calories: 160, protein: 18, carbs: 14, fat: 4, serving: '1 cup', price: 2.10,
    ingredients: [
      { name: 'Cottage cheese', qty: 1, unit: 'cup' },
      { name: 'Mixed berries', qty: 0.5, unit: 'cup' },
    ],
  },
];

export function findLibraryMeal(libraryId) {
  return MEAL_LIBRARY.find((m) => m.id === libraryId);
}

/**
 * Build a grouped shopping list from a set of planned meals.
 * Aggregates quantities where ingredient name + unit match.
 */
export function buildShoppingList(plannedMeals) {
  const byKey = new Map();
  for (const p of plannedMeals) {
    const lib = findLibraryMeal(p.libraryId);
    if (!lib?.ingredients) continue;
    for (const ing of lib.ingredients) {
      const key = `${ing.name.toLowerCase()}|${ing.unit}`;
      if (byKey.has(key)) {
        byKey.get(key).qty += ing.qty;
      } else {
        byKey.set(key, { name: ing.name, unit: ing.unit, qty: ing.qty });
      }
    }
  }
  return [...byKey.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function weekCost(plannedMeals) {
  let total = 0;
  for (const p of plannedMeals) {
    const lib = findLibraryMeal(p.libraryId);
    if (lib?.price) total += lib.price;
  }
  return total;
}
