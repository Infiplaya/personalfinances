'use server';

import { db } from '@/db';
import { profiles, users } from '@/db/schema/auth';
import {
  balances,
  BudgetPlan,
  budgetPlans,
  budgetStatuses,
  transactions,
} from '@/db/schema/finances';
import { TransactionForm } from '@/lib/validation/transaction';
import { eq, inArray, InferModel } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { hash } from 'bcryptjs';
import { ProfileForm, RegisterForm } from '@/lib/validation/auth';
import { v4 as uuidv4 } from 'uuid';
import { convertCurrency, fetchExchangeRates } from '@/lib/utils';
import { getCurrentProfile } from '@/db/queries/auth';
import { validateSession } from '@/db/queries/transactions';
import slugify from 'slugify';
import { z } from 'zod';
import { PlanForm } from '@/lib/validation/budget';

export async function registerUser(formData: RegisterForm) {
  try {
    const hashed_password = await hash(formData.password, 12);

    type NewUser = InferModel<typeof users, 'insert'>;
    const insertUser = async (user: NewUser) => {
      return db.insert(users).values(user);
    };

    const newUser: NewUser = {
      id: uuidv4(),
      name: formData.name,
      password: hashed_password,
      currentProfile: 'default',
      email: formData.email.toLowerCase(),
    };
    await insertUser(newUser);

    type NewProfile = InferModel<typeof profiles, 'insert'>;
    const insertProfile = async (profile: NewProfile) => {
      return db.insert(profiles).values(profile);
    };

    const newProfile: NewProfile = {
      id: uuidv4(),
      name: 'default',
      currencyCode: 'USD',
      userId: newUser.id,
      balance: 0,
    };
    await insertProfile(newProfile);

    return {
      success: true,
      message: 'Registration completed successfully',
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    };
  } catch (e: unknown) {
    console.log(e);
    return {
      success: false,
      error: 'Something went wrong. Try Again.',
    };
  }
}

export async function createNewTransaction(formData: TransactionForm) {
  const currentProfile = await getCurrentProfile();
  const exchangeRates = await fetchExchangeRates();
  const baseAmount = convertCurrency(
    Number(formData.amount),
    formData.currencyCode,
    'USD',
    exchangeRates
  );

  try {
    await db.insert(transactions).values({
      ...formData,
      slug: slugify(formData.name),
      profileId: currentProfile.id,
      amount: Number(formData.amount),
      baseAmount: baseAmount,
    });

    // grab user balance if it exist
    const userBalance = await db.query.balances.findFirst({
      where: eq(balances.profileId, currentProfile.id),
      orderBy: (balances, { desc }) => [desc(balances.timestamp)],
    });

    await db
      .update(profiles)
      .set({
        balance: userBalance
          ? (userBalance.totalBalance as number) + baseAmount
          : baseAmount,
      })
      .where(eq(profiles.id, currentProfile.id));

    await db.insert(balances).values({
      profileId: currentProfile.id,
      totalBalance: userBalance
        ? (userBalance.totalBalance as number) + baseAmount
        : baseAmount,
    });
    revalidatePath('/transactions');

    return { success: true, message: 'Succesfully added new transaction!' };
  } catch (e) {
    console.log(e);
    revalidatePath('/transactions');
    return { success: false, message: 'Something went wrong. Try Again!' };
  }
}

export async function updateTransaction(
  formData: TransactionForm,
  transactionId: number | undefined
) {
  if (!transactionId)
    return { success: false, message: 'Something Went Wrong!' };
  const currentProfile = await getCurrentProfile();
  const exchangeRates = await fetchExchangeRates();
  const baseAmount = convertCurrency(
    Number(formData.amount),
    formData.currencyCode,
    'USD',
    exchangeRates
  );

  try {
    await db
      .update(transactions)
      .set({
        ...formData,
        slug: slugify(formData.name),
        profileId: currentProfile.id,
        amount: Number(formData.amount),
        baseAmount: baseAmount,
      })
      .where(eq(transactions.id, transactionId));

    revalidatePath('/transactions');

    return { success: true, message: 'Successfully updated transaction!' };
  } catch (e) {
    console.log(e);
    return { success: false, message: 'Something Went Wrong!' };
  }
}

export async function deleteTransaction(transactionId: number) {
  try {
    await db.delete(transactions).where(eq(transactions.id, transactionId));
    revalidatePath('/transactions');
    return {
      success: true,
      error: 'Transaction deleted successfully!',
    };
  } catch (e) {
    return {
      success: false,
      error: 'Something went wrong. Try Again.',
    };
  }
}

