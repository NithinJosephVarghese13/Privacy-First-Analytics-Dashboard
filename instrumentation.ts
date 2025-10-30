import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
});

export const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

export async function initTelemetry() {
  try {
    sdk.start();
    console.log('OpenTelemetry initialized');
  } catch (error) {
    console.error('Error initializing OpenTelemetry', error);
  }
}

export async function shutdownTelemetry() {
  try {
    await sdk.shutdown();
    console.log('OpenTelemetry shutdown');
  } catch (error) {
    console.error('Error shutting down OpenTelemetry', error);
  }
}