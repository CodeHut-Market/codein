import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface SignupRequestBody {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  bio?: string;
  location?: string;
  website?: string;
  primaryLanguage: string;
  interests: string[];
  experienceLevel: string;
  goals: string[];
  preferences: {
    emailNotifications: boolean;
    browserNotifications: boolean;
    weeklyDigest: boolean;
    marketingEmails: boolean;
    profileVisibility: string;
    showEmail: boolean;
  };
  subscribeNewsletter: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: SignupRequestBody = await request.json();

    // Validate required fields
    const requiredFields = [
      'username', 'email', 'password', 'firstName', 'lastName',
      'primaryLanguage', 'interests', 'experienceLevel', 'goals'
    ];

    for (const field of requiredFields) {
      if (!body[field as keyof SignupRequestBody]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate arrays
    if (!Array.isArray(body.interests) || body.interests.length === 0) {
      return NextResponse.json(
        { message: "At least one interest must be selected" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.goals) || body.goals.length === 0) {
      return NextResponse.json(
        { message: "At least one goal must be selected" },
        { status: 400 }
      );
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(body.username)) {
      return NextResponse.json(
        { message: "Username must be 3-20 characters with only letters, numbers, underscores, or hyphens" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = {
      length: body.password.length >= 8,
      uppercase: /[A-Z]/.test(body.password),
      lowercase: /[a-z]/.test(body.password),
      number: /\d/.test(body.password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(body.password),
    };

    const isPasswordValid = Object.values(passwordValidation).every(Boolean);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Password does not meet security requirements" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const { data: existingUsername, error: usernameError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", body.username.trim())
      .single();

    if (usernameError && usernameError.code !== "PGRST116") {
      console.error("Username check error:", usernameError);
      return NextResponse.json(
        { message: "Database error checking username" },
        { status: 500 }
      );
    }

    if (existingUsername) {
      return NextResponse.json(
        { message: "Username is already taken" },
        { status: 409 }
      );
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: body.email.trim(),
      password: body.password,
      email_confirm: true, // Auto-confirm email for now
      user_metadata: {
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
      }
    });

    if (authError) {
      console.error("Auth creation error:", authError);
      
      // Handle specific auth errors
      if (authError.message?.includes("already registered")) {
        return NextResponse.json(
          { message: "An account with this email already exists" },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { message: authError.message || "Failed to create account" },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { message: "Failed to create user account" },
        { status: 500 }
      );
    }

    // Create user profile
    const profileData = {
      id: authData.user.id,
      username: body.username.trim(),
      first_name: body.firstName.trim(),
      last_name: body.lastName.trim(),
      bio: body.bio?.trim() || null,
      location: body.location?.trim() || null,
      website: body.website?.trim() || null,
      primary_language: body.primaryLanguage,
      interests: body.interests,
      experience_level: body.experienceLevel,
      goals: body.goals,
      email_notifications: body.preferences.emailNotifications,
      browser_notifications: body.preferences.browserNotifications,
      weekly_digest: body.preferences.weeklyDigest,
      marketing_emails: body.preferences.marketingEmails,
      profile_visibility: body.preferences.profileVisibility,
      show_email: body.preferences.showEmail,
      subscribe_newsletter: body.subscribeNewsletter,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error: profileError } = await supabase
      .from("profiles")
      .insert(profileData);

    if (profileError) {
      console.error("Profile creation error:", profileError);
      
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      
      return NextResponse.json(
        { message: "Failed to create user profile" },
        { status: 500 }
      );
    }

    // Return success (don't include sensitive data)
    return NextResponse.json({
      message: "Account created successfully",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        username: body.username.trim(),
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}