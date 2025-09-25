import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage
            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
            alt="Jane Doe"
            className="object-cover"
          />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Jane Doe</p>
          <p className="text-sm text-muted-foreground">Acme Inc.</p>
        </div>
        <div className="ml-auto font-medium">+$15,000</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            alt="Mike Roberts"
            className="object-cover"
          />
          <AvatarFallback>MR</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Mike Roberts</p>
          <p className="text-sm text-muted-foreground">StartupXYZ</p>
        </div>
        <div className="ml-auto font-medium">+$12,500</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
            alt="Sarah Johnson"
            className="object-cover"
          />
          <AvatarFallback>SJ</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Sarah Johnson</p>
          <p className="text-sm text-muted-foreground">TechCorp Inc.</p>
        </div>
        <div className="ml-auto font-medium">+$25,000</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
            alt="Alex Lee"
            className="object-cover"
          />
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Alex Lee</p>
          <p className="text-sm text-muted-foreground">Global Solutions</p>
        </div>
        <div className="ml-auto font-medium">+$8,500</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
            alt="Emily Martinez"
            className="object-cover"
          />
          <AvatarFallback>EM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Emily Martinez</p>
          <p className="text-sm text-muted-foreground">Retail Chain Co.</p>
        </div>
        <div className="ml-auto font-medium">+$25,000</div>
      </div>
    </div>
  )
}
