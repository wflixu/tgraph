console.log('start ------');

import { fileURLToPath } from 'url';
import { dirname, extname } from 'path';

import { readdir, writeFile, appendFile } from 'fs/promises';

let base = 'graph';
const __filename = fileURLToPath(import.meta.url);
try {
  const files = await readdir('graph');
  for (const file of files) {
    // console.log(file,dirname(file));
    await addText(file,base);
  }
} catch (err) {
  console.error(err);
}

async function addText(file,base) {
  console.log(file);
  let ext = extname(file);
  if (ext == '.js') {
    await appendFile(`${base}/${file}`, `console.log(${file})`);
  }
}
