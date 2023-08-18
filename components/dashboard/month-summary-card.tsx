import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/db';
import { transactions } from '@/db/schema/finances';
import { authOptions } from '@/lib/auth/auth';
import { cn, moneyFormat } from '@/lib/utils';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { Label } from '../ui/label';
import { CardTitleWithTooltip } from './card-title-with-tooltip';

async function getBalanceForMonth(userId: string, month?: number) {
    const currentDate = new Date();
    const startOfMonth = new Date(
        currentDate.getFullYear(),
        month ? month : currentDate.getMonth(),
        1
    );
    const endOfMonth = new Date(
        currentDate.getFullYear(),
        month ? month : currentDate.getMonth() + 1,
        0
    );

    const result = await db
        .select({
            totalIncome: sql<number>`sum(CASE WHEN transactions.type = 'income' THEN transactions.amount ELSE 0 END)`,
            totalExpenses: sql<number>`sum(CASE WHEN transactions.type = 'expense' THEN transactions.amount ELSE 0 END)`,
        })
        .from(transactions)
        .where(
            and(
                gte(transactions.timestamp, startOfMonth),
                lte(transactions.timestamp, endOfMonth),
                eq(transactions.userId, userId)
            )
        );

    return {
        totalExpenses: result[0].totalExpenses,
        totalIncome: result[0].totalIncome,
        totalBalance: Number(result[0].totalIncome) - result[0].totalExpenses,
    };
}

export default async function MonthlyBalanceCard() {
    const session = await getServerSession(authOptions);
    const { totalIncome, totalExpenses, totalBalance } =
        await getBalanceForMonth(session?.user.id as string);
    return (
        <Card>
            <CardHeader>
                <CardTitleWithTooltip message='Summary of incomes and spendings this month.'>
                    <CardTitle>This Month</CardTitle>
                </CardTitleWithTooltip>
            </CardHeader>
            <CardContent className="space-y-3">
                <div>
                    <Label>Income</Label>
                    <p className="text-lg font-semibold">
                        {moneyFormat(totalIncome)}
                    </p>
                </div>
                <div>
                    <Label>Expenses</Label>
                    <p className="text-lg font-semibold">
                        {moneyFormat(totalExpenses)}
                    </p>
                </div>
                <div>
                    <Label>Balance</Label>
                    <p
                        className={cn(
                            'text-lg font-semibold',
                            totalBalance > 0
                                ? 'text-green-500 dark:text-green-400'
                                : 'text-red-500 dark:text-red-400'
                        )}
                    >
                        {moneyFormat(totalBalance)}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
