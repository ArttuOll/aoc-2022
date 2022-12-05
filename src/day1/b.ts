import { readInput } from "../util";
import { map, reduce, sort, takeLeft } from "fp-ts/ReadonlyArray";
import { flow } from "fp-ts/function";
import { split } from "fp-ts/string";
import { Ord as OrdNumber } from "fp-ts/number";
import { reverse } from "fp-ts/Ord";

const sum = reduce<number, number>(
  0,
  (value, accumulator) => value + accumulator
);
const stringToNumber = map(Number);
const inputToElfCalorieArrays = flow(
  split("\n\n"),
  map(flow(split("\n"), stringToNumber))
);

const result = flow(
  readInput(1),
  inputToElfCalorieArrays,
  map(sum),
  sort(reverse(OrdNumber)),
  takeLeft(3),
  sum
);

console.log(result());
