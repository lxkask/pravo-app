'use client'

import { Dog } from '@/lib/dogs-collection';
import { useEffect, useState } from 'react';

interface DogUnlockNotificationProps {
  dog: Dog;
  isNewUnlock: boolean;
  onClose?: () => void;
}

export function DogUnlockNotification({ dog, isNewUnlock, onClose }: DogUnlockNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [onClose]);

  const rarityColors = {
    common: 'from-slate-500 to-slate-700',
    rare: 'from-blue-500 to-blue-700',
    legendary: 'from-yellow-500 to-yellow-700'
  };

  const rarityBorders = {
    common: 'border-slate-400',
    rare: 'border-blue-400',
    legendary: 'border-yellow-400'
  };

  const rarityGlow = {
    common: '',
    rare: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
    legendary: 'shadow-[0_0_30px_rgba(234,179,8,0.7)] animate-pulse'
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
    >
      <div
        className={`bg-gradient-to-r ${rarityColors[dog.rarity]} ${rarityGlow[dog.rarity]} border-4 ${rarityBorders[dog.rarity]} rounded-2xl shadow-2xl max-w-sm p-6`}
      >
        <div className="flex items-start gap-4">
          <div className="text-6xl animate-bounce flex-shrink-0">{dog.emoji}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {isNewUnlock && (
                <span className="text-xs font-bold bg-green-500 text-white px-2 py-1 rounded-full animate-pulse">
                  NOVÝ!
                </span>
              )}
              <span className="text-xs font-bold bg-white/20 text-white px-2 py-1 rounded-full uppercase">
                {dog.rarity === 'legendary' ? '⭐ Legendary' : dog.rarity === 'rare' ? '💎 Rare' : 'Common'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{dog.name}</h3>
            <p className="text-sm text-white/90">{dog.description}</p>
          </div>
        </div>

        {isNewUnlock && dog.rarity === 'legendary' && (
          <div className="mt-4 text-center">
            <div className="text-2xl animate-bounce">🎉 GRATULUJEME! 🎉</div>
            <div className="text-sm text-white/80 mt-1">Odemkli jste legendárního hunda!</div>
          </div>
        )}
      </div>
    </div>
  );
}
