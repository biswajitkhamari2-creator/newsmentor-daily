import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <h3 className="font-serif text-lg font-bold">
              NewsMentor <span className="text-accent">Daily</span>
            </h3>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Turning the day's newspaper into crisp, syllabus-aligned notes for
              serious UPSC aspirants.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/upload" className="hover:text-foreground">Upload Newspaper</Link></li>
              <li><Link to="/headlines" className="hover:text-foreground">Daily Headlines</Link></li>
              <li><Link to="/pyq" className="hover:text-foreground">PYQ Bank</Link></li>
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Mission</h4>
            <p className="mt-3 text-sm text-muted-foreground">
              Save aspirants 2 hours a day — every day — until results day.
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} NewsMentor Daily</p>
          <p className="font-medium">Made for UPSC Aspirants 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
