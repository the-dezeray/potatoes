import nodemailer from "nodemailer";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { recipients } from "../emails/recipients.js";
import { buildInviteHtml } from "../emails/inviteTemplate.js";

const args = process.argv.slice(2);
const isTest = args.includes("--test");
const isDry = args.includes("--dry");
const isSave = args.includes("--save");

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const PASSWORD = process.env.INVITE_PASSWORD;

if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
  console.error("Missing GMAIL_USER / GMAIL_APP_PASSWORD. Run with: node --env-file=.env scripts/sendInvites.mjs");
  process.exit(1);
}

if (!PASSWORD) {
  console.error("Missing INVITE_PASSWORD. Add it to .env — see .env.example.");
  process.exit(1);
}

const SUBJECT = "You're In 🎉 — Access to the BIUST Notice Board Beta";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
});

function preview(recipient) {
  const html = buildInviteHtml({ ...recipient, password: PASSWORD });
  console.log(`\n===== EMAIL TO: ${recipient.name} <${recipient.email}> =====`);
  console.log(`Subject: ${SUBJECT}`);
  console.log(html);
  console.log("===== END =====\n");
}

async function sendOne(recipient) {
  const html = buildInviteHtml({ ...recipient, password: PASSWORD });
  return await transporter.sendMail({
    from: `"BIUST Innovation Club" <${GMAIL_USER}>`,
    to: recipient.email,
    subject: SUBJECT,
    html,
  });
}

function saveOne(recipient) {
  const dir = resolve("emails/out");
  mkdirSync(dir, { recursive: true });
  const file = `${recipient.email.replace(/[^a-z0-9]/gi, "_")}.html`;
  const path = resolve(dir, file);
  const html = buildInviteHtml({ ...recipient, password: PASSWORD });
  writeFileSync(path, html);
  console.log(`[SAVED] ${file} — open this file in a browser, Ctrl+A, Ctrl+C, then paste into Outlook`);
  return path;
}

const targets = isTest
  ? recipients.filter((r) => r.email.toLowerCase().startsWith("cd23018473"))
  : recipients;

if (targets.length === 0) {
  console.error("No matching recipients for --test (expected Desiree Chingwaru).");
  process.exit(1);
}

console.log(`Mode: ${isTest ? "TEST (Desiree only)" : "FULL send"} | ${isDry ? "DRY RUN (no email sent)" : "LIVE"}${isSave ? " | SAVING to emails/out/" : ""}`);
console.log(`Recipients: ${targets.length}`);

if (isSave) {
  for (const r of targets) saveOne(r);
  console.log(`Saved ${targets.length} email(s) to emails/out/ — open one in a browser, Ctrl+A, Ctrl+C, paste into Outlook. Nothing sent.`);
  process.exit(0);
}

if (isDry) {
  for (const r of targets) preview(r);
  console.log(`Generated ${targets.length} email(s) for review — nothing sent.`);
  process.exit(0);
}

let sent = 0;
let failed = 0;

for (const r of targets) {
  try {
    const info = await sendOne(r);
    sent++;
    console.log(`[OK] ${r.email} — ${info.messageId}`);
  } catch (err) {
    failed++;
    console.error(`[FAIL] ${r.email} — ${err.message}`);
  }
}

console.log(`\nDone. Sent: ${sent} | Failed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
