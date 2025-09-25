import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Star,
  Download,
  DollarSign,
  ArrowLeft,
  Calendar,
  Target,
  Users,
  Code,
} from "lucide-react";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
];

export default function Analytics() {
  const [trending, setTrending] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [timeframe, setTimeframe] = useState("7");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe]);

  const fetchAnalyticsData = async () => {
    try {
      const [trendingResponse, statsResponse] = await Promise.all([
        fetch(`/api/stats/trending?days=${timeframe}`),
        fetch("/api/stats"),
      ]);

      if (trendingResponse.ok) {
        const trendingData = await trendingResponse.json();
        setTrending(trendingData);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const languageData = stats
    ? Object.entries(stats.distributions.languages).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  const topTagsData = stats ? stats.distributions.topTags.slice(0, 6) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Analytics & Insights
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Last Day</SelectItem>
                  <SelectItem value="7">Last Week</SelectItem>
                  <SelectItem value="30">Last Month</SelectItem>
                  <SelectItem value="90">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {stats && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Snippets
                  </CardTitle>
                  <Code className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.overview.totalSnippets}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +{stats.recentActivity.newSnippets} this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.overview.totalUsers}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Platform users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Rating
                  </CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.overview.averageRating}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Platform average
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${stats.overview.totalRevenue}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total marketplace revenue
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Tabs */}
            <Tabs defaultValue="trending" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="languages">Languages</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="trending" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Trending Snippets */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Trending Snippets
                      </CardTitle>
                      <CardDescription>
                        Most popular snippets in the last {timeframe} day
                        {timeframe !== "1" ? "s" : ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {trending && trending.trendingSnippets.length > 0 ? (
                        <div className="space-y-4">
                          {trending.trendingSnippets.map(
                            (snippet: any, index: number) => (
                              <div
                                key={snippet.id}
                                className="flex items-center gap-3 p-3 rounded-lg border"
                              >
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-gray-900 truncate">
                                    {snippet.title}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    by {snippet.author}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <TrendingUp className="w-4 h-4 text-green-500" />
                                  <span>{snippet.recentPurchases}</span>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <TrendingDown className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">
                            No trending snippets in this period
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Trending Tags */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Trending Tags
                      </CardTitle>
                      <CardDescription>
                        Most popular tags in recent purchases
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {trending && trending.trendingTags.length > 0 ? (
                        <div className="space-y-3">
                          {trending.trendingTags.map(
                            (tag: any, index: number) => (
                              <div
                                key={tag.tag}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-700">
                                    #{index + 1}
                                  </span>
                                  <Badge variant="secondary">{tag.tag}</Badge>
                                </div>
                                <span className="text-sm text-gray-500">
                                  {tag.count} uses
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Target className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">
                            No trending tags in this period
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Trending Activity Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Summary</CardTitle>
                    <CardDescription>
                      Overview of marketplace activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {trending ? trending.totalTrendingPurchases : 0}
                        </div>
                        <div className="text-sm text-gray-600">Purchases</div>
                        <div className="text-xs text-gray-500">
                          Last {timeframe} day{timeframe !== "1" ? "s" : ""}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {stats.recentActivity.newSnippets}
                        </div>
                        <div className="text-sm text-gray-600">
                          New Snippets
                        </div>
                        <div className="text-xs text-gray-500">This month</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">
                          {trending ? trending.trendingSnippets.length : 0}
                        </div>
                        <div className="text-sm text-gray-600">
                          Trending Items
                        </div>
                        <div className="text-xs text-gray-500">
                          Active trends
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="languages" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Language Distribution Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Language Distribution</CardTitle>
                      <CardDescription>
                        Code snippets by programming language
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={languageData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {languageData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Top Tags Bar Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Popular Tags</CardTitle>
                      <CardDescription>
                        Most used tags across snippets
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topTagsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="tag" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Language Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Language Statistics</CardTitle>
                    <CardDescription>
                      Detailed breakdown by programming language
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {languageData.map((lang, index) => (
                        <div
                          key={lang.name}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                            <span className="font-medium">{lang.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{lang.value} snippets</span>
                            <span>
                              {(
                                (lang.value / stats.overview.totalSnippets) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Performing Snippets */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performing Snippets</CardTitle>
                      <CardDescription>
                        Highest rated and most downloaded
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {stats.popularSnippets.map(
                          (snippet: any, index: number) => (
                            <div
                              key={snippet.id}
                              className="flex items-center gap-3 p-3 rounded-lg border"
                            >
                              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-semibold text-sm">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">
                                  {snippet.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  by {snippet.author}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-1 text-yellow-600">
                                  <Star className="w-4 h-4" />
                                  <span>{snippet.rating}</span>
                                </div>
                                <div className="flex items-center gap-1 text-blue-600">
                                  <Download className="w-4 h-4" />
                                  <span>{snippet.downloads}</span>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                      <CardDescription>
                        Key performance indicators
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                              Average Rating
                            </span>
                            <span className="text-lg font-bold">
                              {stats.overview.averageRating}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{
                                width: `${(stats.overview.averageRating / 5) * 100}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                              Average Price
                            </span>
                            <span className="text-lg font-bold">
                              ${stats.overview.averagePrice}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-400 h-2 rounded-full"
                              style={{
                                width: `${Math.min((stats.overview.averagePrice / 20) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                              Purchase Rate
                            </span>
                            <span className="text-lg font-bold">
                              {(
                                (stats.overview.totalPurchases /
                                  stats.overview.totalSnippets) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-400 h-2 rounded-full"
                              style={{
                                width: `${(stats.overview.totalPurchases / stats.overview.totalSnippets) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Market Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Market Insights</CardTitle>
                      <CardDescription>
                        Key trends and opportunities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-900 mb-2">
                            Most Popular Language
                          </h4>
                          <p className="text-blue-800 text-sm">
                            {languageData[0]?.name} leads with{" "}
                            {languageData[0]?.value} snippets
                          </p>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-900 mb-2">
                            Price Sweet Spot
                          </h4>
                          <p className="text-green-800 text-sm">
                            Average price of ${stats.overview.averagePrice}{" "}
                            performs well in the market
                          </p>
                        </div>

                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <h4 className="font-semibold text-purple-900 mb-2">
                            Quality Standard
                          </h4>
                          <p className="text-purple-800 text-sm">
                            Platform maintains high quality with{" "}
                            {stats.overview.averageRating} average rating
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recommendations</CardTitle>
                      <CardDescription>
                        Actionable insights for growth
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Focus on {languageData[0]?.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              High demand language with growing market share
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <DollarSign className="w-5 h-5 text-blue-500 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Optimize Pricing
                            </h4>
                            <p className="text-sm text-gray-600">
                              Consider pricing around $
                              {stats.overview.averagePrice} for better
                              conversion
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Maintain Quality
                            </h4>
                            <p className="text-sm text-gray-600">
                              High ratings drive more sales and user trust
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
}
