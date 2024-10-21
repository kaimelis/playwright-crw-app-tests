import path from 'path'
import fs from 'fs/promises'
import dotenv from 'dotenv';
dotenv.config();

type User = {
  id: string
  username: string
}

type DbSchema = {
  users: User[]
  // Add other collections as necessary
}

const dbFile = path.join(__dirname, '../' + process.env.PATH_TO_CYPRES +  '/data/database.json');

export async function getRandomUser(): Promise<User> {
  try {
    // Check if the file exists
    await fs.access(dbFile);
  } catch (error) {
    console.error(`Error accessing database file: ${dbFile}`);
    console.error(`Current working directory: ${process.cwd()}`);
    console.error(`__dirname: ${__dirname}`);
    console.error(`PATH_TO_CYPRES: ${process.env.PATH_TO_CYPRES}`);
    console.error(`Full error:`, error);
    throw new Error(`Database file not found: ${dbFile}`);
  }

  const { Low } = await import('lowdb');
  const { JSONFile } = await import('lowdb/node');

  const adapter = new JSONFile<DbSchema>(dbFile);
  const defaultData: DbSchema = { users: [] };
  const db = new Low(adapter, defaultData);

  await db.read();
  const users = db.data?.users || [];
  if (users.length === 0) {
    throw new Error('No users found in the database');
  }
  return users[Math.floor(Math.random() * users.length)];
}