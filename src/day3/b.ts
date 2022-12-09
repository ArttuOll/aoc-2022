import { flow, identity } from "fp-ts/function";
import { readInput } from "../util";
import { Eq, Ord } from "fp-ts/string";
import {
  append,
  dropLeft,
  findIndex,
  head,
  intersection,
  map,
  match as matchArray,
  reduce,
  takeLeft,
} from "fp-ts/Array";
import * as O from "fp-ts/Option";
import { add, memoizeWith, split, sum } from "ramda";
import { equals } from "fp-ts/Ord";
import { fromArray, NonEmptyArray, uniq } from "fp-ts/NonEmptyArray";

const divideToGroupsOfThree: (
  rucksackStrings: string[]
) => NonEmptyArray<string[]> = matchArray(
  () => [[]],
  (rucksacks) => {
    const three = takeLeft(3)(rucksacks);
    const rest = divideToGroupsOfThree(dropLeft(3)(rucksacks));
    return append(three)(rest);
  }
);

const readRucksacks = flow(
  readInput(3),
  split("\n"),
  divideToGroupsOfThree,
  map(map(split("")))
);

const findBadge = (rucksackGroup: string[][]) =>
  fromArray(reduce(rucksackGroup[0] ?? [], intersection(Eq))(rucksackGroup));

const generateAlphabet = memoizeWith(String, () =>
  [...Array(26)]
    .map((_, i) => String.fromCharCode(i + 97))
    .concat([...Array(26)].map((_, i) => String.fromCharCode(i + 65)))
);

const evaluatePriority = (item: string) =>
  flow(
    generateAlphabet,
    findIndex(equals(Ord)(item)),
    O.match(() => 0, add(1))
  )();

const assignPriorities = map(evaluatePriority);

const solve = flow(
  readRucksacks,
  map(
    flow(
      findBadge,
      O.map(flow(uniq(Eq), assignPriorities)),
      O.chain(head),
      O.match(() => 0, identity)
    )
  ),
  sum
);

console.log(solve());
