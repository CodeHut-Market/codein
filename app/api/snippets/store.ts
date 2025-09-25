import { CodeSnippet } from '@shared/api';

declare global {
  // eslint-disable-next-line no-var
  var __SNIPPET_STORE__: CodeSnippet[] | undefined;
}

export function getStore(): CodeSnippet[] {
  if(!global.__SNIPPET_STORE__) global.__SNIPPET_STORE__ = [];
  return global.__SNIPPET_STORE__;
}

export function addSnippet(snippet: CodeSnippet){
  const store = getStore();
  store.unshift(snippet);
}

export function searchSnippets(query?: string){
  const store = getStore();
  if(!query) return store;
  const q = query.toLowerCase();
  return store.filter(s =>
    s.title.toLowerCase().includes(q) ||
    s.language.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q)
  );
}

// Export default for environments that expect a value (optional)
export default getStore;
