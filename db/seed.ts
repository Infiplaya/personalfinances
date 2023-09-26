import { connect } from '@planetscale/database';
import { drizzle } from 'drizzle-orm/planetscale-serverless';

import { fetch } from 'undici';

import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import { profiles, users } from './schema/auth';
import slugify from 'slugify';
import { categories } from './schema/finances';

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

  process.exit(0);
};

runSeed().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});
