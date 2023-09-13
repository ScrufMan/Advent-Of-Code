// https://adventofcode.com/2021/day/21

type Player = {
  position: number;
  score: number;
};

/* Part 1 */

const parseInput = (input: string): [number, number] => {
  const [player1, player2] = input.split('\n');
  const [, player1Start] = player1.split(': ');
  const [, player2Start] = player2.split(': ');

  return [Number(player1Start), Number(player2Start)];
};

const movePlayer = (player: Player, diceValue: number): number => {
  // sum of player's turn total move distance
  const moveDistance = diceValue + diceValue + 1 + diceValue + 2;
  // adjust for offset of 1-10 board positions
  player.position = ((player.position + moveDistance - 1) % 10) + 1;
  player.score += player.position;

  // diceValue for next player - need to adjust for offset as well
  return ((diceValue + 2) % 100) + 1;
};

const solveFirst = (input: string): number => {
  const [player1Start, player2Start] = parseInput(input);

  const player1: Player = { position: player1Start, score: 0 };
  const player2: Player = { position: player2Start, score: 0 };
  let diceValue = 1;
  let diceRolls = 0;

  // play until one player reaches 1000 points
  while (true) {
    diceValue = movePlayer(player1, diceValue);
    diceRolls += 3;

    if (player1.score >= 1000) {
      return player2.score * diceRolls;
    }

    diceValue = movePlayer(player2, diceValue);
    diceRolls += 3;

    if (player2.score >= 1000) {
      return player1.score * diceRolls;
    }
  }
};

/* Part 2 */

// there are (player1.position, player2.position, player1.score, player2.score) = (10 * 10 * 20 * 20) possible states
// we can cache the results of each state to avoid recalculating in the recursive function
const cache = new Map<string, [number, number]>();

const calculateWins = (player1: Player, player2: Player): [number, number] => {
  // function considers it's player1 turn

  const cacheKey = `${player1.position},${player1.score},${player2.position},${player2.score}`;
  if (cache.get(cacheKey)) {
    // state already calculated
    return cache.get(cacheKey)!;
  }

  // initialize win counts to 0
  let p1WIns = 0;
  let p2Wins = 0;

  // for each possible universe created by the dice rolls
  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
      for (let k = 1; k <= 3; k++) {
        // so far position and score
        const { position, score } = player1;

        const moveDistance = i + j + k;
        // adjust for offset of 1-10 board positions
        const newPos = ((position + moveDistance - 1) % 10) + 1;
        const newScore = score + newPos;

        if (newScore >= 21) {
          // player 1 wins, universe ends
          p1WIns++;
        } else {
          // create new player1 object with position and score gained in this universe
          const updatedPlayer1: Player = {
            position: newPos,
            score: newScore,
          };
          // universe expands further, player2's turn
          // flip players and get wins counts in recursive universes
          const [recursiveP2Wins, recursiveP1Wins] = calculateWins(
            player2,
            updatedPlayer1
          );

          p1WIns += recursiveP1Wins;
          p2Wins += recursiveP2Wins;
        }
      }
    }
  }
  // don't forget to cache the results
  cache.set(cacheKey, [p1WIns, p2Wins]);

  return [p1WIns, p2Wins];
};

const solveSecond = (input: string): number => {
  const [player1Start, player2Start] = parseInput(input);
  const results = calculateWins(
    { position: player1Start, score: 0 },
    { position: player2Start, score: 0 }
  );
  return Math.max(...results);
};

const input = `Player 1 starting position: 8
Player 2 starting position: 4`;

const part1 = solveFirst(input);
console.log(`Part 1: ${part1}`);

const part2 = solveSecond(input);
console.log(`Part 2: ${part2}`);
