import { flow, identity } from "fp-ts/function";
import { readInput } from "../util";
import { Eq, Ord, size, slice, split } from "fp-ts/string";
import { findIndex, head, intersection, map } from "fp-ts/ReadonlyArray";
import { fst } from "fp-ts/lib/ReadonlyTuple";
import { snd } from "fp-ts/ReadonlyTuple";
import { match } from "fp-ts/Option";
import { add, memoizeWith, sum } from "ramda";
import { equals } from "fp-ts/Ord";

type Rucksack = [readonly string[], readonly string[]];

const divideToCompartments = (rucksack: string): Rucksack => [
  flow(slice(0, size(rucksack) / 2), split(""))(rucksack),
  flow(slice(size(rucksack) / 2, size(rucksack)), split(""))(rucksack),
];

const readRucksacks = flow(
  readInput(3),
  split("\n"),
  map(divideToCompartments)
);

const findWronglySortedItem = (rucksack: Rucksack) =>
  intersection(Eq)(fst(rucksack), snd(rucksack));

const findWronglySortedItems = map(
  flow(
    findWronglySortedItem,
    head,
    match(() => "", identity)
  )
);

const generateAlphabet = memoizeWith(String, () =>
  [...Array(26)]
    .map((_, i) => String.fromCharCode(i + 97))
    .concat([...Array(26)].map((_, i) => String.fromCharCode(i + 65)))
);

const evaluatePriority = (item: string) =>
  flow(
    generateAlphabet,
    findIndex(equals(Ord)(item)),
    match(() => 0, add(1))
  )();

const assignPriorities = map(evaluatePriority);

const solve = flow(
  readRucksacks,
  findWronglySortedItems,
  assignPriorities,
  sum
);

console.log(solve());
