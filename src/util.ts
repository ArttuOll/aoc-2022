import { readFileSync } from 'fs'

export function readInput(day: number) {
    return readFileSync(`src/day${day}/input.txt`, {encoding: 'utf-8'})
}
