import { prisma } from "../lib/prisma";
import { createEventEmbedding } from "../lib/embeddings";

async function generateEmbeddings() {
  console.log("Starting embedding generation...");

  const events = await prisma.event.findMany({
    where: { consentGiven: true },
    include: { embeddings: true },
    take: 1000, // Process in batches
  });

  const eventsWithoutEmbeddings = events.filter(event =>
    !event.embeddings || event.embeddings.length === 0
  );

  console.log(`Found ${eventsWithoutEmbeddings.length} events without embeddings`);

  let processed = 0;
  let errors = 0;

  for (const event of eventsWithoutEmbeddings) {
    try {
      await createEventEmbedding(event.id);
      processed++;
      if (processed % 10 === 0) {
        console.log(`Processed ${processed} embeddings...`);
      }
    } catch (error) {
      console.error(`Failed to create embedding for event ${event.id}:`, error);
      errors++;
    }
  }

  console.log(`Embedding generation complete. Processed: ${processed}, Errors: ${errors}`);
}

generateEmbeddings()
  .catch(console.error)
  .finally(() => process.exit(0));