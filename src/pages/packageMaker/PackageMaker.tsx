import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { INITIAL_INVENTORY_ITEMS, INVENTORY_STORAGE_KEY } from '@/data/inventory';
import { CreatePackageDialog } from '@/pages/packageMaker/components/CreatePackageDialog';
import { PackageTable } from '@/pages/packageMaker/components/PackageTable';
import type { InventoryItem } from '@/types/inventory';
import type { NewPackageInput, PackageRecord } from '@/types/package';

export const PACKAGES_STORAGE_KEY = 'bare-bears-packages';

function loadPackages(): PackageRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(PACKAGES_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PackageRecord[]) : [];
  } catch {
    return [];
  }
}

function loadInventoryItems(): InventoryItem[] {
  if (typeof window === 'undefined') return INITIAL_INVENTORY_ITEMS;
  try {
    const raw = window.localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (!raw) return INITIAL_INVENTORY_ITEMS;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as InventoryItem[]) : INITIAL_INVENTORY_ITEMS;
  } catch {
    return INITIAL_INVENTORY_ITEMS;
  }
}

export function PackageMaker() {
  const [packages, setPackages] = useState<PackageRecord[]>(loadPackages);
  const [inventory] = useState<InventoryItem[]>(loadInventoryItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(packages));
    } catch {
      toast.error('Could not save packages to local storage.');
    }
  }, [packages]);

  const filteredPackages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return packages;
    return packages.filter((pkg) => {
      const titleMatch = pkg.title.toLowerCase().includes(query);
      const descMatch = pkg.description.toLowerCase().includes(query);
      const inclusionMatch = pkg.inclusions.some(
        (inc) => inc.name.toLowerCase().includes(query) || inc.size.toLowerCase().includes(query)
      );
      return titleMatch || descMatch || inclusionMatch;
    });
  }, [packages, searchQuery]);

  const handleCreatePackage = (input: NewPackageInput) => {
    const created: PackageRecord = {
      id: `pkg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      ...input,
    };
    setPackages((prev) => [created, ...prev]);
    toast.success(`Created package "${created.title}".`);
  };

  const handleDeletePackage = (id: string) => {
    const target = packages.find((pkg) => pkg.id === id);
    setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
    toast.success(target ? `Deleted "${target.title}".` : 'Package deleted.');
  };

  return (
    <section className="flex h-[calc(100dvh-3.5rem)] flex-col gap-4 p-4 sm:p-6">
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search packages..."
            aria-label="Search packages"
            className="h-10 rounded-lg border-slate-300 bg-white pr-8 pl-9 text-sm text-slate-900 placeholder:text-slate-400"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>

        <Button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="h-10 gap-1.5 rounded-lg bg-[#1D6CE0] px-4 text-sm font-semibold text-white hover:bg-[#1554B3]"
        >
          <Plus className="size-4" aria-hidden="true" />
          <span>Create Package</span>
        </Button>
      </div>

      <PackageTable packages={filteredPackages} onDeletePackage={handleDeletePackage} />

      <CreatePackageDialog
        open={createOpen}
        inventory={inventory}
        onClose={() => setCreateOpen(false)}
        onCreatePackage={handleCreatePackage}
      />
    </section>
  );
}
