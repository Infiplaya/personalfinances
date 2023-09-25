import {
  int,
  timestamp,
  mysqlTable,
  primaryKey,
  varchar,
  text,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';
import type { AdapterAccount } from '@auth/core/adapters';
import { relations } from 'drizzle-orm';
import { balances, transactions, currencies } from './finances';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 255 }).notNull().primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  password: varchar('password', { length: 255 }),
  image: varchar('image', { length: 255 }),
  currentProfile: varchar('currentProfile', { length: 255 }),
});

export const accounts = mysqlTable(
  'accounts',
  {
    userId: varchar('userId', { length: 255 }).notNull(),
    type: varchar('type', { length: 255 })
      .$type<AdapterAccount['type']>()
      .notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
    refresh_token: varchar('refresh_token', { length: 255 }),
    refresh_token_expires_in: int('refresh_token_expires_in'),
    access_token: varchar('access_token', { length: 255 }),
    expires_at: int('expires_at'),
    token_type: varchar('token_type', { length: 255 }),
    scope: varchar('scope', { length: 255 }),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
);

export const sessions = mysqlTable('sessions', {
  sessionToken: varchar('sessionToken', { length: 255 }).notNull().primaryKey(),
  userId: varchar('userId', { length: 255 }).notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const profiles = mysqlTable(
  'profiles',
  {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    userId: varchar('userId', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    currencyCode: varchar('currencyCode', { length: 3 }).notNull(),
  },
  (profiles) => ({
    nameIndex: uniqueIndex('name_idx').on(profiles.name),
  })
);

export const verificationTokens = mysqlTable(
  'verificationToken',
  {
    identifier: varchar('identifier', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  profiles: many(profiles),
}));

export const profilesRelations = relations(profiles, ({ many, one }) => ({
  transactions: many(transactions),
  balance: one(balances),
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
  currency: one(currencies, {
    fields: [profiles.currencyCode],
    references: [currencies.code],
  }),
}));
