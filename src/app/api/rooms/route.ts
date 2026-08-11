import { NextResponse } from 'next/server';

// Server-side global rooms store for Monopoly and UNO
// Keys formatted as `${game}_${roomId}`
interface RoomStoreItem {
  gameState: any;
  updatedAt: number;
}

const roomsStore: Record<string, RoomStoreItem> = {};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const game = searchParams.get('game') || 'monopoly';
  const rawRoomId = searchParams.get('roomId') || '1234';
  const roomId = rawRoomId.replace(/\D/g, '').slice(0, 4) || '1234';
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
    const { action, game, roomId: rawRoomId, gameState, playerId } = body;
    const roomId = (rawRoomId || '1234').replace(/\D/g, '').slice(0, 4) || '1234';
    const roomKey = `${game}_${roomId}`;

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

    if (action === 'leave' && roomsStore[roomKey]) {
      const current = roomsStore[roomKey].gameState;
      if (current && current.players) {
        const leavingPlayer = current.players.find((p: any) => p.id === playerId);
        const notificationMsg = leavingPlayer
          ? `⚠️ ${leavingPlayer.name} oyundan ayrıldı! Yerine 'Bot ${leavingPlayer.name} AI' atandı.`
          : '⚠️ Bir oyuncu ayrıldı, yerine Bot atandı.';

        // Replace leaving player with AI bot
        const updatedPlayers = current.players.map((p: any) => {
          if (p.id === playerId) {
            return {
              ...p,
              name: `Bot ${p.name} AI`,
              avatar: '🤖 Bot',
              isBot: true,
              ready: true,
            };
          }
          return p;
        });

        roomsStore[roomKey] = {
          gameState: {
            ...current,
            players: updatedPlayers,
            notification: notificationMsg,
            log: [notificationMsg, ...(current.log || [])],
          },
          updatedAt: Date.now(),
        };
      }
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
