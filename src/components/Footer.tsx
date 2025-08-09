import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Logo />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BOOKMYVENUE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
