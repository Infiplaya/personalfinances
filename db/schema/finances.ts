import { InferModel, relations } from 'drizzle-orm';
import {
  double,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';
import { profiles } from './auth';

export const transactions = mysqlTable(
  'transactions',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    slug: varchar('slug', { length: 256 }).notNull(),
    description: text('description'),
    amount: double('amount', { precision: 10, scale: 2 }).notNull(),
    baseAmount: double('baseAmount', { precision: 10, scale: 2 }).notNull(),
    profileId: varchar('profileId', { length: 255 }).notNull(),
    categoryName: varchar('categoryName', { length: 255 }).notNull(),
    currencyCode: varchar('currencyCode', { length: 3 }).notNull(),
    type: mysqlEnum('type', ['expense', 'income']).notNull(),
    timestamp: timestamp('timestamp').defaultNow(),
  },
  (transactions) => ({
    nameIndex: uniqueIndex('name_idx').on(transactions.name),
  })
);

export const categories = mysqlTable(
  'categories',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    slug: varchar('slug', { length: 256 }).notNull(),
    type: mysqlEnum('type', ['expense', 'income']).notNull().default('expense'),
  },
  (categories) => ({
    nameIndex: uniqueIndex('name_idx').on(categories.name),
  })
);

export const currencies = mysqlTable(
  'currencies',
  {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 256 }).notNull(),
    name: varchar('name', { length: 256 }).notNull(),
  },
  (currencies) => ({
    codeIndex: uniqueIndex('code_idx').on(currencies.code),
  })
);

export const balances = mysqlTable(
  'balances',
  {
    id: serial('id').primaryKey(),
    totalBalance: double('totalBalance', { precision: 10, scale: 2 }).default(
      0.0
    ),
    profileId: varchar('profileId', { length: 255 }).notNull(),
    timestamp: timestamp('timestamp').defaultNow(),
  },
  (balance) => ({
    idIndex: uniqueIndex('idId_idx').on(balance.id),
  })
);

export const balancesRelations = relations(balances, ({ one }) => ({
  profile: one(profiles, {
    fields: [balances.profileId],
    references: [profiles.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

export const currenciesRelations = relations(currencies, ({ many }) => ({
  transactions: many(transactions),
  profiles: many(profiles),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  profile: one(profiles, {
    fields: [transactions.profileId],
    references: [profiles.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryName],
    references: [categories.name],
  }),
  currency: one(currencies, {
    fields: [transactions.currencyCode],
    references: [currencies.code],
  }),
}));

export type Category = InferModel<typeof categories>;
export type Currency = InferModel<typeof currencies>;
export type Transaction = InferModel<typeof transactions>;
