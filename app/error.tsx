'use client';

import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, FileText, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <Card className="w-full max-w-lg border-destructive/20">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20 shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-destructive">Something went wrong</CardTitle>
              <CardDescription className="mt-1">
                An error occurred while loading this page. This might be due to a missing, corrupt, or invalid data file.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error message block */}
          <div className="p-3 bg-muted/50 border border-border rounded-lg font-mono text-[11px] text-destructive overflow-x-auto">
            <div className="flex items-center gap-2 mb-1.5">
              <Bug className="w-3.5 h-3.5" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Error Message</span>
            </div>
            <code className="block break-words">{error.message || 'Unknown error'}</code>
          </div>

          {error.digest && (
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
              <FileText className="w-3.5 h-3.5" />
              <span>Error ID: <code className="bg-muted px-1.5 py-0.5 rounded">{error.digest}</code></span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button
            onClick={() => reset()}
            variant="default"
            size="sm"
            className="w-full sm:w-auto"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Try Again
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
          >
            <Link href="/">
              <Home className="w-3.5 h-3.5 mr-1.5" />
              Back to Dashboard
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}