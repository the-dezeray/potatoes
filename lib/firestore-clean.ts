export function stripUndefinedDeep<T>(value: T): T {
  if (value === undefined) return value
  if (value === null) return value

  // Keep special objects (Date, Firestore FieldValue/Timestamp, etc.) intact.
  const isPlainObject =
    typeof value === "object" &&
    value !== null &&
    (value as any).constructor === Object

  if (Array.isArray(value)) {
    return value
      .map((v) => stripUndefinedDeep(v))
      .filter((v) => v !== undefined) as any
  }

  if (!isPlainObject) return value

  const result: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(value as any)) {
    const cleaned = stripUndefinedDeep(v)
    if (cleaned !== undefined) result[k] = cleaned
  }
  return result as any
}
