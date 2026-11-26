import { SocialLinks } from '@/components/common/SocialLinks';
import { Container } from '@/components/ui/Container';
import { SITE_CONFIG } from '@/data/site';

export function Footer() {
  return (
    <footer className="border-border bg-background border-t py-8">
      <Container className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
        </p>
        <SocialLinks />
      </Container>
    </footer>
  );
}
