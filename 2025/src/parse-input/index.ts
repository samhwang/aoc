import fs from 'node:fs';

export function parseInput(inputPath: string): string[] {
  const input = fs.readFileSync(inputPath, { encoding: 'utf-8' });
  return input.trim().split('\n');
}
