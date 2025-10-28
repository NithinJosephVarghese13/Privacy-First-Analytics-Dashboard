import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  const pages = [
    { url: 'https://example.com/', title: 'Home Page' },
    { url: 'https://example.com/about', title: 'About Us' },
    { url: 'https://example.com/products', title: 'Products' },
    { url: 'https://example.com/contact', title: 'Contact' },
    { url: 'https://example.com/blog', title: 'Blog' },
  ];

  for (const pageData of pages) {
    const page = await prisma.page.upsert({
      where: { url: pageData.url },
      update: {},
      create: pageData,
    });

    const eventCount = Math.floor(Math.random() * 50) + 10;
    const visitors = Array.from({ length: 5 }, (_, i) =>
      `visitor_hash_${i}_${Date.now()}`
    );

    for (let i = 0; i < eventCount; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - daysAgo);
      timestamp.setHours(Math.floor(Math.random() * 24));

      await prisma.event.create({
        data: {
          pageId: page.id,
          timestamp,
          eventType: ['pageview', 'click', 'form_submit'][
            Math.floor(Math.random() * 3)
          ],
          visitorHash: visitors[Math.floor(Math.random() * visitors.length)],
          userAgent: 'Mozilla/5.0 (seed data)',
          metadata: {},
          consentGiven: true,
        },
      });
    }

    console.log(`Created ${eventCount} events for ${page.title}`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
