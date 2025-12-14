export interface Dog {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'legendary';
  emoji: string;
  theme: string;
}

export const DOGS_COLLECTION: Dog[] = [
  {
    id: 'ridic',
    name: 'Řidič',
    description: 'Klasický hund za volantem. První ze sbírky!',
    rarity: 'common',
    emoji: '🚗',
    theme: 'driving'
  },
  {
    id: 'party-animal',
    name: 'Párty Šampion',
    description: 'Tento hund ví, jak se baví. Pivko v tlapě, úsměv na tlamě!',
    rarity: 'common',
    emoji: '🍺',
    theme: 'party'
  },
  {
    id: 'student',
    name: 'Studijní Guru',
    description: 'Má NOZ pod polštářem a paragraf v hlavě. Učí se i ve spánku!',
    rarity: 'rare',
    emoji: '📚',
    theme: 'study'
  },
  {
    id: 'dj-dog',
    name: 'DJ Woofmaster',
    description: 'Točí decky lepší než paragrafy. Drop the bass, not the case!',
    rarity: 'rare',
    emoji: '🎵',
    theme: 'music'
  },
  {
    id: 'gym-bro',
    name: 'Gym Hund',
    description: 'Cvičí právo i svaly. Právní váha? Zvedne to!',
    rarity: 'common',
    emoji: '🏋️',
    theme: 'fitness'
  },
  {
    id: 'night-owl',
    name: 'Noční Válečník',
    description: 'V klubu do rána, na přednášku ráno. Spánek je pro slabé!',
    rarity: 'rare',
    emoji: '🌙',
    theme: 'nightlife'
  },
  {
    id: 'pizza-lover',
    name: 'Pizza Hund',
    description: 'Studuje právo, ale jeho srdce patří italské kuchyni.',
    rarity: 'common',
    emoji: '🍕',
    theme: 'food'
  },
  {
    id: 'gamer',
    name: 'Pro Gamer',
    description: 'E-sporty jsou jeho život. Právo? To je jen side quest.',
    rarity: 'rare',
    emoji: '🎮',
    theme: 'gaming'
  },
  {
    id: 'coffee-addict',
    name: 'Kofeinový Démon',
    description: 'Bez kávy? Nemluv se mnou. Třetí espresso a můžeme mluvit o právu.',
    rarity: 'legendary',
    emoji: '☕',
    theme: 'coffee'
  },
  {
    id: 'professor',
    name: 'Pan Profesor',
    description: 'Legendární hund! Učí právo i ostatní hundy. Vzácný úlovek!',
    rarity: 'legendary',
    emoji: '🎓',
    theme: 'teaching'
  },
  {
    id: 'meme-lord',
    name: 'Meme Lord',
    description: 'Zná všechny právní memes. Místo paragrafů posílá gify!',
    rarity: 'common',
    emoji: '🤣',
    theme: 'internet'
  },
  {
    id: 'bookworm',
    name: 'Knihomol',
    description: 'Žije v knihovně. Má víc výpisků než přátel.',
    rarity: 'rare',
    emoji: '📖',
    theme: 'library'
  },
  {
    id: 'procrastinator',
    name: 'Procrastinator Pro',
    description: 'Deadline za hodinu? Ideální čas začít! Pracuje nejlépe pod tlakem.',
    rarity: 'common',
    emoji: '⏰',
    theme: 'procrastination'
  },
  {
    id: 'court-dog',
    name: 'Soudní Hund',
    description: 'Vzácný případ! Už vyhrál 100 případů. Legenda mezi hundy!',
    rarity: 'legendary',
    emoji: '⚖️',
    theme: 'courtroom'
  },
  {
    id: 'paragraph-detective',
    name: 'Paragrafový Detektiv',
    description: 'Najde každou skulinku v zákoně. Sherlock práva!',
    rarity: 'rare',
    emoji: '🔍',
    theme: 'investigation'
  },
  {
    id: 'energy-dog',
    name: 'Energy Hund',
    description: 'Red Bull je jeho krev. Čtyři plechovky denně minimálně.',
    rarity: 'common',
    emoji: '⚡',
    theme: 'energy'
  },
  {
    id: 'netflix-dog',
    name: 'Netflix Hund',
    description: 'Právnické seriály = studium, ne? Suits odkoukané 3x.',
    rarity: 'common',
    emoji: '📺',
    theme: 'entertainment'
  },
  {
    id: 'sports-fan',
    name: 'Sportovní Fanda',
    description: 'Právo je super, ale hokej je život. Dres pod košilí!',
    rarity: 'rare',
    emoji: '⚽',
    theme: 'sports'
  },
  {
    id: 'traveler',
    name: 'Cestovatel',
    description: 'Erasmus warrior! Studuje právo v 5 zemích najednou.',
    rarity: 'rare',
    emoji: '✈️',
    theme: 'travel'
  },
  {
    id: 'romantic',
    name: 'Romantický Hund',
    description: 'Našel lásku i na právu. Tohle je ten pravý zázrak!',
    rarity: 'rare',
    emoji: '💖',
    theme: 'romance'
  }
];

export function getDogById(id: string): Dog | undefined {
  return DOGS_COLLECTION.find(dog => dog.id === id);
}

export function getRandomUnlockedDog(unlockedIds: string[]): Dog {
  const locked = DOGS_COLLECTION.filter(dog => !unlockedIds.includes(dog.id));

  // If all unlocked, return random
  if (locked.length === 0) {
    return DOGS_COLLECTION[Math.floor(Math.random() * DOGS_COLLECTION.length)];
  }

  // Weight by rarity (legendary rarer to get)
  const weighted = locked.flatMap(dog => {
    switch (dog.rarity) {
      case 'common': return Array(5).fill(dog);
      case 'rare': return Array(2).fill(dog);
      case 'legendary': return [dog];
      default: return [dog];
    }
  });

  return weighted[Math.floor(Math.random() * weighted.length)];
}
