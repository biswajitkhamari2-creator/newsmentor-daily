import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function HamburgerTrigger({ className }: { className?: string }) {
  const { toggleSidebar, state, openMobile, isMobile } = useSidebar();
  const open = isMobile ? openMobile : state === "expanded";

  return (
    <button
      type="button"
      aria-label="Toggle sidebar"
      aria-pressed={open}
      onClick={toggleSidebar}
      className={cn(
        "group relative grid h-9 w-9 place-items-center rounded-lg",
        "border border-border/60 bg-muted/40 hover:bg-muted",
        "transition-all duration-300 hover:border-gold/60 hover:shadow-[0_0_0_3px_color-mix(in_oklab,var(--gold)_18%,transparent)]",
        "active:scale-95",
        className,
      )}
    >
      <span className="relative block h-3.5 w-5">
        <span
          className={cn(
            "absolute left-0 right-0 top-0 h-[2px] rounded-full bg-foreground",
            "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "group-hover:bg-gold",
            open && "top-1/2 -translate-y-1/2 rotate-45",
          )}
        />
        <span
          className={cn(
            "absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-foreground",
            "transition-all duration-300",
            "group-hover:bg-gold",
            open ? "opacity-0 scale-x-0" : "opacity-100",
          )}
        />
        <span
          className={cn(
            "absolute left-0 right-0 bottom-0 h-[2px] rounded-full bg-foreground",
            "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "group-hover:bg-gold",
            open && "bottom-1/2 translate-y-1/2 -rotate-45",
          )}
        />
      </span>
    </button>
  );
}
