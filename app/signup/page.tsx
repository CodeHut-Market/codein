"use client"

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Rocket,
  User,
  X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../../client/components/ui/button";
import { Card, CardContent } from "../../client/components/ui/card";
import { Checkbox } from "../../client/components/ui/checkbox";
import { Input } from "../../client/components/ui/input";
import { Label } from "../../client/components/ui/label";
import { Progress } from "../../client/components/ui/progress";
import RippleThemeToggle from "../../components/RippleThemeToggle";

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

export default function SignupPage() {
  const router = useRouter();
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

      // For now, just redirect to login until auth context is set up
      router.push("/login?message=Account created successfully! Please log in.");
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
              <h2 className="text-2xl font-bold">Tell Us About Yourself</h2>
              <p className="text-muted-foreground">Help us create your perfect profile</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => updateFormData({ firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
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
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Tell other developers about yourself..."
                  value={formData.bio}
                  onChange={(e) => updateFormData({ bio: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Share a brief description about yourself and your coding journey
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="San Francisco, CA"
                    value={formData.location}
                    onChange={(e) => updateFormData({ location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourwebsite.com"
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
                <Rocket className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Your Coding Preferences</h2>
              <p className="text-muted-foreground">Help us personalize your experience</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Primary Programming Language *</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      className={`p-2 text-sm rounded-md border transition-colors ${
                        formData.primaryLanguage === lang
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted border-input'
                      }`}
                      onClick={() => updateFormData({ primaryLanguage: lang })}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Experience Level *</Label>
                <div className="space-y-2 mt-2">
                  {experienceLevels.map((level) => (
                    <div key={level.id} className="flex items-start space-x-3">
                      <input
                        type="radio"
                        id={level.id}
                        name="experienceLevel"
                        checked={formData.experienceLevel === level.id}
                        onChange={(e) => updateFormData({ experienceLevel: e.target.value })}
                        value={level.id}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor={level.id} className="font-medium">
                          {level.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">{level.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Areas of Interest * (Select all that apply)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {interests.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      className={`p-2 text-sm rounded-md border transition-colors ${
                        formData.interests.includes(interest)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted border-input'
                      }`}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Selected: {formData.interests.length} interest{formData.interests.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div>
                <Label>What are your goals with CodeHut? * (Select all that apply)</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {goals.map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      className={`p-3 text-sm rounded-md border text-left transition-colors ${
                        formData.goals.includes(goal)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted border-input'
                      }`}
                      onClick={() => toggleGoal(goal)}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Selected: {formData.goals.length} goal{formData.goals.length !== 1 ? 's' : ''}
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
                <User className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Notifications & Privacy</h2>
              <p className="text-muted-foreground">Customize your preferences</p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Notification Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Get notified about new followers, likes, and comments
                      </p>
                    </div>
                    <Checkbox
                      id="emailNotifications"
                      checked={formData.emailNotifications}
                      onCheckedChange={(checked) => 
                        updateFormData({ emailNotifications: checked as boolean })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="browserNotifications">Browser Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive instant notifications in your browser
                      </p>
                    </div>
                    <Checkbox
                      id="browserNotifications"
                      checked={formData.browserNotifications}
                      onCheckedChange={(checked) => 
                        updateFormData({ browserNotifications: checked as boolean })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weeklyDigest">Weekly Digest</Label>
                      <p className="text-xs text-muted-foreground">
                        Get a summary of trending snippets and activity
                      </p>
                    </div>
                    <Checkbox
                      id="weeklyDigest"
                      checked={formData.weeklyDigest}
                      onCheckedChange={(checked) => 
                        updateFormData({ weeklyDigest: checked as boolean })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketingEmails">Marketing Emails</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive updates about new features and promotions
                      </p>
                    </div>
                    <Checkbox
                      id="marketingEmails"
                      checked={formData.marketingEmails}
                      onCheckedChange={(checked) => 
                        updateFormData({ marketingEmails: checked as boolean })
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Privacy Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Profile Visibility</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          id="public"
                          name="profileVisibility"
                          checked={formData.profileVisibility === "public"}
                          onChange={(e) => updateFormData({ profileVisibility: e.target.value })}
                          value="public"
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor="public" className="font-medium">
                            Public
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Anyone can view your profile and snippets
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          id="private"
                          name="profileVisibility"
                          checked={formData.profileVisibility === "private"}
                          onChange={(e) => updateFormData({ profileVisibility: e.target.value })}
                          value="private"
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor="private" className="font-medium">
                            Private
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Only you can see your profile and snippets
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="showEmail">Show Email Publicly</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow other users to see your email address
                      </p>
                    </div>
                    <Checkbox
                      id="showEmail"
                      checked={formData.showEmail}
                      onCheckedChange={(checked) => 
                        updateFormData({ showEmail: checked as boolean })
                      }
                    />
                  </div>
                </div>
              </div>
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

            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => updateFormData({ acceptTerms: checked as boolean })}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
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
                  Subscribe to our newsletter for coding tips, feature updates, and community highlights
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Step {currentStep} - Under construction</div>;
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
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <RippleThemeToggle size="sm" />
              <div className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
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

