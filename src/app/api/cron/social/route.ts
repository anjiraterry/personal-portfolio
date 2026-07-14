import { NextResponse } from 'next/server';
import { triggerScheduler } from '@/app/actions/social';

export const dynamic = 'force-dynamic'; // static by default, unless reading request. We force dynamic just in case.

export async function GET(request: Request) {
  // Check authorization if VERCEL_CRON_SECRET is set
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.VERCEL_CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await triggerScheduler();
    
    if (result.success) {
      return NextResponse.json({ success: true, message: 'Scheduler triggered successfully', data: result.data });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
