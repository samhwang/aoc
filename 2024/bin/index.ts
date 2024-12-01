#!/usr/bin/env node
import { Command } from 'commander';
import { fetchCommand, scaffoldCommand } from '../src/get-aoc-input.ts/command';

const program = new Command();

type CommandInput = {
  year: string;
  day: string;
  session: string;
  output: string;
};

program.name('get-aoc-input').description('CLI for fetching and scaffolding AOC inputs').version('1.0.0');

program
  .command('fetch')
  .description('Fetch an AOC input for the day')
  .requiredOption('-d, --day <day>', 'The day to scaffold')
  .requiredOption('-y, --year <year>', 'The year to scaffold')
  .requiredOption('-s, --session <session>', 'The session cookie to use')
  .option('-o, --output <output>', 'The output directory to use (default is the day from dayOption `day3`, `day4`...)')
  .action(({ year, day, session, output }: CommandInput) => fetchCommand(year, day, session, output));

program
  .command('scaffold')
  .description('Scaffold an AOC input for the day')
  .requiredOption('-d, --day <day>', 'The day to scaffold')
  .requiredOption('-y, --year <year>', 'The year to scaffold')
  .requiredOption('-s, --session <session>', 'The session cookie to use')
  .option('-o, --output <output>', 'The output directory to use (default is the day from dayOption `day3`, `day4`...)')
  .action(({ year, day, session, output }: CommandInput) => scaffoldCommand(year, day, session, output));

program.parse(process.argv);
