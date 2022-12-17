import { flow } from "fp-ts/function";
import { readInput } from "../util";
import { Eq as StringEq, split } from "fp-ts/string";
import { size, tail, takeLeft, uniq } from "fp-ts/ReadonlyArray";
import * as O from "fp-ts/Option";
import { Option } from "fp-ts/Option";

const parseCharacters = flow(readInput(6), split(""));

const firstFourAreUnique = (characters: ReadonlyArray<string>) => {
  const firstFour = takeLeft(4)(characters);
  const uniqueInFirstFour = uniq(StringEq)(firstFour);
  return size(firstFour) === size(uniqueInFirstFour);
};

const findFirstFourUnique = (characters: Option<ReadonlyArray<string>>) =>
  findFirstFourUniqueHelper(0)(characters);

const findFirstFourUniqueHelper: (
  startingIndex: number
) => (characters: Option<ReadonlyArray<string>>) => number = (startingIndex) =>
  O.match(
    () => 0,
    (characters: ReadonlyArray<string>) =>
      firstFourAreUnique(characters)
        ? /*
           First, convert the index to 1 based. Now the index reflects where
           the first unique set of four starts. Adding 3 will make it reflect
           where the first unique set of four ends.
          */
          startingIndex + 1 + 3
        : findFirstFourUniqueHelper(startingIndex + 1)(tail(characters))
  );

const solve = flow(parseCharacters, O.of, findFirstFourUnique, console.log);

solve();
