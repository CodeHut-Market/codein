import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { 
  Award, 
  Trophy, 
  Crown, 
  Star, 
  Zap, 
  Target, 
  Users, 
  Code, 
  Heart,
  Download,
  Eye,
  MessageSquare,
  TrendingUp,
  Shield,
  Flame,
  Sparkles,
  Rocket,
  Lock,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'creation' | 'engagement' | 'community' | 'quality' | 'milestone';
  requirements: {
    metric: string;
    value: number;
    operator: 'gte' | 'lte' | 'eq';
  }[];
  reward_points: number;
  unlocked_at: string | null;
  progress: number; // 0-100
  next_tier?: string;
  hidden?: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned_at: string | null;
  level: number;
  max_level: number;
  progress_to_next: number;
  requirements_current_level: any[];
}

interface UserStats {
  total_points: number;
  achievements_unlocked: number;
  badges_earned: number;
  current_streak: number;
  level: number;
  xp_current: number;
  xp_to_next_level: number;
  rank: string;
}

export default function AchievementsSystem() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  const mockAchievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Create your first code snippet',
      icon: 'Code',
      rarity: 'common',
      category: 'creation',
      requirements: [{ metric: 'snippets_created', value: 1, operator: 'gte' }],
      reward_points: 10,
      unlocked_at: '2024-01-15T10:30:00Z',
      progress: 100
    },
    {
      id: '2',
      title: 'Prolific Creator',
      description: 'Create 50 code snippets',
      icon: 'Rocket',
      rarity: 'rare',
      category: 'creation',
      requirements: [{ metric: 'snippets_created', value: 50, operator: 'gte' }],
      reward_points: 100,
      unlocked_at: '2024-03-20T14:15:00Z',
      progress: 100,
      next_tier: 'century-creator'
    },
    {
      id: '3',
      title: 'Century Creator',
      description: 'Create 100 code snippets',
      icon: 'Crown',
      rarity: 'epic',
      category: 'creation',
      requirements: [{ metric: 'snippets_created', value: 100, operator: 'gte' }],
      reward_points: 250,
      unlocked_at: null,
      progress: 78
    },
    {
      id: '4',
      title: 'Community Favorite',
      description: 'Receive 100 likes across all snippets',
      icon: 'Heart',
      rarity: 'rare',
      category: 'engagement',
      requirements: [{ metric: 'total_likes', value: 100, operator: 'gte' }],
      reward_points: 150,
      unlocked_at: '2024-04-10T09:45:00Z',
      progress: 100
    },
    {
      id: '5',
      title: 'Viral Code',
      description: 'Have a single snippet receive 50+ likes',
      icon: 'Flame',
      rarity: 'epic',
      category: 'engagement',
      requirements: [{ metric: 'max_snippet_likes', value: 50, operator: 'gte' }],
      reward_points: 200,
      unlocked_at: null,
      progress: 64
    },
    {
      id: '6',
      title: 'Download Master',
      description: 'Reach 1000 total downloads',
      icon: 'Download',
      rarity: 'epic',
      category: 'community',
      requirements: [{ metric: 'total_downloads', value: 1000, operator: 'gte' }],
      reward_points: 300,
      unlocked_at: null,
      progress: 42
    },
    {
      id: '7',
      title: 'Code Streak',
      description: 'Upload snippets for 7 consecutive days',
      icon: 'Zap',
      rarity: 'rare',
      category: 'milestone',
      requirements: [{ metric: 'upload_streak', value: 7, operator: 'gte' }],
      reward_points: 75,
      unlocked_at: '2024-02-28T16:20:00Z',
      progress: 100
    },
    {
      id: '8',
      title: 'Quality Assurance',
      description: 'Maintain 4.5+ average rating with 20+ snippets',
      icon: 'Shield',
      rarity: 'legendary',
      category: 'quality',
      requirements: [
        { metric: 'average_rating', value: 4.5, operator: 'gte' },
        { metric: 'snippets_created', value: 20, operator: 'gte' }
      ],
      reward_points: 500,
      unlocked_at: null,
      progress: 85
    },
    {
      id: '9',
      title: 'Hidden Gem',
      description: 'Create a snippet that gets featured',
      icon: 'Sparkles',
      rarity: 'legendary',
      category: 'quality',
      requirements: [{ metric: 'featured_snippets', value: 1, operator: 'gte' }],
      reward_points: 750,
      unlocked_at: null,
      progress: 0,
      hidden: true
    }
  ];

  const mockBadges: Badge[] = [
    {
      id: '1',
      name: 'Creator',
      description: 'For creating code snippets',
      icon: 'Code',
      color: '#3b82f6',
      earned_at: '2024-01-15T10:30:00Z',
      level: 3,
      max_level: 5,
      progress_to_next: 65,
      requirements_current_level: [
        { metric: 'snippets_created', current: 78, required: 100 }
      ]
    },
    {
      id: '2',
      name: 'Popular',
      description: 'For receiving likes on snippets',
      icon: 'Heart',
      color: '#ef4444',
      earned_at: '2024-02-10T15:22:00Z',
      level: 2,
      max_level: 5,
      progress_to_next: 45,
      requirements_current_level: [
        { metric: 'total_likes', current: 245, required: 500 }
      ]
    },
    {
      id: '3',
      name: 'Sharer',
      description: 'For snippet downloads by others',
      icon: 'Download',
      color: '#10b981',
      earned_at: '2024-03-05T11:10:00Z',
      level: 1,
      max_level: 5,
      progress_to_next: 28,
      requirements_current_level: [
        { metric: 'total_downloads', current: 420, required: 1000 }
      ]
    },
    {
      id: '4',
      name: 'Influencer',
      description: 'For building a following',
      icon: 'Users',
      color: '#8b5cf6',
      earned_at: null,
      level: 0,
      max_level: 5,
      progress_to_next: 72,
      requirements_current_level: [
        { metric: 'followers', current: 36, required: 50 }
      ]
    }
  ];

  const mockUserStats: UserStats = {
    total_points: 1450,
    achievements_unlocked: 4,
    badges_earned: 3,
    current_streak: 5,
    level: 8,
    xp_current: 1450,
    xp_to_next_level: 2000,
    rank: 'Rising Developer'
  };

  useEffect(() => {
    setAchievements(mockAchievements);
    setBadges(mockBadges);
    setUserStats(mockUserStats);
  }, []);

  const getIconComponent = (iconName: string, size = 24) => {
    const icons: { [key: string]: any } = {
      Code, Trophy, Crown, Star, Zap, Target, Users, Heart, Download, Eye,
      MessageSquare, TrendingUp, Shield, Flame, Sparkles, Rocket, Award
    };
    const IconComponent = icons[iconName] || Code;
    return <IconComponent size={size} />;
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100 border-gray-300';
      case 'rare': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'epic': return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'legendary': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getRarityGlow = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'rare': return 'shadow-blue-500/20';
      case 'epic': return 'shadow-purple-500/30';
      case 'legendary': return 'shadow-yellow-500/40';
      default: return '';
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (achievement.hidden && !achievement.unlocked_at) return false;
    if (showUnlockedOnly && !achievement.unlocked_at) return false;
    if (selectedCategory === 'all') return true;
    return achievement.category === selectedCategory;
  });

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    const isUnlocked = !!achievement.unlocked_at;
    
    return (
      <Card className={cn(
        "relative transition-all duration-300 hover:scale-105",
        isUnlocked ? `border-2 ${getRarityGlow(achievement.rarity)} shadow-lg` : 'opacity-60',
        isUnlocked && achievement.rarity === 'legendary' && 'animate-pulse'
      )}>
        {isUnlocked && (
          <div className={cn(
            "absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center",
            getRarityColor(achievement.rarity)
          )}>
            <CheckCircle size={16} />
          </div>
        )}
        
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={cn(
              "p-3 rounded-lg",
              isUnlocked ? getRarityColor(achievement.rarity) : 'bg-gray-100 text-gray-400'
            )}>
              {getIconComponent(achievement.icon, 24)}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={cn(
                    "font-semibold",
                    !isUnlocked && 'text-gray-500'
                  )}>
                    {achievement.title}
                  </h4>
                  <p className={cn(
                    "text-sm",
                    isUnlocked ? 'text-muted-foreground' : 'text-gray-400'
                  )}>
                    {achievement.description}
                  </p>
                </div>
                <Badge className={cn("text-xs", getRarityColor(achievement.rarity))}>
                  {achievement.rarity}
                </Badge>
              </div>

              {!isUnlocked && achievement.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{achievement.progress}%</span>
                  </div>
                  <Progress value={achievement.progress} className="h-2" />
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Star size={12} className="text-yellow-500" />
                  <span className="text-muted-foreground">
                    {achievement.reward_points} points
                  </span>
                </div>
                {isUnlocked && (
                  <span className="text-green-600 font-medium">
                    Unlocked {format(new Date(achievement.unlocked_at!), 'MMM d, yyyy')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const BadgeCard = ({ badge }: { badge: Badge }) => {
    const isEarned = !!badge.earned_at;
    const progressPercentage = (badge.progress_to_next / 100) * 100;
    
    return (
      <Card className={cn(
        "transition-all duration-300 hover:scale-105",
        isEarned ? 'border-2 shadow-lg' : 'opacity-60'
      )}>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className={cn(
              "w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-bold",
              isEarned ? '' : 'bg-gray-300'
            )} style={{ backgroundColor: isEarned ? badge.color : undefined }}>
              {isEarned ? getIconComponent(badge.icon, 32) : <Lock size={32} />}
            </div>
            
            <div>
              <h4 className={cn(
                "font-semibold",
                !isEarned && 'text-gray-500'
              )}>
                {badge.name} {isEarned && `Level ${badge.level}`}
              </h4>
              <p className={cn(
                "text-sm",
                isEarned ? 'text-muted-foreground' : 'text-gray-400'
              )}>
                {badge.description}
              </p>
            </div>

            {isEarned && badge.level < badge.max_level && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Next Level</span>
                  <span className="font-medium">{badge.progress_to_next}%</span>
                </div>
                <Progress value={badge.progress_to_next} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {badge.requirements_current_level.map((req, idx) => (
                    <div key={idx}>
                      {req.current.toLocaleString()} / {req.required.toLocaleString()} {req.metric.replace('_', ' ')}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isEarned && (
              <div className="text-xs text-green-600 font-medium">
                Earned {format(new Date(badge.earned_at!), 'MMM d, yyyy')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* User Stats Overview */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <Trophy size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">{userStats.level}</div>
              <div className="text-sm text-muted-foreground">Level</div>
              <div className="text-xs font-medium mt-1">{userStats.rank}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                  <Star size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{userStats.total_points}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
              <div className="text-xs text-muted-foreground mt-1">
                {userStats.xp_to_next_level - userStats.xp_current} to next level
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <Award size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">{userStats.achievements_unlocked}</div>
              <div className="text-sm text-muted-foreground">Achievements</div>
              <div className="text-xs text-muted-foreground mt-1">
                {achievements.length - userStats.achievements_unlocked} remaining
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                  <Zap size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-600">{userStats.current_streak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
              <div className="text-xs text-muted-foreground mt-1">Keep it up!</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="all">All</option>
                  <option value="creation">Creation</option>
                  <option value="engagement">Engagement</option>
                  <option value="community">Community</option>
                  <option value="quality">Quality</option>
                  <option value="milestone">Milestone</option>
                </select>
              </div>
              <Button
                variant={showUnlockedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
              >
                {showUnlockedOnly ? 'Show All' : 'Unlocked Only'}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredAchievements.filter(a => a.unlocked_at).length} of {filteredAchievements.length} unlocked
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>

          {filteredAchievements.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Award size={48} className="mx-auto mb-4 opacity-50" />
              <p>No achievements found for the selected filters.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Progress Badges</h3>
              <p className="text-sm text-muted-foreground">
                Level up your badges by continuing your coding journey
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {badges.filter(b => b.earned_at).length} of {badges.length} earned
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {badges.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>

          {/* Level Progress */}
          {userStats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target size={20} />
                  Level Progress
                </CardTitle>
                <CardDescription>
                  Your journey to the next level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        {userStats.level}
                      </div>
                      <div>
                        <div className="font-semibold">Level {userStats.level}</div>
                        <div className="text-sm text-muted-foreground">{userStats.rank}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">Level {userStats.level + 1}</div>
                      <div className="text-sm text-muted-foreground">
                        {userStats.xp_to_next_level - userStats.xp_current} XP needed
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{userStats.xp_current} XP</span>
                      <span>{userStats.xp_to_next_level} XP</span>
                    </div>
                    <Progress 
                      value={(userStats.xp_current / userStats.xp_to_next_level) * 100} 
                      className="h-3"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}