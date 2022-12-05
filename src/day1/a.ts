import { readInput, sum } from "../util";
import { max } from "fp-ts/Ord";
import { map, reduce } from "fp-ts/ReadonlyArray";
import { flow } from "fp-ts/function";
import { split } from "fp-ts/string";
import { Ord as OrdNumber } from "fp-ts/number";

const stringToNumber = map(Number);
const inputToElfCalorieArrays = flow(
  split("\n\n"),
  map(flow(split("\n"), stringToNumber))
);
const maxArray = reduce(0, max(OrdNumber));

const result = flow(readInput(1), inputToElfCalorieArrays, map(sum), maxArray);

console.log(result());
