import { FolderKanban, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="mx-auto flex max-w-4xl items-center justify-around md:justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary">
          <FolderKanban className="h-6 w-6" />
          <span className="hidden md:inline">PWA Projects</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex flex-col items-center gap-1 md:flex-row">
              <Home className="h-5 w-5" />
              <span className="text-[10px] md:text-sm">Dashboard</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/projects" className="flex flex-col items-center gap-1 md:flex-row">
              <FolderKanban className="h-5 w-5" />
              <span className="text-[10px] md:text-sm">Projects</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
