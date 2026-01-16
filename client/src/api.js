const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';
export async function getTodaySteps(){
  const r = await fetch(`${BASE}/steps/today`);
  if(!r.ok) throw new Error(`${r.status}`);
  return r.json();
}
