import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2.5 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-200 overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90 hover:shadow-sm',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/80 hover:shadow-sm',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 hover:shadow-sm',
        outline:
          'text-foreground border-border [a&]:hover:bg-accent [a&]:hover:text-accent-foreground hover:border-accent-foreground/20',
        success:
          'border-transparent bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 [a&]:hover:bg-green-200 dark:[a&]:hover:bg-green-900/30',
        warning:
          'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 [a&]:hover:bg-yellow-200 dark:[a&]:hover:bg-yellow-900/30',
        info:
          'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 [a&]:hover:bg-blue-200 dark:[a&]:hover:bg-blue-900/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const Badge = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<'span'> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }
>(({ className, variant, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      ref={ref}
      {...props}
    />
  )
})
Badge.displayName = 'Badge'

export { Badge, badgeVariants }

