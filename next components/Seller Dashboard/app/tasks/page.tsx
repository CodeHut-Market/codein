"use client"

import type React from "react"

import { useState } from "react"
import { Topbar } from "@/components/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Calendar, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Task = {
  id: string
  title: string
  description: string
  status: "Todo" | "In Progress" | "Completed" | "Overdue"
  priority: "Low" | "Medium" | "High" | "Urgent"
  assignee: string
  assigneeAvatar: string
  dueDate: string
  createdAt: string
  relatedTo: string
  relatedType: "Deal" | "Contact" | "General"
}

const initialTasks: Task[] = [
  {
    id: "TASK-001",
    title: "Follow up with TechCorp Inc.",
    description: "Schedule demo call for enterprise software license",
    status: "Todo",
    priority: "High",
    assignee: "Jane Doe",
    assigneeAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    dueDate: "2024-01-20",
    createdAt: "2024-01-15",
    relatedTo: "Enterprise Software License",
    relatedType: "Deal",
  },
  {
    id: "TASK-002",
    title: "Prepare proposal for StartupXYZ",
    description: "Create detailed proposal for marketing automation setup",
    status: "In Progress",
    priority: "Medium",
    assignee: "Mike Roberts",
    assigneeAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    dueDate: "2024-01-18",
    createdAt: "2024-01-14",
    relatedTo: "Marketing Automation Setup",
    relatedType: "Deal",
  },
  {
    id: "TASK-003",
    title: "Send contract to Global Solutions",
    description: "Finalize and send signed contract for cloud migration project",
    status: "Completed",
    priority: "High",
    assignee: "Sarah Johnson",
    assigneeAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    dueDate: "2024-01-16",
    createdAt: "2024-01-12",
    relatedTo: "Cloud Migration Project",
    relatedType: "Deal",
  },
  {
    id: "TASK-004",
    title: "Update CRM data",
    description: "Clean up and update contact information in CRM system",
    status: "Overdue",
    priority: "Low",
    assignee: "Alex Lee",
    assigneeAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    dueDate: "2024-01-10",
    createdAt: "2024-01-08",
    relatedTo: "General Maintenance",
    relatedType: "General",
  },
]

const getStatusColor = (status: Task["status"]) => {
  const colors = {
    Todo: "bg-gray-100 text-gray-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    Overdue: "bg-red-100 text-red-800",
  }
  return colors[status]
}

const getPriorityColor = (priority: Task["priority"]) => {
  const colors = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-orange-100 text-orange-800",
    Urgent: "bg-red-100 text-red-800",
  }
  return colors[priority]
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.relatedTo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: `TASK-${String(tasks.length + 1).padStart(3, "0")}`,
      title: taskData.title || "",
      description: taskData.description || "",
      status: taskData.status || "Todo",
      priority: taskData.priority || "Medium",
      assignee: taskData.assignee || "Current User",
      assigneeAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      dueDate: taskData.dueDate || "",
      createdAt: new Date().toISOString().split("T")[0],
      relatedTo: taskData.relatedTo || "",
      relatedType: taskData.relatedType || "General",
    }
    setTasks([...tasks, newTask])
    setIsDialogOpen(false)
  }

  const handleEditTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      setTasks(tasks.map((task) => (task.id === editingTask.id ? { ...task, ...taskData } : task)))
      setEditingTask(null)
      setIsDialogOpen(false)
    }
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const handleToggleComplete = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: task.status === "Completed" ? "Todo" : "Completed" } : task,
      ),
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />

      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">Manage your to-dos and track progress</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingTask(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Task
              </Button>
            </DialogTrigger>
            <TaskDialog
              task={editingTask}
              onSave={editingTask ? handleEditTask : handleAddTask}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingTask(null)
              }}
            />
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tasks..."
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
              <SelectItem value="Todo">Todo</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="board">Board View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={task.status === "Completed"}
                          onCheckedChange={() => handleToggleComplete(task.id)}
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3
                              className={`font-medium ${task.status === "Completed" ? "line-through text-muted-foreground" : ""}`}
                            >
                              {task.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                              <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <Avatar className="h-4 w-4">
                                <AvatarImage src={task.assigneeAvatar || "/placeholder.svg"} className="object-cover" />
                                <AvatarFallback className="text-xs">
                                  {task.assignee
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span>{task.assignee}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>Related to: {task.relatedTo}</span>
                            </div>
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
                                setEditingTask(task)
                                setIsDialogOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Task
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTask(task.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Task
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

          <TabsContent value="board" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {["Todo", "In Progress", "Completed", "Overdue"].map((status) => (
                <Card key={status}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      {status}
                      <Badge variant="secondary">{filteredTasks.filter((task) => task.status === status).length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {filteredTasks
                      .filter((task) => task.status === status)
                      .map((task) => (
                        <Card key={task.id} className="p-3 hover:shadow-sm transition-shadow cursor-pointer">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">{task.title}</h4>
                              <Badge className={getPriorityColor(task.priority)} variant="outline">
                                {task.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={task.assigneeAvatar || "/placeholder.svg"} className="object-cover" />
                                <AvatarFallback className="text-xs">
                                  {task.assignee
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function TaskDialog({
  task,
  onSave,
  onCancel,
}: {
  task: Task | null
  onSave: (data: Partial<Task>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "Todo",
    priority: task?.priority || "Medium",
    assignee: task?.assignee || "",
    dueDate: task?.dueDate || "",
    relatedTo: task?.relatedTo || "",
    relatedType: task?.relatedType || "General",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
        <DialogDescription>{task ? "Update the task information below." : "Create a new task."}</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as Task["status"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todo">Todo</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value as Task["priority"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Input
              id="assignee"
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="relatedTo">Related To</Label>
            <Input
              id="relatedTo"
              value={formData.relatedTo}
              onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="relatedType">Type</Label>
            <Select
              value={formData.relatedType}
              onValueChange={(value) => setFormData({ ...formData, relatedType: value as Task["relatedType"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Deal">Deal</SelectItem>
                <SelectItem value="Contact">Contact</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{task ? "Update Task" : "Create Task"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
