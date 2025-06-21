"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Stethoscope,
  Settings,
  HeartPulse,
  ChevronDown,
  ChevronUp,
  FileText
} from "lucide-react";
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord", tooltip: "Tableau de bord" },
  { href: "/patients", icon: Users, label: "Patients", tooltip: "Gérer les patients" },
  { href: "/appointments", icon: CalendarDays, label: "Rendez-vous", tooltip: "Gérer les rendez-vous"},
  { 
    label: "Consultations", 
    icon: Stethoscope, 
    tooltip: "Consultations médicales",
    subItems: [
      { href: "/consultations/new", label: "Nouvelle consultation", icon: FileText, tooltip: "Démarrer une nouvelle consultation" },
      { href: "/consultations/history", label: "Historique", icon: FileText, tooltip: "Voir l'historique des consultations" },
    ]
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  const toggleSubMenu = (label: string) => {
    setOpenSubMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2 py-2 hover:no-underline">
          <HeartPulse className="h-8 w-8 text-sidebar-foreground group-data-[collapsible=icon]:mx-auto" />
          <span className="font-headline text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            SantéLink
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-0">
        <ScrollArea className="h-[calc(100%-8rem)]"> {/* Adjust height based on header/footer */}
        <SidebarMenu className="p-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              {item.subItems ? (
                <>
                  <SidebarMenuButton
                    onClick={() => toggleSubMenu(item.label)}
                    className="justify-between"
                    tooltip={item.tooltip}
                    aria-expanded={openSubMenus[item.label]}
                    aria-controls={`submenu-${item.label}`}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.label}</span>
                    </div>
                    {openSubMenus[item.label] ? <ChevronUp className="h-4 w-4"/> : <ChevronDown className="h-4 w-4"/>}
                  </SidebarMenuButton>
                  {openSubMenus[item.label] && (
                    <SidebarMenuSub id={`submenu-${item.label}`}>
                      {item.subItems.map(subItem => (
                        <SidebarMenuSubItem key={subItem.href}>
                          <Link href={subItem.href} legacyBehavior passHref>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.href}
                              aria-current={pathname === subItem.href ? "page" : undefined}
                            >
                              <a>
                                <subItem.icon className="h-3.5 w-3.5" />
                                <span>{subItem.label}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </>
              ) : (
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                    tooltip={item.tooltip}
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    <a>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t border-sidebar-border p-2">
        <SidebarMenu>
           <SidebarMenuItem>
            <Link href="/settings" legacyBehavior passHref>
                <SidebarMenuButton asChild isActive={pathname === "/settings"} tooltip="Paramètres">
                <a><Settings /><span>Paramètres</span></a>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
