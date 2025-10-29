"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowLeft,
    Building,
    Calendar,
    Crown,
    Download,
    Receipt,
    User
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ReceiptData {
  id: string;
  date: string;
  customerEmail: string;
  customerName: string;
  plan: string;
  amount: number;
  subscriptionId: string;
  paymentMethod: string;
  billingPeriod: string;
  nextBilling: string;
}

export default function ReceiptViewPage() {
  const params = useParams();
  const receiptId = params.receiptId as string;
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (receiptId) {
      fetchReceiptData();
    }
  }, [receiptId]);

  const fetchReceiptData = async () => {
    try {
      const response = await fetch(`/api/receipts/${receiptId}?format=json`);
      if (response.ok) {
        const data = await response.json();
        setReceiptData(data.receipt);
      } else {
        console.error('Failed to fetch receipt data');
      }
    } catch (error) {
      console.error('Error fetching receipt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      const response = await fetch(`/api/receipts/${receiptId}`);
      
      if (!response.ok) {
        throw new Error('Failed to generate receipt');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CodeHut-Receipt-${receiptId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download receipt. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!receiptData) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Receipt className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Receipt Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The receipt you&apos;re looking for could not be found.
          </p>
          <Button asChild>
            <Link href="/ui-library">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to UI Library
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/ui-library">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Payment Receipt</h1>
              <p className="text-muted-foreground">Receipt #{receiptData.id}</p>
            </div>
          </div>
          
          <Button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </div>

        {/* Receipt Content */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center border-b">
            <div className="flex items-center justify-center mb-4">
              <Crown className="w-8 h-8 text-primary mr-2" />
              <span className="text-2xl font-bold">CodeHut</span>
            </div>
            <CardTitle className="text-xl">Payment Receipt</CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Payment Successful
            </Badge>
          </CardHeader>
          
          <CardContent className="p-8 space-y-6">
            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Customer Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{receiptData.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{receiptData.customerEmail}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  Company Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company:</span>
                    <span className="font-medium">CodeHut Inc.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Support:</span>
                    <span className="font-medium">support@codehut.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Receipt Details */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center">
                <Receipt className="w-4 h-4 mr-2" />
                Receipt Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Receipt ID:</span>
                  <span className="font-mono">{receiptData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{receiptData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subscription ID:</span>
                  <span className="font-mono">{receiptData.subscriptionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span>{receiptData.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Subscription Details */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center">
                <Crown className="w-4 h-4 mr-2" />
                Subscription Details
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-semibold">{receiptData.plan} Plan</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Billing Period:</span>
                  <span>{receiptData.billingPeriod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Next Billing:</span>
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {receiptData.nextBilling}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>${receiptData.amount}.00</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Thank you for your subscription to CodeHut UI Library!
              </p>
              <div className="flex items-center justify-center mt-4 space-x-6 text-xs text-muted-foreground">
                <span>support@codehut.com</span>
                <span>•</span>
                <span>www.codehut.com</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}