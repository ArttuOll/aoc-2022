import { readInput } from "../util";
import { max } from "fp-ts/Ord";
import { map, reduce } from "fp-ts/ReadonlyArray";
import { flow } from "fp-ts/function";
import { split } from "fp-ts/string";
import { Ord as OrdNumber } from "fp-ts/number";

const sum = reduce<number, number>(
  0,
  (value, accumulator) => value + accumulator
);
const stringToNumber = map(Number);
const inputToElfCalorieArrays = flow(
  split("\n\n"),
  map(flow(split("\n"), stringToNumber))
);
const maxArray = reduce(0, max(OrdNumber));

const result = flow(inputToElfCalorieArrays, map(sum), maxArray)(readInput(1));

console.log(result);
