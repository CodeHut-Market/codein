import { isSupabaseAvailable, supabaseClient } from './supabaseClient';

// Vector database configuration for semantic code search
export interface CodeEmbedding {
  id: string;
  snippet_id: string;
  content: string;
  embedding: number[];
  created_at: string;
}

// Configuration for embeddings
const EMBEDDING_DIMENSION = 384; // Using sentence-transformer dimension
const SIMILARITY_THRESHOLD = 0.7; // Minimum similarity score for results

/**
 * Initialize vector database schema for code embeddings
 */
export const initializeVectorDatabase = async (): Promise<boolean> => {
  if (!isSupabaseAvailable() || !supabaseClient) {
    console.warn('⚠️  Supabase not available - vector search disabled');
    return false;
  }

  try {
    // Enable pgvector extension
    const { error: extensionError } = await supabaseClient.rpc('create_extension_if_not_exists', {
      extension_name: 'vector',
      schema_name: 'extensions'
    });

    if (extensionError) {
      console.warn('Vector extension setup:', extensionError.message);
    }

    // Create embeddings table
    const createTableSQL = `
      create table if not exists public.code_embeddings (
        id uuid primary key default gen_random_uuid(),
        snippet_id text not null references public.snippets(id) on delete cascade,
        content text not null,
        embedding vector(${EMBEDDING_DIMENSION}),
        created_at timestamptz default now() not null,
        unique(snippet_id)
      );
    `;

    const { error: tableError } = await supabaseClient.rpc('exec_sql', {
      sql: createTableSQL
    });

    if (tableError) {
      console.warn('Table creation error:', tableError.message);
    }

    // Create HNSW index for efficient similarity search
    const createIndexSQL = `
      create index if not exists idx_code_embeddings_similarity 
      on public.code_embeddings 
      using hnsw (embedding vector_cosine_ops);
    `;

    const { error: indexError } = await supabaseClient.rpc('exec_sql', {
      sql: createIndexSQL
    });

    if (indexError) {
      console.warn('Index creation error:', indexError.message);
    }

    // Enable RLS
    const { error: rlsError } = await supabaseClient.rpc('exec_sql', {
      sql: 'alter table public.code_embeddings enable row level security;'
    });

    if (rlsError) {
      console.warn('RLS setup error:', rlsError.message);
    }

    // Create RLS policy for public read access
    const policySQL = `
      create policy if not exists "public_read_code_embeddings" 
      on public.code_embeddings for select using (true);
    `;

    const { error: policyError } = await supabaseClient.rpc('exec_sql', {
      sql: policySQL
    });

    if (policyError) {
      console.warn('Policy creation error:', policyError.message);
    }

    console.log('✅ Vector database schema initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize vector database:', error);
    return false;
  }
};

/**
 * Generate embeddings for code snippet (placeholder for actual embedding service)
 * In production, you would use OpenAI embeddings, Sentence Transformers, or similar
 */
export const generateCodeEmbedding = async (code: string, title: string, description: string): Promise<number[]> => {
  // This is a simplified embedding generation - in production you'd use:
  // - OpenAI Embeddings API
  // - Sentence Transformers via Python service
  // - Cohere Embeddings
  // - Google Universal Sentence Encoder
  
  // For now, create a simple hash-based embedding (not semantic, just for structure)
  const combinedText = `${title} ${description} ${code}`.toLowerCase();
  const embedding = new Array(EMBEDDING_DIMENSION).fill(0);
  
  // Simple hash-based embedding (replace with real embeddings in production)
  for (let i = 0; i < combinedText.length && i < EMBEDDING_DIMENSION; i++) {
    embedding[i % EMBEDDING_DIMENSION] += combinedText.charCodeAt(i) / 256;
  }
  
  // Normalize the vector
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => magnitude > 0 ? val / magnitude : 0);
};

/**
 * Store code embedding in vector database
 */
