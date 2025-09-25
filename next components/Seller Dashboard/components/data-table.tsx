"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export type Deal = {
  id: string
  dealName: string
  client: string
  stage: "Lead" | "Qualified" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost"
  value: number
  probability: number
  owner: string
  ownerAvatar: string
  lastContacted: string
  createdAt: string
  expectedClose: string
}

const data: Deal[] = [
  {
    id: "DEAL-001",
    dealName: "Enterprise Software License",
    client: "TechCorp Inc.",
    stage: "Negotiation",
    value: 45000,
    probability: 75,
    owner: "Jane Doe",
    ownerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    lastContacted: "2024-01-15",
    createdAt: "2023-12-01",
    expectedClose: "2024-02-15",
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
    lastContacted: "2024-01-14",
    createdAt: "2023-12-15",
    expectedClose: "2024-01-30",
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
    lastContacted: "2024-01-12",
    createdAt: "2023-11-20",
    expectedClose: "2024-03-01",
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
    lastContacted: "2024-01-08",
    createdAt: "2023-10-15",
    expectedClose: "2024-01-15",
  },
  {
    id: "DEAL-005",
    dealName: "Security Audit Services",
    client: "FinanceFirst Bank",
    stage: "Lead",
    value: 35000,
    probability: 20,
    owner: "Emily Martinez",
    ownerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    lastContacted: "2024-01-10",
    createdAt: "2024-01-05",
    expectedClose: "2024-04-01",
  },
  {
    id: "DEAL-006",
    dealName: "Data Analytics Platform",
    client: "Healthcare Plus",
    stage: "Negotiation",
    value: 95000,
    probability: 80,
    owner: "David Chen",
    ownerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    lastContacted: "2024-01-16",
    createdAt: "2023-11-30",
    expectedClose: "2024-02-28",
  },
  {
    id: "DEAL-007",
    dealName: "Mobile App Development",
    client: "E-commerce Co.",
    stage: "Proposal",
    value: 55000,
    probability: 50,
    owner: "Lisa Wang",
    ownerAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    lastContacted: "2024-01-13",
    createdAt: "2023-12-20",
    expectedClose: "2024-03-15",
  },
  {
    id: "DEAL-008",
    dealName: "IT Infrastructure Upgrade",
    client: "Manufacturing Corp",
    stage: "Closed Lost",
    value: 120000,
    probability: 0,
    owner: "Tom Wilson",
    ownerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    lastContacted: "2024-01-05",
    createdAt: "2023-09-15",
    expectedClose: "2024-01-01",
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

export const columns: ColumnDef<Deal>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "dealName",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Deal Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("dealName")}</div>,
  },
  {
    accessorKey: "client",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("client")}</div>,
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => {
      const stage = row.getValue("stage") as Deal["stage"]
      return <Badge className={getStageColor(stage)}>{stage}</Badge>
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Value
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("value"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "probability",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Probability
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const probability = row.getValue("probability") as number
      return <div>{probability}%</div>
    },
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => {
      const owner = row.getValue("owner") as string
      const ownerAvatar = row.original.ownerAvatar
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={ownerAvatar || "/placeholder.svg"} alt={owner} className="object-cover" />
            <AvatarFallback className="text-xs">
              {owner
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{owner}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "expectedClose",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Expected Close
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("expectedClose"))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const deal = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(deal.id)}>Copy deal ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View deal details</DropdownMenuItem>
            <DropdownMenuItem>Edit deal</DropdownMenuItem>
            <DropdownMenuItem>Update stage</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Delete deal</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function DataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter deals..."
          value={(table.getColumn("dealName")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("dealName")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
