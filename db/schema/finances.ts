import { relations } from "drizzle-orm";
import {
  decimal,
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
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    quantity: decimal("quantity", { precision: 10, scale: 2 }),
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

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  category: one(users, {
    fields: [transactions.categoryId],
    references: [users.id],
  }),
}));
