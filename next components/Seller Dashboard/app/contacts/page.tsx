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
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Mail, Phone, Building } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Contact = {
  id: string
  name: string
  email: string
  phone: string
  company: string
  position: string
  status: "Active" | "Inactive" | "Lead" | "Customer"
  avatar: string
  lastContact: string
  createdAt: string
  notes: string
}

const initialContacts: Contact[] = [
  {
    id: "CONTACT-001",
    name: "Sarah Wilson",
    email: "sarah.wilson@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Inc.",
    position: "CTO",
    status: "Customer",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    lastContact: "2024-01-15",
    createdAt: "2023-12-01",
    notes: "Key decision maker for enterprise software purchases",
  },
  {
    id: "CONTACT-002",
    name: "Michael Chen",
    email: "m.chen@startupxyz.com",
    phone: "+1 (555) 234-5678",
    company: "StartupXYZ",
    position: "CEO",
    status: "Lead",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    lastContact: "2024-01-14",
    createdAt: "2023-12-15",
    notes: "Interested in marketing automation solutions",
  },
  {
    id: "CONTACT-003",
    name: "Emily Rodriguez",
    email: "emily.r@globalsolutions.com",
    phone: "+1 (555) 345-6789",
    company: "Global Solutions",
    position: "IT Director",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    lastContact: "2024-01-12",
    createdAt: "2023-11-20",
    notes: "Evaluating cloud migration options",
  },
  {
    id: "CONTACT-004",
    name: "David Park",
    email: "david.park@retailchain.com",
    phone: "+1 (555) 456-7890",
    company: "Retail Chain Co.",
    position: "Operations Manager",
    status: "Customer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    lastContact: "2024-01-08",
    createdAt: "2023-10-15",
    notes: "Recently implemented CRM system",
  },
]

const getStatusColor = (status: Contact["status"]) => {
  const colors = {
    Active: "bg-blue-100 text-blue-800",
    Inactive: "bg-gray-100 text-gray-800",
    Lead: "bg-yellow-100 text-yellow-800",
    Customer: "bg-green-100 text-green-800",
  }
  return colors[status]
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddContact = (contactData: Partial<Contact>) => {
    const newContact: Contact = {
      id: `CONTACT-${String(contacts.length + 1).padStart(3, "0")}`,
      name: contactData.name || "",
      email: contactData.email || "",
      phone: contactData.phone || "",
      company: contactData.company || "",
      position: contactData.position || "",
      status: contactData.status || "Lead",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      lastContact: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString().split("T")[0],
      notes: contactData.notes || "",
    }
    setContacts([...contacts, newContact])
    setIsDialogOpen(false)
  }

  const handleEditContact = (contactData: Partial<Contact>) => {
    if (editingContact) {
      setContacts(
        contacts.map((contact) => (contact.id === editingContact.id ? { ...contact, ...contactData } : contact)),
      )
      setEditingContact(null)
      setIsDialogOpen(false)
    }
  }

  const handleDeleteContact = (contactId: string) => {
    setContacts(contacts.filter((contact) => contact.id !== contactId))
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />

      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
            <p className="text-muted-foreground">Manage your customer relationships and leads</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingContact(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Contact
              </Button>
            </DialogTrigger>
            <ContactDialog
              contact={editingContact}
              onSave={editingContact ? handleEditContact : handleAddContact}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingContact(null)
              }}
            />
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search contacts..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Lead">Lead</SelectItem>
              <SelectItem value="Customer">Customer</SelectItem>
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
              {filteredContacts.map((contact) => (
                <Card key={contact.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={contact.avatar || "/placeholder.svg"} className="object-cover" />
                          <AvatarFallback>
                            {contact.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{contact.name}</CardTitle>
                          <CardDescription>{contact.position}</CardDescription>
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
                              setEditingContact(contact)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Contact
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteContact(contact.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Contact
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(contact.status)}>{contact.status}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(contact.lastContact).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{contact.company}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{contact.phone}</span>
                      </div>
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
                  {filteredContacts.map((contact) => (
                    <div key={contact.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={contact.avatar || "/placeholder.svg"} className="object-cover" />
                            <AvatarFallback>
                              {contact.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h3 className="font-medium">{contact.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {contact.position} at {contact.company}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span>{contact.email}</span>
                            <span>{contact.phone}</span>
                          </div>
                          <Badge className={getStatusColor(contact.status)}>{contact.status}</Badge>
                          <div className="text-sm text-muted-foreground">
                            {new Date(contact.lastContact).toLocaleDateString()}
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
                                setEditingContact(contact)
                                setIsDialogOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Contact
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteContact(contact.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Contact
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

function ContactDialog({
  contact,
  onSave,
  onCancel,
}: {
  contact: Contact | null
  onSave: (data: Partial<Contact>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: contact?.name || "",
    email: contact?.email || "",
    phone: contact?.phone || "",
    company: contact?.company || "",
    position: contact?.position || "",
    status: contact?.status || "Lead",
    notes: contact?.notes || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{contact ? "Edit Contact" : "Add New Contact"}</DialogTitle>
        <DialogDescription>
          {contact ? "Update the contact information below." : "Create a new contact."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as Contact["status"] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lead">Lead</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Customer">Customer</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{contact ? "Update Contact" : "Create Contact"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
