import type * as React from "react"

import { cn } from "@/lib/utils"

// <CHANGE> Changed focus ring color from ring to blue-500 for consistency
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm transition-colors",
        "placeholder:text-gray-400",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-red-500 aria-invalid:focus:ring-red-500",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
