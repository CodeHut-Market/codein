"use client"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { 
  Download,
  Search,
  Filter,
  Calendar,
  ArrowUpDown
} from "lucide-react"

export default function TransactionHistoryPage() {
  const transactions = [
    {
      id: "txn_001",
      date: "9/29/2025, 1:18:11 AM",
      customer: "Umbrella",
      description: "Coupon applied",
      status: "succeeded",
      amount: 20.03,
      isLink: true
    },
    {
      id: "txn_002",
      date: "9/28/2025, 2:53:29 PM",
      customer: "Wayne Enterprises",
      description: "Add-on fee",
      status: "pending",
      amount: 156.47,
      isLink: false
    },
    {
      id: "txn_003",
      date: "9/28/2025, 12:18:39 PM",
      customer: "Initech",
      description: "Pro plan upgrade",
      status: "failed",
      amount: 84.63,
      isLink: true
    },
    {
      id: "txn_004",
      date: "9/28/2025, 5:54:46 AM",
      customer: "Initech",
      description: "Annual billing",
      status: "refunded",
      amount: 446.36,
      isLink: true
    },
    {
      id: "txn_005",
      date: "9/27/2025, 2:06:21 PM",
      customer: "Stark Industries",
      description: "Add-on fee",
      status: "succeeded",
      amount: 111.90,
      isLink: false
    },
    {
      id: "txn_006",
      date: "9/27/2025, 10:15:36 AM",
      customer: "Acme Inc",
      description: "Invoice payment",
      status: "refunded",
      amount: 21.28,
      isLink: true
    },
    {
      id: "txn_007",
      date: "9/26/2025, 11:16:33 PM",
      customer: "Wonka LLC",
      description: "Usage overage",
      status: "succeeded",
      amount: 363.56,
      isLink: false
    },
    {
      id: "txn_008",
      date: "9/26/2025, 6:00:32 AM",
      customer: "Wonka LLC",
      description: "Coupon applied",
      status: "failed",
      amount: 233.83,
      isLink: false
    },
    {
      id: "txn_009",
      date: "9/26/2025, 5:01:52 AM",
      customer: "Hooli",
      description: "Invoice payment",
      status: "refunded",
      amount: 483.54,
      isLink: true
    },
    {
      id: "txn_010",
      date: "9/26/2025, 2:33:57 AM",
      customer: "Acme Inc",
      description: "Chargeback resolved",
      status: "pending",
      amount: 265.08,
      isLink: true
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{status}</Badge>
      case 'failed':
        return <Badge variant="destructive">{status}</Badge>
      case 'refunded':
        return <Badge variant="outline" className="text-gray-600">{status}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
        <p className="text-muted-foreground">
          View and manage all your payment transactions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Section */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search id, customer, description"
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="succeeded">Succeeded</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              
              <Input type="date" className="w-40" placeholder="From" />
              <Input type="date" className="w-40" placeholder="To" />
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results and Actions */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">10 of 220 results</span>
            <div className="flex gap-2">
              <Select defaultValue="10">
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">Reset</Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    <Button variant="ghost" className="p-0 h-auto font-medium text-sm hover:bg-transparent">
                      Date <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-sm">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={transaction.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-mono">{transaction.date}</td>
                    <td className="py-3 px-4">
                      {transaction.isLink ? (
                        <button className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                          {transaction.customer}
                        </button>
                      ) : (
                        <span className="font-medium">{transaction.customer}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {transaction.description}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">
                      ${transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-muted-foreground">
              Showing 1 to 10 of 220 results
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                1
              </Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <span className="px-3 py-2 text-sm text-muted-foreground">...</span>
              <Button variant="outline" size="sm">22</Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}