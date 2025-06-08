import { trace, SpanStatusCode, SpanKind } from "@opentelemetry/api"

const tracer = trace.getTracer("webfuzsion", "1.0.0")

export interface TraceOptions {
  name: string
  attributes?: Record<string, string | number | boolean>
  kind?: SpanKind
}

export async function withTrace<T>(options: TraceOptions, fn: () => Promise<T>): Promise<T> {
  return tracer.startActiveSpan(
    options.name,
    {
      kind: options.kind || SpanKind.INTERNAL,
      attributes: options.attributes,
    },
    async (span) => {
      try {
        const result = await fn()
        span.setStatus({ code: SpanStatusCode.OK })
        return result
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : "Unknown error",
        })
        span.recordException(error instanceof Error ? error : new Error(String(error)))
        throw error
      } finally {
        span.end()
      }
    },
  )
}

export function addTraceAttributes(attributes: Record<string, string | number | boolean>) {
  const span = trace.getActiveSpan()
  if (span) {
    Object.entries(attributes).forEach(([key, value]) => {
      span.setAttribute(key, value)
    })
  }
}

export function addTraceEvent(name: string, attributes?: Record<string, string | number | boolean>) {
  const span = trace.getActiveSpan()
  if (span) {
    span.addEvent(name, attributes)
  }
}
