import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { to, inviteUrl, workspaceName, projectName, role, inviterName } = body

  if (!to || !inviteUrl) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  const config = useRuntimeConfig()

  if (!config.smtpUser || !config.smtpPass) {
    throw createError({ statusCode: 500, message: 'Email service not configured' })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass
    }
  })

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; width: 40px; height: 40px; background: #171717; border-radius: 10px; line-height: 40px; text-align: center;">
          <span style="color: white; font-size: 18px;">⚡</span>
        </div>
        <h1 style="font-size: 20px; font-weight: 700; color: #171717; margin: 16px 0 4px;">You're invited!</h1>
        <p style="font-size: 14px; color: #737373; margin: 0;">
          ${inviterName || 'Someone'} invited you to collaborate on ElevateYou
        </p>
      </div>

      <div style="background: #fafafa; border: 1px solid #e5e5e5; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <table style="width: 100%; font-size: 14px; color: #404040;">
          <tr>
            <td style="padding: 4px 0; color: #a3a3a3;">Workspace</td>
            <td style="padding: 4px 0; font-weight: 600; text-align: right;">${workspaceName || 'Workspace'}</td>
          </tr>
          ${projectName ? `<tr>
            <td style="padding: 4px 0; color: #a3a3a3;">Project</td>
            <td style="padding: 4px 0; font-weight: 600; text-align: right;">${projectName}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 4px 0; color: #a3a3a3;">Role</td>
            <td style="padding: 4px 0; font-weight: 600; text-align: right; text-transform: capitalize;">${role || 'Member'}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center;">
        <a href="${inviteUrl}" style="display: inline-block; background: #171717; color: white; font-size: 14px; font-weight: 600; padding: 12px 32px; border-radius: 8px; text-decoration: none;">
          Accept Invitation
        </a>
      </div>

      <p style="font-size: 12px; color: #a3a3a3; text-align: center; margin-top: 32px; line-height: 1.5;">
        If the button doesn't work, copy and paste this link:<br>
        <a href="${inviteUrl}" style="color: #737373; word-break: break-all;">${inviteUrl}</a>
      </p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `ElevateYou <${config.smtpUser}>`,
      to,
      subject: `You're invited to ${projectName || workspaceName || 'a project'} on ElevateYou`,
      html
    })

    return { success: true }
  } catch (err: any) {
    console.error('Email send error:', err)
    throw createError({ statusCode: 500, message: err.message || 'Failed to send email' })
  }
})
