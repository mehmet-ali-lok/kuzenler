import { NextResponse } from 'next/server';
import { INITIAL_PROFILES, INITIAL_SHARED_PHOTOS } from '@/lib/initialData';
import { KuzenProfile, SharedPhoto } from '@/types';

// Global serverless in-memory cache for profiles & photos
let globalProfiles: Record<'duru' | 'omer' | 'cinar', KuzenProfile> | null = null;
let globalPhotos: SharedPhoto[] | null = null;
let lastProfilesUpdatedAt = 0;
let lastPhotosUpdatedAt = 0;

export async function GET() {
  return NextResponse.json({
    profiles: globalProfiles,
    photos: globalPhotos,
    profilesUpdatedAt: lastProfilesUpdatedAt,
    photosUpdatedAt: lastPhotosUpdatedAt,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const now = Date.now();

    if (body.profiles) {
      globalProfiles = body.profiles;
      lastProfilesUpdatedAt = now;
    }
    if (body.photos) {
      globalPhotos = body.photos;
      lastPhotosUpdatedAt = now;
    }

    return NextResponse.json({
      success: true,
      profiles: globalProfiles,
      photos: globalPhotos,
      profilesUpdatedAt: lastProfilesUpdatedAt,
      photosUpdatedAt: lastPhotosUpdatedAt,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
