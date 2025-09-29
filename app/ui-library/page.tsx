"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { CodeHighlighter } from '@/components/ui/syntax-highlighter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    AlertCircle,
    CheckCircle,
    Code,
    Copy,
    Crown,
    Download,
    Eye,
    Heart,
    Info,
    Sparkles,
    Star,
    Users,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import LoadingSpinner, { LoadingOverlay } from '../../components/LoadingSpinner';
import RippleThemeToggle from '../../components/RippleThemeToggle';
import { useAsyncOperation, useLoading } from '../../hooks/useLoading';

export default function UILibraryPage() {
  const [progress, setProgress] = useState(60);
  const [sliderValue, setSliderValue] = useState([50]);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { isLoading: asyncLoading, execute } = useAsyncOperation();

  const loadingVariants = [
    { key: 'default', name: 'Default Tech', description: 'Classic spinning loader with code icon' },
    { key: 'code-matrix', name: 'Code Matrix', description: 'Matrix-style falling code characters' },
    { key: 'terminal', name: 'Terminal', description: 'Terminal-style loading with green text' },
    { key: 'circuit', name: 'Circuit Board', description: 'CPU with orbiting electron particles' },
    { key: 'git-flow', name: 'Git Flow', description: 'Git branching with flowing commits' },
    { key: 'neural', name: 'Neural Network', description: 'Neural network with connecting nodes' },
  ] as const;

  const badgeVariants = ['default', 'secondary', 'destructive', 'outline'] as const;
  const buttonVariants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
  const buttonSizes = ['default', 'sm', 'lg', 'icon'] as const;

  const sampleCode = `// Example React Component
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function ExampleComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Counter: {count}</h2>
      <Button onClick={() => setCount(c => c + 1)}>
        Increment
      </Button>
    </div>
  );
}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Badge className="bg-primary/10 text-primary border-primary/20">
              <Crown className="w-3 h-3 mr-1" />
              Premium UI Library
            </Badge>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-6">
            CodeHut UI Library
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Professional, ready-to-use React components and templates. Save months of development time with our premium UI library featuring custom animations and tech-themed designs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
              <Link href="/ui-library/subscribe?plan=pro">
                <Crown className="w-4 h-4 mr-2" />
                Start Pro Subscription
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/ui-library/components">
                <Eye className="w-4 h-4 mr-2" />
                Browse Components
              </Link>
            </Button>
          </div>
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-300">
              <Code className="h-3 w-3 mr-1" />
              200+ Components
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-300">
              <Zap className="h-3 w-3 mr-1" />
              Production Ready
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-300">
              <Sparkles className="h-3 w-3 mr-1" />
              Premium Quality
            </Badge>
          </div>
        </div>

        {/* Subscription Stats & CTA Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">200+</div>
              <p className="text-sm text-muted-foreground">Premium Components</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">5K+</div>
              <p className="text-sm text-muted-foreground">Happy Subscribers</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <p className="text-sm text-muted-foreground">Monthly Updates</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">99%</div>
              <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Plans */}
        <Card className="mb-12 bg-gradient-to-r from-primary/5 to-purple-600/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Choose Your Plan</CardTitle>
            <CardDescription>Get unlimited access to our premium component library</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="border-2">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center">
                    <Crown className="w-5 h-5 mr-2 text-primary" />
                    Pro Plan
                  </CardTitle>
                  <div className="text-3xl font-bold">$19<span className="text-base font-normal text-muted-foreground">/month</span></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Unlimited downloads</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Full source code access</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Priority support</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Commercial usage rights</li>
                  </ul>
                  <Button className="w-full" asChild>
                    <Link href="/ui-library/subscribe?plan=pro">
                      Start Pro Subscription
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-primary">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center">
                    <Users className="w-5 h-5 mr-2 text-primary" />
                    Team Plan
                  </CardTitle>
                  <div className="text-3xl font-bold">$49<span className="text-base font-normal text-muted-foreground">/month</span></div>
                  <Badge className="bg-primary/10 text-primary">Most Popular</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Everything in Pro</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Up to 10 team members</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Team collaboration tools</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Dedicated support</li>
                  </ul>
                  <Button className="w-full" asChild>
                    <Link href="/ui-library/subscribe?plan=team">
                      Start Team Subscription
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        {/* Component Showcase Tabs */}
        <Tabs defaultValue="loading" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-7 w-full max-w-4xl">
              <TabsTrigger value="loading">Loading</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
              <TabsTrigger value="buttons">Buttons</TabsTrigger>
              <TabsTrigger value="display">Display</TabsTrigger>
              <TabsTrigger value="navigation">Navigation</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </div>

          {/* Loading Components */}
          <TabsContent value="loading" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Tech-Themed Loading Components</h2>
              <p className="text-muted-foreground">Custom loading animations designed for developers</p>
            </div>

            {/* Loading Variants Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingVariants.map(({ key, name, description }) => (
                <Card key={key}>
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg">{name}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center space-y-4">
                    <div className="bg-muted/50 rounded-lg p-8 w-full flex justify-center">
                      <LoadingSpinner variant={key} size="lg" message={`Loading...`} />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`<LoadingSpinner variant="${key}" size="lg" message="Loading..." />`)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy Code
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Loading Sizes */}
            <Card>
              <CardHeader>
                <CardTitle>Size Variations</CardTitle>
                <CardDescription>Different sizes for different use cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  {(['sm', 'md', 'lg', 'xl'] as const).map(size => (
                    <div key={size} className="space-y-4">
                      <div className="bg-muted/50 rounded-lg p-6">
                        <LoadingSpinner variant="code-matrix" size={size} message={`${size.toUpperCase()}`} />
                      </div>
                      <div className="text-sm font-mono text-muted-foreground">{size}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interactive Demos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Loading Overlay Demo</CardTitle>
                  <CardDescription>Fullscreen loading overlay</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    onClick={() => {
                      startLoading();
                      setTimeout(stopLoading, 3000);
                    }}
                  >
                    Show Overlay (3s)
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Async Operation</CardTitle>
                  <CardDescription>Loading state management</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    onClick={() => execute(async () => {
                      await new Promise(resolve => setTimeout(resolve, 2000));
                    })}
                    disabled={asyncLoading}
                  >
                    {asyncLoading ? 'Processing...' : 'Start Task'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Form Components */}
          <TabsContent value="forms" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Form Components</h2>
              <p className="text-muted-foreground">Input fields, selects, and form controls</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Input Components</CardTitle>
                  <CardDescription>Text inputs and labels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Enter password" />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Enter your message..." />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Select & Controls</CardTitle>
                  <CardDescription>Dropdowns and interactive controls</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="select">Framework</Label>
                    <Select value={selectedValue} onValueChange={setSelectedValue}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a framework" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="react">React</SelectItem>
                        <SelectItem value="vue">Vue</SelectItem>
                        <SelectItem value="angular">Angular</SelectItem>
                        <SelectItem value="svelte">Svelte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Slider ({sliderValue[0]}%)</Label>
                    <Slider
                      value={sliderValue}
                      onValueChange={setSliderValue}
                      max={100}
                      step={1}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="notifications"
                      checked={switchChecked}
                      onCheckedChange={setSwitchChecked}
                    />
                    <Label htmlFor="notifications">Enable notifications</Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Button Components */}
          <TabsContent value="buttons" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Button Components</h2>
              <p className="text-muted-foreground">Various button styles and sizes</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
                <CardDescription>Different button styles for various use cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {buttonVariants.map(variant => (
                    <div key={variant} className="space-y-2">
                      <Button variant={variant} className="w-full">
                        {variant}
                      </Button>
                      <div className="text-xs text-center text-muted-foreground font-mono">
                        {variant}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Button Sizes</CardTitle>
                <CardDescription>Different sizes for different contexts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-end">
                  {buttonSizes.map(size => (
                    <div key={size} className="space-y-2 text-center">
                      <Button size={size}>
                        {size === 'icon' ? <Heart className="h-4 w-4" /> : `Size ${size}`}
                      </Button>
                      <div className="text-xs text-muted-foreground font-mono">
                        {size}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Icon Buttons</CardTitle>
                <CardDescription>Buttons with icons for common actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button><Download className="h-4 w-4 mr-2" />Download</Button>
                  <Button variant="outline"><Star className="h-4 w-4 mr-2" />Star</Button>
                  <Button variant="secondary"><Copy className="h-4 w-4 mr-2" />Copy</Button>
                  <Button variant="destructive"><Heart className="h-4 w-4 mr-2" />Like</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Display Components */}
          <TabsContent value="display" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Display Components</h2>
              <p className="text-muted-foreground">Cards, badges, and display elements</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Badge Variants</CardTitle>
                  <CardDescription>Status indicators and labels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {badgeVariants.map(variant => (
                      <Badge key={variant} variant={variant}>
                        {variant}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progress Indicators</CardTitle>
                  <CardDescription>Visual progress representation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
                      -10%
                    </Button>
                    <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
                      +10%
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Avatar Component</CardTitle>
                <CardDescription>User profile pictures and fallbacks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-center">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Code className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Separator</CardTitle>
                <CardDescription>Visual dividers for content sections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>Section 1</div>
                <Separator />
                <div>Section 2</div>
                <Separator />
                <div>Section 3</div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Navigation Components */}
          <TabsContent value="navigation" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Navigation Components</h2>
              <p className="text-muted-foreground">Tabs and navigation elements</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tab Components</CardTitle>
                <CardDescription>Organize content into tabbed sections</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="account">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account" className="mt-4 p-4 border rounded">
                    <h3 className="font-semibold mb-2">Account Settings</h3>
                    <p className="text-sm text-muted-foreground">Manage your account information and preferences.</p>
                  </TabsContent>
                  <TabsContent value="password" className="mt-4 p-4 border rounded">
                    <h3 className="font-semibold mb-2">Password</h3>
                    <p className="text-sm text-muted-foreground">Change your password and security settings.</p>
                  </TabsContent>
                  <TabsContent value="settings" className="mt-4 p-4 border rounded">
                    <h3 className="font-semibold mb-2">General Settings</h3>
                    <p className="text-sm text-muted-foreground">Configure your application preferences.</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Theme Toggle</CardTitle>
                <CardDescription>Custom ripple-effect theme switcher</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <RippleThemeToggle />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Components */}
          <TabsContent value="feedback" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Feedback Components</h2>
              <p className="text-muted-foreground">Status indicators and user feedback</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Success State
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Completed successfully
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    Error State
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="destructive">
                    Something went wrong
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="h-5 w-5 text-blue-600 mr-2" />
                    Info State
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Additional information
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Code Components */}
          <TabsContent value="code" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Code Components</h2>
              <p className="text-muted-foreground">Syntax highlighting and code display</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Syntax Highlighter</CardTitle>
                <CardDescription>Custom syntax highlighting for code snippets</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeHighlighter
                  code={sampleCode}
                  language="javascript"
                  showLineNumbers={true}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Code Block</CardTitle>
                <CardDescription>Simple code display with copy functionality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{`npm install @codehut/ui-components
import { LoadingSpinner } from '@codehut/ui-components';

<LoadingSpinner variant="code-matrix" size="lg" />`}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(`npm install @codehut/ui-components`)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer CTA */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to accelerate your development?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of developers who trust CodeHut UI Library for their projects. 
            All components are built with TypeScript, Tailwind CSS, and Radix UI primitives.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/ui-library/subscribe?plan=pro">
                <Crown className="h-4 w-4 mr-2" />
                Start Subscription
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/ui-library/components">
                <Eye className="h-4 w-4 mr-2" />
                Browse Components
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Loading Overlay for demos */}
      <LoadingOverlay 
        isLoading={isLoading} 
        variant="neural"
        message="Loading overlay demo..." 
      />
    </div>
  );
}