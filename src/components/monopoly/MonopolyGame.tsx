'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MonopolyGameState, MonopolyProperty, Player, KuzenProfile } from '@/types';
import { MONOPOLY_PROPERTIES } from '@/lib/initialData';
import { RoomLobby } from '@/components/RoomLobby';
import { MonopolyBoardView } from './MonopolyBoardView';
import { DiceAnimation } from './DiceAnimation';
import { PropertyCardModal } from './PropertyCardModal';
import { RoomBroadcaster } from '@/lib/multiplayer';
import { soundFx } from '@/lib/audio';
import confetti from 'canvas-confetti';
import { Trophy, History, Wallet, UserCheck, Bot as BotIcon, ArrowRight, AlertTriangle, Flame } from 'lucide-react';

const CHANCE_CARDS = [
  { text: 'Duru sana doğum günü hediyesi gönderdi! +100 ₺ Al', money: 100 },
  { text: 'Ömer ile Uno oynarken ceza aldın! -50 ₺ Öde', money: -50 },
  { text: 'Çınar sana oyunda hızlandırma iksiri sundu! +150 ₺ Al', money: 150 },
  { text: 'Kapadokya turizm ödülü kazandın! +200 ₺ Al', money: 200 },
  { text: 'Köprü geçiş ücreti ve trafik cezası. -75 ₺ Öde', money: -75 },
];

interface MonopolyGameProps {
  profiles?: Record<'duru' | 'omer' | 'cinar', KuzenProfile>;
}

