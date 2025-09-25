import { Star, Download, ThumbsUpIcon, Lock, User, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ProductCard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 p-6">
      <div className="max-w-md mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">CodeHut</h1>
          <p className="text-sm text-slate-600">Premium Code Components</p>
        </div>

        <Card className="relative overflow-hidden shadow-2xl border-0 bg-white/90 backdrop-blur-md rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 p-[1px] rounded-2xl">
            <div className="rounded-2xl h-full w-full bg-[rgba(239,232,232,1)]" />
          </div>

          <div className="relative z-10">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md">
                      <Code2 className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">React Login Form</h2>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed mb-3 font-semibold">
                    Responsive login component with validation and loading states.
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-0.5 rounded-full"
                    >
                      React
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 border-purple-200 text-xs px-2 py-0.5 rounded-full"
                    >
                      Form
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-orange-50 text-orange-700 border-orange-200 text-xs px-2 py-0.5 rounded-full"
                    >
                      Auth
                    </Badge>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-red-500 hover:bg-red-50 hover:scale-110 transition-all duration-200 rounded-full"
                >
                  <ThumbsUpIcon className="px-[-px] px-0 py-0 mx-0 my-0 w-10 h-10" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-t border-slate-100">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-slate-900">4.8</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-600">
                    <Download className="h-3.5 w-3.5" />
                    <span>89</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-600">
                    <User className="h-3.5 w-3.5" />
                    <span>JohnDoe</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-4 border border-slate-200/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                    <Lock className="h-3.5 w-3.5" />
                    Code Preview
                  </h3>
                </div>

                <div className="bg-slate-900 rounded-lg p-3 mb-3">
                  <div className="text-green-400 font-mono text-xs space-y-1">
                    <div className="opacity-60">import React from 'react';</div>
                    <div className="opacity-60">export function LoginForm() {`{`}</div>
                    <div className="opacity-40 pl-2">// Form logic here...</div>
                    <div className="text-slate-500 text-center py-2 border border-dashed border-slate-600 rounded-lg text-xs">
                      Purchase to unlock
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] bg-sidebar-accent text-card">
                  Buy Now
                </Button>
                <Button
                  variant="outline"
                  className="px-4 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all duration-200 hover:scale-[1.02] bg-secondary-foreground"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  )
}
