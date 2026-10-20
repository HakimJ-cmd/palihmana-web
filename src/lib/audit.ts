import { db } from "@/lib/db";

export interface AuditLogParams {
  userId?: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  metadata?: Record<string, any>;
  ipHash?: string | null;
}

export async function logAuditEvent(params: AuditLogParams) {
  try {
    await db.auditLog.create({
      data: {
        userId: params.userId || null,
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId || null,
        metadata: params.metadata || {},
        ipHash: params.ipHash || null,
      },
    });
  } catch (error) {
    // If DB is offline, log to standard output for auditability
    console.info(`[AUDIT_LOG] ${new Date().toISOString()} | Action: ${params.action} | Target: ${params.targetType}:${params.targetId || "-"} | User: ${params.userId || "anonymous"}`);
  }
}
