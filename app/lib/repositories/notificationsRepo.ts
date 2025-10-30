import { randomUUID } from 'crypto';
import { isSupabaseEnabled, supabase } from '../supabaseClient';
import { PostgrestError } from '@supabase/supabase-js';

export interface NotificationItem { id: string; title: string; message: string; read: boolean; createdAt: string; userId?: string; }

interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at?: string;
  createdAt?: string;
  user_id?: string;
  userId?: string;
}

let memoryNotifications: NotificationItem[] = [
  { id: '1', title: 'Welcome', message: 'Thanks for joining CodeHut!', read: false, createdAt: new Date().toISOString() },
];

// Map DB row (any column naming variant) to NotificationItem
interface NotificationRow {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at?: string;
  createdAt?: string;
  createdat?: string;
  user_id?: string;
  userId?: string;
  userid?: string;
  user?: string;
}

function mapRow(row: NotificationRow | null): NotificationItem | null {
  if(!row) return null;
  const createdAt = row.created_at || row.createdAt || row.createdat || new Date().toISOString();
  const userId = row.user_id || row.userId || row.userid || row.user || undefined;
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    read: !!row.read,
    createdAt: typeof createdAt === 'string' ? createdAt : new Date(createdAt).toISOString(),
    userId,
  };
}

async function queryNotifications(userId?: string, attempt = 0): Promise<NotificationItem[]> {
  const targetUser = userId || 'public';
  // Most likely canonical ordering first (created_at), then fallback to createdAt
  const orderCols = ['created_at', 'createdAt'];
  const orderCol = orderCols[attempt] || orderCols[0];
  const userCols = ['user_id', 'userId', 'userid'];

  for(const ucol of userCols){
    let query = supabase!.from('notifications').select('*');
    try {
      query = query.order(orderCol, { ascending: false }).eq(ucol, targetUser);
    } catch { /* ignore method chain errors */ }
    const { data, error } = await query as { data: NotificationRow[] | null; error: PostgrestError | null };
    if(error){
      // Missing table fallback
      if(error.code === 'PGRST205') return memoryNotifications;
      // Column does not exist -> try next combination
      if(error.code === '42703'){
        continue;
      }
      console.error('Supabase notifications error', error);
      return memoryNotifications;
    }
    return (data || []).map(mapRow).filter((item): item is NotificationItem => !!item);
  }
  // If all column combos failed due to 42703, fallback to memory
  return memoryNotifications;
}

export async function listNotifications(userId?: string): Promise<NotificationItem[]>{
  if(isSupabaseEnabled()){
    return queryNotifications(userId, 0);
  }
  return memoryNotifications;
}

export async function markNotificationRead(id: string){
  if(isSupabaseEnabled()){
    // Try updating with flexible user column not required; just id
    const { error } = await supabase!.from('notifications').update({ read: true }).eq('id', id) as { error: PostgrestError | null };
    if(error && error.code !== 'PGRST205' && error.code !== '42703') console.error('Supabase mark read error', error);
    if(error?.code === '42703') {
      // Attempt fallback ignoring unknown columns (no alternative needed here)
    }
  } else {
    const n = memoryNotifications.find(n=> n.id === id); if(n) n.read = true;
  }
}

export async function seedNotification(title: string, message: string, userId?: string){
  const item: NotificationItem = { id: randomUUID(), title, message, read: false, createdAt: new Date().toISOString(), userId };
  if(isSupabaseEnabled()){
    // Attempt insert with canonical snake_case fields
    const payload: NotificationPayload = { id: item.id, title: item.title, message: item.message, read: item.read, created_at: item.createdAt };
    if(userId) payload.user_id = userId;
    const { error } = await supabase!.from('notifications').insert(payload) as { error: PostgrestError | null };
    if(error){
      if(error.code === '42703'){
        // fallback to legacy camelCase column names
        const legacy: NotificationPayload = { id: item.id, title: item.title, message: item.message, read: item.read, createdAt: item.createdAt };
        if(userId) legacy.userId = userId;
        const retry = await supabase!.from('notifications').insert(legacy) as { error: PostgrestError | null };
        if(retry.error && retry.error.code !== 'PGRST205') console.error('Supabase notification insert error', retry.error);
      } else if(error.code !== 'PGRST205') {
        console.error('Supabase notification insert error', error);
      }
    }
  } else {
    memoryNotifications.unshift(item);
  }
  return item;
}
