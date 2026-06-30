import { NextResponse } from "next/server";
import { exchangeCodeForToken, getLinkedInProfile } from "@/lib/linkedin";
import { createServerSupabaseClient } from "@/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/admin/social?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/admin/social?error=no_code", request.url));
  }

  try {
    const tokenData = await exchangeCodeForToken(code);
    const { access_token, refresh_token, expires_in } = tokenData;
    
    // Calculate expires_at
    const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

    // Fetch profile to get ID
    const profileData = await getLinkedInProfile(access_token);
    const profileId = profileData.id;
    const profileName = `${profileData.localizedFirstName} ${profileData.localizedLastName}`;

    // Store in Supabase
    const supabase = createServerSupabaseClient();
    const { error: dbError } = await supabase.from("social_tokens").insert({
      platform: "linkedin",
      access_token,
      refresh_token,
      expires_at: expiresAt,
      profile_id: profileId,
      profile_name: profileName
    });

    if (dbError) throw dbError;

    return NextResponse.redirect(new URL("/admin/social?success=linkedin_connected", request.url));
  } catch (err: any) {
    console.error("LinkedIn OAuth callback failed:", err);
    return NextResponse.redirect(new URL(`/admin/social?error=${encodeURIComponent(err.message)}`, request.url));
  }
}
