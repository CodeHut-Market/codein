import { Topbar } from "@/components/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Slack, Calendar, Mail, Zap, Github, Chrome, Database, MessageSquare } from "lucide-react"

const integrations = [
  {
    id: 1,
    name: "Slack",
    description: "Get notifications and updates directly in your Slack channels",
    icon: Slack,
    connected: true,
    category: "Communication",
  },
  {
    id: 2,
    name: "Google Calendar",
    description: "Sync your meetings and appointments with Google Calendar",
    icon: Calendar,
    connected: true,
    category: "Productivity",
  },
  {
    id: 3,
    name: "HubSpot",
    description: "Sync contacts and deals with your HubSpot CRM",
    icon: Database,
    connected: false,
    category: "CRM",
  },
  {
    id: 4,
    name: "Zapier",
    description: "Connect with 5000+ apps through Zapier automation",
    icon: Zap,
    connected: false,
    category: "Automation",
  },
  {
    id: 5,
    name: "Gmail",
    description: "Track email opens and sync email conversations",
    icon: Mail,
    connected: true,
    category: "Email",
  },
  {
    id: 6,
    name: "GitHub",
    description: "Link development work to customer deals and projects",
    icon: Github,
    connected: false,
    category: "Development",
  },
  {
    id: 7,
    name: "Chrome Extension",
    description: "Access CRM data directly from your browser",
    icon: Chrome,
    connected: false,
    category: "Browser",
  },
  {
    id: 8,
    name: "Microsoft Teams",
    description: "Collaborate with your team using Microsoft Teams",
    icon: MessageSquare,
    connected: false,
    category: "Communication",
  },
]

const categories = ["All", "Communication", "Productivity", "CRM", "Automation", "Email", "Development", "Browser"]

export default function Integrations() {
  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />

      <div className="flex-1 p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">Connect your favorite tools and streamline your workflow</p>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search integrations..." className="pl-10" />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button key={category} variant={category === "All" ? "default" : "outline"} size="sm">
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Integration Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => (
            <Card key={integration.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <integration.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {integration.category}
                      </Badge>
                    </div>
                  </div>
                  {integration.connected && <Badge className="bg-green-100 text-green-800">Connected</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{integration.description}</CardDescription>
                <Button className="w-full" variant={integration.connected ? "outline" : "default"}>
                  {integration.connected ? "Manage" : "Connect"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Popular Integrations */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Integrations</CardTitle>
            <CardDescription>Most commonly used integrations by sales teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Slack className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="font-medium">Slack</p>
                  <p className="text-sm text-muted-foreground">95% of teams use this</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium">Google Calendar</p>
                  <p className="text-sm text-muted-foreground">87% of teams use this</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Mail className="h-8 w-8 text-red-600" />
                <div>
                  <p className="font-medium">Gmail</p>
                  <p className="text-sm text-muted-foreground">78% of teams use this</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
