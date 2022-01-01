console.log('start ------');

import { fileURLToPath } from 'url';
import { dirname, extname } from 'path';

import { readdir, writeFile, appendFile, stat } from 'fs/promises';

let base = 'graph';
const __filename = fileURLToPath(import.meta.url);
try {
  //   const files = await readdir('graph');
  //   await readCurDir('graph/')
  //   for (const file of files) {
  //     // console.log(file,dirname(file));
  //     // await addText(file, base);
  //   }
  await readCurDir('graph');
} catch (err) {
  console.error(err);
}

async function addText(file) {
  let ext = extname(file);
  if (ext == '.js') {
    console.log(file, `console.log(${file})`);
    await appendFile(file, `console.log('${file}');`);
  }
}

async function readCurDir(dir) {
  try {
    const files = await readdir(dir);
    for (const file of files) {
      // console.log(file,dirname(file));
      //   await addText(file, base);
      let cur = `${dir}\/${file}`;
      let filestat = await stat(cur);
      if (filestat.isDirectory()) {
        readCurDir(cur);
      } else {
        addText(cur);
      }
      //   console.log(res.isDirectory());
    }
  } catch (err) {
    console.error(err);
  }
}