export const MonopolyGame: React.FC<MonopolyGameProps> = ({ profiles }) => {
  const [myPlayerId] = useState<string>(() => `player_${Math.random().toString(36).substr(2, 9)}`);
  const [roomId, setRoomId] = useState<string>('1234');
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = useState<MonopolyProperty | null>(null);
  const [isLandedTileModal, setIsLandedTileModal] = useState<boolean>(false);
  const [isRolling, setIsRolling] = useState(false);

  const [gameState, setGameState] = useState<MonopolyGameState>({
    roomId: '1234',
    players: [],
    properties: MONOPOLY_PROPERTIES,
    currentPlayerIndex: 0,
    dice: [1, 1],
    isDiceRolled: false,
    gameStatus: 'lobby',
    log: ['Monopoly canlı odasına hoş geldiniz!'],
    freeParkingPool: 0,
    notification: null,
  });

  const broadcasterRef = useRef<RoomBroadcaster | null>(null);

  useEffect(() => {
    broadcasterRef.current = new RoomBroadcaster('monopoly', roomId, (newState) => {
      if (newState) {
        setGameState(newState as MonopolyGameState);
      }
    });

    return () => {
      broadcasterRef.current?.destroy();
    };
  }, [roomId]);

  const updateState = (newState: MonopolyGameState) => {
    setGameState(newState);
    broadcasterRef.current?.broadcast(newState);
  };

  const handleJoinRoom = async (name: string, avatar: string, customRoomId?: string) => {
    const activeRoom = (customRoomId || roomId).replace(/\D/g, '').slice(0, 4) || '1234';
    if (customRoomId && customRoomId !== roomId) {
      setRoomId(activeRoom);
    }

    let existingPlayers: Player[] = [];
    let currentProperties = MONOPOLY_PROPERTIES;
    let currentStatus: 'lobby' | 'playing' | 'ended' = 'lobby';
    let currentLogs = [`${name} odaya katıldı!`];

    try {
      const res = await fetch(`/api/rooms?game=monopoly&roomId=${activeRoom}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.found && data.gameState) {
          existingPlayers = data.gameState.players || [];
          currentProperties = data.gameState.properties || MONOPOLY_PROPERTIES;
          currentStatus = data.gameState.gameStatus || 'lobby';
          currentLogs = [`${name} odaya katıldı!`, ...(data.gameState.log || [])];
        }
      }
    } catch (e) {
      console.error('Fetch existing room error', e);
    }

    const colors = ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#d946ef'];
    const newPlayer: Player = {
      id: myPlayerId,
      name,
      avatar,
      color: colors[existingPlayers.length % colors.length],
      money: 1500,
      position: 0,
      inJail: false,
      isBankrupt: false,
      ready: true,
    };

    const updatedPlayers = [...existingPlayers.filter((p) => p.id !== myPlayerId), newPlayer];
    const realPlayers = updatedPlayers.filter((p) => !p.isBot);
    const autoStart = realPlayers.length >= 2 && realPlayers.every((p) => p.ready);

    const nextState: MonopolyGameState = {
      ...gameState,
      roomId: activeRoom,
      players: updatedPlayers,
      properties: currentProperties,
      gameStatus: autoStart ? 'playing' : currentStatus,
      log: autoStart ? ['🎮 Tüm oyuncular hazır! Oyun otomatik başladı! 🎲', ...currentLogs] : currentLogs,
    };

    setIsJoined(true);
    updateState(nextState);
  };

  const handleToggleReady = () => {
    const updatedPlayers = gameState.players.map((p) =>
      p.id === myPlayerId ? { ...p, ready: !p.ready } : p
    );

    const realPlayers = updatedPlayers.filter((p) => !p.isBot);
    const autoStart = realPlayers.length >= 2 && realPlayers.every((p) => p.ready);

    if (autoStart) {
      soundFx.playWinFanfare();
    }

    updateState({
      ...gameState,
      players: updatedPlayers,
      gameStatus: autoStart ? 'playing' : gameState.gameStatus,
      log: autoStart ? ['🎮 Tüm oyuncular hazırım butonuna bastı! Oyun otomatik başladı! 🎲', ...gameState.log] : gameState.log,
    });
  };

  const handleAddBot = () => {
    const botNames = ['Bot Duru AI', 'Bot Ömer AI', 'Bot Çınar AI', 'Bot Zeki', 'Bot Şanslı'];
    const colors = ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#d946ef'];
    const botId = `bot_${Math.random().toString(36).substr(2, 6)}`;
    const botName = botNames[gameState.players.length % botNames.length];

    const botPlayer: Player = {
      id: botId,
      name: botName,
      avatar: '🤖 Bot',
      color: colors[gameState.players.length % colors.length],
      isBot: true,
      money: 1500,
      position: 0,
      inJail: false,
      isBankrupt: false,
      ready: true,
    };

    const updatedPlayers = [...gameState.players, botPlayer];
    const realPlayers = updatedPlayers.filter((p) => !p.isBot);
    const autoStart = realPlayers.length >= 1 && realPlayers.every((p) => p.ready);

    updateState({
      ...gameState,
      players: updatedPlayers,
      gameStatus: autoStart && updatedPlayers.length >= 2 ? 'playing' : gameState.gameStatus,
      log: [`${botName} oyuna bot olarak eklendi!`, ...gameState.log],
    });
  };

  const handleRemovePlayer = (id: string) => {
    updateState({
      ...gameState,
      players: gameState.players.filter((p) => p.id !== id),
    });
  };

  const handleStartGame = () => {
    soundFx.playWinFanfare();
    updateState({
      ...gameState,
      gameStatus: 'playing',
      currentPlayerIndex: 0,
      log: ['🎮 Monopoly oyunu başladı! İlk oyuncu zarlarını atıyor...', ...gameState.log],
    });
  };

  const handleLeaveRoom = () => {
    broadcasterRef.current?.leaveRoom(myPlayerId);
    setIsJoined(false);
  };

  const handleRollDice = () => {
    if (gameState.gameStatus !== 'playing' || gameState.isDiceRolled) return;

    setIsRolling(true);
    soundFx.playDice();

    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const totalSteps = d1 + d2;

      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      let newPosition = ((currentPlayer.position || 0) + totalSteps) % gameState.properties.length;
      let newMoney = currentPlayer.money || 0;
      let logMsg = `${currentPlayer.name} zarları attı: ${d1} ve ${d2} (${totalSteps} adım).`;

      if (newPosition < (currentPlayer.position || 0)) {
        newMoney += 200;
        logMsg += ' Başlangıç noktasından geçti, +200 ₺ kazandı!';
      }

      const currentTile = gameState.properties[newPosition];
      logMsg += ` ${currentTile.name} karesine geldi.`;

      let updatedProperties = [...gameState.properties];
      let updatedPlayersList = [...gameState.players];

      if (currentTile.ownerId && currentTile.ownerId !== currentPlayer.id) {
        const ownerIndex = updatedPlayersList.findIndex((p) => p.id === currentTile.ownerId);
        if (ownerIndex !== -1 && !updatedPlayersList[ownerIndex].isBankrupt) {
          const rentAmount = currentTile.rent;
          newMoney -= rentAmount;
          soundFx.playPenaltyBuzzer();
          logMsg += ` ${updatedPlayersList[ownerIndex].name} kullanıcısına ${rentAmount} ₺ kira ödedi!`;

          updatedPlayersList[ownerIndex] = {
            ...updatedPlayersList[ownerIndex],
            money: (updatedPlayersList[ownerIndex].money || 0) + rentAmount,
          };
        }
      }

      if (currentTile.type === 'special' && currentTile.name.includes('ŞANS')) {
        const card = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
        newMoney += card.money;
        logMsg += ` Şans kartı çekti: ${card.text}`;
      }

      if (currentTile.type === 'special' && currentTile.name.includes('KODE')) {
        newPosition = 10;
        logMsg += ' Hapishaneye gönderildi!';
      }

      const updatedPlayers = updatedPlayersList.map((p, idx) =>
        idx === gameState.currentPlayerIndex
          ? { ...p, position: newPosition, money: newMoney }
          : p
      );

      setIsRolling(false);
      updateState({
        ...gameState,
        players: updatedPlayers,
        properties: updatedProperties,
        dice: [d1, d2],
        isDiceRolled: true,
        log: [logMsg, ...gameState.log],
      });

      if (!currentTile.ownerId && currentTile.price > 0) {
        setSelectedProperty(currentTile);
        setIsLandedTileModal(true);
      }
    }, 1000);
  };

  const handleNextTurn = () => {
    let nextIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    while (gameState.players[nextIndex]?.isBankrupt && gameState.players.filter((p) => !p.isBankrupt).length > 1) {
      nextIndex = (nextIndex + 1) % gameState.players.length;
    }

    const nextPlayer = gameState.players[nextIndex];
    soundFx.playClick();

    updateState({
      ...gameState,
      currentPlayerIndex: nextIndex,
      isDiceRolled: false,
      log: [`Sıra ${nextPlayer.name}'e geçti.`, ...gameState.log],
    });
  };

  const handleBuyProperty = (property: MonopolyProperty) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    if (currentPlayer.position !== property.id) {
      alert('Sadece zarınızın durduğu karedeki yeri satın alabilirsiniz!');
      return;
    }

    if ((currentPlayer.money || 0) < property.price) return;

    const updatedMoney = (currentPlayer.money || 0) - property.price;
    const updatedProperties = gameState.properties.map((p) =>
      p.id === property.id ? { ...p, ownerId: currentPlayer.id } : p
    );
    const updatedPlayers = gameState.players.map((p, idx) =>
      idx === gameState.currentPlayerIndex ? { ...p, money: updatedMoney } : p
    );

    updateState({
      ...gameState,
      properties: updatedProperties,
      players: updatedPlayers,
      log: [`${currentPlayer.name}, ${property.name} mülkünü ${property.price} ₺ karşılığında satın aldı! 🎉`, ...gameState.log],
    });
  };

  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      if (currentPlayer && currentPlayer.isBot && !isRolling) {
        if (!gameState.isDiceRolled) {
          const timer = setTimeout(() => handleRollDice(), 1500);
          return () => clearTimeout(timer);
        } else {
          const currentTile = gameState.properties[currentPlayer.position || 0];
          if (!currentTile.ownerId && currentTile.price > 0 && (currentPlayer.money || 0) >= currentTile.price) {
            handleBuyProperty(currentTile);
          }
          const timer = setTimeout(() => handleNextTurn(), 2200);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [gameState.currentPlayerIndex, gameState.isDiceRolled, gameState.gameStatus]);

  if (!isJoined || gameState.gameStatus === 'lobby') {
    return (
      <RoomLobby
        gameTitle="Monopoly"
        gameIcon="🎲"
        gameDescription="Türkiye'nin en güzel turizm cennetleri ve dünya metropolleriyle donatılmış 8 kişilik Resmi Monopoly macerası!"
        players={gameState.players}
        myPlayerId={myPlayerId}
        roomId={roomId}
        isJoined={isJoined}
        profiles={profiles}
        onJoinRoom={handleJoinRoom}
        onToggleReady={handleToggleReady}
        onAddBot={handleAddBot}
        onRemovePlayer={handleRemovePlayer}
        onStartGame={handleStartGame}
        onLeaveRoom={handleLeaveRoom}
        isHost={gameState.players[0]?.id === myPlayerId}
        maxPlayers={8}
      />
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === myPlayerId;

  return (
    <div className="min-h-[calc(100vh-5rem)] py-6 px-3 sm:px-6 bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {gameState.notification && (
          <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-500/50 text-amber-200 font-extrabold text-sm sm:text-base text-center shadow-lg animate-pulse flex items-center justify-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>{gameState.notification}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-3xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shadow-md"
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

          <div className="flex items-center justify-center">
            <DiceAnimation
              dice={gameState.dice}
              isRolling={isRolling}
              onRoll={handleRollDice}
              disabled={!isMyTurn || gameState.isDiceRolled}
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={handleNextTurn}
              disabled={!isMyTurn || !gameState.isDiceRolled}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition ${
                isMyTurn && gameState.isDiceRolled
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg cursor-pointer hover:scale-105'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Sırayı Devret</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <MonopolyBoardView
              properties={gameState.properties}
              players={gameState.players}
              onTileClick={(prop) => {
                setSelectedProperty(prop);
                setIsLandedTileModal(currentPlayer?.position === prop.id && !gameState.isDiceRolled);
              }}
            />
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 backdrop-blur-md space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>Oyuncu Bakiyeleri ({gameState.players.length})</span>
              </div>
              <div className="space-y-2">
                {gameState.players.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-xs ${
                      idx === gameState.currentPlayerIndex
                        ? 'bg-purple-950/40 border-purple-500/50 text-white font-bold'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                      <span>{p.name}</span>
                      {p.isBot && <span className="text-[9px] px-1 bg-cyan-500/20 text-cyan-300 rounded">BOT</span>}
                    </div>
                    <div className="font-mono font-extrabold text-emerald-400">
                      {p.money} ₺
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 backdrop-blur-md space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                <History className="w-4 h-4 text-purple-400" />
                <span>Oyun Geçmişi</span>
              </div>
              <div className="h-44 overflow-y-auto space-y-1.5 pr-2 text-xs text-slate-400 font-medium">
                {gameState.log.map((logItem, i) => (
                  <div key={i} className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    {logItem}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <PropertyCardModal
          property={selectedProperty}
          players={gameState.players}
          currentPlayer={currentPlayer}
          isLandedTile={isLandedTileModal}
          onBuy={handleBuyProperty}
          onClose={() => {
            setSelectedProperty(null);
            setIsLandedTileModal(false);
          }}
        />

      </div>
    </div>
  );
};
