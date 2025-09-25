import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { RevenueChart, SalesChart } from './components/charts'
import { OverviewStats } from './components/overview-stats'

export default function DashboardPage() {
  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button>New Snippet</Button>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <OverviewStats />
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Sales</CardTitle></CardHeader>
              <CardContent><SalesChart /></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Revenue</CardTitle></CardHeader>
              <CardContent><RevenueChart /></CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="activity">
          <Card>
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent>Activity feed migration pending.</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
