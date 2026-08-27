"use client"

import * as React from "react"

import { useAuth } from "@/components/AuthContext"
import { Badge } from "@/components/ui/badge"
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
import type { ProjectRow, ProjectStatus } from "@/lib/firestore-types"
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore"

const STATUS_LABELS: Record<ProjectStatus, string> = {
  planned: "Planned",
  active: "Active",
  done: "Done",
}

const STATUS_VARIANT: Record<ProjectStatus, "default" | "secondary" | "outline"> = {
  planned: "outline",
  active: "default",
  done: "secondary",
}

export default function AdminProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = React.useState<ProjectRow[]>([])
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<ProjectRow | null>(null)

  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [ownerUid, setOwnerUid] = React.useState("")
  const [status, setStatus] = React.useState<ProjectStatus>("planned")
  const [deadline, setDeadline] = React.useState("")
  const [githubUrl, setGithubUrl] = React.useState("")
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    return onSnapshot(collection(db, "projects"), (snap) => {
      const next: ProjectRow[] = snap.docs.map((d) => {
        const data = d.data() as any
        return {
          id: d.id,
          name: data.name ?? "(untitled)",
          description: data.description,
          members: Array.isArray(data.members) ? data.members : [],
          ownerUid: data.ownerUid ?? null,
          status: data.status ?? "planned",
          deadline: data.deadline ?? null,
          githubUrl: data.githubUrl,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }
      })
      setProjects(next)
    })
  }, [])

  function startCreate() {
    setEditing(null)
    setName("")
    setDescription("")
    setOwnerUid(user?.uid ?? "")
    setStatus("planned")
    setDeadline("")
    setGithubUrl("")
    setOpen(true)
  }

  function startEdit(p: ProjectRow) {
    setEditing(p)
    setName(p.name)
    setDescription(p.description ?? "")
    setOwnerUid(p.ownerUid ?? "")
    setStatus(p.status ?? "planned")
    setDeadline(
      p.deadline
        ? new Date((p.deadline as any).toDate()).toISOString().slice(0, 10)
        : ""
    )
    setGithubUrl(p.githubUrl ?? "")
    setOpen(true)
  }

  async function saveProject(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)

    try {
      const batch = writeBatch(db)
      const deadlineTs = deadline ? new Date(deadline) : null

      if (editing) {
        const ref = doc(db, "projects", editing.id)
        batch.update(ref, {
          name,
          description,
          ownerUid: ownerUid || null,
          status,
          deadline: deadlineTs,
          githubUrl: githubUrl || null,
          updatedAt: serverTimestamp(),
        })
        batchAudit(batch, {
          actorUid: user.uid,
          actorEmail: user.email ?? undefined,
          action: "project.updated",
          targetType: "project",
          targetId: editing.id,
          targetLabel: name,
          metadata: { status, deadline, githubUrl },
        })
      } else {
        const ref = doc(collection(db, "projects"))
        batch.set(ref, {
          name,
          description,
          members: [],
          ownerUid: ownerUid || null,
          status,
          deadline: deadlineTs,
          githubUrl: githubUrl || null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
        batchAudit(batch, {
          actorUid: user.uid,
          actorEmail: user.email ?? undefined,
          action: "project.created",
          targetType: "project",
          targetId: ref.id,
          targetLabel: name,
          metadata: { status },
        })
      }

      await batch.commit()
      setOpen(false)
    } finally {
      setSaving(false)
    }
  }

  async function deleteProject(p: ProjectRow) {
    if (!user) return
    const ok = window.confirm(`Delete project "${p.name}"?`)
    if (!ok) return

    const batch = writeBatch(db)
    batch.delete(doc(db, "projects", p.id))
    batchAudit(batch, {
      actorUid: user.uid,
      actorEmail: user.email ?? undefined,
      action: "project.deleted",
      targetType: "project",
      targetId: p.id,
      targetLabel: p.name,
    })
    await batch.commit()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Create, edit, and delete projects.</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button type="button" onClick={startCreate}>
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Edit project" : "Create project"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={saveProject} className="flex flex-col gap-6">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="proj-name">Name</FieldLabel>
                    <Input
                      id="proj-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="proj-desc">Description</FieldLabel>
                    <Textarea
                      id="proj-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="proj-owner">Owner UID</FieldLabel>
                    <Input
                      id="proj-owner"
                      value={ownerUid}
                      onChange={(e) => setOwnerUid(e.target.value)}
                      placeholder="Firebase Auth UID"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="proj-status">Status</FieldLabel>
                    <select
                      id="proj-status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="planned">Planned</option>
                      <option value="active">Active</option>
                      <option value="done">Done</option>
                    </select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="proj-deadline">Deadline</FieldLabel>
                    <Input
                      id="proj-deadline"
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="proj-github">GitHub URL</FieldLabel>
                    <Input
                      id="proj-github"
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/…"
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
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>GitHub</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground">
                  No projects yet.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-medium">{p.name}</div>
                    {p.description && (
                      <div className="max-w-[18rem] truncate text-xs text-muted-foreground">
                        {p.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[p.status ?? "planned"]}>
                      {STATUS_LABELS[p.status ?? "planned"]}
                    </Badge>
                  </TableCell>
                  <TableCell>{p.members.length}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {p.deadline
                      ? new Date((p.deadline as any).toDate()).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {p.githubUrl ? (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline underline-offset-2"
                      >
                        Link
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(p)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteProject(p)}
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
