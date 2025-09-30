import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    Download,
    Eye,
    FileText,
    Receipt,
    Search
} from "lucide-react";
import { useState } from "react";

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  description: string;
  planName: string;
  paymentMethod: string;
  downloadUrl?: string;
  invoiceNumber: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  brand?: string;
  last4?: string;
  email?: string;
}

interface BillingHistoryProps {
  className?: string;
}

const BillingHistory = ({ className }: BillingHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Mock data - replace with actual API calls
  const invoices: Invoice[] = [
    {
      id: 'inv_001',
      date: '2024-09-15',
      amount: 9.99,
      status: 'paid',
      description: 'CodeHut Pro - Monthly Subscription',
      planName: 'Pro',
      paymentMethod: 'Visa ending in 4242',
      downloadUrl: '#',
      invoiceNumber: 'INV-2024-001'
    },
    {
      id: 'inv_002',
      date: '2024-08-15',
      amount: 9.99,
      status: 'paid',
      description: 'CodeHut Pro - Monthly Subscription',
      planName: 'Pro',
      paymentMethod: 'Visa ending in 4242',
      downloadUrl: '#',
      invoiceNumber: 'INV-2024-002'
    },
    {
      id: 'inv_003',
      date: '2024-07-15',
      amount: 9.99,
      status: 'failed',
      description: 'CodeHut Pro - Monthly Subscription',
      planName: 'Pro',
      paymentMethod: 'Visa ending in 4242',
      invoiceNumber: 'INV-2024-003'
    },
    {
      id: 'inv_004',
      date: '2024-06-15',
      amount: 99.00,
      status: 'paid',
      description: 'CodeHut Pro - Annual Subscription',
      planName: 'Pro Annual',
      paymentMethod: 'PayPal (john@example.com)',
      downloadUrl: '#',
      invoiceNumber: 'INV-2024-004'
    },
    {
      id: 'inv_005',
      date: '2024-05-20',
      amount: 29.99,
      status: 'refunded',
      description: 'CodeHut Enterprise - Monthly Subscription',
      planName: 'Enterprise',
      paymentMethod: 'Mastercard ending in 8888',
      downloadUrl: '#',
      invoiceNumber: 'INV-2024-005'
    },
    {
      id: 'inv_006',
      date: '2024-04-15',
      amount: 9.99,
      status: 'pending',
      description: 'CodeHut Pro - Monthly Subscription',
      planName: 'Pro',
      paymentMethod: 'Visa ending in 4242',
      invoiceNumber: 'INV-2024-006'
    }
  ];

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'refunded':
        return <Receipt className="h-4 w-4 text-blue-500" />;
      default:
        return <Receipt className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: Invoice['status']) => {
    const variants = {
      paid: 'default',
      pending: 'secondary',
      failed: 'destructive',
      refunded: 'outline'
    } as const;

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.planName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      
      const invoiceDate = new Date(invoice.date);
      const now = new Date();
      
      switch (dateFilter) {
        case 'last30':
          return (now.getTime() - invoiceDate.getTime()) <= (30 * 24 * 60 * 60 * 1000);
        case 'last90':
          return (now.getTime() - invoiceDate.getTime()) <= (90 * 24 * 60 * 60 * 1000);
        case 'thisYear':
          return invoiceDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log('Downloading invoice:', invoiceId);
    // Implement download logic here
  };

  const handleViewInvoice = (invoiceId: string) => {
    console.log('Viewing invoice:', invoiceId);
    // Implement view logic here
  };

  const totalSpent = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingAmount = invoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across all paid invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {invoices.filter(inv => inv.status === 'pending').length} pending invoice(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
            <p className="text-xs text-muted-foreground">
              Since account creation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View and manage your past invoices and payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="last30">Last 30 days</SelectItem>
                  <SelectItem value="last90">Last 90 days</SelectItem>
                  <SelectItem value="thisYear">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="space-y-2">
                        <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No invoices found</p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(invoice.date).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{invoice.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {invoice.planName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${invoice.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(invoice.status)}
                          {getStatusBadge(invoice.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {invoice.paymentMethod}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewInvoice(invoice.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {invoice.downloadUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadInvoice(invoice.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredInvoices.length > 0 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p>
                Showing {filteredInvoices.length} of {invoices.length} invoice(s)
              </p>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export All
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingHistory;