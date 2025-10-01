import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar, 
  BarChart3, 
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths, addMonths, differenceInDays } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { cn } from '../../lib/utils';

interface MonthlyStats {
  month: string;
  snippets_created: number;
  likes_received: number;
  downloads: number;
  views: number;
  comments_received: number;
  followers_gained: number;
}

interface Goal {
  id: string;
  title: string;
  target_value: number;
  current_value: number;
  metric: 'snippets' | 'likes' | 'downloads' | 'views' | 'followers';
  deadline: string;
  status: 'active' | 'completed' | 'overdue';
  created_at: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  achieved_at: string | null;
  target_date: string;
  type: 'snippets' | 'engagement' | 'community' | 'quality';
  requirements: {
    metric: string;
    value: number;
  }[];
}

export default function EnhancedProgressTracker() {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewType, setViewType] = useState<'overview' | 'detailed'>('overview');

  // Mock data for demonstration
  const mockMonthlyStats: MonthlyStats[] = [
    { month: '2024-01', snippets_created: 12, likes_received: 45, downloads: 123, views: 678, comments_received: 23, followers_gained: 8 },
    { month: '2024-02', snippets_created: 18, likes_received: 67, downloads: 189, views: 892, comments_received: 34, followers_gained: 12 },
    { month: '2024-03', snippets_created: 15, likes_received: 78, downloads: 234, views: 1045, comments_received: 41, followers_gained: 15 },
    { month: '2024-04', snippets_created: 22, likes_received: 95, downloads: 312, views: 1234, comments_received: 52, followers_gained: 18 },
    { month: '2024-05', snippets_created: 28, likes_received: 134, downloads: 445, views: 1567, comments_received: 68, followers_gained: 25 },
    { month: '2024-06', snippets_created: 35, likes_received: 167, downloads: 567, views: 1893, comments_received: 82, followers_gained: 32 }
  ];

  const mockGoals: Goal[] = [
    {
      id: '1',
      title: 'Create 50 Snippets This Month',
      target_value: 50,
      current_value: 35,
      metric: 'snippets',
      deadline: '2024-12-31',
      status: 'active',
      created_at: '2024-12-01'
    },
    {
      id: '2',
      title: 'Reach 1000 Total Likes',
      target_value: 1000,
      current_value: 856,
      metric: 'likes',
      deadline: '2024-12-31',
      status: 'active',
      created_at: '2024-11-15'
    },
    {
      id: '3',
      title: 'Get 5000 Downloads',
      target_value: 5000,
      current_value: 5234,
      metric: 'downloads',
      deadline: '2024-12-15',
      status: 'completed',
      created_at: '2024-10-01'
    },
    {
      id: '4',
      title: 'Gain 100 New Followers',
      target_value: 100,
      current_value: 78,
      metric: 'followers',
      deadline: '2024-11-30',
      status: 'overdue',
      created_at: '2024-09-01'
    }
  ];

  const mockMilestones: Milestone[] = [
    {
      id: '1',
      title: 'First 100 Snippets',
      description: 'Create your first 100 code snippets',
      achieved_at: '2024-05-15',
      target_date: '2024-05-31',
      type: 'snippets',
      requirements: [{ metric: 'snippets_created', value: 100 }]
    },
    {
      id: '2',
      title: 'Community Favorite',
      description: 'Receive 500 total likes across all snippets',
      achieved_at: '2024-06-10',
      target_date: '2024-06-30',
      type: 'engagement',
      requirements: [{ metric: 'likes_received', value: 500 }]
    },
    {
      id: '3',
      title: 'Download Champion',
      description: 'Reach 2000 total downloads',
      achieved_at: null,
      target_date: '2024-12-31',
      type: 'community',
      requirements: [{ metric: 'downloads', value: 2000 }]
    },
    {
      id: '4',
      title: 'Quality Contributor',
      description: 'Maintain average rating above 4.5 with 50+ snippets',
      achieved_at: null,
      target_date: '2024-12-31',
      type: 'quality',
      requirements: [
        { metric: 'average_rating', value: 4.5 },
        { metric: 'snippets_created', value: 50 }
      ]
    }
  ];

  useEffect(() => {
    setMonthlyStats(mockMonthlyStats);
    setGoals(mockGoals);
    setMilestones(mockMilestones);
  }, []);

  const getCurrentMonthStats = () => {
    const currentMonthKey = format(currentMonth, 'yyyy-MM');
    return monthlyStats.find(stat => stat.month === currentMonthKey) || {
      month: currentMonthKey,
      snippets_created: 0,
      likes_received: 0,
      downloads: 0,
      views: 0,
      comments_received: 0,
      followers_gained: 0
    };
  };

  const getPreviousMonthStats = () => {
    const previousMonth = subMonths(currentMonth, 1);
    const previousMonthKey = format(previousMonth, 'yyyy-MM');
    return monthlyStats.find(stat => stat.month === previousMonthKey);
  };

  const calculateGrowth = (current: number, previous: number | undefined) => {
    if (!previous || previous === 0) return { percentage: 0, trend: 'neutral' as const };
    const growth = ((current - previous) / previous) * 100;
    return {
      percentage: Math.abs(growth),
      trend: growth > 0 ? 'up' as const : growth < 0 ? 'down' as const : 'neutral' as const
    };
  };

  const getGoalProgress = (goal: Goal) => {
    const progress = (goal.current_value / goal.target_value) * 100;
    return Math.min(progress, 100);
  };

  const getGoalStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getMilestoneTypeIcon = (type: Milestone['type']) => {
    switch (type) {
      case 'snippets': return <BarChart3 size={16} />;
      case 'engagement': return <Award size={16} />;
      case 'community': return <TrendingUp size={16} />;
      case 'quality': return <CheckCircle size={16} />;
      default: return <Target size={16} />;
    }
  };

  const currentStats = getCurrentMonthStats();
  const previousStats = getPreviousMonthStats();

  const MetricCard = ({ 
    title, 
    value, 
    previousValue, 
    icon, 
    formatter = (v: number) => v.toString() 
  }: {
    title: string;
    value: number;
    previousValue?: number;
    icon: React.ReactNode;
    formatter?: (value: number) => string;
  }) => {
    const growth = calculateGrowth(value, previousValue);
    
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                {icon}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <p className="text-2xl font-bold">{formatter(value)}</p>
              </div>
            </div>
            {previousValue !== undefined && (
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                growth.trend === 'up' ? 'text-green-700 bg-green-100' :
                growth.trend === 'down' ? 'text-red-700 bg-red-100' :
                'text-gray-700 bg-gray-100'
              )}>
                {growth.trend === 'up' ? <TrendingUp size={12} /> : 
                 growth.trend === 'down' ? <TrendingDown size={12} /> : 
                 <div className="w-3 h-3 rounded-full bg-current" />}
                {growth.percentage.toFixed(1)}%
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Progress Tracker</h2>
          <p className="text-muted-foreground">
            Track your coding journey and achieve your goals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewType === 'overview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('overview')}
          >
            Overview
          </Button>
          <Button
            variant={viewType === 'detailed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('detailed')}
          >
            Detailed
          </Button>
        </div>
      </div>

      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monthly">Monthly Stats</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-6">
          {/* Month Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  {format(currentMonth, 'MMMM yyyy')}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date())}
                  >
                    Current
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  >
                    Next
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Current Month Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              title="Snippets Created"
              value={currentStats.snippets_created}
              previousValue={previousStats?.snippets_created}
              icon={<BarChart3 size={20} />}
            />
            <MetricCard
              title="Likes Received"
              value={currentStats.likes_received}
              previousValue={previousStats?.likes_received}
              icon={<Award size={20} />}
            />
            <MetricCard
              title="Downloads"
              value={currentStats.downloads}
              previousValue={previousStats?.downloads}
              icon={<TrendingUp size={20} />}
              formatter={(v) => v.toLocaleString()}
            />
            <MetricCard
              title="Views"
              value={currentStats.views}
              previousValue={previousStats?.views}
              icon={<Target size={20} />}
              formatter={(v) => v.toLocaleString()}
            />
            <MetricCard
              title="Comments"
              value={currentStats.comments_received}
              previousValue={previousStats?.comments_received}
              icon={<CheckCircle size={20} />}
            />
            <MetricCard
              title="New Followers"
              value={currentStats.followers_gained}
              previousValue={previousStats?.followers_gained}
              icon={<TrendingUp size={20} />}
            />
          </div>

          {/* Monthly Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>6-Month Trend</CardTitle>
              <CardDescription>
                Your progress over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tickFormatter={(value) => format(new Date(value + '-01'), 'MMM')}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => format(new Date(value + '-01'), 'MMMM yyyy')}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="snippets_created" 
                      stackId="1"
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                      name="Snippets"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="likes_received" 
                      stackId="2"
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                      name="Likes"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="followers_gained" 
                      stackId="3"
                      stroke="#f59e0b" 
                      fill="#f59e0b" 
                      fillOpacity={0.6}
                      name="Followers"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Current Goals</h3>
              <p className="text-sm text-muted-foreground">Track your progress towards personal targets</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Goal
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map(goal => {
              const progress = getGoalProgress(goal);
              const daysUntilDeadline = differenceInDays(new Date(goal.deadline), new Date());
              
              return (
                <Card key={goal.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{goal.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {goal.current_value} / {goal.target_value} {goal.metric}
                        </p>
                      </div>
                      <Badge className={cn("text-xs", getGoalStatusColor(goal.status))}>
                        {goal.status === 'completed' ? <CheckCircle size={12} className="mr-1" /> :
                         goal.status === 'overdue' ? <XCircle size={12} className="mr-1" /> :
                         <Clock size={12} className="mr-1" />}
                        {goal.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{progress.toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={progress} 
                        className={cn(
                          "h-2",
                          goal.status === 'completed' ? '[&>div]:bg-green-500' :
                          goal.status === 'overdue' ? '[&>div]:bg-red-500' :
                          '[&>div]:bg-blue-500'
                        )}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` :
                         daysUntilDeadline === 0 ? 'Due today' :
                         `${Math.abs(daysUntilDeadline)} days overdue`}
                      </span>
                      <span>
                        Created {format(new Date(goal.created_at), 'MMM d')}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Milestones</h3>
            <p className="text-sm text-muted-foreground">Major achievements in your coding journey</p>
          </div>

          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <Card key={milestone.id} className={cn(
                "p-6 border-l-4",
                milestone.achieved_at ? 'border-l-green-500 bg-green-50/50' : 'border-l-blue-500'
              )}>
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    milestone.achieved_at ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  )}>
                    {getMilestoneTypeIcon(milestone.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {milestone.title}
                          {milestone.achieved_at && (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle size={12} className="mr-1" />
                              Achieved
                            </Badge>
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {milestone.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        {milestone.requirements.map((req, idx) => (
                          <span key={idx} className="flex items-center gap-1">
                            <Target size={12} />
                            {req.metric.replace('_', ' ')}: {req.value}
                          </span>
                        ))}
                      </div>
                      <div>
                        {milestone.achieved_at ? (
                          <span className="text-green-600 font-medium">
                            Achieved {format(new Date(milestone.achieved_at), 'MMM d, yyyy')}
                          </span>
                        ) : (
                          <span>
                            Target: {format(new Date(milestone.target_date), 'MMM d, yyyy')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>
                Analyze your growth patterns over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tickFormatter={(value) => format(new Date(value + '-01'), 'MMM')}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => format(new Date(value + '-01'), 'MMMM yyyy')}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="snippets_created" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Snippets Created"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="likes_received" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Likes Received"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="followers_gained" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      name="Followers Gained"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Growth Rate</CardTitle>
                <CardDescription>Month-over-month growth percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyStats.slice(-3).map((stat, index, arr) => {
                    const prevStat = arr[index - 1];
                    if (!prevStat) return null;
                    
                    const snippetGrowth = calculateGrowth(stat.snippets_created, prevStat.snippets_created);
                    const likeGrowth = calculateGrowth(stat.likes_received, prevStat.likes_received);
                    
                    return (
                      <div key={stat.month} className="space-y-2">
                        <h5 className="font-medium">{format(new Date(stat.month + '-01'), 'MMMM yyyy')}</h5>
                        <div className="flex justify-between items-center text-sm">
                          <span>Snippets:</span>
                          <div className={cn(
                            "flex items-center gap-1",
                            snippetGrowth.trend === 'up' ? 'text-green-600' : 
                            snippetGrowth.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                          )}>
                            {snippetGrowth.trend === 'up' ? <TrendingUp size={12} /> : 
                             snippetGrowth.trend === 'down' ? <TrendingDown size={12} /> : null}
                            {snippetGrowth.percentage.toFixed(1)}%
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Likes:</span>
                          <div className={cn(
                            "flex items-center gap-1",
                            likeGrowth.trend === 'up' ? 'text-green-600' : 
                            likeGrowth.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                          )}>
                            {likeGrowth.trend === 'up' ? <TrendingUp size={12} /> : 
                             likeGrowth.trend === 'down' ? <TrendingDown size={12} /> : null}
                            {likeGrowth.percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Best Performing Month</CardTitle>
                <CardDescription>Your highest activity month</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  if (monthlyStats.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No data available yet</p>
                      </div>
                    );
                  }
                  
                  const bestMonth = monthlyStats.reduce((best, current) => 
                    current.snippets_created > best.snippets_created ? current : best,
                    monthlyStats[0]
                  );
                  
                  return (
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-blue-600">
                          {format(new Date(bestMonth.month + '-01'), 'MMMM yyyy')}
                        </h3>
                        <p className="text-sm text-muted-foreground">Peak performance month</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-lg">{bestMonth.snippets_created}</div>
                          <div className="text-muted-foreground">Snippets</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-lg">{bestMonth.likes_received}</div>
                          <div className="text-muted-foreground">Likes</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-lg">{bestMonth.downloads}</div>
                          <div className="text-muted-foreground">Downloads</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-lg">{bestMonth.followers_gained}</div>
                          <div className="text-muted-foreground">Followers</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}