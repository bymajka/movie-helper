import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ connected: false });

  const { data: link } = await supabase
    .from("user_tmdb_link")
    .select("v4_access_token, v3_session_id, revoked")
    .eq("user_id", user.id)
    .single();

  const connected = !!link && !link.revoked && (!!link.v4_access_token || !!link.v3_session_id);
  return NextResponse.json({ connected });
}