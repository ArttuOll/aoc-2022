import { flow } from "fp-ts/function";
import { readInput } from "../util";
import { Eq as StringEq, split } from "fp-ts/string";
import { size, tail, takeLeft, uniq } from "fp-ts/ReadonlyArray";
import * as O from "fp-ts/Option";
import { Option } from "fp-ts/Option";

const parseCharacters = flow(readInput(6), split(""));

const firstFourteenAreUnique = (characters: ReadonlyArray<string>) => {
  const firstFourteen = takeLeft(14)(characters);
  const uniqueInFirstFourteen = uniq(StringEq)(firstFourteen);
  return size(firstFourteen) === size(uniqueInFirstFourteen);
};

const findFirstFourteenUnique = (characters: Option<ReadonlyArray<string>>) =>
  findFirstFourteenUniqueHelper(0)(characters);

const findFirstFourteenUniqueHelper: (
  startingIndex: number
) => (characters: Option<ReadonlyArray<string>>) => number = (startingIndex) =>
  O.match(
    () => 0,
    (characters: ReadonlyArray<string>) =>
      firstFourteenAreUnique(characters)
        ? /*
           First, convert the index to 1 based. Now the index reflects where
           the first unique set of fourteen starts. Adding 13 will make it reflect
           where the first unique set of fourteen ends.
          */
          startingIndex + 1 + 13
        : findFirstFourteenUniqueHelper(startingIndex + 1)(tail(characters))
  );

const solve = flow(parseCharacters, O.of, findFirstFourteenUnique, console.log);

solve();
