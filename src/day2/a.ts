import { flow } from "fp-ts/function";
import { split } from "fp-ts/string";
import { filter, map } from "fp-ts/ReadonlyArray";
import { fst, snd } from "fp-ts/ReadonlyTuple";
import { readInput, sum } from "../util";

type Rock = "A" | "X";
type Paper = "B" | "Y";
type Scissors = "C" | "Z";

type RPS = Rock | Paper | Scissors;

enum Result {
  Win = 6,
  Tie = 3,
  Loss = 0,
}

type Game = [RPS, RPS];

const isGame = (gameString: readonly string[]): gameString is Game =>
  ["A", "B", "C"].includes(gameString?.[0] ?? "") &&
  ["X", "Y", "Z"].includes(gameString?.[1] ?? "");

const readGames = flow(
  readInput(2),
  split("\n"),
  map(split(" ")),
  filter(isGame)
);

const opponentPlayedRock = (game: Game) =>
  fst(game) === "A" || fst(game) == "X";
const opponentPlayedPaper = (game: Game) =>
  fst(game) === "B" || fst(game) == "Y";
const opponentPlayedScissors = (game: Game) =>
  fst(game) === "C" || fst(game) == "Z";

const calculateGameScore = (game: Game) => {
  switch (snd(game)) {
    case "X":
      return opponentPlayedPaper(game)
        ? Result.Loss
        : opponentPlayedScissors(game)
        ? Result.Win
        : Result.Tie;
    case "Y":
      return opponentPlayedScissors(game)
        ? Result.Loss
        : opponentPlayedRock(game)
        ? Result.Win
        : Result.Tie;
    case "Z":
      return opponentPlayedRock(game)
        ? Result.Loss
        : opponentPlayedPaper(game)
        ? Result.Win
        : Result.Tie;
    default:
      return 0;
  }
};

const calculateShapeScore = (rps: RPS) => {
  switch (rps) {
    case "A":
    case "X":
      return 1;
    case "B":
    case "Y":
      return 2;
    case "C":
    case "Z":
      return 3;
  }
};

const calculateScore = (game: Game): number =>
  calculateShapeScore(snd(game)) + calculateGameScore(game);

const result = flow(readGames, map(calculateScore), sum);

console.log(result());
