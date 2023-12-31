import { relations } from 'drizzle-orm';
import {
  double,
  int,
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
    nameProfileIdIndex: uniqueIndex('nameProfileId_idx').on(
      transactions.name,
      transactions.profileId
    ),
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

export const budgetStatuses = mysqlTable(
  'budgetStatuses',
  {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    profileId: varchar('profileId', { length: 255 }).notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
  },
  (status) => ({
    nameIndex: uniqueIndex('profileIdName_idx').on(
      status.name,
      status.profileId
    ),
  })
);

export const budgetPlans = mysqlTable('budgetPlans', {
  id: varchar('id', { length: 255 }).notNull().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  statusId: varchar('statusId', { length: 255 }).notNull(),
  order: int('order').default(0),
});

export const financial_targets = mysqlTable('financial_targets', {
  id: varchar('id', { length: 255 }).notNull().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  amount: double('amount', { precision: 10, scale: 2 }).notNull(),
  type: mysqlEnum('type', ['goal', 'limit']).notNull(),
  timePeriod: mysqlEnum('timePeriod', ['day', 'month', 'year']).notNull(),
  profileId: varchar('profileId', { length: 255 }).notNull(),
  currencyCode: varchar('currencyCode', { length: 3 }).notNull(),
});

export const budgetStatusesRelations = relations(
  budgetStatuses,
  ({ one, many }) => ({
    profile: one(profiles, {
      fields: [budgetStatuses.profileId],
      references: [profiles.id],
    }),
    budgetPlans: many(budgetPlans),
  })
);

export const budgetPlansRelations = relations(budgetPlans, ({ one }) => ({
  budgetStatus: one(budgetStatuses, {
    fields: [budgetPlans.statusId],
    references: [budgetStatuses.id],
  }),
}));

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

export const targetsRelations = relations(financial_targets, ({ one }) => ({
  profile: one(profiles, {
    fields: [financial_targets.profileId],
    references: [profiles.id],
  }),
}));

export type Category = typeof categories.$inferSelect;
export type Currency = typeof currencies.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type BudgetPlan = typeof budgetPlans.$inferSelect;
export type BudgetStatus = typeof budgetStatuses.$inferSelect;
export type FinancialTarget = typeof financial_targets.$inferSelect;
