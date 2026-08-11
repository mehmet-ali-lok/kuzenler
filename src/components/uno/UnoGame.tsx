'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UnoGameState, UnoCard, UnoColor, Player, KuzenProfile } from '@/types';
import { RoomLobby } from '@/components/RoomLobby';
import { UnoCardView } from './UnoCardView';
import { RoomBroadcaster } from '@/lib/multiplayer';
import { soundFx } from '@/lib/audio';
import confetti from 'canvas-confetti';
import { Flame, ShieldAlert, RotateCw, VolumeX, Sparkles, Layers, AlertTriangle } from 'lucide-react';

const COLORS: UnoColor[] = ['red', 'blue', 'green', 'yellow'];

const GENERATE_DECK = (): UnoCard[] => {
  const deck: UnoCard[] = [];
  let idCounter = 1;

  COLORS.forEach((color) => {
    for (let i = 0; i <= 9; i++) {
      deck.push({ id: `c_${idCounter++}`, color, value: `${i}` as UnoCard['value'] });
      if (i !== 0) {
        deck.push({ id: `c_${idCounter++}`, color, value: `${i}` as UnoCard['value'] });
      }
    }
    ['skip', 'reverse', 'draw2'].forEach((val) => {
      deck.push({ id: `c_${idCounter++}`, color, value: val as UnoCard['value'] });
      deck.push({ id: `c_${idCounter++}`, color, value: val as UnoCard['value'] });
    });
  });

  for (let i = 0; i < 4; i++) {
    deck.push({ id: `c_${idCounter++}`, color: 'wild', value: 'wild' });
    deck.push({ id: `c_${idCounter++}`, color: 'wild', value: 'wild_draw4' });
  }

  ['silence', 'mega_draw_all', 'hand_swap', 'kuzen_curse', 'lock_color'].forEach((penalty) => {
    for (let i = 0; i < 2; i++) {
      deck.push({ id: `c_${idCounter++}`, color: 'wild', value: penalty as UnoCard['value'] });
    }
  });

  return deck.sort(() => Math.random() - 0.5);
};

interface UnoGameProps {
  profiles?: Record<'duru' | 'omer' | 'cinar', KuzenProfile>;
}

