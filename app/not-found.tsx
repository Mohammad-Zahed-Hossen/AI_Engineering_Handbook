import Link from 'next/link';
import { Search, Home, Package, Cpu, Workflow, BookOpen, Layers, Terminal, Compass, FileCode2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const quickLinks = [
  { href: '/', label: 'Dashboard', icon: Home, description: 'Main overview' },
  { href: '/packages', label: 'Packages', icon: Package, description: 'Library references' },
  { href: '/models', label: 'Models', icon: Cpu, description: 'ML/DL architectures' },
  { href: '/workflows', label: 'Workflows', icon: Workflow, description: 'Pipeline guides' },
  { href: '/cheatsheets', label: 'Cheatsheets', icon: BookOpen, description: 'Quick references' },
  { href: '/registry', label: 'Registry', icon: Terminal, description: 'Model registry' },
  { href: '/problem-index', label: 'Problem Index', icon: Layers, description: 'Debug guides' },
  { href: '/patterns', label: 'Patterns', icon: Compass, description: 'Design patterns' },
];

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted border border-border shrink-0">
              <Search className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle>Page not found</CardTitle>
              <CardDescription className="mt-1">
                The page may have moved or the URL may be incorrect.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Quick Navigation
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-2.5 p-2.5 rounded-lg border border-border bg-card hover:border-foreground/20 hover:bg-muted/50 transition-all"
                  >
                    <div className="p-1.5 rounded bg-primary/5 group-hover:bg-primary/10 transition-all shrink-0">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors block truncate">
                        {link.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate block">
                        {link.description}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href="/">
              <Home className="w-3.5 h-3.5 mr-1.5" />
              Return to Dashboard
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}