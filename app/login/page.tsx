"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { signIn, signInWithProvider, user } = useAuth();
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [oauthLoading, setOauthLoading] = useState<string | null>(null);
	const [authError, setAuthError] = useState<string | null>(null);

	// Check for error in URL params
	useEffect(() => {
		const error = searchParams?.get('error');
		if (error) {
			setAuthError(decodeURIComponent(error));
		}
	}, [searchParams]);

	// Redirect if already logged in
	useEffect(() => {
		if (user) {
			console.log('User authenticated, redirecting to dashboard');
			router.push('/dashboard');
		}
	}, [user, router]);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!email || !password) {
			setAuthError("Please enter both email and password");
			return;
		}

		setIsLoading(true)
		setAuthError(null)

		try {
			const { data, error } = await signIn(email.trim(), password);

			if (error) {
				throw error
			}

			if (data.user) {
				// Redirect to dashboard
				router.push('/dashboard');
			}
		} catch (error: any) {
			console.error('Login error:', error)
			setAuthError(error.message || 'Failed to sign in. Please check your credentials.');
		} finally {
			setIsLoading(false)
		}
	}

	const handleSocialLogin = async (provider: 'google' | 'github') => {
		try {
			setAuthError(null);
			setOauthLoading(provider);

			console.log(`Initiating ${provider} OAuth sign-in`);
			const { data, error } = await signInWithProvider(provider);
			
			if (error) {
				console.error(`${provider} OAuth error:`, error);
				throw error;
			}

			console.log(`${provider} OAuth initiated successfully`);
			// Don't clear loading here - let the auth state change handle it
		} catch(e: any){
			console.error(`${provider} OAuth sign-in failed:`, e);
			setAuthError(e.message || `${provider} sign-in failed`);
			setOauthLoading(null);
		}
	}

	return (
		<div>
			{/* Header */}
			<header className="bg-background/95 backdrop-blur border-b border-border">
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
							<div className="text-sm text-muted-foreground">
								Don't have an account?{" "}
								<Link href="/signup" className="text-primary hover:underline">
									Sign up
								</Link>
							</div>
						</div>
					</div>
				</div>
			</header>

			<div
				className="min-h-screen flex items-center justify-center p-4"
				style={{
					backgroundImage: "url('/gradient-background.jpeg')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			>
			<div
				className="absolute inset-0 opacity-0"
				style={{ background: "rgba(0, 0, 0, 0.15)" }}
			/>
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-50 animate-pulse" style={{background:"rgba(255,255,255,0.15)",backdropFilter:"blur(20px) saturate(180%)",border:"2px solid rgba(255,255,255,0.3)",boxShadow:"0 8px 32px rgba(255,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.4)"}} />
				<div className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full opacity-40 animate-pulse delay-1000" style={{background:"rgba(255,255,255,0.15)",backdropFilter:"blur(20px) saturate(180%)",border:"2px solid rgba(255,255,255,0.3)",boxShadow:"0 8px 32px rgba(255,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.4)"}} />
				<div className="absolute top-1/2 right-1/3 w-16 h-16 rounded-full opacity-45 animate-pulse delay-500" style={{background:"rgba(255,255,255,0.15)",backdropFilter:"blur(20px) saturate(180%)",border:"2px solid rgba(255,255,255,0.3)",boxShadow:"0 8px 32px rgba(255,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.4)"}} />
			</div>
			<Card
				className="max-w-md hover-lift shadow-2xl relative z-10 w-[126%] mx-[0] border-transparent"
				style={{
					background: "rgba(255, 255, 255, 0.25)",
					backdropFilter: "blur(40px) saturate(250%)",
					border: "1px solid rgba(255, 255, 255, 0.4)",
					boxShadow: "0 32px 80px rgba(0,0,0,0.3),0 16px 64px rgba(255,255,255,0.2), inset 0 3px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(255,255,255,0.3)"
				}}
			>
				<CardHeader className="text-center space-y-2">
					<CardTitle className="text-3xl font-bold font-sans">Welcome Back</CardTitle>
					<CardDescription className="font-sans">Sign in to your account to continue</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{authError && (
						<div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
							<p className="text-red-700 dark:text-red-400 text-sm">{authError}</p>
						</div>
					)}

					<form onSubmit={handleLogin} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email" className="text-sm font-medium font-sans">Email Address</Label>
							<Input 
								id="email" 
								type="email" 
								placeholder="Enter your email" 
								value={email} 
								onChange={(e)=>setEmail(e.target.value)} 
								required 
								className="border-white/40 bg-white/10 placeholder:text-card-foreground/50 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/15" 
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password" className="text-sm font-medium font-sans">Password</Label>
							<div className="relative">
								<Input 
									id="password" 
									type={showPassword ? "text" : "password"}
									placeholder="Enter your password" 
									value={password} 
									onChange={(e)=>setPassword(e.target.value)} 
									required 
									className="border-white/40 bg-white/10 placeholder:text-card-foreground/50 py-3 pr-10 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/15" 
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-card-foreground/60 hover:text-card-foreground"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
						</div>
						<Button 
							type="submit" 
							className="w-full ripple-effect hover-lift font-sans font-bold py-5" 
							style={{backgroundColor:'#0C115B',color:'white'}} 
							disabled={isLoading}
						>
							{isLoading ? 'Signing In...' : 'Sign In'}
						</Button>
					</form>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="px-2 font-sans text-card-foreground/60">Or continue with</span>
					</div>
					<div className="space-y-3">
						<Button variant="outline" onClick={()=>handleSocialLogin('google')} disabled={oauthLoading==='google' || oauthLoading==='processing'} className="w-full glass-effect border-white/30 hover-lift ripple-effect font-sans hover:bg-white/20">
							{oauthLoading==='google' ? 'Redirecting…' : oauthLoading==='processing' ? 'Completing sign in…' : 'Continue with Google'}
						</Button>
						<Button variant="outline" onClick={()=>handleSocialLogin('github')} disabled={oauthLoading==='github' || oauthLoading==='processing'} className="w-full glass-effect border-white/30 hover-lift ripple-effect font-sans hover:bg-white/20">
							{oauthLoading==='github' ? 'Redirecting…' : oauthLoading==='processing' ? 'Completing sign in…' : 'Continue with GitHub'}
						</Button>
					</div>
					<div className="text-center">
						<Link href="/reset-password" className="text-sm font-sans text-card-foreground/70 hover:text-card-foreground transition-colors">Forgot your password?</Link>
					</div>
				</CardContent>
			</Card>
		</div>
		</div>
	)
}

