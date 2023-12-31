import { uniqBy } from 'lodash';
import { checkPair, createGamePairs, createGameWithoutPairs, hasWrongPlayers } from './game.utils';

describe('game.utils', () => {
  describe('hasWrongPlayers', () => {
    function generateCases(cases: number[][], value: boolean) {
      for (const item of cases) {
        it(`${JSON.stringify(item)} has ${value}`, () => {
          expect(hasWrongPlayers(item)).toBe(value);
        });
      }
    }
    const positiveCases = [
      [2, 3, 4, 5, 1],
      [3, 4, 5, 2, 1],
      [5, 2, 3, 1, 2],
    ];
    const negativeCases = [
      [0, 1, 2, 3, 4],
      [4, 1, 2, 3, 0],
      [3, 0, 2, 4, 1],
    ];
    generateCases(positiveCases, false);
    generateCases(negativeCases, true);
  });

  describe('checkPair', () => {
    it('should work', () => {
      expect(checkPair([1, 2, 0], [0, 2])).toBe(true);
    });
    it('should work case left part', () => {
      expect(checkPair([2, 0, 1], [0, 2])).toBe(true);
    });

    it('should work case right part', () => {
      expect(checkPair([2, 0, 1], [2, 0])).toBe(true);
    });

    it('should work case with no match', () => {
      expect(checkPair([3, 0, 1, 2], [0, 2])).toBe(false);
    });
  });

  describe('createGamePairs', () => {
    it('should work', () => {
      const players = createGamePairs(5);
      expect(players).toHaveLength(5);
      expect(hasWrongPlayers(players)).toBe(false);
    });

    it('should work for 2 players', () => {
      const players = createGamePairs(2);
      expect(players).toEqual([1, 0]);
    });

    function createSamples(players: number, count: number) {
      const data: number[][] = [];
      for (let i = 0; i < count; i++) {
        data.push(createGamePairs(players));
      }
      return uniqBy(data, (val) => JSON.stringify(val));
    }

    it('check entropy case 4', () => {
      const uniqSamples = createSamples(4, 5000);
      const nonPairSamples = uniqSamples.filter((it) => it[0] !== 1 && it[1] !== 0 && it[2] !== 3 && it[3] !== 2);
      expect(uniqSamples).toHaveLength(9);
      expect(nonPairSamples).toHaveLength(4);
    });

    it('check entropy case 5', () => {
      const uniqSamples: number[][] = createSamples(5, 30000);
      const nonPairSamples = uniqSamples.filter((it) => it[0] !== 1 && it[1] !== 0 && it[2] !== 3 && it[3] !== 2);
      expect(uniqSamples).toHaveLength(44);
      expect(nonPairSamples).toHaveLength(16);
    });
  });

  describe('createGameWithoutPairs', () => {
    it('should work', () => {
      const game = createGameWithoutPairs(4, [
        [0, 1],
        [2, 3],
      ]);
      expect(game).toHaveLength(4);
    });

    it('should check entropy', () => {
      const data: number[][] = [];
      for (let i = 0; i < 50000; i++) {
        data.push(
          createGameWithoutPairs(8, [
            [0, 1],
            [2, 3],
            [4, 5],
          ]),
        );
      }
      const uniqSamples = uniqBy(data, (it) => JSON.stringify(it));
      expect(uniqSamples.length).toBeGreaterThan(6000);
    });
  });
});
