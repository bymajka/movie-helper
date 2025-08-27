import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_auth" }, { status: 401 });

  // get the stored v4 access token
  const { data: link } = await supabase
    .from("user_tmdb_link")
    .select("v4_access_token")
    .eq("user_id", user.id)
    .single();

  if (link?.v4_access_token) {
    // official logout: DELETE /4/auth/access_token with JSON body
    await axios.delete("https://api.themoviedb.org/4/auth/access_token", {
      headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY!}`, "Content-Type": "application/json" },
      data: { access_token: link.v4_access_token },
    });
  }

  await supabase.from("user_tmdb_link")
    .update({ revoked: true, revoked_at: new Date().toISOString(), v4_access_token: null, v3_session_id: null })
    .eq("user_id", user.id);

  return NextResponse.json({ ok: true });
}
