import { connect } from '@planetscale/database';
import { drizzle } from 'drizzle-orm/planetscale-serverless';

import { fetch } from 'undici';

import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import { profiles, users } from './schema/auth';

const currenciesData = [
  { code: 'USD', name: 'United States Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'GBP', name: 'British Pound Sterling' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'SEK', name: 'Swedish Krona' },
  { code: 'NZD', name: 'New Zealand Dollar' },
  { code: 'PLN', name: 'Polish Złoty' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'KRW', name: 'South Korean Won' },
];

const runSeed = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  const connection = connect({
    url: process.env.DATABASE_URL,
    fetch,
  });

  const db = drizzle(connection);

  const allUsers = await db.select().from(users);

  for (const u of allUsers) {
    await db.insert(profiles).values({
      id: uuidv4(),
      name: 'default',
      currencyCode: 'USD',
      userId: u.id,
    });
  }

  process.exit(0);
};

runSeed().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});
