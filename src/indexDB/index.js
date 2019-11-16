import { openDB } from 'idb';

export const dbPromise = openDB('game-of-life-data', 1, {
  upgrade(db) {
    db.createObjectStore('game-data');
  },
});
 
export const idbKeyval = {
  async get(key) {
    return (await dbPromise).get('game-data', key);
  },
  async set(key, val) {
    return (await dbPromise).put('game-data', val, key);
  },
  async delete(key) {
    return (await dbPromise).delete('game-data', key);
  },
  async clear() {
    return (await dbPromise).clear('game-data');
  },
  async keys() {
    return (await dbPromise).getAllKeys('game-data');
  },
};