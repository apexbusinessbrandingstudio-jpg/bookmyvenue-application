import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-primary" />
            <p className="font-headline font-bold">BOOKMYVENUE</p>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BOOKMYVENUE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
