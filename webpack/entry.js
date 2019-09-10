import { entriesReg } from './settings';
import { sync } from 'glob';
import { basename, extname, join } from 'path'

const entries = sync(entriesReg).reduce((pV, cV) => {
  const entryName = basename(cV, extname(cV));
  return Object.assign(pV, {
    [entryName]: './' + join('src', 'entries', basename(cV))
  })
}, {});

export default entries;