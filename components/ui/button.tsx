import type * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-transparent text-primary shadow-lg hover:shadow-xl hover:shadow-primary/25 border-2 border-primary hover:border-primary/80 backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/10 before:to-secondary/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 ring-1 ring-primary/20 hover:ring-primary/30 hover:text-white",
        destructive:
          "bg-transparent text-destructive shadow-lg hover:shadow-xl hover:shadow-destructive/25 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 border-2 border-destructive hover:border-destructive/80 backdrop-blur-sm ring-1 ring-destructive/20 hover:text-white hover:bg-destructive/10",
        outline:
          "border-2 border-primary/50 hover:border-primary/70 bg-transparent backdrop-blur-sm shadow-sm hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10 text-foreground hover:text-primary transition-all duration-300 ring-1 ring-primary/10 hover:ring-primary/20",
        secondary:
          "bg-transparent text-secondary shadow-lg hover:shadow-xl hover:shadow-secondary/25 border-2 border-secondary hover:border-secondary/80 backdrop-blur-sm ring-1 ring-secondary/20 hover:text-white hover:bg-secondary/10",
        ghost:
          "hover:bg-primary/10 hover:text-primary backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/5 border border-transparent hover:border-primary/30 ring-1 ring-transparent hover:ring-primary/10",
        link: "text-primary underline-offset-4 hover:underline relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full border border-transparent hover:border-primary/20 rounded-md px-2 py-1",
      },
      size: {
        default: "h-11 px-6 py-3 has-[>svg]:px-5 text-base",
        sm: "h-9 rounded-lg gap-1.5 px-4 has-[>svg]:px-3 text-sm",
        lg: "h-14 rounded-xl px-8 has-[>svg]:px-6 text-lg font-bold",
        icon: "size-11 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
