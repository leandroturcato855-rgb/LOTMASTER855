import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomNumbers(count: number = 10): number[] {
  const numbers: number[] = [];
  const available = Array.from({ length: 25 }, (_, i) => i + 1);
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    numbers.push(available[randomIndex]);
    available.splice(randomIndex, 1);
  }
  return numbers.sort((a, b) => a - b);
}

export function generateGameNumber(playerName: string, existingGames: Array<{ playerName: string; gameNumber: number }>): number {
  const playerGames = existingGames.filter((g) => g.playerName === playerName);
  return playerGames.length + 1;
}

export function formatGameLabel(playerName: string, gameNumber: number): string {
  return `${playerName} | ${String(gameNumber).padStart(2, "0")}`;
}

export function sortGamesByName<T extends { playerName: string }>(games: T[]): T[] {
  return [...games].sort((a, b) => a.playerName.localeCompare(b.playerName));
}
