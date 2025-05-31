import { ContributorForm } from "@/components/contributor-form";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted p-4 md:p-6 lg:p-8">
      <div className="container max-w-lg mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              ContribuScore
            </h1>
          </div>
          <ThemeToggle />
        </header>
        
        <section className="space-y-6">
          <div className="space-y-2 text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Calculate Your Contributor Score</h2>
            <p className="text-muted-foreground">
              Enter your digital identities to discover your contributor value
            </p>
          </div>
          
          <ContributorForm />
        </section>
        
        <footer className="mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ContribuScore. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}