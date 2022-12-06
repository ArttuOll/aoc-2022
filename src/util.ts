import { readFileSync } from "fs";
import { IO } from "fp-ts/IO";

export function readInput(day: number): IO<string> {
  return () =>
    readFileSync(
      `/home/arttu/ohjelmistoprojektit/aoc-2022/src/day${day}/input.txt`,
      { encoding: "utf-8" }
    );
}