export async function deleteTransactions(transactionsIds: number[]) {
  try {
    await db
      .delete(transactions)
      .where(inArray(transactions.id, transactionsIds));
    revalidatePath('/transactions');
    return {
      success: true,
      error: 'Transactions deleted successfully!',
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: 'Something went wrong. Try Again.',
    };
  }
}

const currencySchema = z.object({
  code: z.string().nonempty(),
});

export async function changeCurrency(prevState: unknown, formData: FormData) {
  const currentProfile = await getCurrentProfile();
  const data = currencySchema.parse({
    code: formData.get('code'),
  });

  try {
    await db
      .update(profiles)
      .set({
        currencyCode: data.code,
      })
      .where(eq(profiles.id, currentProfile.id));

    revalidatePath('/');
    return {
      success: true,
      message: `Changed currency to ${data.code}`,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: 'Something went wrong. Try Again',
    };
  }
}

export async function createNewProfile(formData: ProfileForm) {
  const session = await validateSession();

  try {
    await db.insert(profiles).values({
      id: uuidv4(),
      ...formData,
      userId: session.user.id,
    });
    revalidatePath('/');
    return { success: true, message: 'Successfully created new profile!' };
  } catch (e) {
    return { success: false, message: 'Something went wrong... Try Again' };
  }
}

export async function updateUserProfile(
  formData: ProfileForm,
  profileId: string | undefined
) {
  const currentProfile = await getCurrentProfile();

  const { user } = await validateSession();

  try {
    await db
      .update(profiles)
      .set({
        name: formData.name,
        currencyCode: formData.currencyCode,
      })
      .where(eq(profiles.id, profileId ? profileId : currentProfile.id));

    await db
      .update(users)
      .set({
        currentProfile: formData.name,
      })
      .where(eq(users.id, user.id));

    revalidatePath('/');

    return { success: true, message: 'Successfully updated your profile!' };
  } catch (e) {
    console.log(e);
    return { success: false, message: 'Something Went Wrong!' };
  }
}

const profileSchema = z.object({
  name: z.string().nonempty(),
});

export async function changeCurrentProfile(
  prevState: unknown,
  formData: FormData
) {
  const { user } = await validateSession();

  const data = profileSchema.parse({
    name: formData.get('name'),
  });

  try {
    await db
      .update(users)
      .set({
        currentProfile: data.name,
      })
      .where(eq(users.id, user.id));

    revalidatePath('/');
    return { success: true, message: `Changed profile to ${data.name}` };
  } catch (e) {
    console.log(e);
    return { success: false, message: 'Something went wrong... Try again.' };
  }
}

export async function deleteProfile(profileId: string) {
  const { user } = await validateSession();
  const currentProfile = await getCurrentProfile();

  try {
    await db.delete(profiles).where(eq(profiles.id, profileId));
    currentProfile.id === profileId
      ? await db
          .update(users)
          .set({
            currentProfile: 'default',
          })
          .where(eq(users.id, user.id))
      : null;
    revalidatePath('/');
    return { success: true, message: 'Deleted profile successfully.' };
  } catch (e) {
    console.log(e);
    return { success: false, message: 'Something went wrong. Try Again' };
  }
}

export async function updateBudgetPlanStatus(planId: string, statusId: string) {
  try {
    await db
      .update(budgetPlans)
      .set({
        statusId: statusId,
      })
      .where(eq(budgetPlans.id, planId));

    revalidatePath('/');
    return { success: true, message: 'Successfully created new profile!' };
  } catch (e) {
    return { success: false, message: 'Something went wrong... Try Again' };
  }
}

export async function updateBudgetOrder(newOrder: BudgetPlan[]) {
  try {
    for (let i = 0; i < newOrder.length; i++) {
      const planId = newOrder[i].id;
      await db
        .update(budgetPlans)
        .set({
          order: i,
        })
        .where(eq(budgetPlans.id, planId));
    }

    revalidatePath('/');
    return { success: true, message: 'Successfully created new profile!' };
  } catch (e) {
    return { success: false, message: 'Something went wrong... Try Again' };
  }
}

export async function changeBudgetColumnName(formData: FormData) {
  const columnFormSchema = z.object({
    name: z.string(),
    columnId: z.string(),
  });

  const data = columnFormSchema.parse({
    name: formData.get('name'),
    columnId: formData.get('columnId'),
  });

  try {
    await db
      .update(budgetStatuses)
      .set({
        name: data.name,
      })
      .where(eq(budgetStatuses.id, data.columnId));

    revalidatePath('/');
    return { success: true, message: 'Successfully updated the name!' };
  } catch (e) {
    return { success: false, message: 'Something went wrong... Try Again' };
  }
}

