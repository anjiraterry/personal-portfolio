import { supabase } from "@/supabase/supabase"; // Note: Use server client if called from server actions

export async function getLinkedInAuthUrl() {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
  if (!clientId || !redirectUri) throw new Error("Missing LinkedIn env vars");

  const state = Math.random().toString(36).substring(7);
  // Optional: store state in a cookie to verify on callback
  
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
    scope: "w_member_social r_liteprofile" // adjust scopes as needed, r_liteprofile for profile ID
  });

  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) throw new Error("Missing LinkedIn env vars");

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri);
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);

  const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  });

  if (!res.ok) throw new Error("Failed to exchange token");
  return res.json();
}

export async function refreshLinkedInToken(refreshToken: string) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  if (!clientId || !clientSecret) throw new Error("Missing LinkedIn env vars");

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);

  const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  });

  if (!res.ok) throw new Error("Failed to refresh token");
  return res.json();
}

export async function getLinkedInProfile(accessToken: string) {
  const res = await fetch("https://api.linkedin.com/v2/me", {
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  if (!res.ok) throw new Error("Failed to get LinkedIn profile");
  return res.json();
}

export async function createLinkedInPost(accessToken: string, profileId: string, content: string) {
  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0"
    },
    body: JSON.stringify({
      author: `urn:li:person:${profileId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: content },
          shareMediaCategory: "NONE"
        }
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(`Failed to post to LinkedIn: ${JSON.stringify(err)}`);
  }
  return res.json();
}
