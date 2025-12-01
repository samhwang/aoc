import fs from 'node:fs';
import path from 'node:path';
import wretch from 'wretch';

function getAocClient(session: string) {
  return wretch('https://adventofcode.com')
    .options({ credentials: 'same-origin' })
    .headers({
      Cookie: `session=${session}`,
      'User-Agent': 'https://github.com/samhwang/aoc-template by samhwang2112.dev@gmail.com',
    });
}

export async function downloadAOCInput(year: string, day: string, session: string, outputDir: string): Promise<void> {
  const result = await getAocClient(session).url(`/${year}/day/${day}/input`).get().text();
  const outputPath = path.join(outputDir, 'input.txt');
  return fs.writeFileSync(outputPath, result);
}

export async function fetchTitle(year: string, day: string, session: string): Promise<string> {
  const document = await getAocClient(session).url(`/${year}/day/${day}`).get().text();

  const titleRegex = /(---) (Day) (\d+): (.+) (---)/g;
  const fullTitle = document.match(titleRegex);
  if (!fullTitle) {
    return `Day ${day}: unknown title`;
  }

  return fullTitle[0].replaceAll('-', '').trim();
}
