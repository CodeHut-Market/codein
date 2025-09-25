import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  maxSize?: number; // in bytes
}

export default function FileUpload({ 
  onFilesSelected, 
  maxFiles = 10,
  acceptedFileTypes = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.css', '.html', '.vue', '.php', '.rb', '.go', '.rs'],
  maxSize = 10 * 1024 * 1024 // 10MB
}: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
        return false;
      }
      return true;
    });

    const newFiles = [...selectedFiles, ...validFiles].slice(0, maxFiles);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  }, [selectedFiles, maxFiles, maxSize, onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': acceptedFileTypes,
      'application/javascript': ['.js'],
      'text/javascript': ['.js'],
      'application/typescript': ['.ts'],
      'text/typescript': ['.ts'],
      'text/x-python': ['.py'],
      'text/x-java-source': ['.java'],
      'text/x-c': ['.c'],
      'text/x-c++': ['.cpp'],
      'text/css': ['.css'],
      'text/html': ['.html'],
      'application/json': ['.json'],
    },
    maxFiles: maxFiles - selectedFiles.length,
    multiple: true
  });

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const codeExtensions = ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'css', 'html', 'vue', 'php', 'rb', 'go', 'rs'];
    return codeExtensions.includes(extension || '') ? <Code className="w-4 h-4" /> : <File className="w-4 h-4" />;
  };

  const getLanguageFromExtension = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'js': 'JavaScript',
      'jsx': 'React',
      'ts': 'TypeScript',
      'tsx': 'React TypeScript',
      'py': 'Python',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'css': 'CSS',
      'html': 'HTML',
      'vue': 'Vue',
      'php': 'PHP',
      'rb': 'Ruby',
      'go': 'Go',
      'rs': 'Rust'
    };
    return languageMap[extension || ''] || 'Unknown';
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <Card 
        {...getRootProps()} 
        className={`cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-green-500 bg-green-50 dark:bg-green-950' 
            : 'border-dashed border-2 hover:border-gray-400'
        }`}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 px-6">
          <input {...getInputProps()} />
          <Upload className={`w-12 h-12 mb-4 ${isDragActive ? 'text-green-500' : 'text-gray-400'}`} />
          <div className="text-center">
            {isDragActive ? (
              <p className="text-lg font-medium text-green-600">Drop your code files here!</p>
            ) : (
              <>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Drag & drop your code files here
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse files
                </p>
                <Button variant="outline">
                  Select Files
                </Button>
              </>
            )}
          </div>
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>Supports: {acceptedFileTypes.join(', ')}</p>
            <p>Max {maxFiles} files, {maxSize / (1024 * 1024)}MB each</p>
          </div>
        </CardContent>
      </Card>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
              Selected Files ({selectedFiles.length})
            </h4>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.name)}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Badge variant="secondary" className="text-xs">
                          {getLanguageFromExtension(file.name)}
                        </Badge>
                        <span>{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