export const UnoGame: React.FC<UnoGameProps> = ({ profiles }) => {
  const [myPlayerId] = useState<string>(() => `player_${Math.random().toString(36).substr(2, 9)}`);
  const [roomId, setRoomId] = useState<string>('1234');
  const [isJoined, setIsJoined] = useState<boolean>(false);

  const [gameState, setGameState] = useState<UnoGameState>({
    roomId: '1234',
    players: [],
    drawDeck: [],
    discardPile: [],
    currentColor: 'red',
    currentValue: '7',
    currentPlayerIndex: 0,
    direction: 1,
    gameStatus: 'lobby',
    log: ['Bol Cezalı UNO canlı odasına hoş geldiniz!'],
    unoDeclared: {},
    notification: null,
  });

  const broadcasterRef = useRef<RoomBroadcaster | null>(null);

  useEffect(() => {
    broadcasterRef.current = new RoomBroadcaster('uno', roomId, (newState) => {
      if (newState) {
        setGameState(newState as UnoGameState);
      }
    });

    return () => {
      broadcasterRef.current?.destroy();
    };
  }, [roomId]);

  const updateState = (newState: UnoGameState) => {
    setGameState(newState);
    broadcasterRef.current?.broadcast(newState);
  };

  const handleJoinRoom = async (name: string, avatar: string, customRoomId?: string) => {
    const activeRoom = (customRoomId || roomId).replace(/\D/g, '').slice(0, 4) || '1234';
    if (customRoomId && customRoomId !== roomId) {
      setRoomId(activeRoom);
    }

    let existingPlayers: Player[] = [];
    let currentStatus: 'lobby' | 'playing' | 'ended' = 'lobby';
    let currentLogs = [`${name} UNO odasına katıldı!`];

    try {
      const res = await fetch(`/api/rooms?game=uno&roomId=${activeRoom}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.found && data.gameState) {
          existingPlayers = data.gameState.players || [];
          currentStatus = data.gameState.gameStatus || 'lobby';
          currentLogs = [`${name} UNO odasına katıldı!`, ...(data.gameState.log || [])];
        }
      }
    } catch (e) {
      console.error('Fetch UNO room error', e);
    }

    const playerColors = ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#d946ef'];
    const newPlayer: Player = {
      id: myPlayerId,
      name,
      avatar,
      color: playerColors[existingPlayers.length % playerColors.length],
      cards: [],
      ready: true,
    };

    const updatedPlayers = [...existingPlayers.filter((p) => p.id !== myPlayerId), newPlayer];
    const realPlayers = updatedPlayers.filter((p) => !p.isBot);
    const autoStart = realPlayers.length >= 2 && realPlayers.every((p) => p.ready);

    let deck = gameState.drawDeck;
    let discard = gameState.discardPile;
    if (autoStart && deck.length === 0) {
      const fullDeck = GENERATE_DECK();
      updatedPlayers.forEach((p) => {
        p.cards = fullDeck.splice(0, 7);
      });
      const topCard = fullDeck.pop() || { id: 'top_1', color: 'red', value: '5' };
      deck = fullDeck;
      discard = [topCard];
    }

    setIsJoined(true);
    updateState({
      ...gameState,
      roomId: activeRoom,
      players: updatedPlayers,
      drawDeck: deck,
      discardPile: discard,
      gameStatus: autoStart ? 'playing' : currentStatus,
      log: autoStart ? ['🔥 Tüm oyuncular hazır! Bol Cezalı UNO otomatik başladı.', ...currentLogs] : currentLogs,
    });
  };

  const handleToggleReady = () => {
    const updatedPlayers = gameState.players.map((p) =>
      p.id === myPlayerId ? { ...p, ready: !p.ready } : p
    );

    const realPlayers = updatedPlayers.filter((p) => !p.isBot);
    const autoStart = realPlayers.length >= 2 && realPlayers.every((p) => p.ready);

    let deck = gameState.drawDeck;
    let discard = gameState.discardPile;
    if (autoStart && deck.length === 0) {
      soundFx.playWinFanfare();
      const fullDeck = GENERATE_DECK();
      updatedPlayers.forEach((p) => {
        p.cards = fullDeck.splice(0, 7);
      });
      const topCard = fullDeck.pop() || { id: 'top_1', color: 'red', value: '5' };
      deck = fullDeck;
      discard = [topCard];
    }

    updateState({
      ...gameState,
      players: updatedPlayers,
      drawDeck: deck,
      discardPile: discard,
      gameStatus: autoStart ? 'playing' : gameState.gameStatus,
      log: autoStart ? ['🔥 Tüm oyuncular hazırım butonuna bastı! Oyun başladı!', ...gameState.log] : gameState.log,
    });
  };

  const handleAddBot = () => {
    const botNames = ['Bot Duru AI', 'Bot Ömer AI', 'Bot Çınar AI', 'Bot Zeki', 'Bot Şanslı'];
    const playerColors = ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#d946ef'];
    const botId = `bot_${Math.random().toString(36).substr(2, 6)}`;
    const botName = botNames[gameState.players.length % botNames.length];

    const botPlayer: Player = {
      id: botId,
      name: botName,
      avatar: '🤖 Bot',
      color: playerColors[gameState.players.length % playerColors.length],
      isBot: true,
      cards: [],
      ready: true,
    };

    updateState({
      ...gameState,
      players: [...gameState.players, botPlayer],
      log: [`${botName} UNO'ya bot olarak eklendi!`, ...gameState.log],
    });
  };

  const handleStartGame = () => {
    soundFx.playWinFanfare();
    const fullDeck = GENERATE_DECK();

    const updatedPlayers = gameState.players.map((p) => ({
      ...p,
      cards: fullDeck.splice(0, 7),
    }));

    const topCard = fullDeck.pop() || { id: 'top_1', color: 'red', value: '5' };

    updateState({
      ...gameState,
      players: updatedPlayers,
      drawDeck: fullDeck,
      discardPile: [topCard],
      currentColor: topCard.color === 'wild' ? 'red' : topCard.color,
      currentValue: topCard.value,
      currentPlayerIndex: 0,
      gameStatus: 'playing',
      log: ['🔥 Bol Cezalı UNO başladı! Herkese 7 kart dağıtıldı.', ...gameState.log],
    });
  };

  const canPlayCard = (card: UnoCard): boolean => {
    if (card.color === 'wild') return true;
    if (card.color === gameState.currentColor) return true;
    if (card.value === gameState.currentValue) return true;
    return false;
  };

  const handlePlayCard = (card: UnoCard) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.id !== myPlayerId && !currentPlayer.isBot) return;
    if (!canPlayCard(card)) return;

    soundFx.playCardPlay();
    let nextIndex = (gameState.currentPlayerIndex + gameState.direction + gameState.players.length) % gameState.players.length;
    let nextDirection = gameState.direction;
    let penaltyMessage: string | null = null;
    let updatedPlayers = [...gameState.players];
    let deck = [...gameState.drawDeck];

    updatedPlayers[gameState.currentPlayerIndex].cards = (currentPlayer.cards || []).filter((c) => c.id !== card.id);

    if (card.value === 'silence') {
      soundFx.playPenaltyBuzzer();
      penaltyMessage = '⚡ SESSİZLİK CEZASI! Kimse konuşamaz, konuşan +2 kart çeker!';
    } else if (card.value === 'mega_draw_all') {
      soundFx.playPenaltyBuzzer();
      penaltyMessage = '💥 TÜM MASAYA CEZA! Oynayan hariç herkes 2 kart çekti!';
      updatedPlayers = updatedPlayers.map((p, idx) => {
        if (idx === gameState.currentPlayerIndex) return p;
        const drawn = deck.splice(0, 2);
        return { ...p, cards: [...(p.cards || []), ...drawn] };
      });
    } else if (card.value === 'hand_swap') {
      soundFx.playPenaltyBuzzer();
      penaltyMessage = '🌀 SÜPER KASIRGA! Elindeki kartları sağındaki oyuncu ile takas ettin!';
      const targetIdx = (gameState.currentPlayerIndex + 1) % updatedPlayers.length;
      const myCards = updatedPlayers[gameState.currentPlayerIndex].cards;
      updatedPlayers[gameState.currentPlayerIndex].cards = updatedPlayers[targetIdx].cards;
      updatedPlayers[targetIdx].cards = myCards;
    } else if (card.value === 'kuzen_curse') {
      soundFx.playPenaltyBuzzer();
      penaltyMessage = '🎭 KUZEN CEZASI! Sıradaki oyuncu +3 ekstra kart çekti!';
      const drawn = deck.splice(0, 3);
      updatedPlayers[nextIndex].cards = [...(updatedPlayers[nextIndex].cards || []), ...drawn];
    } else if (card.value === 'draw2') {
      const drawn = deck.splice(0, 2);
      updatedPlayers[nextIndex].cards = [...(updatedPlayers[nextIndex].cards || []), ...drawn];
    } else if (card.value === 'wild_draw4') {
      const drawn = deck.splice(0, 4);
      updatedPlayers[nextIndex].cards = [...(updatedPlayers[nextIndex].cards || []), ...drawn];
    } else if (card.value === 'reverse') {
      nextDirection = (gameState.direction * -1) as 1 | -1;
      nextIndex = (gameState.currentPlayerIndex + nextDirection + gameState.players.length) % gameState.players.length;
    } else if (card.value === 'skip') {
      nextIndex = (nextIndex + nextDirection + gameState.players.length) % gameState.players.length;
    }

    if (updatedPlayers[gameState.currentPlayerIndex].cards?.length === 0) {
      soundFx.playWinFanfare();
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      updateState({
        ...gameState,
        players: updatedPlayers,
        gameStatus: 'ended',
        winnerId: currentPlayer.id,
        log: [`🏆 TEBRİKLER! ${currentPlayer.name} Bol Cezalı UNO Şampiyonu oldu!`, ...gameState.log],
      });
      return;
    }

    const chosenColor: UnoColor = card.color === 'wild' ? COLORS[Math.floor(Math.random() * COLORS.length)] : card.color;

    updateState({
      ...gameState,
      players: updatedPlayers,
      drawDeck: deck,
      discardPile: [card, ...gameState.discardPile],
      currentColor: chosenColor,
      currentValue: card.value,
      currentPlayerIndex: nextIndex,
      direction: nextDirection,
      activePenalty: penaltyMessage,
      log: [`${currentPlayer.name} ${card.color} ${card.value} oynadı.`, ...gameState.log],
    });
  };

  const handleDrawCard = () => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.id !== myPlayerId && !currentPlayer.isBot) return;

    soundFx.playCardPlay();
    let deck = [...gameState.drawDeck];
    if (deck.length === 0) {
      deck = GENERATE_DECK();
    }

    const drawnCard = deck.pop();
    if (!drawnCard) return;

    const updatedPlayers = gameState.players.map((p, idx) =>
      idx === gameState.currentPlayerIndex
        ? { ...p, cards: [...(p.cards || []), drawnCard] }
        : p
    );

    const nextIndex = (gameState.currentPlayerIndex + gameState.direction + gameState.players.length) % gameState.players.length;

    updateState({
      ...gameState,
      players: updatedPlayers,
      drawDeck: deck,
      currentPlayerIndex: nextIndex,
      log: [`${currentPlayer.name} kart çekti.`, ...gameState.log],
    });
  };

  const handleDeclareUno = () => {
    soundFx.playWinFanfare();
    updateState({
      ...gameState,
      unoDeclared: { ...gameState.unoDeclared, [myPlayerId]: true },
      log: [`💥 ${gameState.players.find((p) => p.id === myPlayerId)?.name} "UNO!" DİYE BAĞIRDI!`, ...gameState.log],
    });
  };

  const handleLeaveRoom = () => {
    broadcasterRef.current?.leaveRoom(myPlayerId);
    setIsJoined(false);
  };

  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      if (currentPlayer && currentPlayer.isBot) {
        const playableCard = (currentPlayer.cards || []).find((c) => canPlayCard(c));
        const timer = setTimeout(() => {
          if (playableCard) {
            handlePlayCard(playableCard);
          } else {
            handleDrawCard();
          }
        }, 1800);
        return () => clearTimeout(timer);
      }
    }
  }, [gameState.currentPlayerIndex, gameState.gameStatus]);

  if (!isJoined || gameState.gameStatus === 'lobby') {
    return (
      <RoomLobby
        gameTitle="Bol Cezalı UNO"
        gameIcon="🃏"
        gameDescription="Sessizlik cezaları, el değiştirmeler, tüm masaya kart çektirmeler ile dolu ekstradan eğlenceli ve cezalı UNO oyunu!"
        players={gameState.players}
        myPlayerId={myPlayerId}
        roomId={roomId}
        isJoined={isJoined}
        profiles={profiles}
        onJoinRoom={handleJoinRoom}
        onToggleReady={handleToggleReady}
        onAddBot={handleAddBot}
        onRemovePlayer={(id) => updateState({ ...gameState, players: gameState.players.filter((p) => p.id !== id) })}
        onStartGame={handleStartGame}
        onLeaveRoom={handleLeaveRoom}
        isHost={gameState.players[0]?.id === myPlayerId}
        maxPlayers={8}
      />
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const myPlayer = gameState.players.find((p) => p.id === myPlayerId);
  const isMyTurn = currentPlayer?.id === myPlayerId;
  const topDiscard = gameState.discardPile[0];

  return (
    <div className="min-h-[calc(100vh-5rem)] py-6 px-3 sm:px-6 bg-gradient-to-b from-slate-950 via-rose-950/20 to-slate-950">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {gameState.notification && (
          <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-500/50 text-amber-200 font-extrabold text-sm sm:text-base text-center shadow-lg animate-pulse flex items-center justify-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>{gameState.notification}</span>
          </div>
        )}

        {gameState.activePenalty && (
          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 font-extrabold text-sm sm:text-base text-center shadow-lg shadow-rose-950/50 animate-bounce flex items-center justify-center gap-3">
            <Flame className="w-6 h-6 text-rose-400" />
            <span>{gameState.activePenalty}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-3xl backdrop-blur-md items-center">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md"
              style={{ backgroundColor: currentPlayer?.color || '#ec4899' }}
            >
              {currentPlayer?.avatar.slice(0, 2)}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase">Sıradaki Oyuncu</div>
              <div className="text-lg font-black text-white flex items-center gap-2">
                <span>{currentPlayer?.name}</span>
                {isMyTurn && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Senin Sıran!</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Aktif Renk</div>
              <div
                className="w-10 h-10 rounded-2xl mx-auto border-2 border-white shadow-lg"
                style={{ backgroundColor: gameState.currentColor }}
              />
            </div>
            {topDiscard && <UnoCardView card={topDiscard} size="sm" disabled />}
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={handleDeclareUno}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:scale-105 active:scale-95 text-white font-black text-base shadow-xl shadow-rose-500/25 transition"
            >
              🔥 "UNO!" De!
            </button>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 text-center backdrop-blur-md space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400">Deste ({gameState.drawDeck.length} Kart)</div>
              <button
                onClick={handleDrawCard}
                disabled={!isMyTurn}
                className={`w-24 h-36 rounded-2xl bg-slate-950 border-2 border-slate-700 flex flex-col items-center justify-center text-white font-extrabold text-xs shadow-xl transition ${
                  isMyTurn ? 'hover:scale-105 border-purple-500 cursor-pointer' : 'opacity-60 cursor-not-allowed'
                }`}
              >
                <Layers className="w-8 h-8 text-purple-400 mb-1" />
                <span>Kart Çek</span>
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400">Atılan Kart</div>
              {topDiscard && <UnoCardView card={topDiscard} size="md" disabled />}
            </div>
          </div>
        </div>

        {myPlayer && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Senin Elindeki Kartlar ({myPlayer.cards?.length || 0})</span>
              </div>
              {!isMyTurn && <div className="text-xs text-amber-400 italic">Diğer oyuncunun hamlesi bekleniyor...</div>}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {myPlayer.cards?.map((card) => (
                <UnoCardView
                  key={card.id}
                  card={card}
                  onClick={() => handlePlayCard(card)}
                  disabled={!isMyTurn || !canPlayCard(card)}
                  size="md"
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
