import { NextResponse } from 'next/server';
import { INITIAL_PROFILES, INITIAL_SHARED_PHOTOS } from '@/lib/initialData';
import { KuzenProfile, SharedPhoto } from '@/types';

// Global serverless in-memory cache for profiles & photos
// Persists across active serverless requests on Vercel
let globalProfiles: Record<'duru' | 'omer' | 'cinar', KuzenProfile> = INITIAL_PROFILES;
let globalPhotos: SharedPhoto[] = INITIAL_SHARED_PHOTOS;

export async function GET() {
  return NextResponse.json({
    profiles: globalProfiles,
    photos: globalPhotos,
    updatedAt: Date.now(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.profiles) {
      globalProfiles = body.profiles;
    }
    if (body.photos) {
      globalPhotos = body.photos;
    }

    return NextResponse.json({
      success: true,
      profiles: globalProfiles,
      photos: globalPhotos,
      updatedAt: Date.now(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
