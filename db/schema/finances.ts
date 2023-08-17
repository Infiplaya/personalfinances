import { InferModel, relations } from "drizzle-orm";
import {
  decimal,
  double,
  int,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { users } from "./auth";

export const transactions = mysqlTable(
  "transactions",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    description: text("description"),
    amount: decimal("amount", { precision: 10, scale: 2 }),
    userId: varchar("userId", { length: 255 }).notNull(),
    categoryId: int("categoryId").notNull(),
    type: mysqlEnum("type", ["expense", "income"]).notNull(),
    timestamp: timestamp("timestamp").defaultNow(),
  },
  (transactions) => ({
    nameIndex: uniqueIndex("name_idx").on(transactions.name),
  })
);

export const categories = mysqlTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
  },
  (categories) => ({
    nameIndex: uniqueIndex("name_idx").on(categories.name),
  })
);

export const balances = mysqlTable(
  "balances",
  {
    id: serial("id").primaryKey(),
    totalBalance: double("totalBalance", { precision: 10, scale: 2 }).default(0.00),
    userId: varchar("userId", { length: 255 }).notNull(),
  },
  (balance) => ({
    userIdIndex: uniqueIndex("userId_idx").on(balance.userId),
  })
);

export const balancesRelations = relations(balances, ({ one }) => ({
  user: one(users, {
    fields: [balances.userId],
    references: [users.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export type Category = InferModel<typeof categories>;
export type Transaction = InferModel<typeof transactions>;
