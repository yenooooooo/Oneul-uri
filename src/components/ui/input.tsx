import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 text-base transition-colors duration-200 outline-none placeholder:text-muted-foreground focus:border-coral-500 focus:ring-1 focus:ring-inset focus:ring-coral-500/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
