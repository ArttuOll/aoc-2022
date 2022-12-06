import { flow } from "fp-ts/function";
import { split } from "fp-ts/string";
import { filter, map } from "fp-ts/ReadonlyArray";
import { fst, snd } from "fp-ts/ReadonlyTuple";
import { readInput, sum } from "../util";

enum Rps {
  Rock = "A",
  Paper = "B",
  Scissors = "C",
}

enum Outcome {
  Win = "Z",
  Tie = "Y",
  Loss = "X",
}

enum ResultScore {
  Win = 6,
  Tie = 3,
  Loss = 0,
}

enum ShapeScore {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}

type Game = [Rps, Outcome];

const isGame = (gameString: readonly string[]): gameString is Game =>
  ["A", "B", "C"].includes(gameString?.[0] ?? "") &&
  ["X", "Y", "Z"].includes(gameString?.[1] ?? "");

const readGames = flow(
  readInput(2),
  split("\n"),
  map(split(" ")),
  filter(isGame)
);

const opponentPlayedPaper = (game: Game) => fst(game) === Rps.Paper;
const opponentPlayedScissors = (game: Game) => fst(game) === Rps.Scissors;

const calculateGameScore = (game: Game) => {
  switch (snd(game)) {
    case Outcome.Loss:
      return opponentPlayedPaper(game)
        ? ResultScore.Loss + ShapeScore.Rock
        : opponentPlayedScissors(game)
        ? ResultScore.Loss + ShapeScore.Paper
        : ResultScore.Loss + ShapeScore.Scissors;
    case Outcome.Tie:
      return opponentPlayedPaper(game)
        ? ResultScore.Tie + ShapeScore.Paper
        : opponentPlayedScissors(game)
        ? ResultScore.Tie + ShapeScore.Scissors
        : ResultScore.Tie + ShapeScore.Rock;
    case Outcome.Win:
      return opponentPlayedPaper(game)
        ? ResultScore.Win + ShapeScore.Scissors
        : opponentPlayedScissors(game)
        ? ResultScore.Win + ShapeScore.Rock
        : ResultScore.Win + ShapeScore.Paper;
  }
};

const solve = flow(readGames, map(calculateGameScore), sum);

console.log(solve());
