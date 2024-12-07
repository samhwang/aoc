import fs from 'node:fs';
import path from 'node:path';
import { downloadAOCInput } from './aoc-client';

export async function fetchCommand(year: string, day: string, session: string, output: string) {
  try {
    console.log(`RETRIEVING AOC INPUT FOR YEAR ${year} DAY ${day}...`);
    const outputDir = output ?? path.join(process.cwd(), `day${day}`);
    fs.mkdirSync(outputDir);

    await downloadAOCInput(year, day, session, outputDir);
    console.log(`AOC INPUT FOR YEAR ${year} DAY ${day} RETRIEVED SUCCESSFULLY!`);
  } catch (error) {
    console.error('ERROR RETRIEVING AOC INPUT: ', error);
  }
}
