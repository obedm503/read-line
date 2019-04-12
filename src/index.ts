import { createReadStream, ReadStream } from 'fs';
import { EOL } from 'os';

// based on http://2ality.com/2018/04/async-iter-nodejs.html
export async function* readLine(input: string | ReadStream) {
  const readable =
    typeof input === 'string'
      ? createReadStream(input, { encoding: 'utf8', highWaterMark: 1024 })
      : input;

  let previous = '';
  for await (const chunk of readable) {
    previous += chunk;
    let eolIndex;
    while ((eolIndex = previous.indexOf(EOL)) >= 0) {
      // line DOES NOT includes the EOL
      const line = previous.slice(0, eolIndex);
      yield line;
      previous = previous.slice(eolIndex + 1);
    }
  }
  if (previous.length > 0) {
    yield previous;
  }
}
