import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function getSiteSetting(key) {
  const ref = doc(db, 'site', key);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function updateSiteSetting(key, data) {
  const ref = doc(db, 'site', key);
  await setDoc(ref, data);
}
