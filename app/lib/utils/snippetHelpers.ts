import { supabase } from '../supabaseClient';

/**
 * Helper functions for snippet operations with Supabase
 */

export const snippetHelpers = {
  // Get snippet with all relations
  async getSnippetWithDetails(snippetId: string) {
    if (!supabase) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabase
      .from('snippets')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          avatar_url
        ),
        snippets_comments (
          id,
          comment_text,
          created_at,
          profiles:user_id (
            username,
            avatar_url
          )
        ),
        favorites (
          user_id
        )
      `)
      .eq('id', snippetId)
      .single();
    
    return { data, error };
  },

  // Search snippets with filters
  async searchSnippets(query: string, filters: {
    language?: string;
    framework?: string;
    tags?: string[];
    userId?: string;
    includePrivate?: boolean;
    orderBy?: string;
    ascending?: boolean;
    limit?: number;
    page?: number;
  } = {}) {
    if (!supabase) {
      throw new Error('Supabase not initialized');
    }

    let queryBuilder = supabase
      .from('snippets')
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url
        )
      `);
    
    // Text search
    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }
    
    // Language filter
    if (filters.language) {
      queryBuilder = queryBuilder.eq('language', filters.language);
    }
    
    // Framework filter
    if (filters.framework) {
      queryBuilder = queryBuilder.eq('framework', filters.framework);
    }
    
    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      queryBuilder = queryBuilder.contains('tags', filters.tags);
    }
    
    // User filter
    if (filters.userId) {
      queryBuilder = queryBuilder.eq('author_id', filters.userId);
    }
    
    // Visibility filter (for non-owner queries)
    if (!filters.includePrivate) {
      queryBuilder = queryBuilder.neq('visibility', 'private');
    }
    
    // Ordering
    queryBuilder = queryBuilder.order(filters.orderBy || 'created_at', { 
      ascending: filters.ascending || false 
    });
    
    // Pagination
    const limit = filters.limit || 20;
    const offset = ((filters.page || 1) - 1) * limit;
    queryBuilder = queryBuilder.range(offset, offset + limit - 1);
    
    return await queryBuilder;
  },

  // Increment view count
  async incrementViewCount(snippetId: string) {
    if (!supabase) {
      return;
    }

    const { data: snippet } = await supabase
      .from('snippets')
      .select('views')
      .eq('id', snippetId)
      .single();
    
    if (snippet) {
      await supabase
        .from('snippets')
        .update({ views: (snippet.views || 0) + 1 })
        .eq('id', snippetId);
    }
  },

  // Increment download count
  async incrementDownloadCount(snippetId: string) {
    if (!supabase) {
      return;
    }

    const { data: snippet } = await supabase
      .from('snippets')
      .select('downloads')
      .eq('id', snippetId)
      .single();
    
    if (snippet) {
      await supabase
        .from('snippets')
        .update({ downloads: (snippet.downloads || 0) + 1 })
        .eq('id', snippetId);
    }
  }
};

