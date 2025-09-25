import { OverviewStats } from "@/components/overview-stats";
import { RevenueChart, SalesChart } from "@/components/sales-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, BookOpen, Code, Download, Plus, Search, Settings, Star, Users } from 'lucide-react';
import { useState } from 'react';

export default function ComponentShowcase() {
  const [inputValue, setInputValue] = useState('');
  
  return (
    <div className="space-y-8 p-6 bg-background">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground">Component Showcase</h2>
        <p className="text-muted-foreground mt-2">Modern UI components with enhanced designs</p>
      </div>

      {/* Buttons Section */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Enhanced button variants with shadow-xs and improved focus states</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Primary Button
            </Button>
            <Button variant="secondary">
              <Settings className="w-4 h-4 mr-2" />
              Secondary
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Outline
            </Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="destructive">Delete</Button>
          </div>
          <div className="flex gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </CardContent>
      </Card>

      {/* Badges Section */}
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
          <CardDescription>Modern badge variants with enhanced styling and focus states</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Error</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
          <div className="flex gap-3 items-center">
            <Badge asChild>
              <a href="#" className="cursor-pointer">
                <Star className="w-3 h-3 mr-1" />
                Clickable Badge
              </a>
            </Badge>
            <Badge variant="secondary">
              <Code className="w-3 h-3 mr-1" />
              With Icon
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Input</CardTitle>
          <CardDescription>Enhanced input with improved focus states and styling</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              placeholder="Search components..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input 
              placeholder="Disabled input" 
              disabled 
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-10" 
              placeholder="Search with icon..." 
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation Menu Section */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation Menu</CardTitle>
          <CardDescription>Modern navigation with enhanced hover states and animations</CardDescription>
        </CardHeader>
        <CardContent>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px]">
                    <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Introduction</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Learn about our component library
                      </p>
                    </NavigationMenuLink>
                    <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Installation</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        How to install and set up components
                      </p>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[500px] grid-cols-2">
                    <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <Users className="w-4 h-4 mb-2" />
                      <div className="text-sm font-medium leading-none">Button</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Interactive button component
                      </p>
                    </NavigationMenuLink>
                    <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <BookOpen className="w-4 h-4 mb-2" />
                      <div className="text-sm font-medium leading-none">Input</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Form input elements
                      </p>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </CardContent>
      </Card>

      {/* Menubar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Menubar</CardTitle>
          <CardDescription>Enhanced menubar with modern styling and focus states</CardDescription>
        </CardHeader>
        <CardContent>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  New Project <span className="ml-auto text-xs">⌘N</span>
                </MenubarItem>
                <MenubarItem>
                  Open <span className="ml-auto text-xs">⌘O</span>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Export</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Undo <span className="ml-auto text-xs">⌘Z</span></MenubarItem>
                <MenubarItem>Redo <span className="ml-auto text-xs">⌘Y</span></MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Copy</MenubarItem>
                <MenubarItem>Paste</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Show Sidebar</MenubarItem>
                <MenubarItem>Full Screen</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </CardContent>
      </Card>

      {/* Dialog Section */}
      <Card>
        <CardHeader>
          <CardTitle>Dialog</CardTitle>
          <CardDescription>Modern dialog with enhanced overlay and content positioning</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Component Demo</DialogTitle>
                <DialogDescription>
                  This dialog showcases the modern styling with enhanced focus states and improved accessibility.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  The dialog component now features:
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                  <li>• Enhanced overlay with better blur effect</li>
                  <li>• Improved content positioning</li>
                  <li>• Better focus management</li>
                  <li>• Optional close button prop</li>
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tabs</CardTitle>
          <CardDescription>Enhanced tabs with improved active states and focus styling</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4 p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Overview</h3>
              <p className="text-sm text-muted-foreground">
                This tab showcases the enhanced styling with improved focus states and better visual hierarchy.
              </p>
            </TabsContent>
            <TabsContent value="features" className="mt-4 p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Features</h3>
              <p className="text-sm text-muted-foreground">
                Enhanced focus states, better dark mode support, and improved accessibility.
              </p>
            </TabsContent>
            <TabsContent value="settings" className="mt-4 p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configuration options for the enhanced component behaviors.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dashboard Components Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Dashboard Analytics (v0.dev Import)
          </CardTitle>
          <CardDescription>New dashboard components with Chart.js integration imported from v0.dev</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Overview Statistics</h4>
            <OverviewStats />
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Sales & Revenue Charts</h4>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <SalesChart />
                <RevenueChart />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}