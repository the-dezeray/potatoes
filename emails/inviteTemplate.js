export function buildInviteHtml({ name, email, password }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePassword = escapeHtml(password);

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>You're In — BIUST Notice Board Beta</title>
<style>
  :root { color-scheme: light; }
  [data-ogsc] body, body[data-ogsc], html[data-ogsc] { background-color: #FAF6EF !important; color: #1c1c1c !important; }
  [data-ogsc] body, [data-ogsc] .card { background-color: #FAF6EF !important; }
  @media (prefers-color-scheme: dark) {
    body, body * { background-color: #FAF6EF !important; color: #1c1c1c !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:#FAF6EF; color-scheme:light; color:#1c1c1c; font-family:'Space Grotesk', 'Segoe UI', ui-sans-serif, system-ui, sans-serif;">

  <center style="width:100%; table-layout:fixed; -webkit-text-size-adjust:100%; background-color:#FAF6EF; color-scheme:light; background-image:radial-gradient(at 15% 10%, rgba(255,68,0,0.05) 0, transparent 40%), radial-gradient(at 85% 10%, rgba(19,78,142,0.05) 0, transparent 40%);">
  <div style="max-width:560px; margin:0 auto; padding:40px 24px;">

    <!-- Card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; background-color:#FAF6EF; color-scheme:light; border:3px solid #1c1c1c; border-radius:32px; box-shadow:8px 8px 0 #1c1c1c; overflow:hidden;">

      <!-- Banner -->
      <tr>
        <td style="background:#1c1c1c; color:#ffffff; padding:26px 28px; border-bottom:3px solid #1c1c1c;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>
            <td style="font-family:'Press Start 2P', monospace; font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:#ffffff; vertical-align:middle;">Notice Board</td>
            <td align="right" style="vertical-align:middle;">
              <span style="display:inline-block; background:#fbd35a; color:#1c1c1c; border-radius:999px; padding:7px 14px; font-size:12px; font-weight:700;">BETA</span>
            </td>
          </tr></table>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:30px 32px;">

          <p style="margin:0 0 14px 0; font-size:13px; font-weight:600; color:#6b6b6b; letter-spacing:0.08em; text-transform:uppercase;">Welcome, ${safeName}</p>

          <h1 style="margin:0 0 16px 0; font-size:30px; line-height:1.15; font-weight:700; letter-spacing:-0.02em; color:#1c1c1c;">
            You've been granted access to the <span style="color:#ff4400; font-style:italic;">private beta</span> of the BIUST Notice Board.
          </h1>

          <p style="margin:0 0 18px 0; font-size:14px; line-height:1.6; color:#555555;">
            We've built a central notice board for the BIUST community — announcements, events,
            courses and everything in between, all in one place. As one of our first beta testers,
            your account is ready to go.
          </p>

          <!-- Sign-in panel -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; background:#edf9f7; border:2px solid #1c1c1c; border-radius:20px; box-shadow:4px 4px 0 #1c1c1c; margin-bottom:20px;">
            <tr>
              <td style="padding:18px 20px;">
                <p style="margin:0 0 14px 0; font-family:'Press Start 2P', monospace; font-size:9px; letter-spacing:0.2em; text-transform:uppercase; color:#134e8e;">Your Login Details</p>

                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:8px 0; border-bottom:2px dashed rgba(28,28,28,0.15); font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#6b6b6b; width:96px;">Email</td>
                    <td style="padding:8px 0; border-bottom:2px dashed rgba(28,28,28,0.15); font-size:14px; font-weight:700; color:#1c1c1c;">${safeEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#6b6b6b; width:96px;">Password</td>
                    <td style="padding:8px 0; font-size:14px; font-weight:700; color:#c00707;">${safePassword}</td>
                  </tr>
                </table>

                <p style="margin:14px 0 0 0; font-size:12px; line-height:1.5; color:#555555;">
                  Use the email above as your username and the password shown to log in. You can
                  change your password once you're inside.
                </p>
              </td>
            </tr>
          </table>

          <!-- CTA button -->
          <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 22px auto;">
            <tr>
              <td align="center" style="border-radius:14px; background:#ff4400; border:2px solid #1c1c1c; box-shadow:4px 4px 0 #1c1c1c;">
                <a href="https://biust-notice-board.vercel.app" style="display:inline-block; padding:14px 34px; font-size:15px; font-weight:700; color:#ffffff; text-decoration:none; letter-spacing:0.01em;">Open the Notice Board</a>
              </td>
            </tr>
          </table>

          <p style="margin:0 0 6px 0; font-size:13px; line-height:1.6; color:#555555; text-align:center;">
            Questions or feedback? Hit reply — we'd love to hear what you think.
          </p>
          <p style="margin:0; font-size:13px; line-height:1.6; color:#3a3a3a; font-weight:600; text-align:center;">
            Welcome aboard. 🚀
          </p>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#1c1c1c; color:#ffffff; padding:16px 28px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>
            <td style="font-family:'Press Start 2P', monospace; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:#ffffff; vertical-align:middle;">BIUST Innovation Club</td>
            <td align="right" style="font-size:11px; color:rgba(255,255,255,0.65); font-weight:500; vertical-align:middle;">Building the future of tech in Botswana.</td>
          </tr></table>
        </td>
      </tr>

    </table>

  </div>
  </center>

</body>
</html>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