// Comment helpers
export const commentHelpers = {
  async addComment(snippetId: string, commentText: string) {
    if (!supabase) {
      throw new Error('Supabase not initialized');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    return await supabase
      .from('snippets_comments')
      .insert([{
        snippet_id: snippetId,
        user_id: user.id,
        comment_text: commentText,
        created_at: new Date().toISOString()
      }])
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url
        )
      `)
      .single();
  },

  async deleteComment(commentId: string) {
    if (!supabase) {
      throw new Error('Supabase not initialized');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // Only delete if the user owns the comment
    return await supabase
      .from('snippets_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', user.id);
  }
};

// Language detection utility
export const detectLanguage = (filename: string) => {
  const supportedLanguages: Record<string, { extensions: string[]; label: string }> = {
    text: { extensions: ['.txt'], label: 'Plain Text' },
    javascript: { extensions: ['.js', '.jsx', '.mjs'], label: 'JavaScript' },
    typescript: { extensions: ['.ts', '.tsx'], label: 'TypeScript' },
    python: { extensions: ['.py'], label: 'Python' },
    java: { extensions: ['.java'], label: 'Java' },
    cpp: { extensions: ['.cpp', '.cc', '.cxx', '.h', '.hpp'], label: 'C++' },
    c: { extensions: ['.c', '.h'], label: 'C' },
    csharp: { extensions: ['.cs'], label: 'C#' },
    html: { extensions: ['.html', '.htm'], label: 'HTML' },
    css: { extensions: ['.css', '.scss', '.sass', '.less'], label: 'CSS' },
    sql: { extensions: ['.sql'], label: 'SQL' },
    json: { extensions: ['.json'], label: 'JSON' },
    xml: { extensions: ['.xml'], label: 'XML' },
    markdown: { extensions: ['.md', '.markdown'], label: 'Markdown' },
    yaml: { extensions: ['.yml', '.yaml'], label: 'YAML' },
    rust: { extensions: ['.rs'], label: 'Rust' },
    go: { extensions: ['.go'], label: 'Go' },
    php: { extensions: ['.php'], label: 'PHP' },
    ruby: { extensions: ['.rb'], label: 'Ruby' },
    swift: { extensions: ['.swift'], label: 'Swift' },
    kotlin: { extensions: ['.kt', '.kts'], label: 'Kotlin' }
  };

  const extension = '.' + filename.split('.').pop()?.toLowerCase();
  for (const [lang, config] of Object.entries(supportedLanguages)) {
    if (config.extensions.includes(extension)) {
      return lang;
    }
  }
  return 'text';
};

// Auto-detect framework from code content
export const detectFramework = (code: string): string | null => {
  if (code.includes('import React') || code.includes("from 'react'") || code.includes('from "react"')) {
    return 'React';
  } else if (code.includes('import Vue') || code.includes("from 'vue'") || code.includes('from "vue"')) {
    return 'Vue';
  } else if (code.includes('@angular')) {
    return 'Angular';
  } else if (code.includes('from django')) {
    return 'Django';
  } else if (code.includes('from flask')) {
    return 'Flask';
  } else if (code.includes('express()') || code.includes("from 'express'")) {
    return 'Express';
  } else if (code.includes('next/') || code.includes("from 'next")) {
    return 'Next.js';
  }
  return null;
};

// Extract potential tags from code
export const extractTagsFromCode = (code: string, language: string): string[] => {
  const suggestions: string[] = [];
  
  if (language === 'javascript' || language === 'typescript') {
    const functionMatches = code.match(/(?:function|const|let|var)\s+(\w+)/g);
    const classMatches = code.match(/class\s+(\w+)/g);
    
    if (functionMatches) {
      functionMatches.forEach(match => {
        const name = match.split(/\s+/).pop();
        if (name && name.length > 2) suggestions.push(name);
      });
    }
    if (classMatches) {
      classMatches.forEach(match => {
        const name = match.split(/\s+/).pop();
        if (name) suggestions.push(name);
      });
    }
  }
  
  return [...new Set(suggestions.slice(0, 5))];
};

// Validate snippet before upload
export const validateSnippet = (snippet: {
  title: string;
  code: string;
  message?: string;
  language: string;
}) => {
  const errors: Record<string, string> = {};
  
  if (!snippet.title || snippet.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }
  if (snippet.title && snippet.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }
  if (!snippet.code || snippet.code.trim().length < 10) {
    errors.code = 'Code snippet must be at least 10 characters';
  }
  if (snippet.code && snippet.code.length > 500000) {
    errors.code = 'Code snippet is too large (max 500KB)';
  }
  if (snippet.message && snippet.message.length > 1000) {
    errors.message = 'Description must be less than 1000 characters';
  }
  
  // Basic XSS prevention check for web languages
  if (['html', 'javascript', 'typescript'].includes(snippet.language)) {
    const dangerousPatterns = [
      /<script[^>]*>[\s\S]*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi
    ];
    
    for (const pattern of dangerousPatterns) {
      if (pattern.test(snippet.code)) {
        errors.code = 'Code contains potentially unsafe patterns';
        break;
      }
    }
  }
  
  return errors;
};

// Upload large file to storage
export async function uploadLargeCodeFile(file: File, snippetId: string) {
  if (!supabase) {
    throw new Error('Supabase not initialized');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${snippetId}.${fileExt}`;
  const filePath = `code-files/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('snippets')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (data) {
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('snippets')
      .getPublicUrl(filePath);
    
    // Update snippet with file URL
    await supabase
      .from('snippets')
      .update({ code_file_url: urlData.publicUrl })
      .eq('id', snippetId);
  }
  
  return { data, error };
}
