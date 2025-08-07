import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  // Categories
  const general = await prisma.category.upsert({
    where: { slug: 'general' },
    update: {},
    create: { name: 'General', slug: 'general' }
  });

  // Example Agent
  await prisma.agent.upsert({
    where: { slug: 'logan-frost' },
    update: {},
    create: {
      name: 'Logan Frost',
      slug: 'logan-frost',
      description: 'Sharp, concise copywriter persona for tech marketing.',
      welcomeMessage: 'Hey, I\'m Logan Frost. What are we writing today?',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
      model: 'gpt-4o-mini',
      temperature: 0.6,
      tone: 'professional',
      style: 'concise',
      outputLanguage: 'en',
      categoryId: general.id,
      dalleEnabled: true,
      visibility: 'PUBLIC',
      tierRequired: 0
    }
  });

  // Credit packages
  await prisma.creditPackage.upsert({
    where: { slug: 'starter-100' },
    update: {},
    create: {
      name: 'Starter 100',
      slug: 'starter-100',
      credits: 100,
      priceCents: 500,
      currency: 'usd',
      tierUnlocked: 0,
      bonus: 0
    }
  });

  await prisma.creditPackage.upsert({
    where: { slug: 'pro-500' },
    update: {},
    create: {
      name: 'Pro 500',
      slug: 'pro-500',
      credits: 500,
      priceCents: 2000,
      currency: 'usd',
      tierUnlocked: 1,
      bonus: 50
    }
  });

  // Pages
  await prisma.page.upsert({
    where: { slug: 'privacy-policy' },
    update: {},
    create: {
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      content: '# Privacy Policy\n\nYour privacy matters.'
    }
  });

  await prisma.page.upsert({
    where: { slug: 'terms' },
    update: {},
    create: {
      slug: 'terms',
      title: 'Terms of Service',
      content: '# Terms of Service\n\nUse responsibly.'
    }
  });

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });