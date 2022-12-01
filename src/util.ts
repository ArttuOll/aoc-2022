import { readFileSync } from "fs";

export function readInput(day: number) {
  return readFileSync(
    `/home/arttu/ohjelmistoprojektit/aoc-2022/src/day${day}/input.txt`,
    { encoding: "utf-8" }
  );
}
