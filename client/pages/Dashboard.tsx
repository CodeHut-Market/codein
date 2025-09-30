import Logo from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeSnippet, User } from "@shared/api";
import {
    Code,
    DollarSign,
    Download,
    LogOut,
    Plus,
    Settings,
    ShoppingCart,
    Star,
    TrendingUp,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userSnippets, setUserSnippets] = useState<CodeSnippet[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
    fetchDashboardData();
  }, []);

  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch {
      navigate("/login");
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Fetch current user data
      const userResponse = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData.user);
        localStorage.setItem("user", JSON.stringify(userData.user));

        // Fetch user's snippets
        const snippetsResponse = await fetch(
          `/api/snippets/author/${userData.user.id}`,
        );
        if (snippetsResponse.ok) {
          const snippetsData = await snippetsResponse.json();
          setUserSnippets(snippetsData.snippets);
        }
      }

      // Fetch marketplace stats
      const statsResponse = await fetch("/api/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-200 border-t-violet-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-indigo-300 opacity-20 mx-auto"></div>
          </div>
          <p className="text-violet-700 font-medium text-lg">Loading dashboard...</p>
          <p className="text-indigo-600 text-sm mt-2">Preparing your personalized experience</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalEarnings = userSnippets.reduce(
    (sum, snippet) => sum + snippet.downloads * snippet.price,
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-cyan-500/10 backdrop-blur-sm border-b border-indigo-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="https://w2sp61d0-8081.inc1.devtunnels.ms/" className="flex items-center">
                <Logo size="md" />
              </a>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  to="/explore"
                  className="text-violet-600 hover:text-violet-800 font-medium transition-colors duration-200"
                >
                  Explore
                </Link>
                <Link
                  to="/upload"
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                >
                  Upload
                </Link>
                <Link
                  to="/analytics"
                  className="text-cyan-600 hover:text-cyan-800 font-medium transition-colors duration-200"
                >
                  Analytics
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-violet-200/50">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-8 h-8 rounded-full ring-2 ring-violet-200"
                />
                <span className="text-sm font-medium text-violet-900">
                  {user.username}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="bg-white/60 backdrop-blur-sm border-rose-300 text-rose-700 hover:bg-rose-50 hover:border-rose-400"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-8 border border-violet-200/30">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            Welcome back, {user.username}!
          </h1>
          <p className="mt-3 text-indigo-700 text-lg">
            Here's what's happening with your code snippets today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">
                Total Snippets
              </CardTitle>
              <Code className="h-5 w-5 text-emerald-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{userSnippets.length}</div>
              <p className="text-xs text-emerald-100 mt-1">
                Published code snippets
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-violet-100">
                Total Downloads
              </CardTitle>
              <Download className="h-5 w-5 text-violet-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{user.totalDownloads}</div>
              <p className="text-xs text-violet-100 mt-1">
                All-time downloads
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-100">
                Total Earnings
              </CardTitle>
              <DollarSign className="h-5 w-5 text-amber-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">${totalEarnings}</div>
              <p className="text-xs text-amber-100 mt-1">
                Revenue from sales
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-500 to-pink-600 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-rose-100">
                Average Rating
              </CardTitle>
              <Star className="h-5 w-5 text-rose-200 fill-current" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{user.rating}</div>
              <p className="text-xs text-rose-100 mt-1">User rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm border border-violet-200/30 rounded-xl p-1">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg font-medium"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="snippets"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white rounded-lg font-medium"
            >
              My Snippets
            </TabsTrigger>
            <TabsTrigger 
              value="purchases"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-lg font-medium"
            >
              Purchases
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg font-medium"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50 border-violet-200/30 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-violet-500/10 to-indigo-500/10 rounded-t-lg">
                  <CardTitle className="text-violet-800">Quick Actions</CardTitle>
                  <CardDescription className="text-violet-600">
                    Get started with common tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 p-6">
                  <Button 
                    asChild 
                    className="w-full justify-start bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-none shadow-md"
                  >
                    <Link to="/upload">
                      <Plus className="w-4 h-4 mr-2" />
                      Upload New Snippet
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full justify-start bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-300 text-violet-700 hover:bg-gradient-to-r hover:from-violet-100 hover:to-indigo-100"
                  >
                    <Link to="/explore">
                      <Users className="w-4 h-4 mr-2" />
                      Browse Marketplace
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full justify-start bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-300 text-cyan-700 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-teal-100"
                  >
                    <Link to={`/profile/${user.username}`}>
                      <Settings className="w-4 h-4 mr-2" />
                      View Public Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 border-rose-200/30 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 rounded-t-lg">
                  <CardTitle className="text-rose-800">Recent Activity</CardTitle>
                  <CardDescription className="text-rose-600">Your latest interactions</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200/50">
                      <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-sm"></div>
                      <span className="text-sm text-emerald-800 font-medium">
                        Account created
                      </span>
                      <span className="text-xs text-emerald-600 ml-auto bg-emerald-200 px-2 py-1 rounded-full">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {userSnippets.length > 0 && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-violet-100 to-indigo-100 border border-violet-200/50">
                        <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full shadow-sm"></div>
                        <span className="text-sm text-violet-800 font-medium">
                          Published first snippet
                        </span>
                        <span className="text-xs text-violet-600 ml-auto bg-violet-200 px-2 py-1 rounded-full">
                          {new Date(
                            userSnippets[0].createdAt,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Marketplace Stats */}
            {stats && (
              <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-200/30 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-t-lg">
                  <CardTitle className="text-indigo-800">Marketplace Overview</CardTitle>
                  <CardDescription className="text-indigo-600">
                    Current marketplace statistics
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-200/30">
                      <div className="text-2xl font-bold text-emerald-700">
                        {stats.overview.totalSnippets}
                      </div>
                      <div className="text-sm text-emerald-600 font-medium mt-1">
                        Total Snippets
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 border border-violet-200/30">
                      <div className="text-2xl font-bold text-violet-700">
                        {stats.overview.totalUsers}
                      </div>
                      <div className="text-sm text-violet-600 font-medium mt-1">Active Users</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200/30">
                      <div className="text-2xl font-bold text-amber-700">
                        ${stats.overview.averagePrice}
                      </div>
                      <div className="text-sm text-amber-600 font-medium mt-1">Avg Price</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 border border-rose-200/30">
                      <div className="text-2xl font-bold text-rose-700">
                        {stats.overview.averageRating}
                      </div>
                      <div className="text-sm text-rose-600 font-medium mt-1">Avg Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="snippets">
            <Card className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-emerald-200/30 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-t-lg">
                <div>
                  <CardTitle className="text-emerald-800">My Code Snippets</CardTitle>
                  <CardDescription className="text-emerald-600">
                    Manage your published snippets
                  </CardDescription>
                </div>
                <Button 
                  asChild 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-none shadow-md"
                >
                  <Link to="/upload">
                    <Plus className="w-4 h-4 mr-2" />
                    New Snippet
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                {userSnippets.length > 0 ? (
                  <div className="space-y-4">
                    {userSnippets.map((snippet) => (
                      <div
                        key={snippet.id}
                        className="flex items-center justify-between p-5 border border-teal-200/50 rounded-xl bg-gradient-to-r from-white/70 to-teal-50/50 backdrop-blur-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-teal-900">
                            {snippet.title}
                          </h3>
                          <p className="text-sm text-teal-700 mt-1">
                            {snippet.description}
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-xs">
                            <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                              <Star className="w-3 h-3 fill-current" />
                              {snippet.rating}
                            </span>
                            <span className="flex items-center gap-1 bg-violet-100 text-violet-700 px-2 py-1 rounded-full">
                              <Download className="w-3 h-3" />
                              {snippet.downloads}
                            </span>
                            <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                              <DollarSign className="w-3 h-3" />
                              {snippet.price}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="secondary"
                            className="bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 border-teal-300"
                          >
                            {snippet.language}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-teal-300 text-teal-700 hover:bg-teal-50"
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Code className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-teal-600 font-medium mb-2">No snippets published yet.</p>
                    <p className="text-sm text-teal-500 mb-4">Start sharing your code with the community!</p>
                    <Button 
                      asChild 
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-none shadow-md"
                    >
                      <Link to="/upload">Upload Your First Snippet</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchases">
            <Card className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-amber-200/30 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-t-lg">
                <CardTitle className="text-amber-800">Purchase History</CardTitle>
                <CardDescription className="text-amber-600">
                  Code snippets you've purchased
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-amber-700 font-medium mb-2">No purchases yet.</p>
                  <p className="text-sm text-amber-600 mb-4">Discover amazing code snippets from the community!</p>
                  <Button 
                    asChild 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-none shadow-md"
                  >
                    <Link to="/explore">Browse Marketplace</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 border-rose-200/30 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 rounded-t-lg">
                <CardTitle className="text-rose-800">Performance Analytics</CardTitle>
                <CardDescription className="text-rose-600">
                  Detailed insights about your snippets
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-rose-700 font-medium mb-2">Analytics coming soon.</p>
                  <p className="text-sm text-rose-600 mb-4">
                    Track downloads, earnings, and user engagement with powerful insights.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 border border-violet-200/50">
                      <TrendingUp className="w-6 h-6 text-violet-600 mx-auto mb-2" />
                      <p className="text-sm text-violet-700 font-medium">Download Trends</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-200/50">
                      <DollarSign className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                      <p className="text-sm text-emerald-700 font-medium">Revenue Analytics</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200/50">
                      <Users className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                      <p className="text-sm text-amber-700 font-medium">User Engagement</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
