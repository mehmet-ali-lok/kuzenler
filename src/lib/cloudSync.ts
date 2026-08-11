import { KuzenProfile, SharedPhoto } from '@/types';

export const fetchCloudSyncData = async (): Promise<{
  profiles?: Record<'duru' | 'omer' | 'cinar', KuzenProfile>;
  photos?: SharedPhoto[];
  profilesUpdatedAt?: number;
  photosUpdatedAt?: number;
} | null> => {
  try {
    const res = await fetch('/api/sync', { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (e) {
    console.error('Fetch cloud sync error:', e);
    return null;
  }
};

export const pushCloudSyncData = async (payload: {
  profiles?: Record<'duru' | 'omer' | 'cinar', KuzenProfile>;
  photos?: SharedPhoto[];
}) => {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('Push cloud sync error:', e);
    return null;
  }
};
