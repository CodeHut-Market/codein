"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../client/contexts/AuthContext";

export default function ResetPasswordPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { user } = useAuth();
	const [email, setEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [isResetMode, setIsResetMode] = useState(false);

	useEffect(() => {
		// Check if this is a password reset callback (has access_token in URL)
		const accessToken = searchParams?.get('access_token');
		const type = searchParams?.get('type');
		
		if (accessToken && type === 'recovery') {
			setIsResetMode(true);
		}
	}, [searchParams]);

	// Redirect authenticated users
	useEffect(() => {
		if (user && !isResetMode) {
			router.push('/dashboard');
		}
	}, [user, isResetMode, router]);

	const handleSendResetEmail = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) {
			setError("Please enter your email address");
			return;
		}

		setIsLoading(true);
		setError("");
		setMessage("");

		try {
			// You would implement the actual reset logic here
			// For now, just show a success message
			setMessage("If an account with that email exists, we've sent you a password reset link.");
		} catch (error: unknown) {
			setError("Failed to send reset email. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newPassword || !confirmPassword) {
			setError("Please fill in both password fields");
			return;
		}

		if (newPassword !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (newPassword.length < 8) {
			setError("Password must be at least 8 characters long");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			// You would implement the actual password update logic here
			setMessage("Password updated successfully! You can now sign in with your new password.");
			setTimeout(() => {
				router.push('/login');
			}, 2000);
		} catch (error: unknown) {
			setError("Failed to update password. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			{/* Header */}
			<header className="bg-background/95 backdrop-blur border-b border-border">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Link
								href="/login"
								className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
							>
								<ArrowLeft className="w-4 h-4" />
								Back to Login
							</Link>
						</div>
					</div>
				</div>
			</header>

			<div className="min-h-screen flex items-center justify-center p-4">
				<Card className="max-w-md w-full">
					<CardHeader className="text-center space-y-2">
						<CardTitle className="text-2xl font-bold">
							{isResetMode ? "Set New Password" : "Reset Password"}
						</CardTitle>
						<CardDescription>
							{isResetMode 
								? "Enter your new password below" 
								: "Enter your email to receive a password reset link"
							}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{message && (
							<div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
								<p className="text-green-700 dark:text-green-400 text-sm">{message}</p>
							</div>
						)}
						
						{error && (
							<div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
								<p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
							</div>
						)}

						{isResetMode ? (
							<form onSubmit={handleResetPassword} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="newPassword">New Password</Label>
									<Input
										id="newPassword"
										type="password"
										placeholder="Enter your new password"
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="confirmPassword">Confirm Password</Label>
									<Input
										id="confirmPassword"
										type="password"
										placeholder="Confirm your new password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
									/>
								</div>
								<Button
									type="submit"
									className="w-full"
									disabled={isLoading}
								>
									{isLoading ? "Updating..." : "Update Password"}
								</Button>
							</form>
						) : (
							<form onSubmit={handleSendResetEmail} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="email">Email Address</Label>
									<Input
										id="email"
										type="email"
										placeholder="Enter your email address"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</div>
								<Button
									type="submit"
									className="w-full"
									disabled={isLoading}
								>
									{isLoading ? "Sending..." : "Send Reset Link"}
								</Button>
							</form>
						)}

						<div className="text-center">
							<Link
								href="/login"
								className="text-sm text-muted-foreground hover:text-foreground"
							>
								Remember your password? Sign in
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}