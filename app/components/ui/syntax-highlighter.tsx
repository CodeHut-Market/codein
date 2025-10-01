"use client";

import { Check, Copy, Download } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import atomOneLight from 'react-syntax-highlighter/dist/styles/atom-one-light';
import atomOneDark from 'react-syntax-highlighter/dist/styles/atom-one-dark';
import { useToastContext } from '../../../components/ToastProvider';
import { Button } from './button';

interface CodeHighlighterProps {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
  allowCopy?: boolean;
  allowDownload?: boolean;
  title?: string;
}

export function CodeHighlighter({
  code,
  language = 'text',
  filename,
  showLineNumbers = true,
  allowCopy = true,
  allowDownload = true,
  title
}: CodeHighlighterProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { resolvedTheme } = useTheme();
  const { success, error } = useToastContext();

  // Map common language names to Prism.js language identifiers
  const getLanguageId = (lang: string): string => {
    const langMap: Record<string, string> = {
      'javascript': 'javascript',
      'typescript': 'typescript',
      'python': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c++': 'cpp',
      'c#': 'csharp',
      'csharp': 'csharp',
      'php': 'php',
      'ruby': 'ruby',
      'go': 'go',
      'rust': 'rust',
      'swift': 'swift',
      'kotlin': 'kotlin',
      'dart': 'dart',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sql': 'sql',
      'bash': 'bash',
      'shell': 'bash',
      'json': 'json',
      'yaml': 'yaml',
      'xml': 'xml',
      'markdown': 'markdown',
    };
    
    return langMap[lang.toLowerCase()] || 'text';
  };

  // Get file extension based on language
  const getFileExtension = (lang: string): string => {
    const extMap: Record<string, string> = {
      'javascript': 'js',
      'typescript': 'ts',
      'python': 'py',
      'java': 'java',
      'cpp': 'cpp',
      'c++': 'cpp',
      'c#': 'cs',
      'csharp': 'cs',
      'php': 'php',
      'ruby': 'rb',
      'go': 'go',
      'rust': 'rs',
      'swift': 'swift',
      'kotlin': 'kt',
      'dart': 'dart',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sql': 'sql',
      'bash': 'sh',
      'shell': 'sh',
      'json': 'json',
      'yaml': 'yml',
      'xml': 'xml',
      'markdown': 'md',
    };
    
    return extMap[lang.toLowerCase()] || 'txt';
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (copyError) {
      console.error('Failed to copy code:', copyError);
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        success('Code copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        error('Failed to copy code to clipboard');
      }
    }
  };

  const handleDownload = () => {
    setDownloading(true);
    
    try {
      const extension = getFileExtension(language);
      const fileName = filename || `code-snippet.${extension}`;
      
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      success(`Downloaded ${fileName} successfully!`);
    } catch (downloadError) {
      console.error('Failed to download code:', downloadError);
      error('Failed to download file');
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  const languageId = getLanguageId(language);
  const isDark = resolvedTheme === 'dark';

  return (
    <div className="relative group">
      {/* Header with title and actions */}
      {(title || allowCopy || allowDownload) && (
        <div className="flex items-center justify-between p-3 bg-muted/50 border-b border-border rounded-t-lg">
          <div className="flex items-center space-x-2">
            {title && (
              <h4 className="text-sm font-medium text-foreground">{title}</h4>
            )}
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md font-mono">
              {language.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {allowCopy && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                <span className="ml-1 text-xs">
                  {copied ? 'Copied!' : 'Copy'}
                </span>
              </Button>
            )}
            
            {allowDownload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                disabled={downloading}
                className="h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Download className="h-3 w-3" />
                <span className="ml-1 text-xs">
                  {downloading ? 'Downloading...' : 'Download'}
                </span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Code block */}
      <div className="relative">
        <SyntaxHighlighter
          language={languageId}
          style={isDark ? atomOneDark : atomOneLight}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            borderRadius: (title || allowCopy || allowDownload) ? '0 0 0.5rem 0.5rem' : '0.5rem',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
          codeTagProps={{
            style: {
              fontSize: '14px',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            }
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}