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
  useSidebar,
} from "@/components/ui/sidebar";
import { HamburgerTrigger } from "./HamburgerTrigger";
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
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePlannerStore } from "@/hooks/usePlannerStore";

const nav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Current Affairs", url: "/current-affairs", icon: Newspaper },
  { title: "Institutional Engine", url: "/institutions", icon: Building2 },
  { title: "Study Planner", url: "/planner", icon: CalendarCheck2 },
  { title: "Revision", url: "/revision", icon: RotateCcw },
  { title: "Syllabus", url: "/syllabus", icon: BookOpen },
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
  const { streak, tasks } = usePlannerStore();
  const dueLabel = tasks.find((t) => !t.done)?.title ?? "Add your first task";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2.5 px-2 py-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground font-serif italic text-lg">
            U
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-serif italic text-lg leading-none text-sidebar-foreground">
                UPSC <span className="text-primary">Hero</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mt-1.5">
                by Biswajit
              </div>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="px-2 pb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Workspace
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {nav.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={`group h-10 rounded-md transition-colors ${
                        active
                          ? "!bg-transparent !text-primary"
                          : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
                      }`}
                    >
                      <Link to={item.url} className="flex items-center gap-3 px-2">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full transition-all ${
                            active
                              ? "bg-primary shadow-[0_0_10px_rgba(79,70,229,0.8)]"
                              : "bg-transparent"
                          }`}
                        />
                        <item.icon
                          className={`h-4 w-4 shrink-0 ${
                            collapsed ? "" : "hidden"
                          } ${active ? "text-primary" : ""}`}
                        />
                        {!collapsed && (
                          <span
                            className={`truncate text-xs uppercase tracking-[0.14em] ${
                              active ? "font-semibold" : "font-medium"
                            }`}
                          >
                            {item.title}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>


      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed ? (
          <div className="rounded-xl border border-sidebar-border bg-card p-4">
            <div className="flex items-center gap-2 text-primary">
              <Flame className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.22em]">Daily streak</span>
            </div>
            <div className="mt-2 font-serif text-2xl text-sidebar-foreground leading-none">
              {streak} <span className="text-sm text-muted-foreground">{streak === 1 ? "day" : "days"}</span>
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground truncate">
              {streak === 0 ? "Complete a task to start your streak." : `Next up: ${dueLabel}`}
            </div>
          </div>
        ) : (
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-sidebar-accent/60 text-primary">
            <Flame className="h-4 w-4" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

function AppHeader() {
  const { streak } = usePlannerStore();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 backdrop-blur px-3 sm:px-6">
      <HamburgerTrigger />
      <div className="relative hidden md:block flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search topics, PYQs, editorials…"
          className="pl-9 h-9 bg-muted/40 border-transparent focus-visible:border-input"
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Badge variant="outline" className="hidden sm:inline-flex gap-1 border-gold/50 text-gold">
          <Flame className="h-3 w-3" /> {streak}
        </Badge>
        <ThemeToggle />
        <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
          AK
        </div>
      </div>
    </header>
  );
}


export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <main className="flex-1 animate-fade-in">{children}</main>
          <footer className="border-t bg-muted/30 px-6 py-6 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-serif text-sm text-foreground">UPSC Hero by Biswajit</span>
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
