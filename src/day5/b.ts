import { readInput } from "../util";
import { flow, identity } from "fp-ts/function";
import { split } from "ramda";
import {
  concat,
  filter,
  init,
  last,
  map,
  mapWithIndex,
  reduce,
  takeRight,
} from "fp-ts/Array";
import { isEmpty } from "fp-ts/string";
import { not } from "fp-ts/Predicate";
import * as O from "fp-ts/Option";

type Crate = string;
type Stack = string[];
type Stacks = string[][];

type Quantity = number;
type StackIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type From = StackIndex;
type To = StackIndex;
type Step = [Quantity, From, To];
type Steps = Step[];

interface StackOperations<A> {
  pushMany: (stack: A[]) => (as: A[]) => A[];
  pop: (n: number) => (stack: A[]) => A[];
  peek: (n: number) => (stack: A[]) => A[];
}

const crateStack: StackOperations<Crate> = {
  pushMany: concat,
  pop: (n) => (stack) =>
    n === 0
      ? stack
      : crateStack.pop(n - 1)(
          flow(
            init,
            O.match(() => [], identity)
          )(stack)
        ),
  peek: takeRight,
};

const quantity = (step: Step) => step[0];
const from = (step: Step) => step[1];
const to = (step: Step) => step[2];

const initialStacks: Stacks = [
  ["S", "M", "R", "N", "W", "J", "V", "T"],
  ["B", "W", "D", "J", "Q", "P", "C", "V"],
  ["B", "J", "F", "H", "D", "R", "P"],
  ["F", "R", "P", "B", "M", "N", "D"],
  ["H", "V", "R", "P", "T", "B"],
  ["C", "B", "P", "T"],
  ["B", "J", "R", "P", "L"],
  ["N", "C", "S", "L", "T", "Z", "B", "W"],
  ["L", "S", "G"],
];

const isStep = (step: number[]): step is Step =>
  step.length === 3 && (step?.[1] ?? 0) >= 1 && (step?.[2] ?? 0) <= 9;

const parseStep = flow(
  split(/move\s|\sfrom\s|\sto\s/),
  filter(not(isEmpty)),
  map(Number)
);

const parseSteps: () => Steps = flow(
  readInput(5),
  split("\n"),
  map(parseStep),
  filter(isStep)
);

const takeFromSource = (stacks: Stacks) => (step: Step) =>
  mapWithIndex((i, stack: Stack) =>
    from(step) === i + 1 ? crateStack.pop(quantity(step))(stack) : stack
  )(stacks);

const pushToDestination =
  (crates: Crate[]) => (step: Step) => (stacks: Stacks) =>
    mapWithIndex((i, stack: Stack) =>
      to(step) === i + 1
        ? crateStack.pushMany(crates)(stacks?.[to(step) - 1] ?? [])
        : stack
    )(stacks);

const executeStep = (stacks: Stacks, step: Step) => {
  const crates = crateStack.peek(quantity(step))(
    stacks?.[from(step) - 1] ?? []
  );
  const takeOperationDone = takeFromSource(stacks)(step);
  return pushToDestination(crates)(step)(takeOperationDone);
};

const executeSteps = (stacks: Stacks) => reduce(stacks, executeStep);

const getTopmostCrates = map(last);

const solve = flow(
  parseSteps,
  executeSteps(initialStacks),
  getTopmostCrates,
  map(O.match(() => "", identity)),
  console.log
);

solve();
