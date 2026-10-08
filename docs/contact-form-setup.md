# Gmail contact form

The footer posts to /api/contact, a Node.js route that sends plain-text email through Gmail SMTP. The recipient is fixed to tamphi5002@gmail.com; visitors supply Reply-To only. Formspree is no longer used.

Set GMAIL_USER and GMAIL_APP_PASSWORD in the ignored .env.local file. Generate an app password with Google 2-Step Verification enabled. Never prefix credentials with NEXT_PUBLIC_ or commit them.

On Vercel, set both variables in Project Settings → Environment Variables for Production, then redeploy. Other hosts need server-side Next.js and outbound SMTP port 465. Test delivery after deployment because Google may reject new server sign-ins.

Protection includes same-origin browser requests, bounded request size, validation, honeypot, and five attempts per ten minutes per IP per running instance. The in-memory limiter resets on cold starts and is not distributed: add a hosting WAF/shared rate limiter before public launch. Origin checks alone do not block scripts.

A successful response means Gmail accepted the message, not that inbox placement was confirmed. Failed submissions preserve text. This route does not log message bodies or raw SMTP errors.

Google setup: https://support.google.com/accounts/answer/185833
