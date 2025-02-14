"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  isCollapsed?: boolean
  className?: string
}

export function Logo({ isCollapsed, className }: LogoProps) {
  const size = isCollapsed ? 22 : 24

  return (
    <div className={cn("flex items-center justify-center py-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary-foreground"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2 4.5C2 3.11929 3.11929 2 4.5 2H19.5C20.8807 2 22 3.11929 22 4.5V19.5C22 20.8807 20.8807 22 19.5 22H4.5C3.11929 22 2 20.8807 2 19.5V4.5ZM4.5 3.5C3.94772 3.5 3.5 3.94772 3.5 4.5V19.5C3.5 20.0523 3.94772 20.5 4.5 20.5H19.5C20.0523 20.5 20.5 20.0523 20.5 19.5V4.5C20.5 3.94772 20.0523 3.5 19.5 3.5H4.5Z"
          fill="currentColor"
        />
        <path
          d="M7 7.5L10 16.5L12 11.5L14 16.5L17 7.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M6 7.5H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

