import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Common email template parts
const emailHeader = `
  <div style="background-color: #f8f9fa; padding: 20px; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${process.env.NEXT_PUBLIC_APP_URL}/icon.svg" alt="TrustedWriter Logo" style="width: 60px; height: 60px; margin-bottom: 10px;">
        <h1 style="color: #000; margin: 0; font-size: 24px;">TrustedWriter</h1>
      </div>
`;

const emailFooter = `
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
        <p>© ${new Date().getFullYear()} TrustedWriter. All rights reserved.</p>
      </div>
    </div>
  </div>
`;

export async function POST(req: Request) {
  try {
    const { email, message } = await req.json();

    // Send notification to support
    await resend.emails.send({
      from: "TrustedWriter <onboarding@resend.dev>",
      to: "support@familiabacelar.com",
      subject: "New Support Request",
      html: `
        ${emailHeader}
        <div style="background-color: #f8f9fa; border-radius: 4px; padding: 15px; margin-bottom: 20px;">
          <h2 style="color: #000; margin: 0 0 15px 0; font-size: 18px;">New Support Request</h2>
          <p style="margin: 0;"><strong>From:</strong> ${email}</p>
        </div>
        <div style="background-color: white; border-left: 4px solid #000; padding: 15px; margin-top: 20px;">
          <p style="margin: 0; color: #444;">${message}</p>
        </div>
        ${emailFooter}
      `,
      replyTo: email,
    });

    // Send confirmation to user
    await resend.emails.send({
      from: "TrustedWriter <onboarding@resend.dev>",
      to: email,
      subject: "We received your message - TrustedWriter Support",
      html: `
        ${emailHeader}
        <div style="padding: 20px 0;">
          <h2 style="color: #000; margin: 0 0 15px 0; font-size: 20px;">Thanks for contacting us!</h2>
          <p style="color: #444; margin-bottom: 20px;">We've received your message and will get back to you soon.</p>
          
          <div style="background-color: #f8f9fa; border-radius: 4px; padding: 15px; margin-bottom: 20px;">
            <h3 style="color: #000; margin: 0 0 10px 0; font-size: 16px;">Your message:</h3>
            <div style="background-color: white; border-left: 4px solid #000; padding: 15px;">
              <p style="margin: 0; color: #444;">${message}</p>
            </div>
          </div>

          <p style="color: #444; margin-top: 20px;">
            Best regards,<br>
            <strong>TrustedWriter Support Team</strong>
          </p>
        </div>
        ${emailFooter}
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Support request sent successfully",
    });
  } catch (error) {
    console.error("Support request error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send support request" },
      { status: 500 }
    );
  }
}
