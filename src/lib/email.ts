import nodemailer from "nodemailer";

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendContactNotification(name: string, email: string, message: string) {
  const transporter = getTransporter();
  if (!transporter) return;

  const to = process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER;
  if (!to) return;

  await transporter.sendMail({
    from: `"Form & Frame" <${process.env.SMTP_USER}>`,
    to,
    subject: `New Inquiry from ${name}`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;">
        <h2 style="color:#D4AF37;font-size:18px;margin-bottom:24px;">Form & Frame — New Contact Inquiry</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Name</td></tr>
          <tr><td style="padding:0 0 16px;font-size:15px;">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Email</td></tr>
          <tr><td style="padding:0 0 16px;font-size:15px;"><a href="mailto:${email}" style="color:#D4AF37;">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Message</td></tr>
          <tr><td style="padding:0 0 16px;font-size:14px;line-height:1.6;white-space:pre-wrap;">${message}</td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #333;margin:24px 0;" />
        <p style="color:#666;font-size:11px;">Sent via formandframe.com</p>
      </div>
    `,
  });
}
