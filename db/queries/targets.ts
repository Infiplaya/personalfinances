import { and, eq } from 'drizzle-orm';
import { cache } from 'react';
import { db } from '..';
import { financial_targets } from '../schema/finances';
import { getCurrentProfile } from './auth';

export type TimePeriod = 'day' | 'month' | 'year';
export type TargetType = 'goal' | 'limit';

async function selectTarget(timePeriod: TimePeriod, targetType: TargetType) {
  const currentProfile = await getCurrentProfile();

  return await db.query.financial_targets.findFirst({
    where: and(
      eq(financial_targets.type, targetType),
      eq(financial_targets.timePeriod, timePeriod),
      eq(financial_targets.profileId, currentProfile.id)
    ),
  });
}

export const getTarget = cache(selectTarget);
