"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Camera,
  Save,
  User,
  Upload
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../../client/contexts/AuthContext";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  username: string;
  bio: string;
  avatar: string;
}

export default function EditProfilePage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    username: '',
    bio: '',
    avatar: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      router.push('/login');
      return;
    }

    // Load user profile data from API
    loadUserProfile();
  }, [currentUser, router]);

  const loadUserProfile = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      
      const response = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load profile');
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        setProfile({
          id: data.user.id,
          username: data.user.username || '',
          bio: data.user.bio || '',
          avatar: data.user.avatar || ''
        });
        setAvatarPreview(data.user.avatar || '');
      } else {
        // Fallback to current user data
        setProfile({
          id: currentUser.id,
          username: currentUser.username || '',
          bio: currentUser.bio || '',
          avatar: currentUser.avatar || ''
        });
        setAvatarPreview(currentUser.avatar || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // Fallback to current user data
      setProfile({
        id: currentUser.id,
        username: currentUser.username || '',
        bio: currentUser.bio || '',
        avatar: currentUser.avatar || ''
      });
      setAvatarPreview(currentUser.avatar || '');
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;
    
    setSaving(true);
    
    try {
      // Basic validation
      if (!profile.username.trim()) {
        toast.error("Username is required");
        setSaving(false);
        return;
      }
      
      let avatarUrl = profile.avatar;
      
      // Upload avatar if a new file was selected
      if (avatarFile) {
        try {
          const formData = new FormData();
          formData.append('avatar', avatarFile);
          
          const uploadResponse = await fetch('/api/profile/avatar', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            },
            body: formData,
          });
          
          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.error || 'Failed to upload avatar');
          }
          
          const uploadData = await uploadResponse.json();
          if (uploadData.success) {
            avatarUrl = uploadData.avatar_url;
          }
        } catch (uploadError) {
          console.error('Avatar upload failed:', uploadError);
          toast.error('Failed to upload avatar, but profile will still be updated');
        }
      }
      
      // Prepare update data
      const updateData = {
        username: profile.username.trim(),
        bio: profile.bio.trim(),
        avatar: avatarUrl
      };
      
      // Call the API to update profile
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('Profile updated successfully:', data.user);
        toast.success("Profile updated successfully!");
        
        // Clear any old localStorage data (cleanup)
        localStorage.removeItem(`user_profile_${currentUser.id}`);
        localStorage.removeItem(`profile_data_${profile.username}`);
        
        // Redirect back to profile using updated username
        router.push(`/profile/${data.user.username}`);
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
      
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/profile/${profile.username}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>

      <div className="space-y-6">
        {/* Profile Picture Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Profile Picture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatarPreview} alt={profile.username} />
                <AvatarFallback className="text-lg">
                  {profile.username?.charAt(0)?.toUpperCase() || <User className="w-8 h-8" />}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                <Label htmlFor="avatar" className="cursor-pointer">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Change Photo
                    </span>
                  </Button>
                </Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <p className="text-sm text-muted-foreground">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                placeholder="Enter your username"
              />
              <p className="text-sm text-muted-foreground">
                This is how others will find you on the platform.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell others about yourself, your skills, and what you do..."
                rows={4}
                maxLength={500}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Share a bit about yourself and your coding expertise.</span>
                <span>{profile.bio.length}/500</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href={`/profile/${profile.username}`}>
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="min-w-[120px]"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}