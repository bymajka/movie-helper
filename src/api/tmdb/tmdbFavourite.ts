import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import axios from "axios";

export async function POST(req: NextRequest) {
  const { media_id, favorite } = await req.json();

  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_auth" }, { status: 401 });

  const { data: link } = await supabase
    .from("user_tmdb_link")
    .select("tmdb_account_id, v3_session_id")
    .eq("user_id", user.id)
    .single();

  if (!link?.v3_session_id) {
    return NextResponse.json({ error: "tmdb_not_connected" }, { status: 400 });
  }

  const url = `https://api.themoviedb.org/3/account/${link.tmdb_account_id}/favorite`;
  const resp = await axios.post(
    url,
    { media_type: "movie", media_id, favorite },
    {
      params: { session_id: link.v3_session_id },
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY!}`,
        "Content-Type": "application/json",
      },
    }
  );

  return NextResponse.json(resp.data, { status: resp.status });
}
