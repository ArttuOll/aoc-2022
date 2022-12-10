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

const valueIsInRange = (range: Range) => (value: number) =>
  value >= fst(range) && value <= snd(range);

const rangesOverlap = (rangePair: RangePair) => {
  const range1 = fst(rangePair);
  const range2 = snd(rangePair);
  const valueIsInRange1 = valueIsInRange(range1);
  const valueIsInRange2 = valueIsInRange(range2);
  return (
    valueIsInRange1(fst(range2)) ||
    valueIsInRange1(snd(range2)) ||
    valueIsInRange2(fst(range1)) ||
    valueIsInRange2(snd(range1))
  );
};

const solve = flow(readRanges, filter(rangesOverlap), size);

console.log(solve());
