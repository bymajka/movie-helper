import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import axios from "axios";

export async function GET() {

   try{
    if(!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
        console.error("TMDB API key is not set");
        return NextResponse.json({ error: "TMDB API key is not set" }, { status: 500 });
    }

    if(!process.env.NEXT_APP_URL) {
        console.error("APP_URL is not set");
        return NextResponse.json({ error: "APP_URL is not set" }, { status: 500 });
    }

    const appUrl = process.env.NEXT_APP_URL;
  const state = crypto.randomUUID();
  const jar = await cookies();
  jar.set("tmdb_oauth_state", state, { httpOnly: true, sameSite: "lax", maxAge: 600, path: "/" });

  const redirect_to = `${appUrl}/api/tmdb/callback?state=${state}`;

  const resp = await axios.post(
    "https://api.themoviedb.org/4/auth/request_token",
    { redirect_to },
    { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY!}`, "Content-Type": "application/json" },
    validateStatus: () => true,
},
  );

  if(resp.status !== 200 || !resp.data.request_token) {
    console.error("TMDB request_token failed:", resp.status, resp.data);
      return NextResponse.json({ error: "tmdb_request_token_failed" }, { status: 502 });
 }

  const { request_token } = resp.data; // v4 request token
  jar.set("tmdb_request_token", request_token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 900, // 15 min
    path: "/",
  });
  const approveUrl = `https://www.themoviedb.org/auth/access?request_token=${encodeURIComponent(request_token)}`;
  return NextResponse.redirect(approveUrl); // user approves at TMDB
} catch (error) {
    console.error("Error connecting to TMDB:", error);
    return NextResponse.json({ error: "Failed to connect to TMDB" }, { status: 500 });
}
}
