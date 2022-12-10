import { readInput } from "../util";
import { flow } from "fp-ts/function";
import { filter, map, size } from "fp-ts/Array";
import { split } from "ramda";
import { fst, snd } from "fp-ts/Tuple";

type Start = number;
type End = number;
type Range = [Start, End];
type RangePair = [Range, Range];

const isRange = (range: number[]): range is Range => range.length === 2;
const isRangePair = (rangePair: number[][]): rangePair is RangePair =>
  rangePair.length === 2 &&
  isRange(rangePair?.[0] ?? []) &&
  isRange(rangePair?.[1] ?? []);

const convertToRanges = map(filter(isRange));
const convertToRangePairs = filter(isRangePair);

const splitToRangePairs = map(
  flow(split(","), map(flow(split("-"), map(Number))))
);

const readRanges = flow(
  readInput(4),
  split("\n"),
  splitToRangePairs,
  convertToRanges,
  convertToRangePairs
);

const oneRangeFullyContainsOther = (rangePair: RangePair) => {
  const range1 = rangePair[0];
  const range2 = rangePair[1];
  return (
    (fst(range1) >= fst(range2) && snd(range1) <= snd(range2)) ||
    (fst(range2) >= fst(range1) && snd(range2) <= snd(range1))
  );
};

const solve = flow(readRanges, filter(oneRangeFullyContainsOther), size);

console.log(solve());
