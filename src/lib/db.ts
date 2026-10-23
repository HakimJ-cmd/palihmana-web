import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  dbCircuitOpenUntil: number | undefined;
};

const rawPrisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = rawPrisma;

const CIRCUIT_TIMEOUT_MS = 30000; // 30 seconds circuit breaker backoff

function isConnectionError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const msg = (err as { message?: string }).message || "";
  return (
    msg.includes("Can't reach database server") ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("P1001") ||
    msg.includes("connect_timeout") ||
    msg.includes("connection closed")
  );
}

function wrapWithCircuitBreaker(target: PrismaClient): PrismaClient {
  return new Proxy(target, {
    get(clientTarget, prop, receiver) {
      const propValue = Reflect.get(clientTarget, prop, receiver);

      // Model queries (e.g. db.article, db.user, db.auditLog, etc.)
      if (typeof propValue === "object" && propValue !== null) {
        return new Proxy(propValue, {
          get(modelTarget, modelProp) {
            const method = (modelTarget as Record<string, unknown>)[modelProp as string];
            if (typeof method === "function") {
              return async function (...args: unknown[]) {
                // If circuit breaker is open, fail fast in 0ms to enable instant SPA navigation
                if (
                  globalForPrisma.dbCircuitOpenUntil &&
                  Date.now() < globalForPrisma.dbCircuitOpenUntil
                ) {
                  throw new Error(
                    "DATABASE_OFFLINE_FAST_FAIL: PostgreSQL offline, circuit breaker open"
                  );
                }

                try {
                  const result = await (method as (...a: unknown[]) => Promise<unknown>).apply(
                    modelTarget,
                    args
                  );
                  globalForPrisma.dbCircuitOpenUntil = 0;
                  return result;
                } catch (error) {
                  if (isConnectionError(error)) {
                    globalForPrisma.dbCircuitOpenUntil = Date.now() + CIRCUIT_TIMEOUT_MS;
                    console.warn(
                      `[DB_CIRCUIT_BREAKER] Database offline. Fast-fail active for ${
                        CIRCUIT_TIMEOUT_MS / 1000
                      }s to maintain instant SPA navigation.`
                    );
                  }
                  throw error;
                }
              };
            }
            return method;
          },
        });
      }

      // Root Prisma methods ($transaction, $queryRaw, $executeRaw)
      if (
        typeof propValue === "function" &&
        (prop === "$transaction" || prop === "$queryRaw" || prop === "$executeRaw")
      ) {
        return async function (...args: unknown[]) {
          if (
            globalForPrisma.dbCircuitOpenUntil &&
            Date.now() < globalForPrisma.dbCircuitOpenUntil
          ) {
            throw new Error(
              "DATABASE_OFFLINE_FAST_FAIL: PostgreSQL offline, circuit breaker open"
            );
          }
          try {
            const result = await (propValue as (...a: unknown[]) => Promise<unknown>).apply(
              clientTarget,
              args
            );
            globalForPrisma.dbCircuitOpenUntil = 0;
            return result;
          } catch (error) {
            if (isConnectionError(error)) {
              globalForPrisma.dbCircuitOpenUntil = Date.now() + CIRCUIT_TIMEOUT_MS;
            }
            throw error;
          }
        };
      }

      return propValue;
    },
  });
}

export const db = wrapWithCircuitBreaker(rawPrisma);
