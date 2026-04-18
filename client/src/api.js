const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

export async function getTodaySteps() {
  const r = await fetch(`${BASE}/steps/today`);
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function scanBarcode(barcode) {
  const r = await fetch(`${BASE}/scan/barcode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ barcode }),
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function scanPhoto(imageData) {
  const r = await fetch(`${BASE}/scan/photo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageData }),
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function saveMeal(meal) {
  const r = await fetch(`${BASE}/meals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(meal),
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function getTodayMeals() {
  const r = await fetch(`${BASE}/meals/today`);
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function getTodayStats() {
  const r = await fetch(`${BASE}/stats/today`);
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

function formatMealMeta(meal) {
  const d = meal.createdAt ? new Date(meal.createdAt) : null;
  if (!d || isNaN(d.getTime())) return meal.servingSize || '';
  const time = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(d);
  const hour = d.getHours();
  const bucket = hour < 11 ? 'Breakfast' : hour < 15 ? 'Lunch' : hour < 18 ? 'Snack' : 'Dinner';
  return `${bucket} · ${time}`;
}

export { formatMealMeta };
