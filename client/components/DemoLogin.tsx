import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, UserCheck, Code, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface DemoUser {
  username: string;
  role: string;
  bio: string;
  stats: string;
  icon: React.ReactNode;
}

const demoUsers: DemoUser[] = [
  {
    username: "JohnDoe",
    role: "👑 Admin • Full-stack Developer",
    bio: "React and Node.js specialist with 12 published snippets",
    stats: "12 snippets • 4.8★",
    icon: <User className="h-4 w-4" />,
  },
  {
    username: "SarahK",
    role: "UI/UX Designer",
    bio: "Vue.js specialist with beautiful dashboard components",
    stats: "8 snippets • 4.9★",
    icon: <UserCheck className="h-4 w-4" />,
  },
  {
    username: "DevMaster",
    role: "🛡️ Moderator • Backend Engineer",
    bio: "API and microservices expert with 15 snippets",
    stats: "15 snippets • 4.7★",
    icon: <Code className="h-4 w-4" />,
  },
  {
    username: "CSSGuru",
    role: "Frontend Specialist",
    bio: "CSS and design systems expert with 20+ snippets",
    stats: "23 snippets • 4.9★",
    icon: <Star className="h-4 w-4" />,
  },
  {
    username: "ReactPro",
    role: "React Expert",
    bio: "React specialist focused on hooks and performance",
    stats: "18 snippets • 4.8★",
    icon: <Code className="h-4 w-4" />,
  },
];

export default function DemoLogin() {
  const [loading, setLoading] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async (username: string) => {
    setLoading(username);

    try {
      const response = await fetch(`/api/auth/demo/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Demo login failed");
      }

      const data = await response.json();

      // Use auth context to handle login
      login(data.user, data.accessToken);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Demo login error:", error);
      // You could add toast notification here
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="text-2xl">👑</span>
          <div>
            <CardTitle>Demo Accounts</CardTitle>
            <CardDescription>
              Try CodeHut with pre-made user accounts
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {demoUsers.map((user) => (
            <div
              key={user.username}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  {user.icon}
                </div>
                <div>
                  <div className="font-medium">{user.username}</div>
                  <div className="text-sm text-gray-600">{user.role}</div>
                  <div className="text-xs text-gray-500">{user.bio}</div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="text-xs mb-1">
                  {user.stats}
                </Badge>
                <br />
                <Button
                  size="sm"
                  onClick={() => handleDemoLogin(user.username)}
                  disabled={loading === user.username}
                  className="text-xs"
                >
                  {loading === user.username ? "Logging in..." : "Try Account"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
