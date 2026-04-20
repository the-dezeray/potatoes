import type { Timestamp } from "firebase/firestore"

// ─── Users ───────────────────────────────────────────────────────────────────

export type UserRole = "pending" | "member" | "admin" | "rejected"

export type UserDoc = {
  email?: string
  role?: UserRole
  name?: string
  bio?: string
  skills?: string
  phoneNumber?: string
  level?: string
  course?: string
  githubUsername?: string
  /** true once user has submitted the application form */
  applicationSubmitted?: boolean
  applicationSubmittedAt?: Timestamp
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export type UserRow = UserDoc & { id: string }

// ─── Projects ────────────────────────────────────────────────────────────────

export type ProjectStatus = "planned" | "active" | "done"

export type ProjectDoc = {
  name: string
  description?: string
  members: string[]
  ownerUid?: string | null
  status?: ProjectStatus
  deadline?: Timestamp | null
  githubUrl?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export type ProjectRow = ProjectDoc & { id: string }

// ─── Applications ─────────────────────────────────────────────────────────────

export type ApplicationStatus = "submitted" | "approved" | "rejected"

export type ApplicationDoc = {
  uid?: string | null
  fullName?: string
  email?: string
  why?: string
  skills?: string
  level?: string
  course?: string
  phoneNumber?: string
  githubUsername?: string
  status: ApplicationStatus
  reviewedAt?: Timestamp
  reviewedBy?: string | null
  createdAt?: Timestamp
}

export type ApplicationRow = ApplicationDoc & { id: string }

// ─── Announcements ────────────────────────────────────────────────────────────

export type AnnouncementType = "general" | "meeting" | "payment" | "warning" | "link"

export type AnnouncementDoc = {
  title: string
  body?: string
  type?: AnnouncementType
  link?: string
  isUrgent?: boolean
  createdAt?: Timestamp
  updatedAt?: Timestamp
  createdBy?: string | null
}

export type AnnouncementRow = AnnouncementDoc & { id: string }

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export type AuditAction =
  | "user.role_changed"
  | "user.removed"
  | "user.project_assigned"
  | "user.project_removed"
  | "project.created"
  | "project.updated"
  | "project.deleted"
  | "application.approved"
  | "application.rejected"
  | "announcement.created"
  | "announcement.updated"
  | "announcement.deleted"
  | "certificateEvent.created"
  | "certificate.issued"
  | "certificate.revoked"

export type AuditLogDoc = {
  actorUid: string
  actorEmail?: string
  action: AuditAction
  targetType: "user" | "project" | "application" | "announcement" | "certificateEvent" | "certificate"
  targetId: string
  targetLabel?: string
  metadata?: Record<string, unknown>
  createdAt?: Timestamp
}

export type AuditLogRow = AuditLogDoc & { id: string }

// ─── Certificates ───────────────────────────────────────────────────────────

export type CertificateStatus = "issued" | "revoked"

export type CertificateEventDoc = {
  title: string
  description?: string
  date?: Timestamp
  createdAt?: Timestamp
  createdBy?: string | null
}

export type CertificateEventRow = CertificateEventDoc & { id: string }

export type CertificateDoc = {
  eventId?: string

  // external recipient support
  recipientName: string
  recipientEmail?: string

  // optional linkage to an authenticated user
  recipientUserId?: string

  status?: CertificateStatus
  issuedAt?: Timestamp
  revokedAt?: Timestamp
  createdAt?: Timestamp
  createdBy?: string | null
}

export type CertificateRow = CertificateDoc & { id: string }
