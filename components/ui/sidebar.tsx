"use client"

import { useState, useCallback, useRef, useEffect, type React } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Calendar,
  CheckSquare,
  FileText,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  ClipboardList,
  Briefcase,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Logo } from "./logo"

const menuItems = [
  { name: "Anasayfa", href: "/", icon: Home },
  { name: "Personel Listesi", href: "/personel-listesi", icon: ClipboardList },
  { name: "İzin Yönetimi", href: "/izin-yonetimi", icon: Briefcase },
  { name: "MTP Hazırla", href: "/mesai-plani", icon: Calendar },
  { name: "MTP Onay", href: "/mesai-onay", icon: CheckSquare },
  { name: "Raporlar", href: "/raporlar", icon: FileText },
  { name: "Ayarlar", href: "/ayarlar", icon: Settings },
]

interface MenuButtonProps extends React.ComponentPropsWithoutRef<"div"> {
  icon: React.ElementType
  isCollapsed: boolean
  isActive?: boolean
  children: React.ReactNode
}

const MenuButton = ({ icon: Icon, isCollapsed, isActive, children, ...props }: MenuButtonProps) => {
  return (
    <div
      className={cn(
        "flex items-center px-3 py-2 text-gray-400 hover:bg-[#1a1d24] hover:text-gray-100 transition-all duration-200 ease-in-out cursor-pointer",
        isActive && "bg-[#1a1d24] text-gray-100",
        isCollapsed ? "justify-center" : "space-x-2",
      )}
      {...props}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!isCollapsed && <span className="text-sm truncate">{children}</span>}
    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()
  const sidebarRef = useRef<HTMLDivElement>(null)

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isCollapsed) {
        event.preventDefault()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isCollapsed])

  return (
    <TooltipProvider delayDuration={0}>
      <div className="relative flex">
        <div
          ref={sidebarRef}
          className={cn(
            "relative flex flex-col bg-[#0F1117] text-white transition-[width] duration-300 ease-in-out cursor-default",
            isCollapsed ? "w-14" : "w-64",
          )}
        >
          {/* Logo Section */}
          <div className="h-14 flex items-center justify-between px-2.5 border-b border-[#1a1d24]">
            <Logo isCollapsed={isCollapsed} />
            {/* Toggle Button - Only show when expanded */}
            {!isCollapsed && (
              <button
                onClick={toggleSidebar}
                className="p-1 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer hover:bg-[#1a1d24] rounded"
              >
                <PanelLeftClose size={16} />
              </button>
            )}
          </div>

          {/* Menu Items */}
          <nav className="flex-1 py-2">
            {menuItems.map((item) => (
              <div key={item.name}>
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          router.push(item.href)
                        }}
                        className="w-full"
                      >
                        <MenuButton icon={item.icon} isCollapsed={isCollapsed} isActive={pathname === item.href}>
                          {item.name}
                        </MenuButton>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-[#0F1117] text-gray-200 border-[#1a1d24]">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <div onClick={() => router.push(item.href)}>
                    <MenuButton icon={item.icon} isCollapsed={isCollapsed} isActive={pathname === item.href}>
                      {item.name}
                    </MenuButton>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Toggle Button - Only show when collapsed */}
          {isCollapsed && (
            <div className="border-t border-[#1a1d24]">
              <button
                onClick={toggleSidebar}
                className="w-full p-3 text-gray-400 hover:text-gray-200 hover:bg-[#1a1d24] transition-all duration-200 ease-in-out flex items-center justify-center cursor-pointer"
              >
                <PanelLeftOpen size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Resize Handle */}
        <div
          className="w-1 hover:bg-gray-600/20 flex items-center justify-center transition-colors duration-200 ease-in-out group"
          onClick={toggleSidebar}
          style={{ cursor: "ew-resize" }}
        >
          <div className="w-0.5 h-8 bg-gray-600/30 group-hover:bg-gray-500/50 transition-colors duration-200 ease-in-out rounded-full" />
        </div>
      </div>
    </TooltipProvider>
  )
}

