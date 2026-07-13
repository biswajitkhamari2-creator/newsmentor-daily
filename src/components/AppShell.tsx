import { Link, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Newspaper,
  CalendarCheck2,
  FileQuestion,
  PenLine,
  Sparkles,
  Info,
  Flame,
  Search,
  Building2,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const nav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Current Affairs", url: "/current-affairs", icon: Newspaper },
  { title: "Study Planner", url: "/planner", icon: CalendarCheck2 },
  { title: "PYQ & Tests", url: "/pyq", icon: FileQuestion },
  { title: "Answer Writing", url: "/answers", icon: PenLine },
  { title: "AI Mentor", url: "/mentor", icon: Sparkles },
  { title: "About", url: "/about", icon: Info },
];

function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) => (url === "/" ? path === "/" : path.startsWith(url));

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2.5 px-2 py-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold text-gold-foreground font-serif text-lg font-semibold">
            N
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-serif text-lg leading-none text-sidebar-foreground">
                NewsMentor
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-gold/80 mt-1">
                Daily · UPSC
              </div>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed ? (
          <div className="rounded-lg bg-sidebar-accent/60 p-3">
            <div className="flex items-center gap-2 text-gold">
              <Flame className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Daily streak</span>
            </div>
            <div className="mt-1 font-serif text-2xl text-sidebar-foreground">12 days</div>
            <div className="text-[11px] text-sidebar-foreground/70">Keep it going. GS-II due today.</div>
          </div>
        ) : (
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-sidebar-accent/60 text-gold">
            <Flame className="h-4 w-4" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 backdrop-blur px-3 sm:px-6">
            <SidebarTrigger />
            <div className="relative hidden md:block flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search topics, PYQs, editorials…"
                className="pl-9 h-9 bg-muted/40 border-transparent focus-visible:border-input"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:inline-flex gap-1 border-gold/50 text-gold">
                <Flame className="h-3 w-3" /> 12
              </Badge>
              <ThemeToggle />
              <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                AK
              </div>
            </div>
          </header>
          <main className="flex-1 animate-fade-in">{children}</main>
          <footer className="border-t bg-muted/30 px-6 py-6 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-serif text-sm text-foreground">NewsMentor Daily</span>
                <span className="mx-2">·</span>
                Made for UPSC Aspirants
              </div>
              <div className="flex gap-4">
                <Link to="/about" className="hover:text-foreground">About</Link>
                <a className="hover:text-foreground" href="#">Privacy</a>
                <a className="hover:text-foreground" href="#">Contact</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
