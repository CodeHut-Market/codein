import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { NextResponse } from 'next/server'

// Helper to format errors consistently
function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

// GET /api/snippets?q=term&lang=ts&limit=20&cursor=<iso-date>
export async function GET(req: Request) {
  if (!supabaseAdmin) return error('Supabase not configured', 500)
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim() || ''
  const lang = searchParams.get('lang')?.trim() || ''
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50)
  const cursor = searchParams.get('cursor') // ISO date for pagination (created_at before cursor)

  let query = supabaseAdmin
    .from('snippets')
    .select('id,title,code,language,tags,favorite_count,created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (cursor) {
    query = query.lt('created_at', cursor)
  }
  if (lang) {
    query = query.eq('language', lang)
  }
  if (q) {
    // Use ilike on title OR fallback to full text if search vector exists
    // Supabase JS doesn't support OR chains easily with FTS here; simplest: ilike title + maybe language
    query = query.ilike('title', `%${q}%`)
  }

  const { data, error: dbError } = await query
  if (dbError) return error(dbError.message, 500)

  const nextCursor = data && data.length === limit ? data[data.length - 1].created_at : null
  return NextResponse.json({ items: data ?? [], nextCursor })
}

// POST /api/snippets  { title, code, language?, tags?[] }
export async function POST(req: Request) {
  if (!supabaseAdmin) return error('Supabase not configured', 500)
  const body = await req.json().catch(() => null)
  if (!body?.title || !body?.code) return error('title and code required')

  const insert = {
    title: body.title as string,
    code: body.code as string,
    language: (body.language as string) || 'plaintext',
    tags: (Array.isArray(body.tags) ? body.tags : []) as string[],
    user_id: null as any // TODO: derive from auth when user sessions added server side
  }
  const { data, error: dbError } = await supabaseAdmin.from('snippets').insert(insert).select('id,title,code,language,tags,favorite_count,created_at').single()
  if (dbError) return error(dbError.message, 500)
  return NextResponse.json(data, { status: 201 })
}

export const dynamic = 'force-dynamic'
