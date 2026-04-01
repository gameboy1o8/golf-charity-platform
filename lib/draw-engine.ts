export function generateDrawNumbers(count: number = 5, max: number = 45): number[] {
  const numbers = new Set<number>()
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * max) + 1)
  }
  return Array.from(numbers).sort((a, b) => a - b)
}

export function countMatches(userNumbers: number[], drawnNumbers: number[]): number {
  return userNumbers.filter(n => drawnNumbers.includes(n)).length
}

export function calculatePrizes(
  poolTotal: number,
  jackpotRollover: number = 0
): { jackpot: number; pool4: number; pool3: number } {
  return {
    jackpot: poolTotal * 0.4 + jackpotRollover,
    pool4: poolTotal * 0.35,
    pool3: poolTotal * 0.25,
  }
}