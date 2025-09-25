import { CodeSnippet } from '@shared/api';
import { randomUUID } from 'crypto';
import { isSupabaseEnabled, supabase } from '../supabaseClient';

let memorySnippets: CodeSnippet[] = [];

export interface CreateSnippetInput {
  title: string; code: string; description?: string; language: string; price?: number; tags?: string[]; framework?: string;
  authorId: string; author: string;
}

export async function createSnippet(input: CreateSnippetInput): Promise<CodeSnippet>{
  const now = new Date().toISOString();
  const snippet: CodeSnippet = {
    id: randomUUID(),
    title: input.title,
    code: input.code,
    description: input.description || '',
    price: input.price || 0,
    rating: 0,
    author: input.author,
    authorId: input.authorId,
    tags: input.tags || [],
    language: input.language,
    framework: input.framework,
    downloads: 0,
    createdAt: now,
    updatedAt: now
  };
  if(isSupabaseEnabled()){
    const { error } = await supabase!.from('snippets').insert(snippet as any);
    if(error) console.error('Supabase insert error', error);
  } else {
    memorySnippets.unshift(snippet);
  }
  return snippet;
}

export interface ListSnippetsOptions {
  query?: string;
  language?: string;
  category?: string;
  sortBy?: string;
  featured?: boolean;
  limit?: number;
  userId?: string;
}

export async function listSnippets(options?: ListSnippetsOptions | string): Promise<CodeSnippet[]>{
  // Handle legacy string parameter for backward compatibility
  const opts: ListSnippetsOptions = typeof options === 'string' ? { query: options } : (options || {});
  
  if(isSupabaseEnabled()){
    let q = supabase!.from('snippets').select('*');
    
    // Apply filters
    if(opts.query){
      q = q.ilike('title', `%${opts.query}%`);
    }
    
    if(opts.language){
      q = q.eq('language', opts.language);
    }
    
    if(opts.userId){
      q = q.eq('authorId', opts.userId);
    }
    
    // Handle sorting
    switch(opts.sortBy) {
      case 'popular':
        q = q.order('downloads', { ascending: false });
        break;
      case 'views':
        q = q.order('downloads', { ascending: false }); // Using downloads as proxy for views
        break;
      case 'recent':
      default:
        try {
          q = q.order('createdAt', { ascending: false });
        } catch (e) {
          q = q.order('created_at', { ascending: false });
        }
        break;
    }
    
    // Apply limit
    if(opts.limit){
      q = q.limit(opts.limit);
    }
    
    let { data, error } = await q;
    if(error){
      // fallback if createdAt column missing (maybe created_at used instead)
      if((error as any).code === '42703'){
        const retry = await supabase!.from('snippets').select('*').order('created_at', { ascending: false });
        if(retry.error){ console.error('Supabase list error', retry.error); return []; }
        data = retry.data as any;
      } else {
        console.error('Supabase list error', error); return [];
      }
    }
    
    let results = (data || []).map(mapRowToSnippet) as CodeSnippet[];
    
    // For featured snippets, return a subset of most popular ones
    if(opts.featured){
      results = results.slice(0, 3);
    }
    
    return results;
  }
  
  // Memory fallback
  let results = [...memorySnippets];
  
  if(opts.query) {
    const ql = opts.query.toLowerCase();
    results = results.filter(s=>
      s.title.toLowerCase().includes(ql) ||
      s.language.toLowerCase().includes(ql) ||
      s.description.toLowerCase().includes(ql)
    );
  }
  
  if(opts.language) {
    results = results.filter(s => s.language.toLowerCase() === opts.language!.toLowerCase());
  }
  
  if(opts.userId) {
    results = results.filter(s => s.authorId === opts.userId);
  }
  
  // Sort results
  switch(opts.sortBy) {
    case 'popular':
      results.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      break;
    case 'views':
      results.sort((a, b) => (b.downloads || 0) - (a.downloads || 0)); // Using downloads as proxy
      break;
    case 'recent':
    default:
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }
  
  if(opts.featured){
    results = results.slice(0, 3);
  }
  
  if(opts.limit){
    results = results.slice(0, opts.limit);
  }
  
  return results;
}

export async function getSnippetById(id: string): Promise<CodeSnippet | null>{
  if(isSupabaseEnabled()){
    const { data, error } = await supabase!.from('snippets').select('*').eq('id', id).maybeSingle();
    if(error){ console.error('Supabase get error', error); return null; }
    if(!data) return null;
    return mapRowToSnippet(data as any);
  }
  return memorySnippets.find(s=> s.id === id) || null;
}

export async function listPopular(limit = 6): Promise<CodeSnippet[]>{
  if(isSupabaseEnabled()){
    // Try ordering by downloads; if column missing fallback to createdAt
    let { data, error } = await supabase!.from('snippets').select('*').order('downloads', { ascending: false }).limit(limit);
    if(error){
      // 42703 = undefined column
      if((error as any).code === '42703'){
        let retry = await supabase!.from('snippets').select('*').order('createdAt', { ascending: false }).limit(limit);
        if(retry.error && (retry.error as any).code === '42703') {
          retry = await supabase!.from('snippets').select('*').order('created_at', { ascending: false }).limit(limit);
        }
        if(retry.error){ console.error('Supabase popular fallback error', retry.error); return memorySnippets.slice(0, limit); }
        return (retry.data || []).map(mapRowToSnippet) as CodeSnippet[];
      }
      console.error('Supabase popular error', error); return memorySnippets.slice(0, limit);
    }
    return (data || []).map(mapRowToSnippet) as CodeSnippet[];
  }
  return memorySnippets.slice(0, limit);
}

// Defensive helper for missing table situations reused by list/create if extended later
function handleTableMissing(err: any){
  if(!err) return;
  if(err.code === 'PGRST205'){
    // Table not in schema cache – likely not migrated yet. Silent fallback.
    return true; // signal to fallback
  }
  return false;
}

// Map DB row (supports snake_case) to CodeSnippet shape expected by app
function mapRowToSnippet(row: any): CodeSnippet {
  return {
    id: row.id,
    title: row.title,
    code: row.code,
    description: row.description || '',
    price: Number(row.price || 0),
    rating: Number(row.rating || 0),
    author: row.author,
    authorId: row.authorid || row.authorId || row.author_id || 'unknown',
    tags: Array.isArray(row.tags) ? row.tags : [],
    language: row.language,
    framework: row.framework || undefined,
    downloads: Number(row.downloads || 0),
    createdAt: row.createdAt ?? row.created_at ?? new Date().toISOString(),
    updatedAt: row.updatedAt ?? row.updated_at ?? row.createdAt ?? row.created_at ?? new Date().toISOString(),
  };
}
