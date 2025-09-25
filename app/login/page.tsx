"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { getRedirectURL, isSupabaseEnabled, supabase } from "../lib/supabaseClient";

export default function LoginPage() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [isLoading, setIsLoading] = useState(false)

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		// Placeholder: implement email/password auth if desired
		await new Promise((resolve) => setTimeout(resolve, 800))
		setIsLoading(false)
		console.log("[login] Attempted with:", { email, password })
	}

	const [oauthLoading, setOauthLoading] = useState<string | null>(null);
	const [oauthError, setOauthError] = useState<string | null>(null);

	const handleSocialLogin = async (provider: 'google' | 'github') => {
		if(!isSupabaseEnabled()) {
			console.log('[mock] Social login', provider);
			return;
		}
		try {
			setOauthError(null);
			setOauthLoading(provider);

			const { error } = await supabase!.auth.signInWithOAuth({ 
				provider,
				options: {
					redirectTo: `${getRedirectURL()}auth/callback`
				}
			});
			if(error) throw error;
		} catch(e:any){
			setOauthError(e.message || 'OAuth sign-in failed');
		} finally { setOauthLoading(null); }
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
					<form onSubmit={handleLogin} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email" className="text-sm font-medium font-sans">Email Address</Label>
							<Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="border-white/40 bg-white/10 placeholder:text-card-foreground/50 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/15" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="password" className="text-sm font-medium font-sans">Password</Label>
							<Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="border-white/40 bg-white/10 placeholder:text-card-foreground/50 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/15" />
						</div>
						<Button type="submit" className="w-full ripple-effect hover-lift font-sans font-bold py-5" style={{backgroundColor:'#0C115B',color:'white'}} disabled={isLoading}>{isLoading? 'Signing In...' : 'Sign In'}</Button>
					</form>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="px-2 font-sans text-card-foreground/60">Or continue with</span>
					</div>
					<div className="space-y-3">
						<Button variant="outline" onClick={()=>handleSocialLogin('google')} disabled={oauthLoading==='google'} className="w-full glass-effect border-white/30 hover-lift ripple-effect font-sans hover:bg-white/20">
							{oauthLoading==='google' ? 'Redirecting…' : 'Continue with Google'}
						</Button>
						<Button variant="outline" onClick={()=>handleSocialLogin('github')} disabled={oauthLoading==='github'} className="w-full glass-effect border-white/30 hover-lift ripple-effect font-sans hover:bg-white/20">
							{oauthLoading==='github' ? 'Redirecting…' : 'Continue with GitHub'}
						</Button>
						{oauthError && <p className="text-xs text-red-500 text-center">{oauthError}</p>}
					</div>
					<div className="text-center">
						<a href="#" className="text-sm font-sans text-card-foreground/70 hover:text-card-foreground transition-colors">Forgot your password?</a>
					</div>
				</CardContent>
			</Card>
		</div>
		</div>
	)
}

