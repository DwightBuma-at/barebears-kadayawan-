import { useState } from 'react';
import { Loader2, LogOut, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { BrandLogo } from '@/components/common/BrandLogo';
import { NotificationButton } from '@/components/common/NotificationButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SIDEBAR_GROUPS } from '@/data/sidebar';
import { cn } from '@/lib/utils';
import type { SidebarGroup } from '@/types/navigation';

export interface SidebarProps {
  groups?: SidebarGroup[];
  className?: string;
}

interface SidebarNavGroupsProps {
  groups: SidebarGroup[];
  collapsed?: boolean;
  onNavigate?: () => void;
}

function SidebarNavGroups({ groups, collapsed = false, onNavigate }: SidebarNavGroupsProps) {
  return (
    <nav aria-label="Admin navigation" className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
      {groups.map((group) => (
        <div key={group.id} className="space-y-1">
          {!collapsed ? (
            <p className="text-muted-foreground px-2.5 pb-1 text-[11px] font-semibold tracking-wider uppercase">
              {group.label}
            </p>
          ) : null}

          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/dashboard'}
                    onClick={onNavigate}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors',
                        collapsed && 'justify-center px-2',
                        isActive
                          ? 'bg-[#1D6CE0] font-semibold text-white shadow-xs'
                          : 'font-normal text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={cn(
                            'size-4 shrink-0 stroke-[1.75]',
                            isActive ? 'text-white' : 'text-slate-500'
                          )}
                          aria-hidden="true"
                        />
                        {!collapsed ? (
                          <>
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.badge ? (
                              <span
                                className={cn(
                                  'rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums',
                                  isActive
                                    ? 'bg-white/20 text-white'
                                    : 'bg-slate-100 text-slate-700'
                                )}
                              >
                                {item.badge}
                              </span>
                            ) : null}
                          </>
                        ) : null}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function Sidebar({ groups = SIDEBAR_GROUPS, className }: SidebarProps) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleOpenSignOut = () => {
    setMobileOpen(false);
    setSignOutOpen(true);
  };

  const handleConfirmSignOut = () => {
    setIsSigningOut(true);
    window.setTimeout(() => {
      setIsSigningOut(false);
      setSignOutOpen(false);
      toast.success('Signed out.');
      navigate('/');
    }, 600);
  };

  return (
    <>
      {/* Compact mobile top bar with slide-over drawer */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-300 bg-white px-4 shadow-xs lg:hidden">
        <div className="flex items-center gap-2.5">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
              >
                <Menu className="size-5 stroke-[1.75]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background flex w-64 flex-col p-0">
              <SheetHeader className="border-border border-b px-4 py-3 text-left">
                <SheetTitle>
                  <BrandLogo />
                </SheetTitle>
                <SheetDescription className="sr-only">Admin navigation menu</SheetDescription>
              </SheetHeader>

              <SidebarNavGroups groups={groups} onNavigate={() => setMobileOpen(false)} />

              <div className="border-border border-t p-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleOpenSignOut}
                  className="w-full justify-start gap-2.5 rounded-md text-sm font-medium text-[#DC2626] hover:bg-[#DC2626]/10 hover:text-[#B91C1C]"
                >
                  <LogOut className="size-4 stroke-[1.75]" aria-hidden="true" />
                  <span>Sign out</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <BrandLogo />
        </div>
        <NotificationButton />
      </header>

      {/* Desktop persistent collapsible sidebar */}
      <aside
        aria-label="Admin sidebar"
        className={cn(
          'sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-slate-300 bg-white shadow-[2px_0_12px_rgba(15,23,42,0.06)] transition-[width] duration-200 lg:flex',
          collapsed ? 'w-16' : 'w-60',
          className
        )}
      >
        <div
          className={cn(
            'border-border flex h-14 items-center border-b px-3',
            collapsed ? 'justify-center' : 'justify-between'
          )}
        >
          {!collapsed ? (
            <div className="px-1">
              <BrandLogo />
            </div>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="text-muted-foreground hover:text-foreground size-8"
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4 stroke-[1.75]" />
            ) : (
              <PanelLeftClose className="size-4 stroke-[1.75]" />
            )}
          </Button>
        </div>

        <SidebarNavGroups groups={groups} collapsed={collapsed} />

        <div className="border-border border-t p-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleOpenSignOut}
            title={collapsed ? 'Sign out' : undefined}
            className={cn(
              'w-full gap-2.5 rounded-md text-sm font-medium text-[#DC2626] hover:bg-[#DC2626]/10 hover:text-[#B91C1C]',
              collapsed ? 'justify-center px-2' : 'justify-start px-2.5'
            )}
          >
            <LogOut className="size-4 shrink-0 stroke-[1.75]" aria-hidden="true" />
            {!collapsed ? <span>Sign out</span> : null}
          </Button>
        </div>
      </aside>

      {/* Sign out confirmation modal */}
      <Dialog
        open={signOutOpen}
        onOpenChange={(open) => {
          if (!isSigningOut) setSignOutOpen(open);
        }}
      >
        <DialogContent className="bg-white sm:max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Sign out?</DialogTitle>
            <DialogDescription className="text-slate-600">
              You will be redirected to the login page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSigningOut}
              onClick={() => setSignOutOpen(false)}
              className="border-slate-300 text-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isSigningOut}
              onClick={handleConfirmSignOut}
              className="gap-2 bg-[#DC2626] text-white hover:bg-[#B91C1C]"
            >
              {isSigningOut ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  <span>Signing out...</span>
                </>
              ) : (
                <span>Confirm</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