export async function createBudgetColumn(
  prevState: unknown,
  formData: FormData
) {
  const currentProfile = await getCurrentProfile();

  const columnFormSchema = z.object({
    name: z.string().nonempty('Name cant be blank').min(1),
    columnId: z.string(),
  });

  const result = columnFormSchema.safeParse({
    name: formData.get('name'),
    columnId: uuidv4(),
  });

  if (!result.success) {
    return { success: false, message: result.error.format().name?._errors[0] };
  }

  try {
    await db.insert(budgetStatuses).values({
      name: result.data.name,
      id: result.data.columnId,
      profileId: currentProfile.id,
    });

    revalidatePath('/');
    return { success: true, message: 'Successfully updated the name!' };
  } catch (e) {
    return { success: false, message: 'This column name is taken.' };
  }
}

export async function createStatusFromClient(name: string, columnId: string) {
  const currentProfile = await getCurrentProfile();

  const columnFormSchema = z.object({
    name: z.string().nonempty('Name cant be blank').min(1),
    columnId: z.string(),
  });

  const result = columnFormSchema.safeParse({
    name,
    columnId,
  });

  if (!result.success) {
    return { success: false, message: result.error.format().name?._errors[0] };
  }

  try {
    await db.insert(budgetStatuses).values({
      name: result.data.name,
      id: result.data.columnId,
      profileId: currentProfile.id,
    });

    return { success: true, message: 'Created new status' };
  } catch (e) {
    return { success: false, message: 'This column name is taken.' };
  }
}

export async function deleteBudgetColumn(formData: FormData) {
  const columnFormSchema = z.object({
    columnId: z.string(),
  });

  const data = columnFormSchema.parse({
    columnId: formData.get('columnId'),
  });

  try {
    await db.delete(budgetStatuses).where(eq(budgetStatuses.id, data.columnId));

    revalidatePath('/');
    return { success: true, message: 'Successfully updated the name!' };
  } catch (e) {
    return { success: false, message: 'Something went wrong... Try Again' };
  }
}

export async function deleteBudgetItems(formData: FormData) {
  const columnFormSchema = z.object({
    columnId: z.string(),
  });

  const data = columnFormSchema.parse({
    columnId: formData.get('columnId'),
  });

  try {
    await db.delete(budgetPlans).where(eq(budgetPlans.statusId, data.columnId));

    revalidatePath('/');
    return { success: true, message: 'Cleared all items' };
  } catch (e) {
    return { success: false, message: 'Something went wrong... Try Again' };
  }
}

export async function createBudgetPlan(prevState: unknown, formData: FormData) {
  const planFormSchema = z.object({
    id: z.string(),
    name: z.string().nonempty('Name cant be blank').min(1),
    columnId: z.string(),
  });

  const result = planFormSchema.safeParse({
    id: uuidv4(),
    name: formData.get('name'),
    columnId: formData.get('columnId'),
  });

  if (!result.success) {
    return { success: false, message: result.error.format().name?._errors[0] };
  }

  try {
    await db.insert(budgetPlans).values({
      name: result.data.name,
      id: result.data.id,
      statusId: result.data.columnId,
      order: 0,
    });

    revalidatePath('/');
    return { success: true, message: 'Created new plan!' };
  } catch (e) {
    return { success: false, message: 'This column name is taken.' };
  }
}

export async function deleteBudgetPlan(planId: string) {
  try {
    await db.delete(budgetPlans).where(eq(budgetPlans.id, planId));
    revalidatePath('/');
    return { success: true, message: 'Deleted this plan' };
  } catch (e) {
    return { success: false, message: 'Something went wrong... Try Again' };
  }
}

export async function changeBudgetPlanName(
  prevState: unknown,
  formData: FormData
) {
  const planFormSchema = z.object({
    name: z.string(),
    planId: z.string(),
  });

  const result = planFormSchema.safeParse({
    name: formData.get('name'),
    planId: formData.get('planId'),
  });

  if (!result.success) {
    return { success: false, message: result.error.format().name?._errors[0] };
  }

  console.log(formData);

  try {
    await db
      .update(budgetPlans)
      .set({
        name: result.data.name,
      })
      .where(eq(budgetPlans.id, result.data.planId));

    revalidatePath('/');
    return { success: true, message: 'Updated name of the plan' };
  } catch (e) {
    return { success: false, message: 'Something went wrong' };
  }
}

export async function updateBudgetPlan(formData: PlanForm, planId: string) {
  try {
    await db
      .update(budgetPlans)
      .set({
        name: formData.name,
        description: formData.description,
        statusId: formData.statusId,
      })
      .where(eq(budgetPlans.id, planId));

    revalidatePath('/');

    return { success: true, message: 'Updated the plan' };
  } catch (e) {
    console.log(e);
    return { success: false, message: 'Something went wrong' };
  }
}
