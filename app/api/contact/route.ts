import { Resend } from 'resend'
import { NextResponse } from 'next/server'

// Basic MX / format validation via a free API
async function isEmailReal(email: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${process.env.HUNTER_API_KEY}`,
      { next: { revalidate: 0 } }
    )
    if (!res.ok) return true // if API fails, don't block submission
    const data = await res.json()
    const status = data?.data?.status
    // block only clearly disposable / invalid
    return status !== 'disposable' && status !== 'invalid'
  } catch {
    return true
  }
}

function buildReplyBody(
  fullName: string,
  email: string,
  phone: string,
  nationality: string,
  currentResidence: string,
  destinationCountry: string,
  service: string,
  message: string
) {
  const lines = [
    `Hi ${fullName.split(' ')[0]},`,
    '',
    'Thank you for reaching out to Avilo Immigration!',
    '',
    'Here is a summary of your request:',
    `  • Nationality: ${nationality}`,
    `  • Moving from: ${currentResidence} → ${destinationCountry}`,
    `  • Service: ${service}`,
    phone ? `  • Phone: ${phone}` : '',
    '',
    `Your message: "${message}"`,
    '',
    '---',
    '',
    '[Your response here]',
    '',
    'Best regards,',
    'Avilo Immigration Team',
    'info@aviloimmigration.com',
  ].filter((l) => l !== undefined)

  return encodeURIComponent(lines.join('\n'))
}

function buildEmailHtml(
  fullName: string,
  email: string,
  phone: string,
  nationality: string,
  currentResidence: string,
  destinationCountry: string,
  service: string,
  message: string
) {
  const replyBody = buildReplyBody(fullName, email, phone, nationality, currentResidence, destinationCountry, service, message)
  const replySubject = encodeURIComponent(`Re: Your consultation request — Avilo Immigration`)
  const mailtoHref = `mailto:${email}?subject=${replySubject}&body=${replyBody}`

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
        <p style="margin: 0; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.06em; font-family: Arial, sans-serif;">${label}</p>
        <p style="margin: 4px 0 0; font-size: 15px; color: #1a1a2e; font-weight: 600; font-family: Arial, sans-serif;">${value}</p>
      </td>
    </tr>`

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f0effe;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0effe;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="background-color:#7c6fcd;padding:32px 40px;border-radius:12px 12px 0 0;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.8);letter-spacing:0.1em;text-transform:uppercase;font-family:Arial,sans-serif;">Avilo Immigration</p>
          <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;font-family:Arial,sans-serif;">New Consultation Request</h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="background-color:#ffffff;padding:36px 40px;border-radius:0 0 12px 12px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${row('Full Name', fullName)}
            ${row('Email', `<a href="mailto:${email}" style="color:#7c6fcd;text-decoration:none;">${email}</a>`)}
            ${phone ? row('Phone', phone) : ''}
            ${row('Nationality', nationality)}
            ${row('Current Residence → Destination', `${currentResidence} &rarr; ${destinationCountry}`)}
            ${row('Service Needed', service)}

            <!-- Message -->
            <tr><td style="padding-top:20px;">
              <p style="margin:0 0 8px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;font-family:Arial,sans-serif;">Message</p>
              <div style="background-color:#f0effe;border-radius:8px;padding:16px 20px;">
                <p style="margin:0;font-size:15px;color:#1a1a2e;line-height:1.65;font-family:Arial,sans-serif;">${message.replace(/\n/g, '<br>')}</p>
              </div>
            </td></tr>
          </table>

          <!-- Reply button -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
            <tr><td align="center">
              <a href="${mailtoHref}"
                 style="display:inline-block;background-color:#7c6fcd;color:#ffffff;font-size:15px;font-weight:700;padding:14px 36px;border-radius:8px;text-decoration:none;font-family:Arial,sans-serif;">
                ↩&nbsp; Reply to ${fullName.split(' ')[0]}
              </a>
            </td></tr>
            <tr><td align="center" style="padding-top:10px;">
              <p style="margin:0;font-size:12px;color:#6b7280;font-family:Arial,sans-serif;">
                Opens a pre-filled email to <strong>${email}</strong>
              </p>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="text-align:center;padding:24px 0 8px;">
          <p style="margin:0;font-size:11px;color:#9ca3af;font-family:Arial,sans-serif;">
            Avilo Immigration &middot; info@aviloimmigration.com
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function POST(req: Request) {
  const { fullName, email, phone, nationality, currentResidence, destinationCountry, service, message } =
    await req.json()

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  // Optional real-email check (only runs if HUNTER_API_KEY is set)
  if (process.env.HUNTER_API_KEY) {
    const real = await isEmailReal(email)
    if (!real) {
      return NextResponse.json({ error: 'Please use a valid email address.' }, { status: 400 })
    }
  }

  const html = buildEmailHtml(fullName, email, phone || '', nationality, currentResidence, destinationCountry, service, message)

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: 'Avilo Contact Form <onboarding@resend.dev>',
    to: process.env.CONTACT_EMAIL!,
    replyTo: email,
    subject: `New consultation request from ${fullName}`,
    html,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
