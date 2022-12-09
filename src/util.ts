import { readFileSync } from "fs";
import { IO } from "fp-ts/IO";

export function readInput(day: number): IO<string> {
  return () =>
    readFileSync(`${__dirname}/day${day}/input.txt`, { encoding: "utf-8" });
}
