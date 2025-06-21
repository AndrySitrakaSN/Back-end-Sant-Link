"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Moon, Sun, UserCircle, Settings, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Mock theme toggle functionality
const useTheme = () => {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") || "light";
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return { theme, toggleTheme };
};

const pageTitleMap: Record<string, string> = {
  dashboard: "Tableau de bord",
  patients: "Patients",
  appointments: "Rendez-vous",
  consultations: "Consultations",
  settings: "Paramètres",
  new: "Nouveau",
  history: "Historique",
  login: "Connexion" 
};

export function AppHeader() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return pageTitleMap.dashboard;

    const lastSegment = segments[segments.length - 1];
    const secondLastSegment = segments.length > 1 ? segments[segments.length - 2] : "";
    
    let title = pageTitleMap[lastSegment] || lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, " ");

    if ((lastSegment === "new" || lastSegment === "history") && pageTitleMap[secondLastSegment]) {
      title = `${pageTitleMap[secondLastSegment]} / ${pageTitleMap[lastSegment]}`;
    } else if (segments[0] === "patients" && segments.length > 1 && !pageTitleMap[lastSegment]) {
      // Handles /patients/[id]
      title = `Patient / ${lastSegment}`;
    } else if (segments[0] === "appointments" && segments.length > 1 && !pageTitleMap[lastSegment] ) {
       // Handles /appointments/[id] - if we had a details page
      title = `Rendez-vous / ${lastSegment}`;
    }


    return title;
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      {isMobile && <SidebarTrigger />}
      {!isMobile && <div className="w-8"></div>} {/* Placeholder to align with sidebar trigger width */}
      
      <div className="flex-1">
        <h1 className="font-headline text-xl font-semibold">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Changer de thème">
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>

        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/100x100.png" alt="Avatar de l'utilisateur" data-ai-hint="user avatar" />
                <AvatarFallback>DA</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Dr. Agent Santé</p>
                <p className="text-xs leading-none text-muted-foreground">
                  s.agent@healthlink.org
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
