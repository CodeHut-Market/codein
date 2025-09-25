"use client"

import type React from "react"

import { useState } from "react"
import { Topbar } from "@/components/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Deal = {
  id: string
  dealName: string
  client: string
  stage: "Lead" | "Qualified" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost"
  value: number
  probability: number
  owner: string
  ownerAvatar: string
  expectedClose: string
  description: string
  createdAt: string
}

const initialDeals: Deal[] = [
  {
    id: "DEAL-001",
    dealName: "Enterprise Software License",
    client: "TechCorp Inc.",
    stage: "Negotiation",
    value: 45000,
    probability: 75,
    owner: "Jane Doe",
    ownerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    expectedClose: "2024-02-15",
    description: "Large enterprise software licensing deal for 500+ users",
    createdAt: "2023-12-01",
  },
  {
    id: "DEAL-002",
    dealName: "Marketing Automation Setup",
    client: "StartupXYZ",
    stage: "Proposal",
    value: 12500,
    probability: 60,
    owner: "Mike Roberts",
    ownerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    expectedClose: "2024-01-30",
    description: "Complete marketing automation platform implementation",
    createdAt: "2023-12-15",
  },
  {
    id: "DEAL-003",
    dealName: "Cloud Migration Project",
    client: "Global Solutions",
    stage: "Qualified",
    value: 78000,
    probability: 40,
    owner: "Sarah Johnson",
    ownerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    expectedClose: "2024-03-01",
    description: "Full cloud infrastructure migration and optimization",
    createdAt: "2023-11-20",
  },
  {
    id: "DEAL-004",
    dealName: "CRM Implementation",
    client: "Retail Chain Co.",
    stage: "Closed Won",
    value: 25000,
    probability: 100,
    owner: "Alex Lee",
    ownerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    expectedClose: "2024-01-15",
    description: "Custom CRM implementation for retail operations",
    createdAt: "2023-10-15",
  },
]

const getStageColor = (stage: Deal["stage"]) => {
  const colors = {
    Lead: "bg-gray-100 text-gray-800",
    Qualified: "bg-blue-100 text-blue-800",
    Proposal: "bg-yellow-100 text-yellow-800",
    Negotiation: "bg-orange-100 text-orange-800",
    "Closed Won": "bg-green-100 text-green-800",
    "Closed Lost": "bg-red-100 text-red-800",
  }
  return colors[stage]
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals)
  const [searchTerm, setSearchTerm] = useState("")
  const [stageFilter, setStageFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.dealName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStage = stageFilter === "all" || deal.stage === stageFilter
    return matchesSearch && matchesStage
  })

  const handleAddDeal = (dealData: Partial<Deal>) => {
    const newDeal: Deal = {
      id: `DEAL-${String(deals.length + 1).padStart(3, "0")}`,
      dealName: dealData.dealName || "",
      client: dealData.client || "",
      stage: dealData.stage || "Lead",
      value: dealData.value || 0,
      probability: dealData.probability || 0,
      owner: dealData.owner || "Current User",
      ownerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      expectedClose: dealData.expectedClose || "",
      description: dealData.description || "",
      createdAt: new Date().toISOString().split("T")[0],
    }
    setDeals([...deals, newDeal])
    setIsDialogOpen(false)
  }

  const handleEditDeal = (dealData: Partial<Deal>) => {
    if (editingDeal) {
      setDeals(deals.map((deal) => (deal.id === editingDeal.id ? { ...deal, ...dealData } : deal)))
      setEditingDeal(null)
      setIsDialogOpen(false)
    }
  }

  const handleDeleteDeal = (dealId: string) => {
    setDeals(deals.filter((deal) => deal.id !== dealId))
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />

      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Deals</h1>
            <p className="text-muted-foreground">Manage your sales pipeline and opportunities</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingDeal(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Deal
              </Button>
            </DialogTrigger>
            <DealDialog
              deal={editingDeal}
              onSave={editingDeal ? handleEditDeal : handleAddDeal}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingDeal(null)
              }}
            />
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search deals..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="Lead">Lead</SelectItem>
              <SelectItem value="Qualified">Qualified</SelectItem>
              <SelectItem value="Proposal">Proposal</SelectItem>
              <SelectItem value="Negotiation">Negotiation</SelectItem>
              <SelectItem value="Closed Won">Closed Won</SelectItem>
              <SelectItem value="Closed Lost">Closed Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="grid" className="space-y-4">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDeals.map((deal) => (
                <Card key={deal.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{deal.dealName}</CardTitle>
                        <CardDescription>{deal.client}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingDeal(deal)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Deal
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteDeal(deal.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Deal
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getStageColor(deal.stage)}>{deal.stage}</Badge>
                      <span className="text-sm text-muted-foreground">{deal.probability}%</span>
                    </div>
                    <div className="text-2xl font-bold">${deal.value.toLocaleString()}</div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={deal.ownerAvatar || "/placeholder.svg"} className="object-cover" />
                        <AvatarFallback className="text-xs">
                          {deal.owner
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{deal.owner}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Expected close: {new Date(deal.expectedClose).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredDeals.map((deal) => (
                    <div key={deal.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="space-y-1">
                            <h3 className="font-medium">{deal.dealName}</h3>
                            <p className="text-sm text-muted-foreground">{deal.client}</p>
                          </div>
                          <Badge className={getStageColor(deal.stage)}>{deal.stage}</Badge>
                          <div className="text-lg font-semibold">${deal.value.toLocaleString()}</div>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={deal.ownerAvatar || "/placeholder.svg"} className="object-cover" />
                              <AvatarFallback className="text-xs">
                                {deal.owner
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{deal.owner}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(deal.expectedClose).toLocaleDateString()}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingDeal(deal)
                                setIsDialogOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Deal
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteDeal(deal.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Deal
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function DealDialog({
  deal,
  onSave,
  onCancel,
}: {
  deal: Deal | null
  onSave: (data: Partial<Deal>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    dealName: deal?.dealName || "",
    client: deal?.client || "",
    stage: deal?.stage || "Lead",
    value: deal?.value || 0,
    probability: deal?.probability || 0,
    expectedClose: deal?.expectedClose || "",
    description: deal?.description || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{deal ? "Edit Deal" : "Add New Deal"}</DialogTitle>
        <DialogDescription>
          {deal ? "Update the deal information below." : "Create a new deal opportunity."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dealName">Deal Name</Label>
          <Input
            id="dealName"
            value={formData.dealName}
            onChange={(e) => setFormData({ ...formData, dealName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>
          <Input
            id="client"
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stage">Stage</Label>
            <Select
              value={formData.stage}
              onValueChange={(value) => setFormData({ ...formData, stage: value as Deal["stage"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Proposal">Proposal</SelectItem>
                <SelectItem value="Negotiation">Negotiation</SelectItem>
                <SelectItem value="Closed Won">Closed Won</SelectItem>
                <SelectItem value="Closed Lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="probability">Probability (%)</Label>
            <Input
              id="probability"
              type="number"
              min="0"
              max="100"
              value={formData.probability}
              onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="value">Value ($)</Label>
            <Input
              id="value"
              type="number"
              min="0"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expectedClose">Expected Close</Label>
            <Input
              id="expectedClose"
              type="date"
              value={formData.expectedClose}
              onChange={(e) => setFormData({ ...formData, expectedClose: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{deal ? "Update Deal" : "Create Deal"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
