import test from 'ava';
import * as fs from 'fs';
import { EOL } from 'os';
import { resolve } from 'path';
import { promisify } from 'util';
import { readLine } from '.';

const readFile = promisify(fs.readFile);

const fileName = resolve(__dirname, '../test.txt');

let text: string[] = [];
test.before(async () => {
  text = (await readFile(fileName, 'utf-8')).split(EOL);
});

test('read file', async t => {
  const file = readLine(fileName);
  for (const line of text) {
    const actual = (await file.next()).value;
    t.assert(line === actual, "lines don't match");
  }
});

test('read stream', async t => {
  const file = readLine(fs.createReadStream(fileName, 'utf-8'));
  for (const line of text) {
    const actual = (await file.next()).value;
    t.assert(line === actual, "lines don't match");
  }
});
