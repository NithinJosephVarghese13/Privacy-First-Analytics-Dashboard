import { prisma } from "../lib/prisma";
import { createEventEmbedding } from "../lib/embeddings";
import { log } from "../lib/logger";

interface EvaluationMetrics {
  totalEvents: number;
  eventsWithEmbeddings: number;
  embeddingSuccessRate: number;
  averageEmbeddingTime: number;
  totalProcessingTime: number;
  memoryUsage: NodeJS.MemoryUsage;
}

interface EvaluationResult {
  metrics: EvaluationMetrics;
  report: string;
  recommendations: string[];
}

async function runAIEvaluationHarness(): Promise<EvaluationResult> {
  log.info("Starting AI Evaluation Harness");

  const startTime = Date.now();
  const initialMemory = process.memoryUsage();

  // Get sample of events for evaluation
  const events = await prisma.event.findMany({
    where: { consentGiven: true },
    include: { embeddings: true },
    take: 100, // Sample size for evaluation
    orderBy: { timestamp: "desc" },
  });

  log.info("Retrieved events for evaluation", { count: events.length });

  const eventsWithoutEmbeddings = events.filter(event =>
    !event.embeddings || event.embeddings.length === 0
  );

  log.info("Events without embeddings", { count: eventsWithoutEmbeddings.length });

  let processed = 0;
  let successful = 0;
  let failed = 0;
  const embeddingTimes: number[] = [];

  // Process embeddings and measure performance
  for (const event of eventsWithoutEmbeddings.slice(0, 50)) { // Limit for evaluation
    const embeddingStart = Date.now();

    try {
      await createEventEmbedding(event.id);
      const embeddingTime = Date.now() - embeddingStart;
      embeddingTimes.push(embeddingTime);
      successful++;
      log.debug("Embedding created successfully", { eventId: event.id, time: embeddingTime });
    } catch (error) {
      failed++;
      log.error("Embedding creation failed", { eventId: event.id, error: String(error) });
    }

    processed++;
    if (processed % 10 === 0) {
      log.info("Evaluation progress", { processed, successful, failed });
    }
  }

  const totalTime = Date.now() - startTime;
  const finalMemory = process.memoryUsage();

  const metrics: EvaluationMetrics = {
    totalEvents: events.length,
    eventsWithEmbeddings: events.length - eventsWithoutEmbeddings.length,
    embeddingSuccessRate: processed > 0 ? (successful / processed) * 100 : 0,
    averageEmbeddingTime: embeddingTimes.length > 0 ? embeddingTimes.reduce((a, b) => a + b, 0) / embeddingTimes.length : 0,
    totalProcessingTime: totalTime,
    memoryUsage: finalMemory,
  };

  const report = generateReport(metrics);
  const recommendations = generateRecommendations(metrics);

  log.info("AI Evaluation Harness completed", { metrics });

  return { metrics, report, recommendations };
}

function generateReport(metrics: EvaluationMetrics): string {
  return `
AI Evaluation Harness Report
===========================

Overview:
- Total events evaluated: ${metrics.totalEvents}
- Events with existing embeddings: ${metrics.eventsWithEmbeddings}
- Embedding success rate: ${metrics.embeddingSuccessRate.toFixed(2)}%
- Average embedding generation time: ${metrics.averageEmbeddingTime.toFixed(2)}ms
- Total processing time: ${metrics.totalProcessingTime}ms

Memory Usage:
- RSS: ${(metrics.memoryUsage.rss / 1024 / 1024).toFixed(2)} MB
- Heap Used: ${(metrics.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB
- Heap Total: ${(metrics.memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB
- External: ${(metrics.memoryUsage.external / 1024 / 1024).toFixed(2)} MB

Performance Analysis:
${metrics.embeddingSuccessRate > 95 ? '✅ High success rate' : '⚠️  Success rate needs improvement'}
${metrics.averageEmbeddingTime < 500 ? '✅ Fast embedding generation' : '⚠️  Embedding generation could be faster'}
${metrics.totalProcessingTime < 30000 ? '✅ Efficient processing' : '⚠️  Processing time could be optimized'}
  `.trim();
}

function generateRecommendations(metrics: EvaluationMetrics): string[] {
  const recommendations: string[] = [];

  if (metrics.embeddingSuccessRate < 95) {
    recommendations.push("Investigate and fix embedding generation failures");
  }

  if (metrics.averageEmbeddingTime > 1000) {
    recommendations.push("Optimize embedding generation for better performance");
  }

  if (metrics.totalProcessingTime > 60000) {
    recommendations.push("Consider batch processing for better throughput");
  }

  if (metrics.eventsWithEmbeddings / metrics.totalEvents < 0.8) {
    recommendations.push("Run embedding generation on more events to improve coverage");
  }

  if (recommendations.length === 0) {
    recommendations.push("AI system is performing well - continue monitoring");
  }

  return recommendations;
}

// CLI interface
if (require.main === module) {
  runAIEvaluationHarness()
    .then((result) => {
      console.log(result.report);
      console.log("\nRecommendations:");
      result.recommendations.forEach((rec, i) => console.log(`${i + 1}. ${rec}`));
      process.exit(0);
    })
    .catch((error) => {
      log.error("AI Evaluation Harness failed", { error: String(error) });
      process.exit(1);
    });
}

export { runAIEvaluationHarness };
export type { EvaluationResult, EvaluationMetrics };