import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendDocumentEmailParams {
  to: string
  subject: string
  documentTitle: string
  documentContent: string
  taskTitle: string
}

export async function sendDocumentEmail({
  to,
  subject,
  documentTitle,
  documentContent,
  taskTitle,
}: SendDocumentEmailParams): Promise<boolean> {
  try {
    console.log("[v0] Preparing to send email to:", to)

    // Format the content for better readability
    const formattedContent = documentContent
      .split("\n")
      .map((line) => `<p style="margin: 0 0 10px 0;">${line}</p>`)
      .join("")

    const { data, error } = await resend.emails.send({
      from: "HR System <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">HR Document Ready</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Your HR document has been generated and is ready for review.</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h2 style="margin: 0 0 10px 0; color: #667eea; font-size: 20px;">${taskTitle}</h2>
                <p style="margin: 0; color: #666; font-size: 14px;">Document Type: ${documentTitle}</p>
              </div>
              
              <div style="background: white; padding: 25px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Document Content</h3>
                <div style="color: #555; font-size: 14px; line-height: 1.8;">
                  ${formattedContent}
                </div>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 12px;">
                <p>This is an automated message from your HR Document System</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error("[v0] Resend error:", error)
      return false
    }

    console.log("[v0] Email sent successfully. ID:", data?.id)
    return true
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    return false
  }
}
