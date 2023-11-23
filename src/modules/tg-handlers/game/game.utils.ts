import { shuffle } from 'lodash';

function buildInxArray(count: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < count; i++) {
    result.push(i);
  }
  return result;
}

export function hasWrongPlayers(players: number[]): boolean {
  return players.some((it, indx) => it === indx);
}

export function createGamePairs(playerCount: number): number[] {
  if (playerCount < 2) {
    throw new Error('Lack of players');
  }
  let players = buildInxArray(playerCount);
  while (hasWrongPlayers(players)) {
    players = shuffle(players);
  }
  return players;
}
