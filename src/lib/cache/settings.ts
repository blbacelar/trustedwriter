import { cache } from 'react'
import { prisma } from "@/lib/prisma"

export const getSettings = cache(async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      profile: true,
      rules: true,
      credits: true,
      subscriptionId: true,
      subscriptionStatus: true,
    }
  });

  return user;
}); 