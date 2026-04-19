// Production always goes through Vercel's /api proxy so session cookies are
// same-origin. Dev uses localhost by default, overridable via VITE_API_BASE.
const BASE = import.meta.env.PROD
  ? '/api'
  : (import.meta.env.VITE_API_BASE || 'http://localhost:8080/api');

const fetchOpts = { credentials: 'same-origin' };

function clientTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export async function getCurrentUser() {
  const r = await fetch(`${BASE}/auth/me`, fetchOpts);
  if (r.status === 401) return null;
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function logout() {
  await fetch('/logout', { method: 'POST', ...fetchOpts });
}

export async function getTodaySteps() {
  const r = await fetch(`${BASE}/steps/today?tz=${encodeURIComponent(clientTimezone())}`, fetchOpts);
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function setTodaySteps(count) {
  const r = await fetch(`${BASE}/steps/today?tz=${encodeURIComponent(clientTimezone())}`, {
    ...fetchOpts,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ count }),
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function getWeekSteps() {
  const r = await fetch(`${BASE}/steps/week?tz=${encodeURIComponent(clientTimezone())}`, fetchOpts);
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function scanBarcode(barcode) {
  const r = await fetch(`${BASE}/scan/barcode`, {
    ...fetchOpts,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ barcode }),
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function scanPhoto(imageData) {
  const r = await fetch(`${BASE}/scan/photo`, {
    ...fetchOpts,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageData }),
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function saveMeal(meal) {
  const r = await fetch(`${BASE}/meals`, {
    ...fetchOpts,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(meal),
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function deleteMeal(id) {
  const r = await fetch(`${BASE}/meals/${id}`, { ...fetchOpts, method: 'DELETE' });
  if (!r.ok && r.status !== 404) throw new Error(`${r.status}`);
}

export async function getTodayMeals() {
  const r = await fetch(`${BASE}/meals/today?tz=${encodeURIComponent(clientTimezone())}`, fetchOpts);
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function getRecentMeals(days = 30) {
  const r = await fetch(`${BASE}/meals?days=${days}`, fetchOpts);
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function getTodayStats() {
  const r = await fetch(`${BASE}/stats/today?tz=${encodeURIComponent(clientTimezone())}`, fetchOpts);
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function getWeekStats() {
  const r = await fetch(`${BASE}/stats/week?tz=${encodeURIComponent(clientTimezone())}`, fetchOpts);
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function getFavorites() {
  const r = await fetch(`${BASE}/favorites`, fetchOpts);
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function addFavorite(food) {
  const r = await fetch(`${BASE}/favorites`, {
    ...fetchOpts,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(food),
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function removeFavorite(id) {
  const r = await fetch(`${BASE}/favorites/${id}`, { ...fetchOpts, method: 'DELETE' });
  if (!r.ok && r.status !== 404) throw new Error(`${r.status}`);
}

export async function getPlannedMeals(startIso, endIso) {
  const r = await fetch(`${BASE}/plan?start=${startIso}&end=${endIso}`, fetchOpts);
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function addPlannedMeal(body) {
  const r = await fetch(`${BASE}/plan`, {
    ...fetchOpts,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export async function removePlannedMeal(id) {
  const r = await fetch(`${BASE}/plan/${id}`, { ...fetchOpts, method: 'DELETE' });
  if (!r.ok && r.status !== 404) throw new Error(`${r.status}`);
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
