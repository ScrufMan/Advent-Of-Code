// https://adventofcode.com/2021/day/14

type InsertionRules = Map<string, string>;
type CountMap = Map<string, number>;

const parseInput = (raw: string): [string, InsertionRules] => {
  const rules: InsertionRules = new Map();

  const lines = raw.split('\n');
  const polymerTemplate = lines[0];

  // skip i == 1 because it's an empty line
  for (let i = 2; i < lines.length; i++) {
    const [key, value] = lines[i].split(' -> ');
    rules.set(key, value);
  }

  return [polymerTemplate, rules];
};

const applyRule = (counts: CountMap, rules: InsertionRules): CountMap => {
  const updatedCounts: CountMap = new Map();

  for (const [molecule, count] of counts) {
    if (rules.has(molecule)) {
      const [leftElement, rightElement] = molecule;
      const newElement = rules.get(molecule)!; // sure that new element can be synthesised

      // because new element binds to both sides of the parent molecule, it creates two new molecules
      // old molecule breaks into two new molecules
      // the updated count of newly created molecules is their so far count + the number of the parent molecules currently in polymer
      updatedCounts.set(
        leftElement + newElement,
        (updatedCounts.get(leftElement + newElement) ?? 0) + count
      );
      updatedCounts.set(
        newElement + rightElement,
        (updatedCounts.get(newElement + rightElement) ?? 0) + count
      );
    } else {
      // if there's no rule for the molecule it won't split, just copy its count
      updatedCounts.set(molecule, count);
    }
  }

  return updatedCounts;
};

const solve = (input: string, steps = 10): number => {
  const [polymerTemplate, rules] = parseInput(input);
  let counts: CountMap = new Map();

  // count initial occurences of molecules (element pairs) in polymer template
  for (let i = 0; i < polymerTemplate.length - 1; i++) {
    const molecule = polymerTemplate[i] + polymerTemplate[i + 1];
    counts.set(molecule, (counts.get(molecule) ?? 0) + 1);
  }

  for (let i = 0; i < steps; i++) {
    counts = applyRule(counts, rules);
  }

  // to get the final count of each element, just consider left side of each molecule and add it to the so far element count
  // because the element on the right side will be counted as element on the left side of the some other molecule
  const elementCounts: CountMap = new Map();
  for (const [molecule, count] of counts) {
    const element = molecule[0];
    elementCounts.set(element, (elementCounts.get(element) ?? 0) + count);
  }
  // rightmost element is not counted in the loop above because it's not the left side of any molecule
  // just add it to the count
  elementCounts.set(
    polymerTemplate[polymerTemplate.length - 1],
    (elementCounts.get(polymerTemplate[polymerTemplate.length - 1]) ?? 0) + 1
  );

  // get elements with highest and lowest count
  const maxCount = Math.max(...elementCounts.values());
  const minCount = Math.min(...elementCounts.values());

  return maxCount - minCount;
};

const exampleInput = `PSVVKKCNBPNBBHNSFKBO

CF -> H
PP -> H
SP -> V
NO -> C
SF -> F
FS -> H
OF -> P
PN -> B
SH -> V
BO -> K
ON -> V
VP -> S
HN -> B
PS -> P
FV -> H
NC -> N
FN -> S
PF -> F
BF -> F
NB -> O
HS -> C
SC -> V
PC -> K
KF -> K
HC -> C
OK -> H
KS -> P
VF -> C
NV -> S
KK -> F
HV -> H
SV -> V
KC -> N
HF -> P
SN -> F
VS -> P
VN -> F
VH -> C
OB -> K
VV -> O
VC -> O
KP -> V
OP -> C
HO -> S
NP -> K
HB -> C
CS -> S
OO -> S
CV -> K
BS -> F
BH -> P
HP -> P
PK -> B
BB -> H
PV -> N
VO -> P
SS -> B
CC -> F
BC -> V
FF -> S
HK -> V
OH -> N
BV -> C
CP -> F
KN -> K
NN -> S
FB -> F
PH -> O
FH -> N
FK -> P
CK -> V
CN -> S
BP -> K
CH -> F
FP -> K
HH -> N
NF -> C
VB -> B
FO -> N
PB -> C
KH -> K
PO -> K
OV -> F
NH -> H
KV -> B
OS -> K
OC -> K
FC -> H
SO -> H
KO -> P
NS -> F
CB -> C
CO -> F
KB -> V
BK -> K
NK -> O
SK -> C
SB -> B
VK -> O
BN -> H`;

const answerPart1 = solve(exampleInput, 10);
console.log('Answer to part 1:', answerPart1);

const answerPart2 = solve(exampleInput, 40);
console.log('Answer to part 2:', answerPart2);
