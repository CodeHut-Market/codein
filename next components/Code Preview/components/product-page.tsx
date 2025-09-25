import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Download, Calendar, Lock, ShoppingCart, Eye, User } from "lucide-react"

export function ProductPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Header */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <CardTitle className="text-2xl font-bold text-gray-900">CSS Grid Layout System</CardTitle>
                  <p className="text-gray-600 leading-relaxed max-w-2xl">
                    Responsive grid system with modern CSS Grid and Flexbox, including auto-fit columns and gap
                    utilities.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                      CSS
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                      Grid
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                      Responsive
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                      Layout
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-gray-900">4.6</span>
                  <span>rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  <span className="font-medium text-gray-900">123</span>
                  <span>downloads</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Published 1/10/2024</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Preview */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Code Preview</CardTitle>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Eye className="w-4 h-4" />
                Purchase to View Full Code
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <div className="text-green-400">
                    <span className="text-blue-400">.grid-container</span> {"{"}
                  </div>
                  <div className="text-green-400 ml-4">
                    <span className="text-orange-400">display:</span> <span className="text-yellow-300">grid;</span>
                  </div>
                  <div className="text-green-400 ml-4">
                    <span className="text-orange-400">gap:</span> <span className="text-yellow-300">1rem;</span>
                  </div>
                  <div className="text-green-400 ml-4">
                    <span className="text-orange-400">grid-template-columns:</span>{" "}
                    <span className="text-yellow-300">repeat(auto-fit, minmax(250px, 1fr));</span>
                  </div>
                  <div className="text-green-400 ml-4">
                    <span className="text-orange-400">padding:</span> <span className="text-yellow-300">1rem;</span>
                  </div>
                  <div className="text-green-400">{"}"}</div>
                  <br />
                  <div className="text-green-400">
                    <span className="text-blue-400">.grid-item</span> {"{"}
                  </div>
                  <div className="text-green-400 ml-4">
                    <span className="text-orange-400">background:</span> <span className="text-yellow-300">white;</span>
                  </div>
                  <div className="text-green-400 ml-4">
                    <span className="text-orange-400">border-radius:</span>{" "}
                    <span className="text-yellow-300">8px;</span>
                  </div>
                  <div className="text-green-400 ml-4">
                    <span className="text-orange-400">padding:</span> <span className="text-yellow-300">1.5rem;</span>
                  </div>
                  <div className="text-green-400 ml-4">
                    <span className="text-orange-400">box-shadow:</span>{" "}
                    <span className="text-yellow-300">0 2px 4px rgba(0, 0, 0, 0.1);</span>
                  </div>
                  <div className="text-green-400 ml-4">
                    <span className="text-orange-400">transition:</span>{" "}
                    <span className="text-yellow-300">transform 0.2s ease, box-shadow 0.2s ease;</span>
                  </div>
                  <div className="text-green-400">{"}"}</div>
                  <br />
                  <div className="text-green-400">
                    <span className="text-blue-400">.grid-item:hover</span> {"{"}
                  </div>
                  <div className="text-green-400 ml-4">
                    <span className="text-orange-400">transform:</span>{" "}
                    <span className="text-yellow-300">translateY(-2px);</span>
                  </div>
                  <div className="text-green-400 ml-4">
                    <span className="text-orange-400">box-shadow:</span>{" "}
                    <span className="text-yellow-300">0 4px 8px rgba(0, 0, 0, 0.15);</span>
                  </div>
                  <div className="text-green-400">{"}"}</div>
                  <br />
                  <div className="text-gray-500">// Preview truncated - Purchase to see full code</div>
                </div>
              </div>

              {/* Locked Content Overlay */}
              <Card className="mt-4 bg-gray-50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <Lock className="w-8 h-8 text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-4">
                    This is a paid snippet. Purchase to view the complete source code.
                  </p>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Purchase for $3
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* About the Author */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">About the Author</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/developer-avatar.png" />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">CG</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900">CSSGuru</h4>
                    <p className="text-sm text-gray-600">Experienced CSS developer</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <User className="w-4 h-4" />
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase Card */}
          <Card className="border-0 shadow-sm sticky top-8">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Purchase</CardTitle>
                <div className="text-2xl font-bold text-emerald-600">$3</div>
              </div>
              <p className="text-sm text-gray-600">One-time purchase with lifetime access</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2" size="lg">
                <ShoppingCart className="w-4 h-4" />
                Buy Now for $3
              </Button>

              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-medium text-gray-900">What you'll get:</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    Complete source code
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    Lifetime updates
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    Commercial modify rights
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    Author support
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
