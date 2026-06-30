require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixDates() {
  const { data: posts } = await sb.from('social_posts').select('*').order('scheduled_date', { ascending: true }).order('scheduled_time', { ascending: true });
  
  if (!posts) return;
  
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1); // Start from tomorrow to guarantee all times are in the future
  
  let currentDayPosts = 0;
  
  for (const post of posts) {
    if (currentDayPosts >= 3) {
      currentDate.setDate(currentDate.getDate() + 1);
      currentDayPosts = 0;
    }
    
    const formattedDate = currentDate.toISOString().split('T')[0];
    await sb.from('social_posts').update({ scheduled_date: formattedDate }).eq('id', post.id);
    currentDayPosts++;
  }
  console.log('Fixed dates for', posts.length, 'posts');
}
fixDates().catch(console.error);
