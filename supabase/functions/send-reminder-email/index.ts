import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReminderEmailRequest {
  partnerUserId: string;
  senderName: string;
  partnerName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { partnerUserId, senderName, partnerName }: ReminderEmailRequest = await req.json();

    // Get partner's email from auth
    const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(
      partnerUserId
    );

    if (userError || !userData?.user?.email) {
      throw new Error("Could not fetch partner email");
    }

    const partnerEmail = userData.user.email;

    // For now, we'll log the reminder
    // In production, integrate with Resend for actual email sending
    console.log(`Reminder email would be sent to ${partnerEmail}`);
    console.log(`From: ${senderName}`);
    console.log(`To: ${partnerName}`);

    // TODO: Integrate with Resend
    // Uncomment when you have RESEND_API_KEY configured
    /*
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    await resend.emails.send({
      from: "Spark Meter <noreply@yourdomain.com>",
      to: [partnerEmail],
      subject: `${senderName} is waiting for your check-in!`,
      html: `
        <h2>Hi ${partnerName}!</h2>
        <p>${senderName} is waiting to see how you're doing today.</p>
        <p>Take a moment to check in on Spark Meter and share how you're feeling.</p>
        <p><a href="${Deno.env.get("SUPABASE_URL")}/dashboard" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, rgba(180, 150, 255, 0.8) 0%, rgba(150, 200, 255, 0.8) 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Check in now</a></p>
      `,
    });
    */

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Reminder sent successfully" 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-reminder-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
