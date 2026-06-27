"use client";

import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "cook-app";
const STORE = "kv";

let dbPromise: Promise<IDBPDatabase> | null = null;

function db() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(d) {
        if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE);
      },
    });
  }
  return dbPromise;
}

export async function kvGet<T>(key: string): Promise<T | undefined> {
  return (await db()).get(STORE, key);
}

export async function kvSet<T>(key: string, value: T): Promise<void> {
  await (await db()).put(STORE, value, key);
}
