import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const state = url.searchParams.get("state");

  const jar = cookies();
  const cookieState = jar.get("tmdb_oauth_state")?.value;

  const qsToken = url.searchParams.get("request_token");
  const cookieToken = jar.get("tmdb_request_token")?.value;
  const request_token = qsToken ?? cookieToken;

  if (!request_token || !state || !cookieState || state !== cookieState) {
    jar.set("tmdb_oauth_state", "", { maxAge: 0, path: "/" });
    jar.set("tmdb_request_token", "", { maxAge: 0, path: "/" });
    return NextResponse.redirect(`${process.env.NEXT_APP_URL}/settings/integrations/tmdb?error=error=state&hasCookieToken=${!!cookieToken}&hasQsToken=${!!qsToken}`);
  }

  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return NextResponse.redirect(`${process.env.NEXT_APP_URL}/login?next=/`);

  // 1) Exchange approved request token -> v4 user access token
  const tokenResp = await axios.post(
    "https://api.themoviedb.org/4/auth/access_token",
    { request_token },
    { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY!}`, "Content-Type": "application/json" } }
  );
  const { access_token, account_id } = tokenResp.data;

  // 2) Optional: convert v4 access_token -> v3 session_id
  let session_id: string | null = null;
  try {
    const v3Resp = await axios.post("https://api.themoviedb.org/3/authentication/session/convert/4", { access_token });
    if (v3Resp.status === 200) session_id = v3Resp.data.session_id;
  } catch {}

  // 3) Upsert link
  const { error: upsertErr } = await supabase.from("user_tmdb_link").upsert({
    user_id: user.id,
    tmdb_account_id: String(account_id),
    v4_access_token: access_token,
    v3_session_id: session_id,
    revoked: false,
    revoked_at: null,
  });
  if (upsertErr) {
    return NextResponse.redirect(`${process.env.NEXT_APP_URL}/settings/integrations/tmdb?error=store`);
  }

  // 4) Cleanup + redirect
  cookies().set("tmdb_oauth_state", "", { maxAge: 0 });
  return NextResponse.redirect(`${process.env.NEXT_APP_URL}/settings/integrations/tmdb?ok=1`);
}
