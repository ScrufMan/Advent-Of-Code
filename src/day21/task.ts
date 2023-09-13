// https://adventofcode.com/2021/day/21

type Player = {
  position: number;
  score: number;
};

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

const solve = (input: string): number => {
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

const input = `Player 1 starting position: 8
Player 2 starting position: 4`;

const part1 = solve(input);
console.log(`Part 1: ${part1}`);
