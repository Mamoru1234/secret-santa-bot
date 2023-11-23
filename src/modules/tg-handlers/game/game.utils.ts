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

export function checkPair(players: number[], pair: [number, number]): boolean {
  return players[pair[0]] === pair[1] || players[pair[1]] === pair[0];
}

function hasInvalidPair(players: number[], pairs: [number, number][]): boolean {
  return pairs.some((it) => checkPair(players, it));
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

export function createGameWithoutPairs(playerCount: number, pairs: [number, number][]) {
  if (playerCount < 4) {
    throw new Error('Lack of players');
  }
  let game = createGamePairs(playerCount);
  while (hasInvalidPair(game, pairs)) {
    game = createGamePairs(playerCount);
  }
  return game;
}
