import {
  getVapidPublicKey,
  postPushSubscription,
  deletePushSubscription,
} from './api';

function urlBase64ToUint8Array(base64) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export function pushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

export async function ensurePermission() {
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return await Notification.requestPermission();
}

export async function subscribePush() {
  if (!pushSupported()) throw new Error('push-unsupported');
  const reg = await navigator.serviceWorker.ready;

  const { publicKey, configured } = await getVapidPublicKey();
  if (!configured || !publicKey) throw new Error('push-not-configured');

  const existing = await reg.pushManager.getSubscription();
  if (existing) {
    await postPushSubscription(existing.toJSON());
    return existing;
  }

  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });
  await postPushSubscription(subscription.toJSON());
  return subscription;
}

export async function unsubscribePush() {
  if (!pushSupported()) return;
  const reg = await navigator.serviceWorker.ready;
  const existing = await reg.pushManager.getSubscription();
  if (!existing) return;
  try {
    await deletePushSubscription(existing.endpoint);
  } catch {}
  await existing.unsubscribe();
}
