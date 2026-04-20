import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  type WriteBatch,
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import type { AuditLogDoc } from "@/lib/firestore-types"
import { stripUndefinedDeep } from "@/lib/firestore-clean"

export type AuditParams = Pick<
  AuditLogDoc,
  "actorUid" | "actorEmail" | "action" | "targetType" | "targetId" | "targetLabel" | "metadata"
>

/**
 * Write a single audit log entry (fire-and-forget; does not block your action).
 */
export function writeAudit(params: AuditParams): Promise<void> {
  return addDoc(
    collection(db, "auditLogs"),
    stripUndefinedDeep({
      ...params,
      createdAt: serverTimestamp(),
    })
  ).then(() => undefined)
}

/**
 * Add an audit-log set() to an existing WriteBatch so the action + the
 * audit record land atomically.
 */
export function batchAudit(batch: WriteBatch, params: AuditParams): WriteBatch {
  const ref = doc(collection(db, "auditLogs"))
  batch.set(
    ref,
    stripUndefinedDeep({
      ...params,
      createdAt: serverTimestamp(),
    })
  )
  return batch
}
