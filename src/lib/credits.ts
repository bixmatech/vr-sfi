import { prisma } from '@/lib/prisma';

export async function getUserCredits(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { credits: true } });
  return user?.credits ?? 0;
}

export async function requireCredits(userId: string, amount: number) {
  const credits = await getUserCredits(userId);
  if (credits < amount) throw new Error('Insufficient credits');
}

export async function deductCredits(userId: string, amount: number, reason: string) {
  const updated = await prisma.user.update({ where: { id: userId }, data: { credits: { decrement: amount } } });
  await prisma.creditLedger.create({ data: { userId, delta: -amount, reason } });
  return updated.credits;
}

export async function addCredits(userId: string, amount: number, reason: string) {
  const updated = await prisma.user.update({ where: { id: userId }, data: { credits: { increment: amount } } });
  await prisma.creditLedger.create({ data: { userId, delta: amount, reason } });
  return updated.credits;
}