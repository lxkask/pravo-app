'use client'

import { useDogCollection } from '@/hooks/use-dog-collection';
import { DOGS_COLLECTION, Dog } from '@/lib/dogs-collection';
import { DogAnimations } from '@/components/dog-animations';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';

function DogCard({ dog, isUnlocked }: { dog: Dog; isUnlocked: boolean }) {
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

  if (!isUnlocked) {
    return (
      <div className="relative bg-slate-800 dark:bg-slate-900 rounded-2xl p-6 border-4 border-slate-700 aspect-square flex flex-col items-center justify-center">
        <div className="text-6xl opacity-20 filter blur-sm">🐕</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl">🔒</div>
        </div>
        <div className="mt-4 text-sm text-slate-500 dark:text-slate-600 text-center">
          ???
        </div>
      </div>
    );
  }

  const AnimationComponent = DogAnimations[dog.id as keyof typeof DogAnimations];

  return (
    <div
      className={`bg-gradient-to-br ${rarityColors[dog.rarity]} rounded-2xl p-6 border-4 ${rarityBorders[dog.rarity]} shadow-xl hover:scale-105 transition-transform duration-200 flex flex-col`}
    >
      {/* Animation Container - Fixed Height */}
      <div className="h-48 overflow-hidden rounded-xl mb-3 relative flex items-center justify-center bg-black/10">
        {AnimationComponent ? (
          <div className="absolute inset-0 flex items-center justify-center scale-[0.6] origin-center">
            <AnimationComponent />
          </div>
        ) : (
          <div className="text-6xl animate-bounce">{dog.emoji}</div>
        )}
      </div>

      {/* Card Content */}
      <div className="text-center">
        <div className="text-xs font-bold bg-white/20 text-white px-2 py-1 rounded-full uppercase inline-block mb-2">
          {dog.rarity === 'legendary' ? '⭐ Legendary' : dog.rarity === 'rare' ? '💎 Rare' : 'Common'}
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{dog.name}</h3>
        <p className="text-sm text-white/80 leading-relaxed">{dog.description}</p>
      </div>
    </div>
  );
}

function DogCollectionContent() {
  const {
    isDogUnlocked,
    getUnlockedCount,
    getTotalCount,
    isCollectionComplete,
    resetCollection,
    isLoaded
  } = useDogCollection();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-2xl">Načítání sbírky...</div>
      </div>
    );
  }

  const unlockedCount = getUnlockedCount();
  const totalCount = getTotalCount();
  const progress = (unlockedCount / totalCount) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Zpět na hlavní stránku
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            🐕 Sběr Hundů
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            Dokončuj testy a sbírej všechny hundy! Každý má svůj příběh.
          </p>

          {/* Progress bar */}
          <div className="bg-slate-200 dark:bg-slate-800 rounded-full h-8 overflow-hidden mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-full flex items-center justify-center text-white font-bold text-sm transition-all duration-500"
              style={{ width: `${progress}%` }}
            >
              {unlockedCount > 0 && `${unlockedCount}/${totalCount}`}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {isCollectionComplete() ? (
                <span className="text-green-600 dark:text-green-400 font-bold">
                  🎉 Kompletní sbírka! Máš všechny hundy!
                </span>
              ) : (
                <span>
                  Odemkl jsi <strong>{unlockedCount}</strong> z <strong>{totalCount}</strong> hundů
                </span>
              )}
            </div>

            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={resetCollection}
                className="text-xs text-slate-500 hover:text-red-600 dark:hover:text-red-400"
              >
                Reset sbírky (dev)
              </button>
            )}
          </div>
        </div>

        {/* Rarity sections */}
        <div className="space-y-12">
          {/* Legendary */}
          <div>
            <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
              ⭐ Legendární Hundi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DOGS_COLLECTION.filter(d => d.rarity === 'legendary').map(dog => (
                <DogCard key={dog.id} dog={dog} isUnlocked={isDogUnlocked(dog.id)} />
              ))}
            </div>
          </div>

          {/* Rare */}
          <div>
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
              💎 Vzácní Hundi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DOGS_COLLECTION.filter(d => d.rarity === 'rare').map(dog => (
                <DogCard key={dog.id} dog={dog} isUnlocked={isDogUnlocked(dog.id)} />
              ))}
            </div>
          </div>

          {/* Common */}
          <div>
            <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-4 flex items-center gap-2">
              🐾 Běžní Hundi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DOGS_COLLECTION.filter(d => d.rarity === 'common').map(dog => (
                <DogCard key={dog.id} dog={dog} isUnlocked={isDogUnlocked(dog.id)} />
              ))}
            </div>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">💡 Tip</h3>
          <p className="text-blue-800 dark:text-blue-200">
            Dokončuj průběžný test opakovaně a odemykej nové hundy! Každý dokončený test ti dá šanci na nového hunda.
            Legendární hundi jsou velmi vzácní!
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HundyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Načítání...</div>}>
      <DogCollectionContent />
    </Suspense>
  );
}
