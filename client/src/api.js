const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

function clientTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export async function getTodaySteps() {
  const r = await fetch(`${BASE}/steps/today?tz=${encodeURIComponent(clientTimezone())}`);
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function setTodaySteps(count) {
  const r = await fetch(`${BASE}/steps/today?tz=${encodeURIComponent(clientTimezone())}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ count }),
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function getWeekSteps() {
  const r = await fetch(`${BASE}/steps/week?tz=${encodeURIComponent(clientTimezone())}`);
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

export async function deleteMeal(id) {
  const r = await fetch(`${BASE}/meals/${id}`, { method: 'DELETE' });
  if (!r.ok && r.status !== 404) throw new Error(`${r.status}`);
}

export async function getTodayMeals() {
  const r = await fetch(`${BASE}/meals/today?tz=${encodeURIComponent(clientTimezone())}`);
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function getRecentMeals(days = 30) {
  const r = await fetch(`${BASE}/meals?days=${days}`);
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function getTodayStats() {
  const r = await fetch(`${BASE}/stats/today?tz=${encodeURIComponent(clientTimezone())}`);
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function getWeekStats() {
  const r = await fetch(`${BASE}/stats/week?tz=${encodeURIComponent(clientTimezone())}`);
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
