import { networkInterfaces } from 'os';

export const { address: host } = Object
  .entries(networkInterfaces())
  .reduce((pv, [, cv]) => [...pv, ...cv], [])
  .filter(({ family }) => family === 'IPv4')
  .find(({ address }) => address.match(/192(\.\d+)+/)) || { address: 'localhost' };

export const to = async (promise) => {
  return promise
    .then(data => [data, null])
    .catch(err => [null, err]);
}

export const compare = (a1, a2) => {
  let result = true;
  if (a1.length !== a2.length || a1.filter(item => a2.indexOf(item) !== -1).length !== a2.length) result = false
  return result;
}