// ── Club colour palette ───────────────────────────────────────────────────────
// #fbd35a  yellow   (primary accent)
// #8ecfc8  teal     (secondary accent)
// #f4c3b3  peach    (soft / warning accent)
// #1c1c1c  near-black (borders, text)

const baseTemplate = (accentColor, badgeText, content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BIUST Innovation Club</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f0f0;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f0f0;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Outer card -->
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:2px solid #1c1c1c;box-shadow:5px 5px 0 #1c1c1c;">

          <!-- Header stripe -->
          <tr>
            <td style="background-color:${accentColor};border-bottom:2px solid #1c1c1c;padding:24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#1c1c1c;">
                      BIUST INNOVATION CLUB
                    </p>
                    <p style="margin:4px 0 0;font-size:22px;font-weight:900;color:#1c1c1c;letter-spacing:-0.5px;">
                      ${badgeText}
                    </p>
                  </td>
                  <td align="right" style="vertical-align:top;">
                    <span style="display:inline-block;background:#1c1c1c;color:${accentColor};font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:4px 10px;">
                      NOTICE
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <div style="border-top:2px dashed #d1d5db;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:#fafafa;border-top:2px solid #1c1c1c;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;font-weight:700;color:#1c1c1c;letter-spacing:1px;text-transform:uppercase;">
                      BIUST Innovation Club
                    </p>
                    <p style="margin:4px 0 0;font-size:11px;color:#6b7280;">
                      Botswana International University of Science &amp; Technology
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin:0;font-size:10px;color:#9ca3af;">
                      &copy; ${new Date().getFullYear()}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <!-- Bottom tag line -->
        <p style="margin:16px 0 0;font-size:10px;color:#9ca3af;letter-spacing:1px;text-transform:uppercase;">
          This is an automated message — please do not reply.
        </p>

      </td>
    </tr>
  </table>

</body>
</html>
`

// ── Shared inner styles ────────────────────────────────────────────────────────

const bodyText = `font-size:15px;line-height:1.7;color:#374151;margin:0 0 16px;`
const boldText = `font-size:15px;line-height:1.7;color:#1c1c1c;font-weight:700;margin:0 0 16px;`

// ── Templates ─────────────────────────────────────────────────────────────────

export const applicationReceived = (name) =>
  baseTemplate(
    "#8ecfc8",
    "Application Received",
    `
    <p style="${boldText}">Hey ${name},</p>
    <p style="${bodyText}">
      Thanks for applying to the BIUST Innovation Club! We've received your application
      and our team will review it shortly.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background:#f0faf9;border:2px solid #1c1c1c;box-shadow:3px 3px 0 #1c1c1c;padding:16px 20px;">
          <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1c1c1c;">
            What Happens Next
          </p>
          <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">
            Our team reviews applications on a rolling basis. You'll get an email once a decision has been made — usually within a few days.
          </p>
        </td>
      </tr>
    </table>

    <p style="${bodyText}">We're excited to learn more about you. Hang tight!</p>
    `
  )

export const accepted = (name) =>
  baseTemplate(
    "#fbd35a",
    "Welcome to the Club!",
    `
    <p style="${boldText}">Congratulations, ${name}!</p>
    <p style="${bodyText}">
      You're officially a member of the BIUST Innovation Club. We're stoked to have you on board.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background:#fffbeb;border:2px solid #1c1c1c;box-shadow:3px 3px 0 #1c1c1c;padding:16px 20px;">
          <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1c1c1c;">
            Getting Started
          </p>
          <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">
            Log into the member portal to complete your profile, explore ongoing projects,
            and connect with the rest of the club.
          </p>
        </td>
      </tr>
    </table>

    <p style="${bodyText}">See you at the next meeting!</p>
    `
  )

export const rejected = (name) =>
  baseTemplate(
    "#f4c3b3",
    "Application Update",
    `
    <p style="${boldText}">Hi ${name},</p>
    <p style="${bodyText}">
      Thank you for your interest in the BIUST Innovation Club. After careful review,
      we're unable to move forward with your application at this time.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background:#fdf5f2;border:2px solid #1c1c1c;box-shadow:3px 3px 0 #1c1c1c;padding:16px 20px;">
          <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1c1c1c;">
            A Note From Us
          </p>
          <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">
            This decision doesn't reflect your potential. We encourage you to keep building,
            keep learning, and apply again in the future.
          </p>
        </td>
      </tr>
    </table>

    <p style="${bodyText}">We wish you the very best.</p>
    `
  )

export const massUpdate = (message) =>
  baseTemplate(
    "#8ecfc8",
    "Club Announcement",
    `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="background:#f0faf9;border:2px solid #1c1c1c;box-shadow:3px 3px 0 #1c1c1c;padding:20px 24px;">
          <p style="margin:0;font-size:15px;color:#1c1c1c;line-height:1.7;">
            ${message}
          </p>
        </td>
      </tr>
    </table>

    <p style="${bodyText}">Stay tuned for more updates from the club.</p>
    `
  )

export const meetingInvite = (name, date) =>
  baseTemplate(
    "#fbd35a",
    "Meeting Invitation",
    `
    <p style="${boldText}">Hey ${name},</p>
    <p style="${bodyText}">You're invited to an upcoming Innovation Club meeting. Mark your calendar!</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background:#fffbeb;border:2px solid #1c1c1c;box-shadow:3px 3px 0 #1c1c1c;padding:16px 24px;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1c1c1c;">
            Date &amp; Time
          </p>
          <p style="margin:0;font-size:20px;font-weight:900;color:#1c1c1c;">
            ${date}
          </p>
        </td>
      </tr>
    </table>

    <p style="${bodyText}">We look forward to seeing you there!</p>
    `
  )
