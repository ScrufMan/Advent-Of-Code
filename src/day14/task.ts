// https://adventofcode.com/2021/day/14

type insertionRules = Map<string, string>;
type countMap = Map<string, number>;

const parseInput = (raw: string): [string, insertionRules] => {
  const rules: insertionRules = new Map();

  const lines = raw.split('\n');
  const polymerTemplate = lines[0];

  // skip i == 1 because it's an empty line
  for (let i = 2; i < lines.length; i++) {
    const [key, value] = lines[i].split(' -> ');
    rules.set(key, value);
  }

  return [polymerTemplate, rules];
};

const applyRule = (
  template: string,
  rules: insertionRules,
  counts: Map<string, number>
): string => {
  let result = '';
  for (let i = 0; i < template.length; i++) {
    result += template[i]; // add current element

    // check if can make a pair
    if (i < template.length - 1) {
      const pair = template[i] + template[i + 1];
      if (rules.has(pair)) {
        // if can, add new element and update counts
        const newElement = rules.get(pair)!; // checked that new element exists
        result += newElement;
        counts.set(newElement, (counts.get(newElement) ?? 0) + 1);
      }
    }
  }
  return result;
};

const solve = (input: string, steps = 10): number => {
  const elementsCounts: countMap = new Map();
  const [polymerTemplate, rules] = parseInput(input);

  // count elements in initial polymer
  for (const element of polymerTemplate) {
    const count = elementsCounts.get(element) ?? 0;
    elementsCounts.set(element, count + 1);
  }

  let polymerSoFar = polymerTemplate;
  for (let i = 0; i < steps; i++) {
    polymerSoFar = applyRule(polymerSoFar, rules, elementsCounts);
  }

  // get elements with highest and lowest count
  const maxCount = Math.max(...elementsCounts.values());
  const minCount = Math.min(...elementsCounts.values());

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

const answer = solve(exampleInput);
console.log('Answer:', answer);
