import { readInput } from "../util.js";
import { function as f, readonlyArray as roa, string as s } from "fp-ts";

const result = f.flow(
  s.split("\n\n"),
  roa.map(
    f.flow(
      s.split("\n"),
      f.flow(
        roa.map(Number),
        roa.reduce(0, (value, accumulator) => value + accumulator)
      )
    )
  )
)(readInput(1));

console.log(result);
