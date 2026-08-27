"use client"

import * as React from "react"

import { useAuth } from "@/components/AuthContext"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { db } from "@/lib/firebase"
import { batchAudit } from "@/lib/audit"
import type { AnnouncementRow, AnnouncementType } from "@/lib/firestore-types"
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore"

export default function AdminAnnouncementsPage() {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = React.useState<AnnouncementRow[]>([])
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<AnnouncementRow | null>(null)
  const [title, setTitle] = React.useState("")
  const [body, setBody] = React.useState("")
  const [annType, setAnnType] = React.useState<AnnouncementType>("general")
  const [link, setLink] = React.useState("")
  const [isUrgent, setIsUrgent] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    const q = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc")
    )
    return onSnapshot(q, (snap) => {
      const next: AnnouncementRow[] = snap.docs.map((d) => {
        const data = d.data() as any
        return {
          id: d.id,
          title: data.title ?? "(untitled)",
          body: data.body,
          type: data.type,
          link: data.link,
          isUrgent: data.isUrgent ?? false,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          createdBy: data.createdBy,
        }
      })
      setAnnouncements(next)
    })
  }, [])

  function startCreate() {
    setEditing(null)
    setTitle("")
    setBody("")
    setAnnType("general")
    setLink("")
    setIsUrgent(false)
    setOpen(true)
  }

  function startEdit(a: AnnouncementRow) {
    setEditing(a)
    setTitle(a.title)
    setBody(a.body ?? "")
    setAnnType(a.type ?? "general")
    setLink(a.link ?? "")
    setIsUrgent(a.isUrgent ?? false)
    setOpen(true)
  }

  async function saveAnnouncement(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    try {
      const batch = writeBatch(db)

      if (editing) {
        const ref = doc(db, "announcements", editing.id)
        batch.update(ref, {
          title,
          body,
          type: annType,
          link: link || null,
          isUrgent,
          updatedAt: serverTimestamp(),
        })
        batchAudit(batch, {
          actorUid: user.uid,
          actorEmail: user.email ?? undefined,
          action: "announcement.updated",
          targetType: "announcement",
          targetId: editing.id,
          targetLabel: title,
        })
      } else {
        const ref = doc(collection(db, "announcements"))
        batch.set(ref, {
          title,
          body,
          type: annType,
          link: link || null,
          isUrgent,
          createdBy: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
        batchAudit(batch, {
          actorUid: user.uid,
          actorEmail: user.email ?? undefined,
          action: "announcement.created",
          targetType: "announcement",
          targetId: ref.id,
          targetLabel: title,
        })
      }

      await batch.commit()
      setOpen(false)
    } finally {
      setSaving(false)
    }
  }

  async function deleteAnnouncement(a: AnnouncementRow) {
    if (!user) return
    if (!window.confirm(`Delete "${a.title}"?`)) return
    const batch = writeBatch(db)
    batch.delete(doc(db, "announcements", a.id))
    batchAudit(batch, {
      actorUid: user.uid,
      actorEmail: user.email ?? undefined,
      action: "announcement.deleted",
      targetType: "announcement",
      targetId: a.id,
      targetLabel: a.title,
    })
    await batch.commit()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Publish monthly updates for club members.</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button type="button" onClick={startCreate}>
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Edit announcement" : "New announcement"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={saveAnnouncement} className="flex flex-col gap-6">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="ann-title">Title</FieldLabel>
                    <Input
                      id="ann-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="ann-type">Type</FieldLabel>
                    <select
                      id="ann-type"
                      value={annType}
                      onChange={(e) => setAnnType(e.target.value as AnnouncementType)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="general">General</option>
                      <option value="meeting">Meeting</option>
                      <option value="payment">Payment</option>
                      <option value="warning">Warning</option>
                      <option value="link">Link</option>
                    </select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="ann-link">Action Link (optional)</FieldLabel>
                    <Input
                      id="ann-link"
                      type="url"
                      placeholder="https://..."
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isUrgent}
                        onChange={(e) => setIsUrgent(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      Mark as Urgent
                    </label>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="ann-body">Body</FieldLabel>
                    <Textarea
                      id="ann-body"
                      rows={5}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                    />
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving…" : "Save"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  No announcements yet.
                </TableCell>
              </TableRow>
            ) : (
              announcements.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <div className="font-medium flex items-center gap-1.5">
                      {a.isUrgent && <span className="text-red-500 text-xs font-bold uppercase">URGENT</span>}
                      {a.title}
                    </div>
                    {a.body && (
                      <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {a.body}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm capitalize text-muted-foreground">{a.type ?? "general"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {a.createdAt
                      ? new Date((a.createdAt as any).toDate()).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {a.updatedAt
                      ? new Date((a.updatedAt as any).toDate()).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(a)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteAnnouncement(a)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
