import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { CloudSun, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onAuthClick?: () => void;
}

export function Navbar({ onAuthClick }: NavbarProps) {
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <CloudSun className="w-7 h-7 text-secondary" />
          <span className="font-display text-xl font-bold text-primary-foreground">
            WeatherNG
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:flex items-center gap-1.5 text-sm text-primary-foreground/80">
                <User className="w-4 h-4" />
                {user.email?.split('@')[0]}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={onAuthClick}
              className="btn-accent rounded-lg"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
