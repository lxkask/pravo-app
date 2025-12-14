'use client'

import { useState, useEffect } from 'react';
import { Dog, DOGS_COLLECTION, getRandomUnlockedDog } from '@/lib/dogs-collection';

const STORAGE_KEY = 'pravo-app-dog-collection';

interface DogCollectionState {
  unlockedDogs: string[];
  lastSeenDog: string | null;
  totalSeen: number;
}

export function useDogCollection() {
  const [state, setState] = useState<DogCollectionState>({
    unlockedDogs: [],
    lastSeenDog: null,
    totalSeen: 0
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setState(parsed);
      } catch (e) {
        console.error('Failed to parse dog collection state:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const unlockRandomDog = (): { dog: Dog; isNew: boolean } => {
    const dog = getRandomUnlockedDog(state.unlockedDogs);
    const wasAlreadyUnlocked = state.unlockedDogs.includes(dog.id);

    setState(prev => ({
      unlockedDogs: prev.unlockedDogs.includes(dog.id)
        ? prev.unlockedDogs
        : [...prev.unlockedDogs, dog.id],
      lastSeenDog: dog.id,
      totalSeen: prev.totalSeen + 1
    }));

    return { dog, isNew: !wasAlreadyUnlocked };
  };

  const isDogUnlocked = (dogId: string): boolean => {
    return state.unlockedDogs.includes(dogId);
  };

  const getUnlockedCount = (): number => {
    return state.unlockedDogs.length;
  };

  const getTotalCount = (): number => {
    return DOGS_COLLECTION.length;
  };

  const getUnlockedDogs = (): Dog[] => {
    return DOGS_COLLECTION.filter(dog => state.unlockedDogs.includes(dog.id));
  };

  const getLockedDogs = (): Dog[] => {
    return DOGS_COLLECTION.filter(dog => !state.unlockedDogs.includes(dog.id));
  };

  const isCollectionComplete = (): boolean => {
    return state.unlockedDogs.length === DOGS_COLLECTION.length;
  };

  const resetCollection = () => {
    setState({
      unlockedDogs: [],
      lastSeenDog: null,
      totalSeen: 0
    });
  };

  return {
    unlockedDogs: state.unlockedDogs,
    lastSeenDog: state.lastSeenDog,
    totalSeen: state.totalSeen,
    unlockRandomDog,
    isDogUnlocked,
    getUnlockedCount,
    getTotalCount,
    getUnlockedDogs,
    getLockedDogs,
    isCollectionComplete,
    resetCollection,
    isLoaded
  };
}
