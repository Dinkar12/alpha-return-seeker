
import React, { ReactNode } from "react";
import { LucideSearch } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-primary">StockPredict</h1>
            <span className="px-2 py-1 rounded-md bg-primary/20 text-primary-foreground text-xs font-medium">
              BETA
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-secondary pl-9 pr-4 py-1.5 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-4 px-4">
        {children}
      </main>
      <footer className="border-t border-border py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 StockPredict. All data is simulated for demonstration purposes only.</p>
          <p className="mt-1">Not financial advice. Do not make investment decisions based on this tool.</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
