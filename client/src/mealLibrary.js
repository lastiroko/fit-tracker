// Curated meal library for the planner. Nutritional values are rough averages
// per serving — good enough for planning, not clinical accuracy.

export const MEAL_CATEGORIES = ['breakfast', 'lunch', 'dinner', 'snack'];

export const MEAL_LIBRARY = [
  // ── breakfast ─────────────────────────────────────
  { id: 'oat-berries', name: 'Oat bowl with berries', category: 'breakfast', calories: 340, protein: 12, carbs: 55, fat: 8, serving: '1 bowl' },
  { id: 'avo-toast', name: 'Avocado toast', category: 'breakfast', calories: 280, protein: 8, carbs: 32, fat: 14, serving: '2 slices' },
  { id: 'greek-yogurt-granola', name: 'Greek yogurt + granola', category: 'breakfast', calories: 320, protein: 18, carbs: 42, fat: 8, serving: '1 cup' },
  { id: 'scrambled-eggs', name: 'Scrambled eggs + spinach', category: 'breakfast', calories: 260, protein: 18, carbs: 4, fat: 18, serving: '3 eggs' },
  { id: 'smoothie-bowl', name: 'Berry smoothie bowl', category: 'breakfast', calories: 310, protein: 14, carbs: 52, fat: 6, serving: '1 bowl' },

  // ── lunch ─────────────────────────────────────────
  { id: 'chicken-salad', name: 'Grilled chicken salad', category: 'lunch', calories: 420, protein: 38, carbs: 16, fat: 22, serving: '1 plate' },
  { id: 'quinoa-bowl', name: 'Quinoa veggie bowl', category: 'lunch', calories: 480, protein: 18, carbs: 68, fat: 14, serving: '1 bowl' },
  { id: 'turkey-wrap', name: 'Turkey + hummus wrap', category: 'lunch', calories: 450, protein: 28, carbs: 44, fat: 18, serving: '1 wrap' },
  { id: 'tuna-rice', name: 'Tuna + brown rice', category: 'lunch', calories: 510, protein: 34, carbs: 62, fat: 10, serving: '1 plate' },
  { id: 'lentil-soup', name: 'Lentil soup + bread', category: 'lunch', calories: 380, protein: 18, carbs: 58, fat: 6, serving: '1 bowl' },

  // ── dinner ────────────────────────────────────────
  { id: 'salmon-veg', name: 'Salmon + roasted veg', category: 'dinner', calories: 540, protein: 38, carbs: 24, fat: 28, serving: '1 plate' },
  { id: 'pasta-primavera', name: 'Pasta primavera', category: 'dinner', calories: 520, protein: 16, carbs: 82, fat: 14, serving: '1 plate' },
  { id: 'steak-potato', name: 'Steak + sweet potato', category: 'dinner', calories: 620, protein: 44, carbs: 38, fat: 28, serving: '1 plate' },
  { id: 'veggie-stirfry', name: 'Tofu veggie stir-fry', category: 'dinner', calories: 440, protein: 24, carbs: 42, fat: 18, serving: '1 plate' },
  { id: 'chicken-rice-bowl', name: 'Chicken rice bowl', category: 'dinner', calories: 560, protein: 40, carbs: 58, fat: 16, serving: '1 bowl' },
  { id: 'shrimp-pasta', name: 'Shrimp linguine', category: 'dinner', calories: 590, protein: 32, carbs: 72, fat: 16, serving: '1 plate' },

  // ── snack ─────────────────────────────────────────
  { id: 'apple-pb', name: 'Apple + peanut butter', category: 'snack', calories: 210, protein: 6, carbs: 28, fat: 10, serving: '1 apple + 1 tbsp' },
  { id: 'hummus-carrots', name: 'Carrots + hummus', category: 'snack', calories: 180, protein: 6, carbs: 18, fat: 10, serving: '1 serving' },
  { id: 'trail-mix', name: 'Trail mix', category: 'snack', calories: 240, protein: 7, carbs: 22, fat: 14, serving: '1/4 cup' },
  { id: 'protein-shake', name: 'Protein shake', category: 'snack', calories: 180, protein: 25, carbs: 12, fat: 3, serving: '1 scoop + milk' },
  { id: 'cottage-cheese', name: 'Cottage cheese + berries', category: 'snack', calories: 160, protein: 18, carbs: 14, fat: 4, serving: '1 cup' },
];
