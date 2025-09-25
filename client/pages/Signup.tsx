"use client"

import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code,
  Eye,
  EyeOff,
  Github,
  Rocket,
  Settings,
  Sparkles,
  User,
  X
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

interface OnboardingData {
  // Step 1: Basic Info
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  
  // Step 2: Profile Setup
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  website: string;
  
  // Step 3: Preferences
  primaryLanguage: string;
  interests: string[];
  experienceLevel: string;
  goals: string[];
  
  // Step 4: Notifications & Privacy
  emailNotifications: boolean;
  browserNotifications: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
  profileVisibility: string;
  showEmail: boolean;
  
  // Terms
  acceptTerms: boolean;
  subscribeNewsletter: boolean;
}

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [isUsernameValid, setIsUsernameValid] = useState(true);

  const [formData, setFormData] = useState<OnboardingData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
    website: "",
    primaryLanguage: "",
    interests: [],
    experienceLevel: "",
    goals: [],
    emailNotifications: true,
    browserNotifications: true,
    weeklyDigest: true,
    marketingEmails: false,
    profileVisibility: "public",
    showEmail: false,
    acceptTerms: false,
    subscribeNewsletter: false,
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const languages = [
    'JavaScript', 'Python', 'TypeScript', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 
    'Go', 'Rust', 'Swift', 'Kotlin', 'Dart', 'HTML/CSS', 'SQL', 'Shell/Bash'
  ];

  const interests = [
    'Web Development', 'Mobile Development', 'Backend Development', 'Frontend Development',
    'Full Stack', 'DevOps', 'Data Science', 'Machine Learning', 'AI', 'Cybersecurity',
    'Game Development', 'Blockchain', 'Cloud Computing', 'UI/UX Design', 'API Development',
    'Database Design', 'System Architecture', 'Open Source', 'Startups', 'Enterprise'
  ];

  const experienceLevels = [
    { id: 'beginner', label: 'Beginner', desc: '0-2 years of coding experience' },
    { id: 'intermediate', label: 'Intermediate', desc: '2-5 years of coding experience' },
    { id: 'advanced', label: 'Advanced', desc: '5+ years of coding experience' },
    { id: 'expert', label: 'Expert', desc: '10+ years, lead teams or architect systems' }
  ];

  const goals = [
    'Learn new technologies', 'Share knowledge with community', 'Build a portfolio',
    'Find code solutions quickly', 'Collaborate with other developers', 'Monetize my code',
    'Get discovered by recruiters', 'Build open source projects', 'Start freelancing',
    'Improve code quality', 'Stay updated with trends', 'Network with peers'
  ];

  const validatePassword = (password: string) => {
    const validation = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordValidation(validation);
    return Object.values(validation).every(Boolean);
  };

  const validateUsername = (username: string) => {
    const trimmed = username.trim();
    const valid = /^[a-zA-Z0-9_-]{3,20}$/.test(trimmed);
    setIsUsernameValid(valid || trimmed.length === 0);
    return valid;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      setError("");
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError("");
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.username.trim() || !formData.email.trim() || !formData.password) {
          setError("Please fill in all required fields");
          return false;
        }
        if (!validateUsername(formData.username)) {
          setError("Username must be 3-20 characters with only letters, numbers, underscores, or hyphens");
          return false;
        }
        if (!validatePassword(formData.password)) {
          setError("Password does not meet security requirements");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return false;
        }
        break;
      case 2:
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
          setError("Please provide your first and last name");
          return false;
        }
        break;
      case 3:
        if (!formData.primaryLanguage || formData.interests.length === 0 || !formData.experienceLevel) {
          setError("Please complete your preferences to help us personalize your experience");
          return false;
        }
        if (formData.goals.length === 0) {
          setError("Please select at least one goal to help us understand how you plan to use CodeHut");
          return false;
        }
        break;
      case 5:
        if (!formData.acceptTerms) {
          setError("You must accept the Terms of Service to continue");
          return false;
        }
        break;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          primaryLanguage: formData.primaryLanguage,
          interests: formData.interests,
          experienceLevel: formData.experienceLevel,
          goals: formData.goals,
          preferences: {
            emailNotifications: formData.emailNotifications,
            browserNotifications: formData.browserNotifications,
            weeklyDigest: formData.weeklyDigest,
            marketingEmails: formData.marketingEmails,
            profileVisibility: formData.profileVisibility,
            showEmail: formData.showEmail,
          },
          subscribeNewsletter: formData.subscribeNewsletter,
        }),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error("Response parsing error:", parseError);
        throw new Error(`Server returned invalid response (${response.status}). Please try again.`);
      }

      if (!response.ok) {
        throw new Error(responseData.message || "Signup failed");
      }

      login(responseData.user, responseData.accessToken);
      navigate("/dashboard?welcome=true");
    } catch (error) {
      console.error("Signup error:", error);
      setError(error instanceof Error ? error.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (updates: Partial<OnboardingData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const toggleInterest = (interest: string) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    updateFormData({ interests: newInterests });
  };

  const toggleGoal = (goal: string) => {
    const newGoals = formData.goals.includes(goal)
      ? formData.goals.filter(g => g !== goal)
      : [...formData.goals, goal];
    updateFormData({ goals: newGoals });
  };

  const ValidationIcon = ({ isValid }: { isValid: boolean }) =>
    isValid ? (
      <Check className="w-4 h-4 text-green-500" />
    ) : (
      <X className="w-4 h-4 text-red-500" />
    );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Create Your Account</h2>
              <p className="text-muted-foreground">Let's start with the basics</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateFormData({ username: val });
                    validateUsername(val);
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  3–20 characters. Letters, numbers, underscores, and hyphens only.
                </p>
                {!isUsernameValid && (
                  <p className="text-xs text-red-600 mt-1">
                    Username format is invalid
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => {
                      updateFormData({ password: e.target.value });
                      validatePassword(e.target.value);
                    }}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>

                {formData.password && (
                  <div className="mt-2 space-y-1">
                    {Object.entries(passwordValidation).map(([key, isValid]) => (
                      <div key={key} className="flex items-center gap-2 text-xs">
                        <ValidationIcon isValid={isValid} />
                        <span className={isValid ? "text-green-600" : "text-red-600"}>
                          {key === 'length' && 'At least 8 characters'}
                          {key === 'uppercase' && 'One uppercase letter'}
                          {key === 'lowercase' && 'One lowercase letter'}
                          {key === 'number' && 'One number'}
                          {key === 'special' && 'One special character'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Tell Us About You</h2>
              <p className="text-muted-foreground">Help others discover and connect with you</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => updateFormData({ firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => updateFormData({ lastName: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell the community about yourself, your coding journey, and what you're passionate about..."
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => updateFormData({ bio: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  A good bio helps others understand your expertise and interests
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="San Francisco, CA"
                    value={formData.location}
                    onChange={(e) => updateFormData({ location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://johndoe.dev"
                    value={formData.website}
                    onChange={(e) => updateFormData({ website: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Code className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Your Coding Profile</h2>
              <p className="text-muted-foreground">Help us personalize your CodeHut experience</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Primary Programming Language</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {languages.map((lang) => (
                    <Button
                      key={lang}
                      variant={formData.primaryLanguage === lang ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFormData({ primaryLanguage: lang })}
                      className="justify-start"
                    >
                      {lang}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Areas of Interest</Label>
                <p className="text-sm text-muted-foreground mb-3">Select all that apply</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {interests.map((interest) => (
                    <Button
                      key={interest}
                      variant={formData.interests.includes(interest) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleInterest(interest)}
                      className="justify-start"
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Selected: {formData.interests.length}
                </p>
              </div>

              <div>
                <Label>Experience Level</Label>
                <div className="grid gap-3 mt-2">
                  {experienceLevels.map((level) => (
                    <div
                      key={level.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.experienceLevel === level.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => updateFormData({ experienceLevel: level.id })}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{level.label}</h3>
                          <p className="text-sm text-muted-foreground">{level.desc}</p>
                        </div>
                        {formData.experienceLevel === level.id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>What are your goals on CodeHut?</Label>
                <p className="text-sm text-muted-foreground mb-3">Select all that apply</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {goals.map((goal) => (
                    <Button
                      key={goal}
                      variant={formData.goals.includes(goal) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleGoal(goal)}
                      className="justify-start"
                    >
                      {goal}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Selected: {formData.goals.length}
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Settings className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Preferences</h2>
              <p className="text-muted-foreground">Customize your notifications and privacy settings</p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notifications</CardTitle>
                  <CardDescription>Choose how you'd like to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Get notified about important updates</p>
                    </div>
                    <Switch
                      checked={formData.emailNotifications}
                      onCheckedChange={(checked) => updateFormData({ emailNotifications: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Browser Notifications</h4>
                      <p className="text-sm text-muted-foreground">Real-time notifications in your browser</p>
                    </div>
                    <Switch
                      checked={formData.browserNotifications}
                      onCheckedChange={(checked) => updateFormData({ browserNotifications: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Weekly Digest</h4>
                      <p className="text-sm text-muted-foreground">Summary of your weekly activity</p>
                    </div>
                    <Switch
                      checked={formData.weeklyDigest}
                      onCheckedChange={(checked) => updateFormData({ weeklyDigest: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Marketing Emails</h4>
                      <p className="text-sm text-muted-foreground">Promotions and feature announcements</p>
                    </div>
                    <Switch
                      checked={formData.marketingEmails}
                      onCheckedChange={(checked) => updateFormData({ marketingEmails: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Privacy</CardTitle>
                  <CardDescription>Control who can see your information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Profile Visibility</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {[
                        { id: 'public', label: 'Public', desc: 'Anyone can view your profile' },
                        { id: 'members', label: 'Members Only', desc: 'Only CodeHut members can view' },
                        { id: 'private', label: 'Private', desc: 'Only you can view your profile' }
                      ].map((option) => (
                        <div
                          key={option.id}
                          className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                            formData.profileVisibility === option.id 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => updateFormData({ profileVisibility: option.id })}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{option.label}</h4>
                              <p className="text-sm text-muted-foreground">{option.desc}</p>
                            </div>
                            {formData.profileVisibility === option.id && (
                              <Check className="w-5 h-5 text-primary" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Show Email</h4>
                      <p className="text-sm text-muted-foreground">Display email on your public profile</p>
                    </div>
                    <Switch
                      checked={formData.showEmail}
                      onCheckedChange={(checked) => updateFormData({ showEmail: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">You're Almost Ready!</h2>
              <p className="text-muted-foreground">Just a few more details and you're all set</p>
            </div>

            <Card className="bg-gradient-to-r from-primary/5 to-purple-600/5">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Welcome to CodeHut!
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Share and discover amazing code snippets</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Connect with a community of developers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Build your coding portfolio and reputation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Access powerful tools and analytics</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => updateFormData({ acceptTerms: checked as boolean })}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="newsletter"
                  checked={formData.subscribeNewsletter}
                  onCheckedChange={(checked) => updateFormData({ subscribeNewsletter: checked as boolean })}
                />
                <Label htmlFor="newsletter" className="text-sm leading-relaxed">
                  Subscribe to our newsletter for coding tips, featured snippets, and platform updates
                </Label>
              </div>
            </div>

            <Separator />

            <div className="text-center text-sm text-muted-foreground">
              <p>Or continue with</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" type="button">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
              <Button variant="outline" type="button">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <Logo size="md" />
            </div>
            <div className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-background border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              {renderStep()}

              <div className="flex items-center justify-between pt-6 mt-8 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex space-x-2">
                  {Array.from({ length: totalSteps }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < currentStep ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                {currentStep < totalSteps ? (
                  <Button onClick={handleNext} className="flex items-center">
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center bg-green-600 hover:bg-green-700"
                  >
                    {loading ? (
                      "Creating Account..."
                    ) : (
                      <>
                        <Rocket className="w-4 h-4 mr-2" />
                        Create Account
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
