import { cn } from '@/lib/utils';
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Code,
    Eye,
    Paperclip,
    Upload,
    X
} from 'lucide-react';
import { useState } from 'react';

interface UploadStep {
  id: number;
  title: string;
  description: string;
}

const steps: UploadStep[] = [
  { id: 1, title: 'Basic Info', description: 'Title and description' },
  { id: 2, title: 'Code', description: 'Your code snippet' },
  { id: 3, title: 'Details', description: 'Language and tags' },
  { id: 4, title: 'Preview', description: 'Review before publishing' },
];

const languages = [
  'JavaScript', 'TypeScript', 'Python', 'React', 'Vue', 'Angular',
  'CSS', 'HTML', 'Java', 'PHP', 'C++', 'Go', 'Rust', 'Swift'
];

const popularTags = [
  'frontend', 'backend', 'api', 'component', 'utility', 'hook',
  'animation', 'responsive', 'performance', 'security', 'testing'
];

export function MobileUploadWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    language: '',
    tags: [] as string[],
    visibility: 'public' as 'public' | 'private' | 'unlisted',
    allowComments: true,
  });

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.title.trim().length >= 3 && formData.description.trim().length >= 10;
      case 2:
        return formData.code.trim().length >= 10;
      case 3:
        return formData.language !== '';
      default:
        return true;
    }
  };

  const canProceed = isStepValid(currentStep);

  const handleNext = () => {
    if (canProceed && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = async () => {
    try {
      // Submit logic here
      console.log('Submitting:', formData);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={cn(
                "p-2 rounded-lg transition-colors",
                currentStep === 1
                  ? "text-gray-300"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Upload Snippet</h1>
              <p className="text-sm text-gray-600">Step {currentStep} of {steps.length}</p>
            </div>
          </div>
          
          <button
            onClick={() => window.history.back()}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center space-x-2 mb-2">
            {steps.map((step) => (
              <div key={step.id} className="flex-1">
                <div className={cn(
                  "h-2 rounded-full transition-colors",
                  step.id < currentStep
                    ? "bg-green-500"
                    : step.id === currentStep
                    ? "bg-blue-500"
                    : "bg-gray-200"
                )} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            {steps.map((step) => (
              <span key={step.id} className={cn(
                "transition-colors",
                step.id === currentStep ? "text-blue-600 font-medium" : ""
              )}>
                {step.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
                <p className="text-gray-600">Let's start with a title and description for your snippet</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., React Custom Hook for API Calls"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    maxLength={100}
                  />
                  <div className="flex justify-between mt-1">
                    <span className={cn(
                      "text-sm",
                      formData.title.length < 3 ? "text-red-500" : "text-gray-500"
                    )}>
                      {formData.title.length < 3 ? "At least 3 characters required" : ""}
                    </span>
                    <span className="text-sm text-gray-400">
                      {formData.title.length}/100
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what your code does, how to use it, and any important details..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    maxLength={500}
                  />
                  <div className="flex justify-between mt-1">
                    <span className={cn(
                      "text-sm",
                      formData.description.length < 10 ? "text-red-500" : "text-gray-500"
                    )}>
                      {formData.description.length < 10 ? "At least 10 characters required" : ""}
                    </span>
                    <span className="text-sm text-gray-400">
                      {formData.description.length}/500
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Code */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Code</h2>
                <p className="text-gray-600">Paste or type your code snippet here</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code *
                </label>
                <div className="relative">
                  <textarea
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder={`// Your code here...\nfunction example() {\n  return "Hello, CodeHut!";\n}`}
                    rows={15}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
                  />
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600 bg-white rounded shadow-sm">
                      <Paperclip className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className={cn(
                    "text-sm",
                    formData.code.length < 10 ? "text-red-500" : "text-gray-500"
                  )}>
                    {formData.code.length < 10 ? "At least 10 characters required" : ""}
                  </span>
                  <span className="text-sm text-gray-400">
                    {formData.code.split('\n').length} lines
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Details</h2>
                <p className="text-gray-600">Choose language, tags, and visibility settings</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Programming Language *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setFormData(prev => ({ ...prev, language: lang }))}
                        className={cn(
                          "p-3 text-sm font-medium rounded-lg border transition-colors",
                          formData.language === lang
                            ? "bg-blue-50 border-blue-500 text-blue-700"
                            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                        )}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tags (optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={cn(
                          "px-3 py-2 text-sm rounded-full border transition-colors",
                          formData.tags.includes(tag)
                            ? "bg-blue-50 border-blue-500 text-blue-700"
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                        )}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                  {formData.tags.length > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Selected: {formData.tags.join(', ')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Visibility
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'public', label: 'Public', desc: 'Everyone can see this snippet' },
                      { value: 'unlisted', label: 'Unlisted', desc: 'Only people with the link can see it' },
                      { value: 'private', label: 'Private', desc: 'Only you can see this snippet' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="visibility"
                          value={option.value}
                          checked={formData.visibility === option.value}
                          onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as any }))}
                          className="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allowComments}
                      onChange={(e) => setFormData(prev => ({ ...prev, allowComments: e.target.checked }))}
                      className="text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Allow Comments</div>
                      <div className="text-sm text-gray-500">Let others comment on your snippet</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preview */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Preview</h2>
                <p className="text-gray-600">Review your snippet before publishing</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{formData.title}</h3>
                  <p className="text-gray-600 mb-4">{formData.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {formData.language}
                    </span>
                    <span className="capitalize">{formData.visibility}</span>
                    {formData.tags.length > 0 && (
                      <span>{formData.tags.length} tags</span>
                    )}
                  </div>

                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300 font-mono">
                      <code>{formData.code}</code>
                    </pre>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {formData.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={cn(
              "flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors",
              currentStep === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 bg-gray-100 hover:bg-gray-200"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={cn(
                "flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors",
                canProceed
                  ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-sm"
                  : "text-gray-400 bg-gray-100 cursor-not-allowed"
              )}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-6 py-3 text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Publish Snippet</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}