export const storeCodeEmbedding = async (
  snippetId: string,
  code: string,
  title: string,
  description: string
): Promise<boolean> => {
  if (!isSupabaseAvailable() || !supabaseClient) {
    return false;
  }

  try {
    // Generate embedding
    const embedding = await generateCodeEmbedding(code, title, description);
    const content = `${title}\n${description}\n${code}`;

    // Store in database
    const { error } = await supabaseClient
      .from('code_embeddings')
      .upsert({
        snippet_id: snippetId,
        content,
        embedding: JSON.stringify(embedding)
      });

    if (error) {
      console.error('Error storing code embedding:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error generating/storing embedding:', error);
    return false;
  }
};

/**
 * Perform semantic search on code snippets
 */
export const semanticCodeSearch = async (
  query: string,
  limit: number = 10,
  threshold: number = SIMILARITY_THRESHOLD
): Promise<Array<{ snippet_id: string; similarity: number; content: string }>> => {
  if (!isSupabaseAvailable() || !supabaseClient) {
    return [];
  }

  try {
    // Generate embedding for search query
    const queryEmbedding = await generateCodeEmbedding(query, '', '');

    // Perform similarity search using cosine similarity
    const { data, error } = await supabaseClient.rpc('semantic_search_code', {
      query_embedding: JSON.stringify(queryEmbedding),
      match_threshold: threshold,
      match_count: limit
    });

    if (error) {
      console.error('Semantic search error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error performing semantic search:', error);
    return [];
  }
};

/**
 * Create the semantic search function in Supabase
 */
export const createSemanticSearchFunction = async (): Promise<boolean> => {
  if (!isSupabaseAvailable() || !supabaseClient) {
    return false;
  }

  try {
    const functionSQL = `
      create or replace function semantic_search_code(
        query_embedding vector(${EMBEDDING_DIMENSION}),
        match_threshold float,
        match_count int
      )
      returns table (
        snippet_id text,
        content text,
        similarity float
      )
      language sql stable
      as $$
        select
          ce.snippet_id,
          ce.content,
          1 - (ce.embedding <=> query_embedding) as similarity
        from code_embeddings ce
        where 1 - (ce.embedding <=> query_embedding) > match_threshold
        order by ce.embedding <=> query_embedding
        limit match_count;
      $$;
    `;

    const { error } = await supabaseClient.rpc('exec_sql', { sql: functionSQL });

    if (error) {
      console.error('Error creating semantic search function:', error);
      return false;
    }

    console.log('✅ Semantic search function created successfully');
    return true;
  } catch (error) {
    console.error('Error creating semantic search function:', error);
    return false;
  }
};

/**
 * Enhanced search that combines text search with semantic search
 */
export const hybridCodeSearch = async (
  query: string,
  textResults: any[],
  limit: number = 10
): Promise<any[]> => {
  try {
    // Get semantic search results
    const semanticResults = await semanticCodeSearch(query, limit);
    
    // Combine and deduplicate results
    const combinedResults = new Map();
    
    // Add text search results with high relevance score
    textResults.forEach(result => {
      combinedResults.set(result.id, {
        ...result,
        relevanceScore: 1.0,
        searchType: 'text'
      });
    });
    
    // Add semantic search results
    semanticResults.forEach(result => {
      if (combinedResults.has(result.snippet_id)) {
        // Boost score if found in both searches
        const existing = combinedResults.get(result.snippet_id);
        existing.relevanceScore = Math.min(1.0, existing.relevanceScore + result.similarity * 0.5);
        existing.searchType = 'hybrid';
      } else {
        // Add semantic-only results with lower base score
        combinedResults.set(result.snippet_id, {
          id: result.snippet_id,
          relevanceScore: result.similarity * 0.8,
          searchType: 'semantic'
        });
      }
    });
    
    // Sort by relevance score and return top results
    return Array.from(combinedResults.values())
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  } catch (error) {
    console.error('Error in hybrid search:', error);
    return textResults; // Fallback to text search only
  }
};

// Export configuration
export const vectorConfig = {
  EMBEDDING_DIMENSION,
  SIMILARITY_THRESHOLD,
  isVectorSearchEnabled: () => isSupabaseAvailable()
};