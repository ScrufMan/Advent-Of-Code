// https://adventofcode.com/2021/day/17

type Probe = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

type InputCoordinates = [number, number, number, number];

const parseInput = (input: string): InputCoordinates => {
  // split the string to x and y parts
  const [xPart, yPart] = input.split(', ');

  // extract values from x and y parts
  const xValues = xPart.split('=')[1].split('..').map(Number);
  const yValues = yPart.split('=')[1].split('..').map(Number);

  return [...xValues, ...yValues] as InputCoordinates;
};

const step = (probe: Probe): Probe => {
  /*
    The probe's x position increases by its x velocity.
    The probe's y position increases by its y velocity.
    Due to drag, the probe's x velocity changes by 1 toward the value 0; that is, it decreases by 1 if it is greater than 0, 
    increases by 1 if it is less than 0, or does not change if it is already 0.
    Due to gravity, the probe's y velocity decreases by 1.
  */
  const dx = probe.dx;

  probe.x = probe.x + dx;
  probe.y = probe.y + probe.dy;
  probe.dy -= 1;
  probe.dx = dx == 0 ? dx : dx - dx / Math.abs(dx);

  return probe;
};

const probeHitTarget = (
  probe: Probe,
  xTarget1: number,
  xTarget2: number,
  yTarget1: number,
  yTarget2: number
): boolean => {
  return (
    probe.x >= xTarget1 &&
    probe.x <= xTarget2 &&
    probe.y >= yTarget1 &&
    probe.y <= yTarget2
  );
};

const highestPoint = (initalVerticalVelocity: number): number => {
  // basic sum of arithmetic progression
  return (initalVerticalVelocity * (initalVerticalVelocity + 1)) / 2;
};

const solve = (input: string): number => {
  const [xTarget1, xTarget2, yTarget1, yTarget2] = parseInput(input);

  // probe with positive inital dy will always fall down and pass through some point which has y = 0 coordinate
  // when the probe will reach that point it's dy will equal -1 * dy,
  // so the highest theoretical inital dy is bound by the -yTarget1
  // because if it was higher, the probe would fall bellow yTarget1 after passing through point with y = 0
  for (let dy = -yTarget1; dy >= yTarget1; dy--) {
    for (let dx = 0; dx <= xTarget2; dx++) {
      const probe: Probe = { x: 0, y: 0, dx, dy };

      // while probe is not out of bounds
      while (probe.y >= yTarget1 && probe.x <= xTarget2) {
        step(probe);
        if (probeHitTarget(probe, xTarget1, xTarget2, yTarget1, yTarget2)) {
          return highestPoint(dy);
        }
      }
    }
  }
  // worst case scenario
  return yTarget1;
};

const part1 = solve('target area: x=175..227, y=-134..-79');
console.log(`Part 1: ${part1}`);
