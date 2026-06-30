export async function pushToBuffer(post: { content: string, scheduledDate: string, scheduledTime: string }) {
  const token = process.env.BUFFER_ACCESS_TOKEN;
  const profileId = process.env.BUFFER_TWITTER_PROFILE_ID;
  
  if (!token || !profileId) throw new Error("Missing Buffer environment variables");

  const scheduleAt = new Date(`${post.scheduledDate}T${post.scheduledTime}Z`);

  const params = new URLSearchParams();
  params.append("text", post.content);
  params.append("profile_ids[]", profileId);
  params.append("scheduled_at", scheduleAt.toISOString());

  const res = await fetch(`https://api.bufferapp.com/1/updates/create.json?access_token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(`Buffer API Error: ${JSON.stringify(errorData)}`);
  }

  return res.json();
}

export async function checkBufferQueue() {
  const token = process.env.BUFFER_ACCESS_TOKEN;
  const profileId = process.env.BUFFER_TWITTER_PROFILE_ID;
  
  if (!token || !profileId) return 0;

  const res = await fetch(`https://api.bufferapp.com/1/profiles/${profileId}/pending_updates.json?access_token=${token}`);
  if (!res.ok) return 0;

  const data = await res.json();
  return data.total || 0;
}

export async function getBufferProfiles() {
  const token = process.env.BUFFER_ACCESS_TOKEN;
  if (!token) return [];

  const res = await fetch(`https://api.bufferapp.com/1/profiles.json?access_token=${token}`);
  if (!res.ok) return [];

  return res.json();
}
