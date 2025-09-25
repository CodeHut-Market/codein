import { NextRequest, NextResponse } from 'next/server';
import { listNotifications, markNotificationRead } from '../../lib/repositories/notificationsRepo';

export async function GET(){
  const notifications = await listNotifications();
  return NextResponse.json({ notifications });
}

export async function POST(req: NextRequest){
  const { id } = await req.json();
  if(!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await markNotificationRead(id);
  return NextResponse.json({ ok: true });
}