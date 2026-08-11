import { NextResponse } from 'next/server';

// Server-side global rooms store for Monopoly and UNO
// Keys are formatted as `${game}_${roomId}`
interface RoomStoreItem {
  gameState: any;
  updatedAt: number;
}

const roomsStore: Record<string, RoomStoreItem> = {};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const game = searchParams.get('game') || 'monopoly';
  const roomId = (searchParams.get('roomId') || 'KUZEN77').toUpperCase();
  const roomKey = `${game}_${roomId}`;

  const room = roomsStore[roomKey];
  if (!room) {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({
    found: true,
    gameState: room.gameState,
    updatedAt: room.updatedAt,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, game, roomId, gameState } = body;
    const roomKey = `${game}_${(roomId || 'KUZEN77').toUpperCase()}`;

    if (action === 'update' || action === 'join' || action === 'create') {
      roomsStore[roomKey] = {
        gameState: gameState,
        updatedAt: Date.now(),
      };
      return NextResponse.json({
        success: true,
        gameState: roomsStore[roomKey].gameState,
        updatedAt: roomsStore[roomKey].updatedAt,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Room sync failed' }, { status: 500 });
  }
}
