import { MotionConfig } from 'motion/react';
import { BrowserRouter } from 'react-router';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppRoutes } from '@/routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <TooltipProvider>
          <AppRoutes />
          <Toaster position="top-right" />
        </TooltipProvider>
      </MotionConfig>
    </BrowserRouter>
  );
}

export default App;
