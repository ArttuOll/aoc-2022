import { readInput } from "../util";
import { flow, identity, pipe } from "fp-ts/function";
import * as S from "fp-ts/string";
import { includes } from "fp-ts/string";
import { append, init, intercalate, lookup, reduce } from "fp-ts/Array";
import { split, sum } from "ramda";
import * as O from "fp-ts/Option";
import { Option, some } from "fp-ts/Option";
import { fst, snd } from "fp-ts/Tuple";
import * as M from "fp-ts/Map";
import { mapWithIndex } from "fp-ts/Map";
import * as N from "fp-ts/number";

type Size = number;
type Directory = string;
type Path = Directory[];
type DirectorySizes = Map<Directory, Size>;
type State = [Path, DirectorySizes];

const navigateBackwards = (state: State): Option<State> =>
  pipe(
    fst(state),
    init,
    O.map((newPath) => [newPath, snd(state)])
  );

const pathToString = intercalate(S.Monoid)("+");

const executeCd =
  (state: State) =>
  (nextDirectoryName: string): Option<State> => {
    switch (nextDirectoryName) {
      case "..": {
        return navigateBackwards(state);
      }
      default: {
        const currentPath = fst(state);
        const currentDirectorySizes = snd(state);
        const newPath = append(nextDirectoryName)(currentPath);
        return some([
          newPath,
          M.upsertAt(S.Eq)(pathToString(newPath), 0)(currentDirectorySizes),
        ]);
      }
    }
  };

const updateFileSizes = (state: State) => (newFileSize: number) => {
  const currentPathKey = pathToString(fst(state));
  return mapWithIndex((path: string, size: number) =>
    includes(path)(currentPathKey) ? size + newFileSize : size
  );
};

const executeFileSize =
  (state: State) =>
  (fileSize: string): State => {
    const currentPath = fst(state);
    const currentDirectorySizes = snd(state);
    return [
      currentPath,
      pipe(currentDirectorySizes, updateFileSizes(state)(Number(fileSize))),
    ];
  };

const executeLine = (state: State, line: string) => {
  const startsWithFileSize = (line: string) => line.match(/\d+\s/);
  if (S.startsWith("$ cd")(line)) {
    return flow(
      split(" "),
      lookup(2),
      O.chain(executeCd(state)),
      O.match(() => state, identity)
    )(line);
  } else if (startsWithFileSize(line)) {
    return flow(
      split(" "),
      lookup(0),
      O.map(executeFileSize(state)),
      O.match(() => state, identity)
    )(line);
  } else {
    return state;
  }
};

const sumDirectoriesWithSizeOver100000 = (state: State) =>
  pipe(
    state,
    snd,
    M.filterWithIndex((k, v) => v <= 100_000),
    M.values(N.Ord),
    sum
  );

const solve = flow(
  readInput(7),
  split("\n"),
  reduce([[], new Map()], executeLine),
  sumDirectoriesWithSizeOver100000,
  console.log
);

solve();
