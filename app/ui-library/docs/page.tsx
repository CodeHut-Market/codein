"use client";

import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { CodeHighlighter } from "../../components/ui/syntax-highlighter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
    Code,
    Crown,
    Download,
    Palette,
    Play,
    Settings
} from "lucide-react";
import Link from "next/link";

const installationCode = `# Install via npm
npm install @codehut/ui-components

# Install via yarn  
yarn add @codehut/ui-components

# Install via pnpm
pnpm add @codehut/ui-components`;

const basicUsage = `import { LoadingSpinner, Button } from '@codehut/ui-components';

function App() {
  return (
    <div>
      <LoadingSpinner variant="code-matrix" size="lg" />
      <Button variant="primary">Get Started</Button>
    </div>
  );
}`;

const customTheme = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}`;

const components = [
  {
    name: "Loading Spinner",
    description: "Tech-themed loading animations with multiple variants",
    category: "Feedback",
    props: ["variant", "size", "message", "className"]
  },
  {
    name: "Advanced Button",
    description: "Enhanced button component with loading states and icons",
    category: "Input",
    props: ["variant", "size", "loading", "icon", "children"]
  },
  {
    name: "Data Table",
    description: "Fully featured table with sorting, filtering, and pagination",
    category: "Display",
    props: ["data", "columns", "sortable", "filterable", "pageSize"]
  },
  {
    name: "Form Builder", 
    description: "Drag-and-drop form builder with validation",
    category: "Input",
    props: ["schema", "onSubmit", "validation", "theme"]
  }
];

export default function DocsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Documentation
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn how to integrate and customize CodeHut UI components in your projects
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid gap-2">
                <a href="#installation" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                  <Download className="w-4 h-4 mr-2" />
                  Installation
                </a>
                <a href="#usage" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                  <Code className="w-4 h-4 mr-2" />
                  Basic Usage
                </a>
                <a href="#theming" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                  <Palette className="w-4 h-4 mr-2" />
                  Theming
                </a>
                <a href="#components" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                  <Settings className="w-4 h-4 mr-2" />
                  Components
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 text-center">
              <Crown className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Need Help?</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Get priority support with a subscription
              </p>
              <Button size="sm" asChild>
                <Link href="/support">
                  Contact Support
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Installation */}
          <section id="installation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Installation
                </CardTitle>
                <CardDescription>Get started with CodeHut UI components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Install the component library using your preferred package manager:
                  </p>
                  <CodeHighlighter
                    code={installationCode}
                    language="bash"
                    showLineNumbers={false}
                  />
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Note:</strong> Some components require a subscription for access. 
                      Free tier includes basic components and previews.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Usage */}
          <section id="usage">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Basic Usage
                </CardTitle>
                <CardDescription>How to use components in your React application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Import and use components in your React components:
                  </p>
                  <CodeHighlighter
                    code={basicUsage}
                    language="javascript"
                    showLineNumbers={true}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Theming */}
          <section id="theming">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Theming & Customization
                </CardTitle>
                <CardDescription>Customize components to match your design system</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="colors">
                  <TabsList>
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="fonts">Typography</TabsTrigger>
                    <TabsTrigger value="spacing">Spacing</TabsTrigger>
                  </TabsList>
                  <TabsContent value="colors" className="space-y-4">
                    <p className="text-muted-foreground">
                      Customize the color scheme by extending your Tailwind CSS configuration:
                    </p>
                    <CodeHighlighter
                      code={customTheme}
                      language="javascript"
                      showLineNumbers={true}
                    />
                  </TabsContent>
                  <TabsContent value="fonts" className="space-y-4">
                    <p className="text-muted-foreground">
                      Components use system fonts by default but can be customized:
                    </p>
                    <CodeHighlighter
                      code={`// Add custom fonts to your CSS
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

// Update Tailwind config
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['Fira Code', 'monospace'],
}`}
                      language="css"
                      showLineNumbers={true}
                    />
                  </TabsContent>
                  <TabsContent value="spacing" className="space-y-4">
                    <p className="text-muted-foreground">
                      All components use Tailwind's spacing scale, which can be customized:
                    </p>
                    <CodeHighlighter
                      code={`// Custom spacing in tailwind.config.js
spacing: {
  '18': '4.5rem',
  '88': '22rem',
}`}
                      language="javascript"
                      showLineNumbers={true}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>

          {/* Components */}
          <section id="components">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Component Reference
                </CardTitle>
                <CardDescription>Complete list of available components and their props</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {components.map((component, index) => (
                    <Card key={index} className="border border-border">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{component.name}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {component.category}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">
                          {component.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Props:</p>
                          <div className="flex flex-wrap gap-1">
                            {component.props.map((prop, propIndex) => (
                              <Badge key={propIndex} variant="secondary" className="text-xs font-mono">
                                {prop}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button asChild>
                    <Link href="/ui-library/components">
                      <Play className="w-4 h-4 mr-2" />
                      Explore All Components
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}